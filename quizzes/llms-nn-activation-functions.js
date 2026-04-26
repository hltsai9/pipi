registerQuiz({
  collection: "llms",
  key: "nn-activation-functions",
  title: "Neural Network: Activation Functions",
  icon: "σ",
  description: "Nonlinearities — ReLU, sigmoid, tanh, GELU, softmax — and why they matter.",
  createdAt: "2026-04-25T19:00:00Z",
  updatedAt: "2026-04-26T17:50:00Z",
  questions: [
    {
      q: "What is the primary purpose of using a nonlinear activation function in a neural network?",
      choices: [
        "To speed up matrix multiplication on modern GPU hardware accelerators",
        "To act as a regularizer that prevents the network from overfitting the data",
        "To allow the model to express nonlinear relationships, which stacked linear layers cannot",
        "To reduce the parameter count by sharing weights across the activation function"
      ],
      answer: 2,
      explanation: "A composition of linear functions is itself linear, so without a nonlinear activation between layers, a deep network has no more representational power than a single linear layer. Nonlinearities (ReLU, sigmoid, GELU, etc.) are what let neural networks approximate arbitrary functions."
    },
    {
      q: "Which classic activation function is defined as f(x) = max(0, x)?",
      choices: [
        "Sigmoid — squashes inputs to (0, 1)",
        "Tanh — squashes inputs to (−1, 1)",
        "ReLU — passes positives, zeros negatives",
        "Softmax — normalizes a vector to a distribution"
      ],
      answer: 2,
      explanation: "ReLU (Rectified Linear Unit) outputs x if x > 0 and 0 otherwise. It's cheap to compute, doesn't saturate for positive values, and largely replaced sigmoid/tanh in hidden layers because it trains much faster and avoids the vanishing-gradient problem in deep networks."
    },
    {
      q: "Why do sigmoid and tanh suffer from the 'vanishing gradient' problem in deep networks?",
      choices: [
        "Their derivatives saturate near zero for large |x|, so chain-rule products shrink to nothing",
        "They produce strictly negative outputs that cancel each other in the loss function",
        "They cannot be evaluated efficiently on GPUs without specialized custom kernels",
        "They violate the chain rule when stacked across more than a handful of layers"
      ],
      answer: 0,
      explanation: "For large |x|, sigmoid/tanh derivatives approach 0. Multiplying many small derivatives together through the chain rule across deep stacks makes gradients vanish, so the early layers receive almost no learning signal. ReLU's derivative is 1 for positive inputs, which sidesteps this in many cases."
    },
    {
      q: "Which activation is most commonly used inside transformer feed-forward layers in modern LLMs?",
      choices: [
        "Plain sigmoid, applied element-wise after each linear projection",
        "Tanh, since it is centered at zero and has a bounded range",
        "GELU and its gated variants such as SwiGLU and GeGLU",
        "Softmax, applied across the feature dimension of the FFN output"
      ],
      answer: 2,
      explanation: "GELU (Gaussian Error Linear Unit) and gated variants like SwiGLU have become the default in transformer FFN blocks (BERT, GPT, Llama, etc.). They're smooth ReLU-like nonlinearities that empirically train slightly better. softmax is used for attention weights and classification outputs, not as the FFN nonlinearity."
    },
    {
      q: "Where in a neural network is the softmax function most commonly used?",
      choices: [
        "As the standard nonlinear activation for every hidden layer in deep networks",
        "As a drop-in replacement for ReLU whenever training becomes unstable",
        "As a low-rank approximation that reduces the dimensionality between layers",
        "To normalize logits into a probability distribution at outputs and in attention"
      ],
      answer: 3,
      explanation: "softmax(x_i) = exp(x_i) / Σ exp(x_j) turns arbitrary scores into a distribution that sums to 1. It's used at the output of multi-class classifiers and inside transformer attention to normalize attention weights. It is not used as a hidden-layer nonlinearity."
    },
    {
      q: "Compared to ReLU, what problem can 'Leaky ReLU' or 'ELU' help mitigate?",
      choices: [
        "Vanishing gradients specifically inside the attention block of a Transformer",
        "Severe overfitting that occurs when the training dataset is small relative to the model",
        "The 'dying ReLU' problem, where units output 0 with zero gradient and stop learning",
        "The need to apply a softmax output layer for multi-class classification problems"
      ],
      answer: 2,
      explanation: "When a ReLU neuron's pre-activation is consistently negative, its output and gradient are both 0 — it's effectively dead. Variants like Leaky ReLU (small slope for x<0), PReLU, and ELU keep a nonzero gradient on the negative side so the neuron can recover."
    }
  ]
});
