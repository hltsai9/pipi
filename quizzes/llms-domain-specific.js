registerQuiz({
  collection: "llms",
  key: "domain",
  title: "Domain-Specific LLMs",
  icon: "S",
  description: "Models specialized for medicine, law, code, finance, and more.",
  createdAt: "2026-04-25T18:03:00Z",
  updatedAt: "2026-06-06T00:35:00Z",
  questions: [
    {
      q: "Which of these is an example of a domain-specific LLM?",
      choices: [
        "GPT-4 — OpenAI's general-purpose multimodal frontier model",
        "Llama 3 base — Meta's general-purpose open-weight foundation model",
        "BERT-base — Google's general-purpose bidirectional encoder",
        "Med-PaLM and BloombergGPT — tuned for medicine and finance respectively"
      ],
      answer: 3,
      explanation: "Med-PaLM (Google) is tuned for medical question answering; BloombergGPT was pretrained on a finance-heavy corpus for financial NLP. The other options are general-purpose models. Other domain examples include Codex (code), SciBERT (science), and Legal-BERT (law)."
    },
    {
      q: "What are the two most common ways to build a domain-specific LLM?",
      choices: [
        "Continued pretraining or fine-tuning on domain text, or retrieval-augmented generation",
        "Aggressively quantizing the weights to int4 to specialize on smaller hardware",
        "Increasing sampling temperature and top-p so outputs sound more domain-like",
        "Replacing the tokenizer with simple whitespace splitting tuned to domain syntax"
      ],
      answer: 0,
      explanation: "You either bake domain knowledge into the weights — by continued pretraining or fine-tuning on domain corpora — or you keep a generic model and supply domain knowledge at inference time via retrieval (RAG). In practice, hybrid approaches (fine-tune + RAG) are common."
    },
    {
      q: "Which is a key advantage of a well-built domain-specific LLM over a general-purpose LLM?",
      choices: [
        "It is reliably smaller and cheaper than any general LLM, regardless of the task",
        "It eliminates hallucinations within its domain because it has been specialized",
        "It uses domain vocabulary correctly and is more reliable within its domain",
        "It removes the need to run any task-specific evaluation before deployment"
      ],
      answer: 2,
      explanation: "Domain models internalize specialist terminology, conventions, and reasoning patterns (e.g., ICD codes, legal citation styles, financial jargon). They are usually more accurate and fluent within their domain — but they can still hallucinate and they don't necessarily save compute."
    },
    {
      q: "Codex / Code Llama / StarCoder are domain-specific LLMs for which domain?",
      choices: [
        "Medicine and clinical text",
        "Legal contracts and case law",
        "Finance and trading research",
        "Source code and programming"
      ],
      answer: 3,
      explanation: "These are code-specialized LLMs, typically pretrained or continue-pretrained on large public code corpora (e.g., The Stack, GitHub). Code is one of the clearest success stories for domain specialization — code-tuned models handily beat general models at programming tasks of similar size."
    },
    {
      q: "When is Retrieval-Augmented Generation (RAG) often preferred over fine-tuning a domain-specific LLM?",
      choices: [
        "When the team wants the deployed model to be much smaller and cheaper",
        "When the domain knowledge changes frequently or answers must be cited",
        "When the team has effectively unlimited GPU capacity for retraining",
        "When correctness of answers is not actually a meaningful requirement"
      ],
      answer: 1,
      explanation: "RAG keeps knowledge in an external store you can update without retraining, and it lets you cite sources — both critical when facts change often (news, policies, product docs) or when answers must be verifiable (medicine, law). Fine-tuning bakes knowledge into weights, which is harder to update or audit."
    }
  ]
});
