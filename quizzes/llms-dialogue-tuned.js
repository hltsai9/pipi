registerQuiz({
  collection: "llms",
  key: "dialogue",
  title: "Dialogue-Tuned LLMs",
  icon: "D",
  description: "Models specialized for multi-turn conversation and chat.",
  questions: [
    {
      q: "What primarily distinguishes a dialogue-tuned LLM from an instruction-tuned LLM?",
      choices: [
        "It has more parameters",
        "It is optimized for multi-turn conversation, with awareness of speaker roles and chat history",
        "It only works in English",
        "It cannot follow instructions"
      ],
      answer: 1,
      explanation: "Dialogue tuning builds on instruction tuning but adds multi-turn structure: distinct system/user/assistant roles, persistent context across turns, and conversational behaviors like asking clarifying questions, maintaining persona, and avoiding repetition."
    },
    {
      q: "What is RLHF (Reinforcement Learning from Human Feedback) most commonly used for in dialogue models like ChatGPT and Claude?",
      choices: [
        "Compressing the model to fit on a phone",
        "Aligning the model's outputs with human preferences for helpfulness, harmlessness, and tone",
        "Speeding up token generation",
        "Eliminating the need for any training data"
      ],
      answer: 1,
      explanation: "RLHF trains a reward model on human preference comparisons, then uses RL (typically PPO) to push the LLM toward responses humans prefer. In chat models this is the main mechanism for making replies feel helpful, honest, and safe — beyond what supervised fine-tuning alone can achieve."
    },
    {
      q: "Which of these is the typical message-role structure used in dialogue-tuned LLM APIs?",
      choices: [
        "input / output / metadata",
        "prompt / completion only",
        "system / user / assistant",
        "encoder / decoder / classifier"
      ],
      answer: 2,
      explanation: "Modern chat APIs (OpenAI, Anthropic, etc.) standardize on system/user/assistant roles. The system message sets persona and rules, user messages are the human's turns, and assistant messages are the model's prior replies. The model is fine-tuned to respect these role boundaries."
    },
    {
      q: "Which of these problems is dialogue tuning specifically designed to address?",
      choices: [
        "Models forgetting earlier turns or breaking persona within a conversation",
        "Slow GPU kernels",
        "Tokenization errors",
        "The need for vector databases"
      ],
      answer: 0,
      explanation: "Multi-turn coherence is a defining challenge for chat models: keeping track of what was said earlier, sticking to a persona/system instructions, and producing replies that fit the conversational flow. Dialogue tuning explicitly trains on multi-turn data to improve this."
    },
    {
      q: "Anthropic's Constitutional AI (CAI) is best described as:",
      choices: [
        "A new tokenization scheme",
        "An alternative to RLHF where the model critiques and revises its own outputs based on a set of principles",
        "A regulatory framework imposed by governments",
        "A way to prune model weights"
      ],
      answer: 1,
      explanation: "Constitutional AI (Bai et al., 2022) replaces much of the human preference labeling in RLHF with AI feedback guided by a written 'constitution' of principles. The model critiques and revises its own outputs, and a reward model is trained from those AI-generated preferences (RLAIF)."
    }
  ]
});
