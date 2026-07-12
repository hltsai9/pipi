registerStructuredQuiz({
  collection: "headroom",
  key: "setup-and-limitations",
  title: "Setup, Config & Limits",
  icon: "S",
  description: "Installing and running Headroom, configuring it, hot-reload, and the safety gates that limit compression.",
  createdAt: "2026-07-09T13:20:00Z",
  updatedAt: "2026-07-09T13:20:00Z",
  sections: [
    {
      category: "priming",
      questions: [
        {
          type: "open_ended",
          question: "Before reading anything formal: you want to try a context compressor on an existing agent without rewriting it. What would make that adoption easy versus painful?",
          difficulty: "easy"
        },
        {
          type: "open_ended",
          question: "Predict: when might compressing code inside a conversation be a bad idea — when could stripping detail actually hurt the model's answer?",
          difficulty: "medium"
        }
      ]
    },
    {
      category: "comprehension",
      questions: [
        {
          type: "flashcard",
          question: "How do you install Headroom?",
          answer: "Python (all features): pip install \"headroom-ai[bash]\"; Node/TypeScript: npm install headroom-ai; or Docker: docker pull ghcr.io/chopratejas/headroom:latest.",
          difficulty: "easy"
        },
        {
          type: "flashcard",
          question: "How do you run the proxy and wrap an existing agent?",
          answer: "Start the proxy with `headroom proxy --port 8787`, and wrap any agent with zero code changes, e.g. `headroom wrap claude`.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "What are the ways to configure Headroom?",
          answer: "Via the SDK constructor, the proxy command line, environment variables, or per-request overrides.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "How does hot-reload of settings work?",
          answer: "Settings are synced to the running proxy over a loopback POST /admin/runtime-env, so they take effect immediately — with no restart, cold start, dropped requests, or lost caches.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "What is verbosity steering?",
          answer: "Headroom appends a short 'be terse, don't restate context' note to the end of the system prompt; `headroom learn --verbosity` can read your past sessions and pick the level automatically.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "What is 'analysis intent protection'?",
          answer: "With protect_analysis_context enabled, if the latest user message contains keywords like 'analyze', 'review', 'explain', 'fix', or 'debug', all code in the conversation is protected from compression.",
          difficulty: "hard"
        }
      ]
    },
    {
      category: "application",
      questions: [
        {
          type: "multiple_choice",
          question: "How do you put Headroom in front of an existing Claude agent without changing its code?",
          options: [
            "Rewrite the agent to import the SDK and call compress() on every message",
            "Run the proxy and wrap the agent, for example: headroom wrap claude",
            "Fork the agent and merge Headroom's source into its request handler",
            "Point the agent at Headroom's hosted cloud endpoint instead of the API"
          ],
          correct_option: "B",
          explanation: "`headroom wrap` puts the proxy in front of an agent with zero code changes. Rewriting, forking, or switching to a hosted endpoint would all defeat the point of a transparent, local layer."
        },
        {
          type: "multiple_choice",
          question: "You change HEADROOM_VERBOSITY on a running proxy. When does it take effect?",
          options: [
            "After you restart the proxy, which briefly drops any in-flight requests",
            "On the next cold start, once the existing caches have all been cleared",
            "Only for proxies started afterward; the running one keeps the old value",
            "Immediately — it's hot-synced via a loopback POST /admin/runtime-env"
          ],
          correct_option: "D",
          explanation: "Headroom hot-reloads settings through POST /admin/runtime-env, so the change applies right away with no restart, cold start, dropped requests, or lost caches."
        },
        {
          type: "multiple_choice",
          question: "Your latest message says 'explain this function.' What does analysis intent protection do?",
          options: [
            "It protects all of the code in the conversation from being compressed",
            "It compresses the code more aggressively, since you only want an explanation",
            "It disables the CCR cache so no retrieval is needed for this one turn",
            "It switches the proxy into fully verbose mode for every future request"
          ],
          correct_option: "A",
          explanation: "Keywords like 'explain', 'analyze', 'review', 'fix', and 'debug' signal the user needs the real code, so protection keeps all code uncompressed rather than compressing it harder."
        },
        {
          type: "multiple_choice",
          question: "Which command installs the full-featured Python package?",
          options: [
            "npm install headroom-ai",
            "docker pull ghcr.io/chopratejas/headroom:latest",
            "pip install \"headroom-ai[bash]\"",
            "headroom proxy --port 8787"
          ],
          correct_option: "C",
          explanation: "`pip install \"headroom-ai[bash]\"` installs the Python package with all features. The npm and docker lines are the Node and container installs, and `headroom proxy` starts the proxy rather than installing anything."
        }
      ]
    },
    {
      category: "transfer_synthesis",
      questions: [
        {
          type: "flashcard",
          question: "Why does Headroom gate the CodeCompressor behind safety protections?",
          answer: "Compressing code can strip detail the model needs — especially when the user asks to analyze, fix, or debug it — so Headroom is conservative: the CodeCompressor rarely fires, and analysis-intent keywords protect all code, trading some savings for safety.",
          difficulty: "hard"
        },
        {
          type: "multiple_choice",
          question: "Why offer configuration via the constructor, the CLI, environment variables, AND per-request overrides?",
          options: [
            "Redundancy for its own sake; in practice only the SDK constructor actually works",
            "To fit different deployment styles and allow per-call tuning without redeploys",
            "Because each surface configures a separate, entirely non-overlapping product",
            "Because environment variables are ignored unless also set in the constructor"
          ],
          correct_option: "B",
          explanation: "Multiple config surfaces let you set defaults where it suits your deployment (code, CLI, env) and still override per request — flexibility, not redundancy, and they configure the same product."
        }
      ]
    }
  ]
});
