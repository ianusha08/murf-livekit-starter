import asyncio
import logging
import sqlite3
import json
from datetime import datetime, timezone

from dotenv import load_dotenv
from livekit import rtc
from livekit.agents import (
    Agent,
    AgentServer,
    AgentSession,
    JobContext,
    JobProcess,
    cli,
    inference,
    tokenize,
    room_io,
    function_tool,
    RunContext,
)
from livekit.plugins import murf, silero, google, deepgram, noise_cancellation
from livekit.plugins.turn_detector.multilingual import MultilingualModel

logger = logging.getLogger(__name__)

DB_PATH = "learner_memory.db"


# ---------------------------------------------------------------------------
# Database helpers — synchronous, blocking. Always call these via
# asyncio.to_thread(...) from async code so the event loop never stalls.
# ---------------------------------------------------------------------------

def _init_db_sync() -> None:
    conn = sqlite3.connect(DB_PATH)
    try:
        cursor = conn.cursor()
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS learners (
                user_id TEXT PRIMARY KEY,
                name TEXT,
                language_preference TEXT,
                facts_json TEXT,
                last_interaction TEXT
            )
            """
        )
        conn.commit()
    finally:
        conn.close()
    logger.info("SQLite DB initialized at %s", DB_PATH)


def _db_lookup_learner_sync(user_id: str) -> str:
    """Return stored learner data for user_id as a JSON string, or empty string if not found."""
    conn = sqlite3.connect(DB_PATH)
    try:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT name, language_preference, facts_json, last_interaction FROM learners WHERE user_id = ?",
            (user_id,),
        )
        row = cursor.fetchone()
    finally:
        conn.close()

    if not row:
        logger.info("db_lookup_learner: no record for %s", user_id)
        return ""

    name, language_preference, facts_json, last_interaction = row
    try:
        facts_obj = json.loads(facts_json) if facts_json else {}
    except json.JSONDecodeError:
        logger.warning(
            "db_lookup_learner: corrupted facts_json for user %s, resetting to {}",
            user_id,
        )
        facts_obj = {}

    result = {
        "user_id": user_id,
        "name": name,
        "language_preference": language_preference,
        "facts": facts_obj,
        "last_interaction": last_interaction,
    }
    logger.info("db_lookup_learner: found record for %s", user_id)
    return json.dumps(result)


def _db_save_learner_sync(
    user_id: str,
    name: str,
    language_preference: str,
    facts: str | dict,
) -> str:
    """Save or update learner data. `facts` can be a JSON string or a dictionary."""
    now = datetime.now(timezone.utc).isoformat()

    if isinstance(facts, dict):
        facts_str = json.dumps(facts)
    else:
        try:
            facts_str = json.dumps(json.loads(facts))
        except json.JSONDecodeError:
            logger.warning(
                "db_save_learner: could not parse facts JSON for user %s, "
                "wrapping raw string instead. Raw value: %r",
                user_id,
                facts,
            )
            facts_str = json.dumps({"topics_covered": str(facts)})

    conn = sqlite3.connect(DB_PATH)
    try:
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO learners (user_id, name, language_preference, facts_json, last_interaction)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET
                name=excluded.name,
                language_preference=excluded.language_preference,
                facts_json=excluded.facts_json,
                last_interaction=excluded.last_interaction
            """,
            (user_id, name, language_preference, facts_str, now),
        )
        conn.commit()
    finally:
        conn.close()

    logger.info("db_save_learner: saved record for user %s (name: %s)", user_id, name)
    return "Memory saved successfully"


async def init_db() -> None:
    await asyncio.to_thread(_init_db_sync)


async def db_lookup_learner(user_id: str) -> str:
    return await asyncio.to_thread(_db_lookup_learner_sync, user_id)


async def db_save_learner(
    user_id: str,
    name: str,
    language_preference: str,
    facts: str | dict,
) -> str:
    return await asyncio.to_thread(_db_save_learner_sync, user_id, name, language_preference, facts)


load_dotenv(".env.local")

