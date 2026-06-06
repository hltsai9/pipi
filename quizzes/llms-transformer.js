registerQuiz({
  collection: "llms",
  key: "transformer",
  title: "Transformer",
  icon: "T",
  description: "Self-attention, positional encodings, and the architecture behind modern LLMs.",
  createdAt: "2026-04-26T17:20:00Z",
  updatedAt: "2026-06-06T00:35:00Z",
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
        "Stacks of 2D and 3D convolutional layers applied across the sequence",
        "Recurrent connections passing a hidden state from one position to the next",
        "Self-attention, where every token attends to every other token in parallel",
        "Pooling layers that aggregate features over sliding windows of tokens"
      ],
      answer: 2,
      explanation: "Self-attention computes attention weights between every pair of positions in a sequence, so each token's representation is updated by a weighted combination of all other tokens. Crucially, this happens in parallel across the whole sequence — unlike RNNs, which process tokens one at a time."
    },
    {
      q: "What did the Transformer eliminate that RNNs and LSTMs depended on?",
      choices: [
        "The loss function used to score predictions during supervised training",
        "Backpropagation through the model graph to compute parameter gradients",
        "Word embeddings as a learned mapping from discrete tokens to dense vectors",
        "Sequential recurrence — the need to process tokens one after another"
      ],
      answer: 3,
      explanation: "RNNs/LSTMs unfold sequentially, making the sequence dimension hard to parallelize. The Transformer's all-pairs attention is fully parallelizable across the sequence, enabling far better GPU utilization and the scaling behavior that produced modern LLMs."
    },
    {
      q: "Why does the Transformer need positional encodings (or positional embeddings)?",
      choices: [
        "Without them, self-attention is permutation-invariant — order is lost",
        "They shrink the model by replacing some of the learned weight matrices",
        "They are required to compute the cross-entropy loss correctly during training",
        "They replace the token embedding layer when working with large vocabularies"
      ],
      answer: 0,
      explanation: "Self-attention treats inputs as a set; if you shuffle the tokens, attention output (modulo position) is the same. Positional encodings (sinusoidal in the original paper, then learned, RoPE, ALiBi, etc.) inject order information so the model knows which token is where."
    },
    {
      q: "What is multi-head attention?",
      choices: [
        "Running self-attention several times sequentially with the same projections",
        "Splitting Q/K/V into parallel heads that each attend differently, then concatenating",
        "A separate small model that post-processes the output of a single attention layer",
        "A specialized activation function applied after the attention block to nonlinearize"
      ],
      answer: 1,
      explanation: "Instead of one big attention computation, the Transformer projects Q, K, V into h smaller heads, runs scaled dot-product attention independently in each head, and concatenates the results. Different heads tend to learn different patterns (syntax, coreference, distant context, etc.)."
    },
    {
      q: "How do encoder-only, decoder-only, and encoder-decoder Transformers differ?",
      choices: [
        "They are implemented in different programming languages — Python vs. C++ vs. Rust",
        "Decoder-only Transformers do not use attention at all, relying purely on FFN blocks",
        "They differ only in the tokenizer used to map text into integer IDs at the input",
        "Encoder-only is bidirectional (BERT); decoder-only is causal (GPT); ED is seq-to-seq"
      ],
      answer: 3,
      explanation: "The original Transformer was encoder-decoder for translation. BERT-style encoder-only models use bidirectional self-attention for understanding/classification. GPT-style decoder-only models use causal (masked) self-attention for autoregressive generation — and are now the dominant LLM design."
    },
    {
      q: "Why has the Transformer become the dominant architecture for large language models?",
      choices: [
        "It is the only architecture mathematically capable of representing language",
        "It uses essentially no learnable parameters and is therefore extremely cheap",
        "Sequence-level parallelism, strong scaling behavior, and a uniform structure",
        "It cannot be trained on GPUs, forcing efficient algorithmic implementations"
      ],
      answer: 2,
      explanation: "Transformers parallelize beautifully on modern accelerators, their loss scales smoothly with model and data size (scaling laws), and the architecture is uniform — depth, width, and context length can all be increased almost mechanically. That combination of properties is what made modern LLMs possible."
    }
  ]
});
