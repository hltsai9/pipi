registerQuiz({
  collection: "llms",
  key: "nn-backpropagation",
  title: "Neural Network: Backpropagation",
  icon: "∂",
  description: "How gradients flow backwards through a network — the engine behind training.",
  createdAt: "2026-04-25T19:01:00Z",
  updatedAt: "2026-04-25T19:01:00Z",
  questions: [
    {
      q: "What does the backpropagation algorithm actually compute?",
      choices: [
        "The output of a neural network for a given input",
        "The gradient of the loss with respect to every learnable parameter, by applying the chain rule layer-by-layer from output back to input",
        "The optimal value of each parameter",
        "Just a forward pass through the network"
      ],
      answer: 1,
      explanation: "Backprop is an efficient algorithm for computing gradients of the scalar loss with respect to all parameters. It is not the optimizer (that's SGD/Adam/etc.) — it's the gradient-computation step. The chain rule is applied once per layer in reverse order."
    },
    {
      q: "Which calculus rule is the mathematical foundation of backpropagation?",
      choices: [
        "Integration by parts",
        "The chain rule",
        "L'Hôpital's rule",
        "Taylor's theorem"
      ],
      answer: 1,
      explanation: "Backprop is a systematic application of the chain rule: ∂loss/∂param = ∂loss/∂output · ∂output/∂(intermediate) · … · ∂(intermediate)/∂param. Each layer's local Jacobian gets multiplied with the gradient flowing back from the output."
    },
    {
      q: "In a typical training step, what is the order of operations?",
      choices: [
        "Backward pass → forward pass → update weights",
        "Update weights → forward pass → backward pass",
        "Forward pass to compute loss → backward pass to compute gradients → optimizer step to update weights",
        "Forward pass → update weights → backward pass"
      ],
      answer: 2,
      explanation: "A standard training step: (1) forward pass produces predictions and a loss, (2) backward pass computes gradients via backprop, (3) the optimizer (SGD, Adam, etc.) updates parameters using those gradients. Then repeat for the next batch."
    },
    {
      q: "Why are activations from the forward pass typically stored in memory during training?",
      choices: [
        "For visualization purposes",
        "Because the local Jacobians used in the backward pass depend on each layer's input/output values, so the framework saves them during the forward pass and consumes them in reverse",
        "To avoid recomputing them on inference",
        "They aren't stored — backprop only needs the loss"
      ],
      answer: 1,
      explanation: "Computing a layer's parameter gradient (and the gradient passed to the previous layer) requires that layer's stored values. Frameworks save activations during the forward pass and reuse them in reverse during backprop. This is the main reason training memory footprint dwarfs inference, and why techniques like activation checkpointing exist."
    },
    {
      q: "What is 'automatic differentiation' as implemented in PyTorch / JAX / TensorFlow?",
      choices: [
        "A symbolic math system that derives derivatives like a textbook",
        "A general technique that computes exact gradients of arbitrary differentiable programs by tracking operations and applying the chain rule — backprop is the reverse-mode case",
        "A heuristic that estimates gradients with finite differences",
        "A way to skip computing gradients"
      ],
      answer: 1,
      explanation: "Autodiff records the operations performed in a forward pass (a 'computation graph') and walks them in reverse, applying known local derivatives. It's exact (up to floating-point), generic, and underpins every modern DL framework. Backprop on a neural network is the canonical example of reverse-mode autodiff."
    },
    {
      q: "Which problem can occur during backpropagation in very deep networks, and how is it commonly addressed?",
      choices: [
        "Vanishing or exploding gradients — addressed with residual/skip connections, normalization (LayerNorm/BatchNorm), better initialization, and gradient clipping",
        "The chain rule no longer applies past 100 layers",
        "Backprop runs faster but loses accuracy",
        "Backprop cannot be used with GPUs"
      ],
      answer: 0,
      explanation: "When chain-rule products span many layers, gradients can shrink to ~0 or grow unboundedly. Residual connections (ResNets, transformers) provide a direct gradient path; LayerNorm/BatchNorm stabilize activations; careful initialization (He/Xavier) keeps variances under control; gradient clipping caps explosions. Together these made very deep networks trainable."
    }
  ]
});
