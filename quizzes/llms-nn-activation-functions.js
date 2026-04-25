registerQuiz({
  collection: "llms",
  key: "nn-activation-functions",
  title: "Neural Network: Activation Functions",
  icon: "σ",
  description: "Nonlinearities — ReLU, sigmoid, tanh, GELU, softmax — and why they matter.",
  createdAt: "2026-04-25T19:00:00Z",
  updatedAt: "2026-04-25T19:00:00Z",
  questions: [
    {
      q: "What is the primary purpose of using a nonlinear activation function in a neural network?",
      choices: [
        "To speed up matrix multiplication",
        "To enable the network to model nonlinear relationships — without it, stacked layers collapse into a single linear transformation",
        "To reduce the number of parameters",
        "To prevent the network from overfitting"
      ],
      answer: 1,
      explanation: "A composition of linear functions is itself linear, so without a nonlinear activation between layers, a deep network has no more representational power than a single linear layer. Nonlinearities (ReLU, sigmoid, GELU, etc.) are what let neural networks approximate arbitrary functions."
    },
    {
      q: "Which classic activation function is defined as f(x) = max(0, x)?",
      choices: ["sigmoid", "tanh", "ReLU", "softmax"],
      answer: 2,
      explanation: "ReLU (Rectified Linear Unit) outputs x if x > 0 and 0 otherwise. It's cheap to compute, doesn't saturate for positive values, and largely replaced sigmoid/tanh in hidden layers because it trains much faster and avoids the vanishing-gradient problem in deep networks."
    },
    {
      q: "A common problem with sigmoid and tanh in deep networks is the 'vanishing gradient' problem. Why?",
      choices: [
        "Their gradients can be extremely small in saturated regions, so chain-rule products through many layers shrink to near zero and earlier layers stop learning",
        "They always output negative numbers",
        "They require GPUs to evaluate",
        "They break the chain rule"
      ],
      answer: 0,
      explanation: "For large |x|, sigmoid/tanh derivatives approach 0. Multiplying many small derivatives together through the chain rule across deep stacks makes gradients vanish, so the early layers receive almost no learning signal. ReLU's derivative is 1 for positive inputs, which sidesteps this in many cases."
    },
    {
      q: "Which activation is most commonly used inside transformer feed-forward layers in modern LLMs?",
      choices: [
        "sigmoid",
        "tanh",
        "GELU (or its gated variants like SwiGLU)",
        "softmax"
      ],
      answer: 2,
      explanation: "GELU (Gaussian Error Linear Unit) and gated variants like SwiGLU have become the default in transformer FFN blocks (BERT, GPT, Llama, etc.). They're smooth ReLU-like nonlinearities that empirically train slightly better. softmax is used for attention weights and classification outputs, not as the FFN nonlinearity."
    },
    {
      q: "Where in a neural network is the softmax function most commonly used?",
      choices: [
        "As the activation function for hidden layers",
        "To normalize a vector of logits into a probability distribution — typically at the output of a classifier and inside attention",
        "To replace ReLU when training is unstable",
        "To reduce dimensionality"
      ],
      answer: 1,
      explanation: "softmax(x_i) = exp(x_i) / Σ exp(x_j) turns arbitrary scores into a distribution that sums to 1. It's used at the output of multi-class classifiers and inside transformer attention to normalize attention weights. It is not used as a hidden-layer nonlinearity."
    },
    {
      q: "Compared to ReLU, what problem can 'Leaky ReLU' or 'ELU' help mitigate?",
      choices: [
        "Vanishing gradients in attention layers",
        "The 'dying ReLU' problem, where neurons get stuck outputting 0 with zero gradient and stop learning",
        "The need for a softmax output layer",
        "Overfitting on small datasets"
      ],
      answer: 1,
      explanation: "When a ReLU neuron's pre-activation is consistently negative, its output and gradient are both 0 — it's effectively dead. Variants like Leaky ReLU (small slope for x<0), PReLU, and ELU keep a nonzero gradient on the negative side so the neuron can recover."
    }
  ]
});
