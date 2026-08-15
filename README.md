# Saksham: Voice First Learning Companion

A voice first learning companion built for the **10 Days of Voice Agents: VoiceForBharat Edition**, under the **Learning & Literacy** track.

Saksham helps learners interact through natural voice conversations, use learning tools, retain context, connect through outbound calls, request human support, and hand conversations to specialist agents.

## Why Saksham?

I have always enjoyed both teaching and learning. I like explaining things, but I also enjoy being the learner. That made Learning & Literacy the most natural track for me.

I wanted to explore how voice could make learning feel more conversational and accessible.

## Features

* Real time voice conversations
* Murf Falcon TTS
* Learner memory
* Learning and practice tools
* Outbound calls
* Human escalation
* Call analytics
* Specialist agent handoff
* Agent state tracking

## Architecture

```text
Learner
   ↓
LiveKit
   ↓
Speech to Text
   ↓
Saksham Agent
   ├── Memory
   ├── Tools
   ├── Guardrails
   ├── Human Escalation
   └── Specialist Handoff
   ↓
Murf Falcon TTS
   ↓
Learner
```

## Tech Stack

**Frontend:** Next.js, React, TypeScript
**Backend:** Python, LiveKit Agents
**STT:** Deepgram
**TTS:** Murf Falcon
**Real Time:** LiveKit
**Deployment:** Vercel, Railway

## Challenge Journey

| Day | Focus                        |
| --- | ---------------------------- |
| 1   | Voice agent foundation       |
| 2   | Learning & Literacy          |
| 3   | Voice interaction states     |
| 4   | Memory                       |
| 5   | Learning tools               |
| 6   | Outbound calls               |
| 7   | Human escalation             |
| 8   | Call analytics               |
| 9   | Specialist handoff           |
| 10  | Documentation and reflection |

## Getting Started

### Clone the repository

```bash
git clone https://github.com/ianusha08/murf-livekit-starter.git
cd murf-livekit-starter
```

### Configure environment variables

Create a `.env` file using the provided example and add your own API credentials.

```env
LIVEKIT_URL=your_livekit_url
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
MURF_API_KEY=your_murf_api_key
DEEPGRAM_API_KEY=your_deepgram_api_key
```

Never commit API keys or private credentials.

### Run the project

Set up the backend and frontend dependencies using the project's configuration, start the agent, then launch the frontend and connect to a LiveKit session.

Once connected, allow microphone access and start talking to Saksham.

## What I Learned

Building a voice agent is much more than connecting speech to an LLM and generating audio.

The challenge taught me to think about **memory, tools, guardrails, human fallback, analytics, and specialization** as part of the agent itself.

The biggest shift was moving from:

```text
Voice → Conversation
```

to:

```text
Conversation → Context → Action → Support → Specialization
```

## What's Next?

I would like to explore stronger multilingual support, better personalized learning, additional specialist agents, improved analytics, and more robust production infrastructure.

## Links

**GitHub:** https://github.com/ianusha08/murf-livekit-starter
**Blog:** https://medium.com/@iashi.s/meet-saksham-9e852ed99e65
**Challenge:** https://github.com/murf-ai/voice-for-bharat-challenge-2026

## Acknowledgements

Built as part of **10 Days of Voice Agents: VoiceForBharat Edition** by Murf AI.

**Track:** Learning & Literacy
**Project:** Saksham
