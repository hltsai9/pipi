registerStructuredQuiz({
  collection: "headroom",
  key: "how-compression-works",
  title: "How Compression Works",
  icon: "R",
  description: "ContentRouter and the type-aware compressors: SmartCrusher, CodeCompressor, Kompress, LogCompressor.",
  createdAt: "2026-07-04T13:10:00Z",
  updatedAt: "2026-07-04T13:10:00Z",
  sections: [
    {
      category: "priming",
      questions: [
        {
          type: "open_ended",
          question: "Before reading anything formal: a giant JSON array, a stack trace, and a source file are all 'text,' yet they compress very differently. Why might a single one-size-fits-all compressor be a poor fit?",
          difficulty: "easy"
        },
        {
          type: "open_ended",
          question: "Predict: what would a compressor need to understand about source code in order to shrink it without changing what the code means?",
          difficulty: "medium"
        }
      ]
    },
    {
      category: "comprehension",
      questions: [
        {
          type: "flashcard",
          question: "What is the ContentRouter's job?",
          answer: "It auto-detects the type of each content block and routes it to the compressor best suited for that type, rather than applying one generic compressor to everything.",
          difficulty: "easy"
        },
        {
          type: "flashcard",
          question: "What does SmartCrusher handle?",
          answer: "JSON — arrays of dicts, nested objects, and mixed types — the verbose structured data that tools and APIs emit.",
          difficulty: "easy"
        },
        {
          type: "flashcard",
          question: "What is special about the CodeCompressor?",
          answer: "It's AST-aware (built on tree-sitter) and understands multiple languages — Python, JS/TS, Go, Rust, Java, C/C++, Perl — so it compresses code without breaking its meaning.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "What is Kompress (v2-base)?",
          answer: "A HuggingFace model trained on agentic traces, used by Headroom to compress general text.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "What kinds of content can Headroom compress?",
          answer: "JSON, code, logs, search results, diffs, HTML, and plain text — each routed to a compressor tuned for it (e.g. LogCompressor for logs).",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "Why is type-aware routing better than one universal compressor?",
          answer: "Different content has different redundancy; a JSON-, code-, or log-specific compressor exploits each structure far more effectively than a single generic pass could.",
          difficulty: "medium"
        }
      ]
    },
    {
      category: "application",
      questions: [
        {
          type: "multiple_choice",
          question: "A tool returns a 5,000-line array of JSON records. Which compressor handles it?",
          options: [
            "CodeCompressor, since JSON is really just a programming-language syntax",
            "SmartCrusher, which specializes in JSON arrays and nested objects",
            "LogCompressor, because any large machine output is treated as a log",
            "Kompress, the general text model, since JSON is ultimately just text"
          ],
          correct_option: "B",
          explanation: "SmartCrusher is Headroom's JSON specialist, built for arrays of dicts and nested objects. The others target code, logs, and general text respectively."
        },
        {
          type: "multiple_choice",
          question: "Why is the CodeCompressor AST-aware rather than doing plain text compression?",
          options: [
            "Because ASTs happen to be smaller to store than the source code they represent",
            "Because tree-sitter can only ever read code, never plain natural-language text",
            "Because compressing code as ordinary text would simply run too slowly to use",
            "So it understands code structure and can shrink it without changing its meaning"
          ],
          correct_option: "D",
          explanation: "Parsing to an AST lets the compressor respect syntax and semantics, so it removes redundancy without altering behavior. The other options misstate why AST-awareness matters."
        },
        {
          type: "multiple_choice",
          question: "How does Headroom decide which compressor to use for a given block?",
          options: [
            "The ContentRouter auto-detects the content type and routes accordingly",
            "The user must tag each tool output with its type in the configuration file",
            "It always tries every compressor and keeps whichever output is the smallest",
            "The LLM chooses the compressor by calling a tool before each request runs"
          ],
          correct_option: "A",
          explanation: "The ContentRouter inspects each block, detects its type, and dispatches it to the right compressor automatically — no manual tagging, brute-force trials, or LLM involvement required."
        },
        {
          type: "multiple_choice",
          question: "Which pairing of content and compressor is correct?",
          options: [
            "A Python stack trace routed through SmartCrusher's JSON-object path",
            "A nested JSON API response handed to the AST-aware CodeCompressor",
            "Verbose application logs sent to LogCompressor, tuned for log output",
            "A Go source file sent to LogCompressor, since code is a sequence of lines"
          ],
          correct_option: "C",
          explanation: "Logs go to the LogCompressor. JSON belongs to SmartCrusher and code to the CodeCompressor, so the other pairings route content to the wrong specialist."
        }
      ]
    },
    {
      category: "transfer_synthesis",
      questions: [
        {
          type: "flashcard",
          question: "How does type-aware compression connect to CCR's reversibility?",
          answer: "The ContentRouter picks a compressor that shrinks each type maximally, while CCR keeps the original cached. So aggressive, structure-specific compression stays safe, because any block can still be retrieved in full.",
          difficulty: "hard"
        },
        {
          type: "multiple_choice",
          question: "Kompress-v2-base is a model 'trained on agentic traces.' Why train on that data specifically?",
          options: [
            "Because agentic traces are the only text that is legally free to train on",
            "So the compressor learns the redundancy patterns of real agent context",
            "Because agent traces are already compressed and need no further training",
            "So the model can generate brand-new agent traces rather than compress them"
          ],
          correct_option: "B",
          explanation: "Training on real agent context teaches the model the specific redundancy patterns it will be asked to compress, making it better at the job than a generic text model."
        }
      ]
    }
  ]
});
