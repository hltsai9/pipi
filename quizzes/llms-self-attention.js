registerQuiz({
  collection: "llms",
  key: "self-attention",
  title: "Self-Attention",
  icon: "α",
  description: "Q, K, V projections, scaled dot-product, masking, and the n² complexity at the heart of every Transformer.",
  createdAt: "2026-04-26T20:20:00Z",
  updatedAt: "2026-04-26T20:20:00Z",
  questions: [
    {
      q: "In 'self-attention', what does the 'self' actually refer to?",
      choices: [
        "Q, K, V all come from the same input sequence in this layer",
        "Each layer's parameters attend only to themselves, not to other layers",
        "The model attends only to its own previous output tokens, not the input",
        "Attention is computed without any learned weight matrices (purely fixed)"
      ],
      answer: 0,
      explanation: "In self-attention, the queries, keys, and values are all linear projections of the same input. In cross-attention (e.g. encoder-decoder), Q comes from one sequence and K/V come from another — that's the contrast."
    },
    {
      q: "In scaled dot-product attention, why is QKᵀ divided by √dₖ before the softmax?",
      choices: [
        "It compresses attention scores into the unit interval prior to softmax",
        "It makes the matmul operation differentiable when dₖ is very small",
        "It compensates for an additive bias term applied to each query vector",
        "Without it, dot products grow with dₖ and push softmax into saturation"
      ],
      answer: 3,
      explanation: "Dot products of independent dₖ-dimensional vectors have variance proportional to dₖ. Without √dₖ scaling, softmax saturates and gradients vanish. There's no bias term involved — that's a distractor."
    },
    {
      q: "In standard self-attention, where do the Q, K, and V vectors come from?",
      choices: [
        "They are fixed sinusoidal positional encodings added to the input",
        "Each is a learned linear projection of the same input embeddings",
        "Q comes from the input, while K and V are learned per-layer constants",
        "Q and K share weights, while V is computed by a separate sibling model"
      ],
      answer: 1,
      explanation: "Each of Q, K, V is produced by its own learned weight matrix applied to the input — three different projections of the same sequence. Positional encodings are added to the embeddings before this step; they aren't Q/K/V themselves."
    },
    {
      q: "What does a causal (or 'decoder') attention mask do?",
      choices: [
        "It prevents each query position from attending to itself in any way",
        "It restricts attention to a fixed-width window around each position",
        "It zeros out attention to future positions (those to the right)",
        "It removes the softmax in decoder layers to make outputs deterministic"
      ],
      answer: 2,
      explanation: "A causal mask sets attention weights to future positions to −∞ before softmax, so each token only sees previous tokens. That's what makes decoder-only LLMs autoregressive. A windowed mask is a different (sparse) variant; the softmax stays in place."
    },
    {
      q: "What is the time and memory complexity of standard self-attention in sequence length n?",
      choices: [
        "O(n²) in both time and memory, due to the n × n attention matrix",
        "O(n) in time and O(n) in memory, since attention is purely local",
        "O(n log n) in both, similar to fast Fourier-based mixing layers",
        "O(n²) in time but O(n) in memory, since attention is computed lazily"
      ],
      answer: 0,
      explanation: "Computing every query-key pair gives an n × n score matrix — both compute and memory scale quadratically. This is exactly why long-context tricks (FlashAttention's tiling, sparse/linear attention, etc.) exist. FlashAttention does reduce *peak* memory but the underlying compute is still O(n²)."
    },
    {
      q: "How does cross-attention differ from self-attention?",
      choices: [
        "Cross-attention does not apply softmax to its attention scores",
        "Cross-attention requires positional encodings while self-attention doesn't",
        "Cross-attention is deterministic while self-attention is stochastic",
        "In cross-attention, Q comes from one sequence and K, V from another"
      ],
      answer: 3,
      explanation: "Cross-attention is the same scaled dot-product mechanism, but Q and K/V are projections of different sequences (e.g. decoder queries attending to encoder outputs). Both variants need positional information and both apply softmax."
    },
    {
      q: "Why use multi-head attention rather than one bigger attention head?",
      choices: [
        "It strictly reduces the total parameter count of the attention block",
        "Different heads can specialize on different relations (syntax, coref, etc.)",
        "It eliminates the need for residual skip connections in the block",
        "It makes the final output independent of the order of input tokens"
      ],
      answer: 1,
      explanation: "Splitting Q/K/V across h smaller heads lets each one learn a different attention pattern; the concatenation gives the model multiple 'views' of the sequence at the same compute budget. Parameter count is roughly the same as one big head; residuals and positional information are unaffected."
    }
  ]
});
