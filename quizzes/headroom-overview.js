registerStructuredQuiz({
  collection: "headroom",
  key: "overview",
  title: "Overview",
  icon: "H",
  description: "What Headroom is, the problem it solves, and where it fits.",
  createdAt: "2026-07-09T13:00:00Z",
  updatedAt: "2026-07-09T13:00:00Z",
  sections: [
    {
      category: "priming",
      questions: [
        {
          type: "open_ended",
          question: "Before reading anything formal: your AI agent's biggest bill is often the tokens it reads, not the tokens it writes. In a tool-using agent, where do you think all those input tokens actually come from?",
          difficulty: "easy"
        },
        {
          type: "open_ended",
          question: "Predict: if you could strip repetitive machine noise — huge JSON, sprawling logs — from what the model reads without losing meaning, what would improve, and what might you put at risk?",
          difficulty: "medium"
        }
      ]
    },
    {
      category: "comprehension",
      questions: [
        {
          type: "flashcard",
          question: "What is Headroom, in one sentence?",
          answer: "A context-optimization layer that compresses what an LLM reads — tool outputs, database results, file reads, and RAG retrievals — before it reaches the model.",
          difficulty: "easy"
        },
        {
          type: "flashcard",
          question: "What problem does Headroom target?",
          answer: "Most input context is machine-generated noise — verbose JSON, repeated database fields, sprawling logs, duplicate API responses — that adds token cost without adding value.",
          difficulty: "easy"
        },
        {
          type: "flashcard",
          question: "Where does Headroom sit, and how does it work?",
          answer: "Between your app/agent and the LLM provider: it intercepts messages, compresses them, and forwards the optimized request. It runs locally and transparently.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "What three forms does Headroom ship in?",
          answer: "A library (SDK) you import, a proxy that sits in front of the LLM API, and an MCP server.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "What are Headroom's headline results?",
          answer: "60–95% fewer tokens with the same answers; across its users it has reportedly saved around $700,000 and roughly 200 billion tokens.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "Who created Headroom, and is it open source?",
          answer: "It's open source, created by Netflix senior engineer Tejas Chopra.",
          difficulty: "easy"
        }
      ]
    },
    {
      category: "application",
      questions: [
        {
          type: "multiple_choice",
          question: "Which of these does Headroom compress before it reaches the model?",
          options: [
            "The model's own chain-of-thought reasoning tokens as it generates them",
            "Tool outputs, database results, file reads, and RAG retrievals in the context",
            "The provider's response stream, shrinking the tokens the model outputs",
            "The user's typed prompt, rewriting it into a shorter paraphrased version"
          ],
          correct_option: "B",
          explanation: "Headroom compresses the bulky machine-generated context the model reads — tool outputs, DB results, file reads, RAG chunks. It doesn't rewrite the user's prompt or touch the model's generated output."
        },
        {
          type: "multiple_choice",
          question: "Architecturally, where does Headroom run relative to your agent and the LLM?",
          options: [
            "Inside the LLM provider, as a server-side feature you enable per account",
            "As a fine-tuned adapter merged into the model's own weights at load time",
            "Between your app and the provider, intercepting and compressing requests",
            "After the response returns, summarizing the model's answer for your logs"
          ],
          correct_option: "C",
          explanation: "Headroom is a local, transparent layer between your application and the provider. It intercepts the outgoing request, compresses the context, and forwards it — it isn't a provider feature or a change to the model."
        },
        {
          type: "multiple_choice",
          question: "Which is NOT one of the forms Headroom is distributed as?",
          options: [
            "A browser extension that rewrites web pages before you copy text from them",
            "A library you import and call from your application's own code directly",
            "A local proxy that sits in front of the LLM API endpoint",
            "An MCP server that exposes Headroom's capabilities to MCP clients"
          ],
          correct_option: "A",
          explanation: "Headroom ships as a library, a proxy, and an MCP server. There is no browser-extension form — Headroom operates on an agent's LLM context, not on web pages in a browser."
        },
        {
          type: "multiple_choice",
          question: "Headroom claims '60–95% fewer tokens, same answers.' How is 'same answers' possible despite dropping so much?",
          options: [
            "It only compresses requests that the model was going to ignore anyway",
            "It asks the model to guess the missing details from general knowledge",
            "It caps compression at whatever level keeps outputs byte-for-byte identical",
            "Compression is reversible — the model can retrieve the full original on demand"
          ],
          correct_option: "D",
          explanation: "Headroom's compression is reversible: originals are cached and the model can pull them back when it needs detail. It isn't guessing, nor limited to ignorable content."
        }
      ]
    },
    {
      category: "transfer_synthesis",
      questions: [
        {
          type: "flashcard",
          question: "Why does compressing input context often matter more than shortening the model's output?",
          answer: "In tool-using agents, most tokens — and thus most cost and latency — come from what the model reads each turn: large tool results, logs, and RAG chunks that dwarf the output. Trimming that input is where the savings are.",
          difficulty: "hard"
        },
        {
          type: "multiple_choice",
          question: "Headroom is described as 'local and transparent.' What does that buy you?",
          options: [
            "Your data is shipped to Headroom's cloud service for centralized compression",
            "Compression happens on your side with no code changes to your agent logic",
            "It replaces your LLM provider with Headroom's own hosted model endpoint",
            "It permanently deletes verbose data so that it can never be recovered later"
          ],
          correct_option: "B",
          explanation: "Local and transparent means compression runs on your side and slots in without rewriting your agent — not a cloud service, not a provider swap, and not destructive (originals remain retrievable)."
        }
      ]
    }
  ]
});
