registerStructuredQuiz({
  collection: "headroom",
  key: "architecture-ccr",
  title: "Architecture & CCR",
  icon: "C",
  description: "Compress-Cache-Retrieve, hash markers, the headroom_retrieve tool, and the pipeline.",
  createdAt: "2026-07-09T13:05:00Z",
  updatedAt: "2026-07-09T13:05:00Z",
  sections: [
    {
      category: "priming",
      questions: [
        {
          type: "open_ended",
          question: "Before reading anything formal: if you shrink data before the model sees it, what happens when the model later needs a detail you compressed away? How might a system be designed to handle that?",
          difficulty: "easy"
        },
        {
          type: "open_ended",
          question: "Predict: to make compression effectively 'lossless' for an LLM, what would the system need to keep around, and what would it need to give the model access to?",
          difficulty: "medium"
        }
      ]
    },
    {
      category: "comprehension",
      questions: [
        {
          type: "flashcard",
          question: "What does CCR stand for, and what does it guarantee?",
          answer: "Compress-Cache-Retrieve. It makes Headroom's compression fully reversible: the LLM can always get the original data back.",
          difficulty: "easy"
        },
        {
          type: "flashcard",
          question: "When Headroom compresses a block, what happens to the original?",
          answer: "The original is stored in a local LRU cache under a hash key, and the LLM sees the compressed version plus a hash marker that points to that cached original.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "What is the headroom_retrieve tool?",
          answer: "A tool given to the LLM so it can fetch the full original of a compressed block on demand, whenever it needs more detail than the compressed form provides.",
          difficulty: "easy"
        },
        {
          type: "flashcard",
          question: "What does headroom_retrieve's optional query parameter do?",
          answer: "It runs a BM25 search over the cached item and returns only the relevant subset, instead of handing back the entire original payload.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "What are the stages of Headroom's compression pipeline?",
          answer: "A three-stage flow: CacheAligner → ContentRouter → the type-specific compressors (SmartCrusher, CodeCompressor, Kompress-base).",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "Which content blocks does Headroom actually compress?",
          answer: "Only the 'live zone' — the newest blocks, such as the latest user message and latest tool result — leaving the stable prefix untouched.",
          difficulty: "medium"
        }
      ]
    },
    {
      category: "application",
      questions: [
        {
          type: "multiple_choice",
          question: "Under CCR, what does the LLM actually see in place of a compressed blob?",
          options: [
            "Nothing — the block is silently removed from the conversation entirely",
            "A one-sentence summary generated on the fly by a smaller helper model",
            "A compressed version plus a hash marker that points to the cached original",
            "A truncated first-200-characters preview, with the remainder discarded"
          ],
          correct_option: "C",
          explanation: "CCR replaces the blob with a compressed form and a hash marker referencing the cached original, so nothing is lost. It isn't deletion, a separate summary model, or blind truncation."
        },
        {
          type: "multiple_choice",
          question: "The model needs the full original of something Headroom compressed. What does it do?",
          options: [
            "It calls the headroom_retrieve tool to fetch the original from the cache",
            "It re-runs the original tool call, hoping the same output comes back again",
            "It asks the user to paste the missing data back into the conversation",
            "It cannot — CCR compression is one-way and the original is already gone"
          ],
          correct_option: "A",
          explanation: "That's exactly what headroom_retrieve is for: pulling the cached original on demand. Because CCR caches originals, the model never has to re-run tools or give up."
        },
        {
          type: "multiple_choice",
          question: "You pass a query to headroom_retrieve instead of retrieving the whole blob. What happens?",
          options: [
            "It returns the blob re-compressed a second time for extra token savings",
            "It ignores the query and always returns the entire cached original anyway",
            "It forwards the query to the LLM provider as a separate billed request",
            "It runs a BM25 search over the cached item and returns only the matches"
          ],
          correct_option: "D",
          explanation: "The optional query triggers a BM25 search over the cached item, returning just the relevant subset — cheaper than pulling back the full original payload."
        },
        {
          type: "multiple_choice",
          question: "Why does Headroom compress only the 'live zone' rather than the whole conversation?",
          options: [
            "Because older messages are encrypted and therefore cannot be compressed",
            "To keep the request prefix stable so the provider's KV cache still gets hits",
            "Because the live zone is the only part small enough to fit in the LRU cache",
            "To ensure the system prompt gets recompressed fresh on every single turn"
          ],
          correct_option: "B",
          explanation: "Touching only the newest blocks keeps the earlier prefix byte-stable, which preserves the provider's prompt/KV cache hits. Compressing the prefix every turn would destroy those cache discounts."
        }
      ]
    },
    {
      category: "transfer_synthesis",
      questions: [
        {
          type: "flashcard",
          question: "How does CCR let Headroom be 'aggressive but safe'?",
          answer: "It can strip a lot because nothing is truly lost: originals live in the local cache, and the model can pull them back — whole, or by BM25 query — through headroom_retrieve whenever it needs the detail.",
          difficulty: "hard"
        },
        {
          type: "multiple_choice",
          question: "How is Headroom's approach different from just truncating or summarizing tool outputs?",
          options: [
            "It isn't — in this context 'compression' is just a nicer word for truncation",
            "It summarizes with a large model, which is slower but supposedly never loses detail",
            "Originals are cached and retrievable, so detail is deferred rather than destroyed",
            "It compresses outputs only after the model has already finished reading them"
          ],
          correct_option: "C",
          explanation: "Plain truncation or summarization loses information permanently. CCR keeps the original cached and retrievable, so compression defers detail instead of destroying it."
        }
      ]
    }
  ]
});
