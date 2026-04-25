registerQuiz({
  collection: "llms",
  key: "evolution",
  title: "Evolution of LLMs",
  icon: "E",
  description: "From n-grams and word embeddings to transformers and modern frontier models.",
  questions: [
    {
      q: "Which 2017 paper introduced the architecture that underpins essentially all modern large language models?",
      choices: [
        "'Sequence to Sequence Learning with Neural Networks' (Sutskever et al., 2014)",
        "'Attention Is All You Need' (Vaswani et al., 2017)",
        "'Deep Residual Learning for Image Recognition' (He et al., 2015)",
        "'Generative Adversarial Networks' (Goodfellow et al., 2014)"
      ],
      answer: 1,
      explanation: "'Attention Is All You Need' introduced the Transformer architecture, replacing recurrence with self-attention. It enabled massive parallel training and became the substrate for BERT, GPT, T5, and every major LLM since."
    },
    {
      q: "Roughly chronologically, which ordering reflects the evolution of language modeling?",
      choices: [
        "Transformers → n-gram models → RNN/LSTM → word2vec",
        "n-gram models → word2vec/GloVe → RNN/LSTM → Transformers (BERT/GPT) → modern LLMs",
        "BERT → n-gram → GPT-4 → word2vec",
        "GPT-4 → LSTM → n-gram → BERT"
      ],
      answer: 1,
      explanation: "The rough trajectory: statistical n-gram models (pre-2010s) → distributed word embeddings like word2vec/GloVe (2013–14) → recurrent encoder-decoders with attention (LSTMs, ~2014–17) → Transformers and pretrained models like BERT/GPT (2018+) → today's frontier LLMs."
    },
    {
      q: "What was the key insight of BERT (2018) versus prior approaches?",
      choices: [
        "Replacing transformers with LSTMs",
        "Using a left-to-right autoregressive objective",
        "Bidirectional masked-language-model pretraining followed by fine-tuning on downstream tasks",
        "Training only on labeled data"
      ],
      answer: 2,
      explanation: "BERT pretrained a Transformer encoder with masked language modeling (predict missing tokens using both left and right context) plus next-sentence prediction, then fine-tuned a small head per task. It set new SOTA across NLP and popularized the 'pretrain + fine-tune' paradigm."
    },
    {
      q: "Which capability was popularized by GPT-3 (2020) and is largely a consequence of scale?",
      choices: [
        "Image generation",
        "In-context (few-shot) learning — solving new tasks from a few examples in the prompt, with no weight updates",
        "Reinforcement learning",
        "Speech synthesis"
      ],
      answer: 1,
      explanation: "GPT-3 showed that at sufficient scale, a single autoregressive model could perform new tasks from a handful of examples in the prompt (in-context / few-shot learning). This capability emerged with scale and reframed how people use LLMs — via prompting rather than fine-tuning."
    },
    {
      q: "Scaling laws (Kaplan et al., 2020; Hoffmann et al., 2022 'Chinchilla') describe how loss scales with which factors?",
      choices: [
        "Only the number of parameters",
        "Model size, dataset size, and compute — and how to balance them",
        "GPU brand and operating system",
        "Number of attention heads only"
      ],
      answer: 1,
      explanation: "Kaplan et al. found smooth power-law relationships between loss and parameters/data/compute. Chinchilla (DeepMind, 2022) corrected the recipe: for a fixed compute budget you should train smaller models on much more data than was previously typical — model and data should scale together."
    },
    {
      q: "Which milestone marked LLMs becoming a mainstream consumer product?",
      choices: [
        "The release of word2vec (2013)",
        "The release of BERT (2018)",
        "The launch of ChatGPT (November 2022)",
        "The publication of the Transformer paper (2017)"
      ],
      answer: 2,
      explanation: "ChatGPT's launch in late 2022 took LLMs from a research/developer tool to a household product, reaching 100M users within ~2 months. It also accelerated investment, multimodal extensions, agentic use cases, and the broader 'LLM era' of AI."
    },
    {
      q: "Which trend characterizes frontier LLMs from ~2023 onward?",
      choices: [
        "A return to recurrent neural networks",
        "Multimodality (text + images + audio), longer context windows, tool use, and explicit reasoning models",
        "Abandoning transformers entirely for symbolic AI",
        "Pure unsupervised training with no post-training"
      ],
      answer: 1,
      explanation: "Recent frontier LLMs (GPT-4o, Claude 3/4, Gemini, Llama 3+) extend the transformer recipe with multimodal inputs/outputs, much longer context (100K–1M+ tokens), native tool/function calling, and explicit 'thinking' / reasoning modes. The transformer backbone has stayed; the surrounding capabilities have exploded."
    }
  ]
});
