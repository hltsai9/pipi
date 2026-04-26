registerQuiz({
  collection: "llms",
  key: "dialogue",
  title: "Dialogue-Tuned LLMs",
  icon: "D",
  description: "Models specialized for multi-turn conversation and chat.",
  createdAt: "2026-04-25T18:02:00Z",
  updatedAt: "2026-04-26T17:50:00Z",
  questions: [
    {
      q: "What primarily distinguishes a dialogue-tuned LLM from an instruction-tuned LLM?",
      choices: [
        "It has substantially more parameters than the underlying instruction-tuned model",
        "It is restricted to English and cannot operate in other natural languages",
        "It is optimized for multi-turn chat, with awareness of speaker roles and history",
        "It deliberately ignores explicit instructions in favor of casual conversation"
      ],
      answer: 2,
      explanation: "Dialogue tuning builds on instruction tuning but adds multi-turn structure: distinct system/user/assistant roles, persistent context across turns, and conversational behaviors like asking clarifying questions, maintaining persona, and avoiding repetition."
    },
    {
      q: "What is RLHF (Reinforcement Learning from Human Feedback) most commonly used for in dialogue models like ChatGPT and Claude?",
      choices: [
        "Aggressively compressing the model so it can run on a phone or embedded device",
        "Aligning the model's outputs with human preferences for helpfulness and tone",
        "Speeding up token generation by replacing slow attention with faster operators",
        "Eliminating the need for any training data, allowing pure self-supervised learning"
      ],
      answer: 1,
      explanation: "RLHF trains a reward model on human preference comparisons, then uses RL (typically PPO) to push the LLM toward responses humans prefer. In chat models this is the main mechanism for making replies feel helpful, honest, and safe — beyond what supervised fine-tuning alone can achieve."
    },
    {
      q: "Which of these is the typical message-role structure used in dialogue-tuned LLM APIs?",
      choices: [
        "input / output / metadata, with the metadata field holding routing info",
        "prompt and completion only, mirroring the simple text-in / text-out style",
        "encoder / decoder / classifier, replicating the original Transformer roles",
        "system / user / assistant, with system messages framing persona and rules"
      ],
      answer: 3,
      explanation: "Modern chat APIs (OpenAI, Anthropic, etc.) standardize on system/user/assistant roles. The system message sets persona and rules, user messages are the human's turns, and assistant messages are the model's prior replies. The model is fine-tuned to respect these role boundaries."
    },
    {
      q: "Which of these problems is dialogue tuning specifically designed to address?",
      choices: [
        "Slow GPU kernels in the attention block, particularly for long contexts",
        "Tokenization errors caused by rare characters in non-Latin scripts",
        "The need for an external vector database to retrieve relevant documents",
        "Models forgetting earlier turns or breaking persona within a conversation"
      ],
      answer: 3,
      explanation: "Multi-turn coherence is a defining challenge for chat models: keeping track of what was said earlier, sticking to a persona/system instructions, and producing replies that fit the conversational flow. Dialogue tuning explicitly trains on multi-turn data to improve this."
    },
    {
      q: "Anthropic's Constitutional AI (CAI) is best described as:",
      choices: [
        "A new tokenization scheme that better handles legal and policy documents",
        "A regulatory framework imposed by governments on AI labs and their releases",
        "An RLHF alternative where the model critiques itself using written principles",
        "A pruning method that removes weights tied to harmful or off-policy behavior"
      ],
      answer: 2,
      explanation: "Constitutional AI (Bai et al., 2022) replaces much of the human preference labeling in RLHF with AI feedback guided by a written 'constitution' of principles. The model critiques and revises its own outputs, and a reward model is trained from those AI-generated preferences (RLAIF)."
    }
  ]
});
