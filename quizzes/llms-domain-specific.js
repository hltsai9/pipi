registerQuiz({
  collection: "llms",
  key: "domain",
  title: "Domain-Specific LLMs",
  icon: "S",
  description: "Models specialized for medicine, law, code, finance, and more.",
  questions: [
    {
      q: "Which of these is an example of a domain-specific LLM?",
      choices: [
        "GPT-4",
        "Med-PaLM (medical) or BloombergGPT (finance)",
        "BERT-base",
        "Llama 3 base"
      ],
      answer: 1,
      explanation: "Med-PaLM (Google) is tuned for medical question answering; BloombergGPT was pretrained on a finance-heavy corpus for financial NLP. The other options are general-purpose models. Other domain examples include Codex (code), SciBERT (science), and Legal-BERT (law)."
    },
    {
      q: "What are the two most common ways to build a domain-specific LLM?",
      choices: [
        "Increasing the temperature and top-p",
        "Continued pretraining / fine-tuning on domain text, or retrieval-augmented generation (RAG)",
        "Quantizing weights to int4",
        "Replacing the tokenizer with whitespace splitting"
      ],
      answer: 1,
      explanation: "You either bake domain knowledge into the weights — by continued pretraining or fine-tuning on domain corpora — or you keep a generic model and supply domain knowledge at inference time via retrieval (RAG). In practice, hybrid approaches (fine-tune + RAG) are common."
    },
    {
      q: "Which is a key advantage of a well-built domain-specific LLM over a general-purpose LLM?",
      choices: [
        "It is always smaller and cheaper, regardless of task",
        "It tends to use domain vocabulary correctly and produces more reliable answers within its domain",
        "It eliminates hallucinations entirely",
        "It removes the need for evaluation"
      ],
      answer: 1,
      explanation: "Domain models internalize specialist terminology, conventions, and reasoning patterns (e.g., ICD codes, legal citation styles, financial jargon). They are usually more accurate and fluent within their domain — but they can still hallucinate and they don't necessarily save compute."
    },
    {
      q: "Codex / Code Llama / StarCoder are domain-specific LLMs for which domain?",
      choices: [
        "Medicine",
        "Law",
        "Source code",
        "Finance"
      ],
      answer: 2,
      explanation: "These are code-specialized LLMs, typically pretrained or continue-pretrained on large public code corpora (e.g., The Stack, GitHub). Code is one of the clearest success stories for domain specialization — code-tuned models handily beat general models at programming tasks of similar size."
    },
    {
      q: "When is Retrieval-Augmented Generation (RAG) often preferred over fine-tuning a domain-specific LLM?",
      choices: [
        "When the domain knowledge changes frequently or must be auditable / citable",
        "When you want the model to be smaller",
        "When you have unlimited GPUs",
        "When you don't care about correctness"
      ],
      answer: 0,
      explanation: "RAG keeps knowledge in an external store you can update without retraining, and it lets you cite sources — both critical when facts change often (news, policies, product docs) or when answers must be verifiable (medicine, law). Fine-tuning bakes knowledge into weights, which is harder to update or audit."
    }
  ]
});