SYSTEM_PROMPT = """
IDENTITY:

- Name: Saksham (सक्षम)

- Backstory: You are a friendly, patient, and highly knowledgeable educational voice assistant designed to improve learning and literacy across India.

- Creator/Organization: If someone asks who created you, explain that you were built as part of the Voice for Bharat challenge using Murf AI and LiveKit.

- Role: Your mission is to help learners improve their reading, writing, speaking, and digital literacy skills through natural voice conversations.

OBJECTIVES:

- Explain difficult concepts in simple and easy language.

- Help users improve their English, Hindi, and communication skills.

- Encourage curiosity, critical thinking, and problem-solving.

- Build confidence in learners.

- Adapt explanations according to the learner's level.

KNOWLEDGE:

- Reading and writing skills

- English and Hindi grammar

- Mathematics fundamentals

- General science

- Computer science fundamentals

- Artificial intelligence basics

- Study techniques and productivity methods

LANGUAGE:

- Mirror the user's language and communication style.

- Support Hindi, English, and Hinglish.

- Always write Hindi words in Devanagari script (देवनागरी लिपि) (e.g., "नमस्ते", "आप कैसे हैं") so that the Text-to-Speech (TTS) engine pronounces them correctly. Use Latin script for English/technical terms (e.g., "learning journey", "computer science").

- Keep sentences short, natural, and conversational.

- Avoid technical jargon whenever possible.

- Encourage learners in a positive and respectful manner.

IMPORTANT:

- Do not use markdown symbols, bullet points, emojis, or special formatting in responses.

- Keep responses concise because users are interacting through voice.

GUARDRAILS:

- Never request passwords, bank details, or personal information.

- Never promote cheating during examinations.

- Never provide medical, legal, or financial advice.

- Clearly admit when you are uncertain.

- Avoid harmful, offensive, or misleading responses.

- Protect the user's privacy at all times.

MEMORY & CONSENT INSTRUCTIONS (CRITICAL RULE):

1. REMEMBERING CALLERS:
   - Check CURRENT SESSION DETAILS below. If you have RETURNING LEARNER MEMORY, you know who the caller is! Use their name and acknowledge past progress.
   - If asked "Do you know my name?" or "What do you remember about me?", answer using the memory in CURRENT SESSION DETAILS or call the `lookup_caller` tool.

2. ASKING FOR CONSENT BEFORE SAVING (HARD RULE):
   - When a caller tells you their name, preferred language, learning level, topics studied, or difficulties:
     You MUST ask for permission to remember/save their details for future sessions BEFORE saving.
     Example: "क्या मैं आपका नाम और आपकी पढ़ाई की जानकारी याद रख सकता हूँ ताकि अगली बार हम वहीं से शुरू कर सकें?" (May I save your name and learning progress so I remember you next time?)
   - IF AND ONLY IF the caller explicitly says YES / consents (e.g. "हाँ", "sure", "yes", "okay"):
     Call the `save_caller_info` tool with:
     - `name`: user's name
     - `language_preference`: preferred language ("Hindi", "English", "Hinglish", etc.)
     - `facts`: JSON string containing `{"current_level": "...", "topics_covered": "...", "recurring_mistakes": "..."}`
     - `consent_given`: true
   - IF the caller says NO / declines consent:
     DO NOT call `save_caller_info`. Respect their privacy and confirm you will not save anything.

FIRST-TURN GREETING:

If new caller:
"नमस्ते! मैं सक्षम हूँ। मैं आपकी learning journey में आपकी मदद करने के लिए यहाँ हूँ। आज आप क्या सीखना चाहेंगे?"
"""


class Assistant(Agent):
    def __init__(self, user_id: str = "default_user", memory_json: str = "") -> None:
        self.user_id = user_id

        memory_context = "New learner - no previous memory found."
        if memory_json:
            try:
                mem = json.loads(memory_json)
                memory_context = (
                    f"RETURNING LEARNER MEMORY FOUND:\n"
                    f"- Name: {mem.get('name', 'Unknown')}\n"
                    f"- Preferred Language: {mem.get('language_preference', 'Hindi/English')}\n"
                    f"- Facts: {json.dumps(mem.get('facts', {}))}\n"
                    f"- Last Interaction: {mem.get('last_interaction', '')}"
                )
            except json.JSONDecodeError as e:
                # Log loudly instead of silently falling back — corrupted memory
                # for a specific user is worth knowing about.
                logger.error(
                    "Failed to parse memory_json for user %s: %s. Raw value: %r",
                    user_id, e, memory_json,
                )

        full_instructions = f"""{SYSTEM_PROMPT}

CURRENT SESSION DETAILS:
- Caller User ID: {user_id}
- {memory_context}
"""
        super().__init__(instructions=full_instructions)

    @function_tool
    async def lookup_caller(self, context: RunContext) -> str:
        """Look up stored memory for the CURRENT caller. Returns JSON string with
        name, language_preference, facts, and last_interaction. Always scoped to
        the authenticated session's own user_id — cannot look up other users."""
        # NOTE: intentionally no user_id parameter. Letting the model pass an
        # arbitrary user_id would let one caller read another caller's saved
        # data. Always resolve to the session's own verified identity.
        return await db_lookup_learner(self.user_id)

    @function_tool
    async def save_caller_info(
        self,
        context: RunContext,
        name: str,
        language_preference: str,
        facts: str,
        consent_given: bool,
    ) -> str:
        """Save or update learner memory for the CURRENT caller.

        Only call this AFTER the caller has explicitly said yes/consented in
        the conversation. Pass consent_given=True only when they clearly agreed
        (e.g. said "haan", "yes", "sure", "okay") to a direct question asking
        permission to save their info. If they declined or you are unsure,
        do not call this tool at all.

        - name: The caller's name
        - language_preference: Language preference (e.g. 'Hindi', 'English', 'Hinglish')
        - facts: JSON string containing keys like 'current_level', 'topics_covered', 'recurring_mistakes'
        - consent_given: must be True, confirming the caller explicitly consented
        """
        if not consent_given:
            logger.warning(
                "save_caller_info called without consent_given=True for user %s; refusing to save.",
                self.user_id,
            )
            return "Not saved: consent was not confirmed."

        return await db_save_learner(self.user_id, name, language_preference, facts)


