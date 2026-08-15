# Saksham

A voice first learning companion built for the **10 Days of Voice Agents: VoiceForBharat Edition**, under the **Learning & Literacy** track.

Saksham enables learners to have natural voice conversations, use learning tools, remember context, make outbound calls, request human support, and hand off conversations to specialist agents.

## Features

* Real time voice conversations
* Murf Falcon TTS
* Learner memory
* Learning tools
* Outbound calls
* Human escalation
* Call analytics
* Specialist agent handoff

## Tech Stack

**Frontend:** Next.js, React, TypeScript
**Backend:** Python, LiveKit Agents
**STT:** Deepgram
**TTS:** Murf Falcon
**Real time:** LiveKit

## Architecture

```text
Learner
   ↓
LiveKit → STT → Saksham Agent
                 ├── Memory
                 ├── Tools
                 ├── Escalation
                 └── Specialist Handoff
   ↓
Murf Falcon TTS
   ↓
Learner
```

## Setup

```bash
git clone https://github.com/ianusha08/murf-livekit-starter.git
cd murf-livekit-starter
```

Configure the required API keys in `.env` and run the backend and frontend using the project's setup instructions.

**Never commit API keys or private credentials.**

## Links

[GitHub](https://github.com/ianusha08/murf-livekit-starter) • [Blog: Meet Saksham](https://medium.com/@iashi.s/meet-saksham-9e852ed99e65)

Built with **Murf Falcon** for the **VoiceForBharat Edition**.
