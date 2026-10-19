# Saksham — Voice-First Learning Companion

**Saksham** is a voice-first learning companion built for **10 Days of Voice Agents: VoiceForBharat Edition**, under the **Learning & Literacy** track.

Designed to make learning more accessible through natural voice interactions, Saksham enables learners to engage in real-time conversations, access learning tools, retain conversational context, initiate outbound calls, request human assistance, and connect with specialist agents.

## Features

- **Real-time Voice Conversations** — Natural, low-latency voice interactions.
- **Murf Falcon TTS** — Expressive and natural text-to-speech generation.
- **Learner Memory** — Retains relevant conversational context.
- **Learning Tools** — Provides interactive learning assistance.
- **Outbound Calls** — Enables proactive voice interactions.
- **Human Escalation** — Connects learners with human support when needed.
- **Call Analytics** — Tracks and analyzes call interactions.
- **Specialist Agent Handoff** — Routes conversations to specialized agents.

## Tech Stack

| Component | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Backend | Python, LiveKit Agents |
| Speech-to-Text (STT) | Deepgram |
| Text-to-Speech (TTS) | Murf Falcon |
| Real-time Communication | LiveKit |

## Architecture

```text
                 Learner
                    |
                    v
                  LiveKit
                    |
                    v
                    STT
                    |
                    v
              Saksham Agent
                    |
          +---------+---------+
          |         |         |
          v         v         v
        Memory    Tools   Escalation
                              |
                              v
                      Specialist Handoff
                    |
                    v
               Murf Falcon TTS
                    |
                    v
                  Learner
```

## Getting Started

Clone the repository:

```bash
git clone https://github.com/ianusha08/murf-livekit-starter.git
cd murf-livekit-starter
```

Configure the required API credentials in your `.env` file and follow the project-specific setup instructions to run the backend and frontend.


## Project Links

- **GitHub Repository:** [murf-livekit-starter](https://github.com/ianusha08/murf-livekit-starter)
- **Blog:** [Meet Saksham](https://medium.com/@iashi.s/meet-saksham-9e852ed99e65)

---



**Security Note:** Never commit API keys, environment files, or private credentials to the repository.