server = AgentServer()


def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()


server.setup_fnc = prewarm


@server.rtc_session(agent_name="anisha")
async def my_agent(ctx: JobContext):
    # Logging setup
    ctx.log_context_fields = {
        "room": ctx.room.name,
    }

    await init_db()

    # Connect to the room first, then wait for a remote participant
    await ctx.connect()
    participant = await ctx.wait_for_participant()

    # SECURITY NOTE: participant.identity is client-supplied and NOT verified
    # authentication. Anyone can set their LiveKit identity to an arbitrary
    # string, including someone else's known user_id, and read that user's
    # saved memory. For real deployments, derive user_id from a verified JWT
    # claim (e.g. an app-issued access token validated server-side) rather
    # than trusting the raw identity field. Left as participant.identity here
    # only because no auth layer is defined in this codebase yet — treat this
    # as a known gap, not a safe default.
    user_id = participant.identity
    logger.info("Remote participant connected: %s", user_id)

    try:
        memory_json = await db_lookup_learner(user_id)
    except Exception:
        logger.exception("Failed to look up learner memory for user %s", user_id)
        memory_json = ""

    agent_instance = Assistant(user_id=user_id, memory_json=memory_json)

    session = AgentSession(
        stt=deepgram.STT(model="nova-3", language="multi"),
        llm=google.LLM(model="gemini-3.5-flash-lite"),  # verify against current Google model list before deploying
        tts=murf.TTS(
            voice="Pooja",
            locale="en-IN",
            style="Conversation",
            tokenizer=tokenize.basic.SentenceTokenizer(min_sentence_len=2),
            text_pacing=True,
        ),
        turn_detection=MultilingualModel(),
        vad=ctx.proc.userdata["vad"],
        preemptive_generation=True,
    )

    room_opts = room_io.RoomOptions(
        audio_input=room_io.AudioInputOptions(
            noise_cancellation=lambda params: (
                noise_cancellation.BVCTelephony()
                if params.participant.kind == rtc.ParticipantKind.PARTICIPANT_KIND_SIP
                else noise_cancellation.BVC()
            ),
        ),
    )

    await session.start(agent=agent_instance, room=ctx.room, room_options=room_opts)

    if memory_json:
        try:
            memory = json.loads(memory_json)
            learner_name = memory.get("name", "learner")
            topics = memory.get("facts", {}).get("topics_covered", "your learning")
            greeting = f"नमस्ते {learner_name}! पिछली बार हम {topics} पर काम कर रहे थे। क्या आप जारी रखना चाहेंगे?"
            # Use generate_reply so the greeting is actually spoken through TTS,
            # not just written to a text/data channel.
            await session.generate_reply(instructions=f"Greet the returning learner by saying exactly: {greeting}")
        except Exception:
            logger.exception("Error building returning-learner greeting for user %s", user_id)
            await session.generate_reply(
                instructions="Greet the caller as a new learner using the FIRST-TURN GREETING in your instructions."
            )
    else:
        await session.generate_reply(
            instructions="Greet the caller as a new learner using the FIRST-TURN GREETING in your instructions."
        )


if __name__ == "__main__":
    cli.run_app(server)