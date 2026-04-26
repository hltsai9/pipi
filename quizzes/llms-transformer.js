registerQuiz({
  collection: "llms",
  key: "transformer",
  title: "Transformer",
  icon: "T",
  description: "Self-attention, positional encodings, and the architecture behind modern LLMs.",
  createdAt: "2026-04-26T17:20:00Z",
  updatedAt: "2026-04-26T17:20:00Z",
  questions: [
    {
      q: "Which 2017 paper introduced the Transformer architecture?",
      choices: [
        "'Generative Adversarial Networks' (Goodfellow et al., 2014)",
        "'Attention Is All You Need' (Vaswani et al., 2017)",
        "'Deep Residual Learning for Image Recognition' (He et al., 2015)",
        "'BERT: Pre-training of Deep Bidirectional Transformers' (Devlin et al., 2018)"
      ],
      answer: 1,
      explanation: "'Attention Is All You Need' by Vaswani et al. (Google, 2017) introduced the Transformer. It replaced recurrence with self-attention and quickly became the dominant architecture for NLP — and later for vision, speech, and other modalities."
    },
    {
      q: "What is the key mechanism that gives the Transformer its name and power?",
      choices: [
        "Convolutional layers",
        "Recurrent connections",
        "Self-attention — each token attends to all other tokens in the sequence in parallel",
        "Pooling layers"
      ],
      answer: 2,
      explanation: "Self-attention computes attention weights between every pair of positions in a sequence, so each token's representation is updated by a weighted combination of all other tokens. Crucially, this happens in parallel across the whole sequence — unlike RNNs, which process tokens one at a time."
    },
    {
      q: "What did the Transformer eliminate that RNNs and LSTMs depended on?",
      choices: [
        "Loss functions",
        "Sequential recurrence — the need to process tokens one after another, which prevented parallelism on the sequence dimension",
        "Backpropagation",
        "Word embeddings"
      ],
      answer: 1,
      explanation: "RNNs/LSTMs unfold sequentially, making the sequence dimension hard to parallelize. The Transformer's all-pairs attention is fully parallelizable across the sequence, enabling far better GPU utilization and the scaling behavior that produced modern LLMs."
    },
    {
      q: "Why does the Transformer need positional encodings (or positional embeddings)?",
      choices: [
        "To shrink the model",
        "Because self-attention is permutation-invariant on its own — without positional information, the model would treat the input as a bag of tokens",
        "To compute the loss",
        "To replace the embedding layer"
      ],
      answer: 1,
      explanation: "Self-attention treats inputs as a set; if you shuffle the tokens, attention output (modulo position) is the same. Positional encodings (sinusoidal in the original paper, then learned, RoPE, ALiBi, etc.) inject order information so the model knows which token is where."
    },
    {
      q: "What is multi-head attention?",
      choices: [
        "Running attention several times sequentially",
        "Splitting Q/K/V into multiple parallel attention 'heads,' each learning to attend to different relationships, then concatenating their outputs",
        "A separate model that wraps the attention output",
        "A type of activation function"
      ],
      answer: 1,
      explanation: "Instead of one big attention computation, the Transformer projects Q, K, V into h smaller heads, runs scaled dot-product attention independently in each head, and concatenates the results. Different heads tend to learn different patterns (syntax, coreference, distant context, etc.)."
    },
    {
      q: "How do encoder-only, decoder-only, and encoder-decoder Transformers differ?",
      choices: [
        "They are different programming languages",
        "Encoder-only (e.g., BERT) processes input bidirectionally for understanding tasks; decoder-only (e.g., GPT) generates left-to-right with causal masking; encoder-decoder (e.g., T5, the original Transformer) maps an input sequence to an output sequence",
        "They differ only in tokenizer",
        "Decoder-only models do not use attention"
      ],
      answer: 1,
      explanation: "The original Transformer was encoder-decoder for translation. BERT-style encoder-only models use bidirectional self-attention for understanding/classification. GPT-style decoder-only models use causal (masked) self-attention for autoregressive generation — and are now the dominant LLM design."
    },
    {
      q: "Why has the Transformer become the dominant architecture for large language models?",
      choices: [
        "It is the only architecture mathematically capable of handling text",
        "Parallelism along the sequence, strong empirical scaling behavior, and a uniform structure that benefits from massive compute and data",
        "It uses no parameters",
        "Because it cannot be trained on GPUs"
      ],
      answer: 1,
      explanation: "Transformers parallelize beautifully on modern accelerators, their loss scales smoothly with model and data size (scaling laws), and the architecture is uniform — depth, width, and context length can all be increased almost mechanically. That combination of properties is what made modern LLMs possible."
    }
  ]
});
