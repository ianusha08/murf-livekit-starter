import os
import asyncio
import json
import logging
import sys
import time
from datetime import datetime
from dotenv import load_dotenv
from livekit import api
# Conditional import for SIP media configuration (available in livekit-api >=1.2.0)
try:
    from livekit.protocol.sip import SIPMedia, SIPMediaEncryption
except ImportError:
    SIPMedia = None
    SIPMediaEncryption = None
# Guard import for CreateSIPParticipantRequest (available when livekit-protocol is installed)
try:
    from livekit.protocol.sip import CreateSIPParticipantRequest
except ImportError:
    CreateSIPParticipantRequest = None


# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("outbound_practice_call")


def find_due_learner(schedule: list) -> dict | None:
    """
    Return the first learner whose preferred_call_time matches the current
    HH:MM and who has not been called today.

    'preferred_call_time' is stored as "HH:MM" (24-hour clock).
    'last_called' is stored as an ISO-8601 date string (YYYY-MM-DD) or "".
    """
    now = datetime.now()
    current_hhmm = now.strftime("%H:%M")
    today_str = now.strftime("%Y-%m-%d")

    for learner in schedule:
        call_time = learner.get("preferred_call_time", "")
        last_called = learner.get("last_called", "")
        if call_time == current_hhmm and last_called != today_str:
            return learner

    return None


async def dial_learner(learner: dict, lk_api: api.LiveKitAPI, sip_trunk_id: str, test_mode: bool = False) -> None:
    """Dispatch the agent and dial out to the given learner."""
    sip_uri = learner["sip_uri"]
    user_id = learner["user_id"]
    name = learner["name"]

    room_name = f"practice_{user_id}_{int(time.time())}"
    logger.info(f"Starting daily practice call for {name} (room: {room_name})")

    # Clean the SIP URI: LiveKit expects only the username/number (no scheme/domain)
    target_number = sip_uri
    # Remove "sip:" prefix if present
    if target_number.startswith("sip:"):
        target_number = target_number[4:]
    # Remove any trailing domain (everything after '@')
    if "@" in target_number:
        target_number = target_number.split("@", 1)[0]
    # For linphone we do not add ';user=phone' suffix



    # 1. Dispatch agent into the room first
    try:
        dispatch = await lk_api.agent_dispatch.create_dispatch(
            api.CreateAgentDispatchRequest(
                agent_name="anisha",
                room=room_name,
            )
        )
        logger.info(f"Agent dispatch created: {dispatch.id}")
    except Exception as e:
        logger.error(f"Error creating agent dispatch: {e}")

    # 2. Set room metadata so the agent knows this is a practice call and who the learner is
    metadata = json.dumps({
        "call_type": "daily_practice",
        "learner_user_id": user_id,
        "learner_name": name,
    })
    try:
        await lk_api.room.update_room_metadata(
            api.UpdateRoomMetadataRequest(
                room=room_name,
                metadata=metadata,
            )
        )
        logger.info(f"Room metadata set: {metadata}")
    except Exception as e:
        logger.error(f"Error setting room metadata: {e}")

    # 3. Dial the learner via SIP outbound trunk
    logger.info(f"Dialing {target_number} via trunk {sip_trunk_id}...")
    try:
        if CreateSIPParticipantRequest is None:
            logger.error("CreateSIPParticipantRequest not available – ensure 'livekit-protocol' is installed.")
            return False
        
        request_kwargs = dict(
            room_name=room_name,
            sip_call_to=target_number,
            sip_trunk_id=sip_trunk_id,
            participant_identity=f"sip_{user_id}",
            wait_until_answered=True,
        )
        # Optional caller ID – some trunks (e.g., Linphone) require the From address to be a registered SIP URI.
        sip_caller_id = os.getenv("LIVEKIT_SIP_CALLER_ID")
        if sip_caller_id:
            request_kwargs["sip_caller_id"] = sip_caller_id

        logger.debug("=== SIP request kwargs ===")
        logger.debug(request_kwargs)

        # Use opportunistic encryption – compatible with Linphone
        if SIPMedia is not None:
            request_kwargs["media"] = SIPMedia(
                media_encryption=SIPMediaEncryption.SIP_MEDIA_ENCRYPT_ALLOW
            )
        request = CreateSIPParticipantRequest(**request_kwargs)
        logger.debug(f"SIP request payload: {request}")
        participant = await lk_api.sip.create_sip_participant(request)

        logger.info(f"Outbound call to {name} succeeded! Participant: {participant}")
        return True
    except Exception as e:
        logger.error(f"Error making outbound SIP call to {name}: {e}")
        return False


async def main():
    load_dotenv(".env.local")

    url = os.getenv("LIVEKIT_URL")
    api_key = os.getenv("LIVEKIT_API_KEY")
    api_secret = os.getenv("LIVEKIT_API_SECRET")
    sip_trunk_id = os.getenv("LIVEKIT_SIP_TRUNK_ID", "ST_AWqXjEn7MXFD")

    if not url or not api_key or not api_secret:
        logger.error(
            "LiveKit credentials not found in environment variables. "
            "Please check backend/.env.local"
        )
        sys.exit(1)

    # Load learner practice schedule
    schedule_path = os.path.join(os.path.dirname(__file__), "learners_practice_schedule.json")
    try:
        with open(schedule_path, "r", encoding="utf-8") as f:
            schedule = json.load(f)
    except Exception as e:
        logger.error(f"Error loading learner schedule: {e}")
        schedule = []

    # --- Allow forcing a specific learner via CLI arg for testing ---
    # Usage: uv run python src/outbound.py test
    # This skips the time-matching check and calls the first learner in the list.
    force_test = len(sys.argv) > 1 and sys.argv[1] == "test"

    if force_test:
        target_learner = schedule[0] if schedule else None
        if target_learner:
            logger.info(f"TEST MODE: Forcing call to first learner: {target_learner['name']}")
    else:
        target_learner = find_due_learner(schedule)

    if not target_learner:
        if force_test:
            logger.error("No learners found in schedule file.")
        else:
            logger.info("No learners are due for a practice call at this time. Schedule a call by matching 'preferred_call_time' to HH:MM now.")
        return

    lk_api = api.LiveKitAPI(url=url, api_key=api_key, api_secret=api_secret)

    try:
        success = await dial_learner(target_learner, lk_api, sip_trunk_id, test_mode=force_test)

        # Record last_called timestamp so we don't double-dial today
        if success:
            target_learner["last_called"] = datetime.now().strftime("%Y-%m-%d")
            try:
                with open(schedule_path, "w", encoding="utf-8") as f:
                    json.dump(schedule, f, indent=2)
                logger.info(f"Updated last_called for {target_learner['name']} to {target_learner['last_called']}")
            except Exception as e:
                logger.error(f"Failed to save schedule update: {e}")
    finally:
        await lk_api.aclose()


if __name__ == "__main__":
    asyncio.run(main())