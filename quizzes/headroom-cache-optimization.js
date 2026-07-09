registerStructuredQuiz({
  collection: "headroom",
  key: "cache-optimization",
  title: "Cache Optimization",
  icon: "K",
  description: "CacheAligner, the live zone, and preserving the provider's KV-cache prefix discount.",
  createdAt: "2026-07-04T13:15:00Z",
  updatedAt: "2026-07-04T13:15:00Z",
  sections: [
    {
      category: "priming",
      questions: [
        {
          type: "open_ended",
          question: "Before reading anything formal: LLM providers give a large discount when a request's prefix matches one they've already cached. How might aggressively editing your context accidentally destroy that discount?",
          difficulty: "medium"
        },
        {
          type: "open_ended",
          question: "Predict: if you want both compression savings AND prefix-cache savings at the same time, which parts of the conversation should you leave completely untouched?",
          difficulty: "medium"
        }
      ]
    },
    {
      category: "comprehension",
      questions: [
        {
          type: "flashcard",
          question: "What is the prefix-cache discount that Headroom tries to preserve?",
          answer: "Providers like Anthropic and OpenAI cache a stable request prefix and charge a large discount — roughly 90% off — to re-read it. Headroom keeps that prefix stable so the discount keeps applying.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "What does CacheAligner do?",
          answer: "It stabilizes the request prefix so the provider's KV cache actually hits, preserving the cached-prefix read discount.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "Which parts of the context does Headroom leave untouched?",
          answer: "The system prompt, the tool definitions, and older turns — the stable prefix — so that prompt caching keeps working.",
          difficulty: "easy"
        },
        {
          type: "flashcard",
          question: "What is the 'live zone'?",
          answer: "The newest content blocks — the latest user message and the latest tool result/output — which is the only part of the conversation Headroom compresses.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "Does Headroom drop old messages to save tokens?",
          answer: "No. It never drops messages from history; it compresses only the live zone and leaves the earlier conversation intact.",
          difficulty: "easy"
        },
        {
          type: "flashcard",
          question: "Why does editing the prefix hurt?",
          answer: "Any change to the prefix invalidates the provider's cache for it, so the whole prefix must be re-read at full price — wiping out the ~90% discount.",
          difficulty: "medium"
        }
      ]
    },
    {
      category: "application",
      questions: [
        {
          type: "multiple_choice",
          question: "Why does Headroom avoid rewriting the system prompt and older turns?",
          options: [
            "Because those sections are strictly read-only and cannot be modified at all",
            "Because the provider already compresses them automatically on its own end",
            "Because changing the prefix would invalidate the provider's cache discount",
            "Because the model ignores everything except the single most recent message"
          ],
          correct_option: "C",
          explanation: "Rewriting any part of the prefix invalidates the provider's cached copy, forcing a full-price re-read. Keeping it stable is precisely how the discount is preserved."
        },
        {
          type: "multiple_choice",
          question: "What is CacheAligner's role in the pipeline?",
          options: [
            "It keeps the request prefix stable so the provider's KV cache hits",
            "It deletes the oldest turns once the context window is nearly full",
            "It encrypts cached blocks so other tenants can't read your prefixes",
            "It picks which type-specific compressor each content block goes to"
          ],
          correct_option: "A",
          explanation: "CacheAligner exists to stabilize the prefix for KV-cache hits. It doesn't evict history, handle encryption, or route content — routing is the ContentRouter's job."
        },
        {
          type: "multiple_choice",
          question: "Headroom compresses the 'live zone.' Which blocks are in it?",
          options: [
            "The system prompt together with the full list of tool definitions",
            "Every message in the conversation, compressed uniformly each turn",
            "Only the messages that are older than the ten most recent turns",
            "The newest blocks — the latest user message and latest tool result"
          ],
          correct_option: "D",
          explanation: "The live zone is the newest content — the latest user message and tool result. The prefix (system prompt, tool defs, older turns) is deliberately left alone."
        },
        {
          type: "multiple_choice",
          question: "A naive approach compresses the entire conversation every turn. Why can that cost more, not less?",
          options: [
            "Because compression always adds more tokens than it removes on balance",
            "Because it changes the prefix each turn, losing the ~90% cache discount",
            "Because the provider bills an extra surcharge for any compressed request",
            "Because older turns are the only part large enough to matter for the cost"
          ],
          correct_option: "B",
          explanation: "Recompressing everything mutates the prefix each turn, so the provider can never reuse its cache — you pay full price for the whole prefix, which can outweigh the token savings."
        }
      ]
    },
    {
      category: "transfer_synthesis",
      questions: [
        {
          type: "flashcard",
          question: "Why can compression and prefix-caching work against each other, and how does Headroom reconcile them?",
          answer: "Compression rewrites context, but rewriting the prefix invalidates the provider's cache. Headroom reconciles the two by touching only the live zone and using CacheAligner to keep the prefix byte-stable — so you get both kinds of savings at once.",
          difficulty: "hard"
        },
        {
          type: "multiple_choice",
          question: "A team sees token counts drop after compression, but their bill barely moves. What's the most likely cause?",
          options: [
            "The provider does not actually charge per token, only a flat fee per request",
            "Compression increased latency, and it is latency, not tokens, that drives cost",
            "Their approach broke prefix caching, so cached reads now cost full price again",
            "Headroom double-counts tokens, so the reported savings were never real to begin with"
          ],
          correct_option: "C",
          explanation: "If compression disturbs the prefix, the ~90% cache discount vanishes and those reads revert to full price — which can cancel out the token-count savings on the bill."
        }
      ]
    }
  ]
});
