registerQuiz({
  collection: "llms",
  key: "nn-backpropagation",
  title: "Neural Network: Backpropagation",
  icon: "∂",
  description: "How gradients flow backwards through a network — the engine behind training.",
  createdAt: "2026-04-25T19:01:00Z",
  updatedAt: "2026-04-26T17:50:00Z",
  questions: [
    {
      q: "What does the backpropagation algorithm actually compute?",
      choices: [
        "The neural network's output for a given input — i.e., the forward prediction",
        "The optimal value of every learnable parameter, given the training objective",
        "The gradient of the loss w.r.t. every parameter, via reverse chain rule",
        "A forward pass through the network with no extra information stored"
      ],
      answer: 2,
      explanation: "Backprop is an efficient algorithm for computing gradients of the scalar loss with respect to all parameters. It is not the optimizer (that's SGD/Adam/etc.) — it's the gradient-computation step. The chain rule is applied once per layer in reverse order."
    },
    {
      q: "Which calculus rule is the mathematical foundation of backpropagation?",
      choices: [
        "Integration by parts, applied once per layer of the network",
        "The chain rule, composed across the layers of the network",
        "L'Hôpital's rule, used to evaluate indeterminate gradient forms",
        "Taylor's theorem, with second-order terms providing the gradient"
      ],
      answer: 1,
      explanation: "Backprop is a systematic application of the chain rule: ∂loss/∂param = ∂loss/∂output · ∂output/∂(intermediate) · … · ∂(intermediate)/∂param. Each layer's local Jacobian gets multiplied with the gradient flowing back from the output."
    },
    {
      q: "In a typical training step, what is the order of operations?",
      choices: [
        "Backward pass to seed gradients → forward pass to compute loss → optimizer update",
        "Optimizer update on the parameters → forward pass to score → backward pass to log",
        "Forward pass to compute loss → backward pass to compute gradients → optimizer update",
        "Forward pass to log activations → optimizer update on the parameters → backward pass"
      ],
      answer: 2,
      explanation: "A standard training step: (1) forward pass produces predictions and a loss, (2) backward pass computes gradients via backprop, (3) the optimizer (SGD, Adam, etc.) updates parameters using those gradients. Then repeat for the next batch."
    },
    {
      q: "Why are activations from the forward pass typically stored in memory during training?",
      choices: [
        "Mainly for debugging and visualization in tools like TensorBoard",
        "They aren't stored — backprop only needs the scalar loss to compute gradients",
        "To avoid recomputing them later when running the same model at inference time",
        "Because the backward pass needs them as inputs to each layer's local Jacobian"
      ],
      answer: 3,
      explanation: "Computing a layer's parameter gradient (and the gradient passed to the previous layer) requires that layer's stored values. Frameworks save activations during the forward pass and reuse them in reverse during backprop. This is the main reason training memory footprint dwarfs inference, and why techniques like activation checkpointing exist."
    },
    {
      q: "What is 'automatic differentiation' as implemented in PyTorch / JAX / TensorFlow?",
      choices: [
        "A symbolic math system that derives derivatives in closed form like a textbook",
        "A heuristic that estimates gradients numerically using small finite differences",
        "An exact, generic gradient method tracking ops and applying the chain rule",
        "A trick that skips computing gradients altogether for differentiable layers"
      ],
      answer: 2,
      explanation: "Autodiff records the operations performed in a forward pass (a 'computation graph') and walks them in reverse, applying known local derivatives. It's exact (up to floating-point), generic, and underpins every modern DL framework. Backprop on a neural network is the canonical example of reverse-mode autodiff."
    },
    {
      q: "Which problem can occur during backpropagation in very deep networks, and how is it commonly addressed?",
      choices: [
        "Vanishing/exploding gradients — fixed by residuals, normalization, and clipping",
        "The chain rule stops applying past about 100 layers due to numeric instability",
        "Backprop runs faster on deep networks but trades that speed for accuracy",
        "Backprop cannot be used with GPUs once the depth exceeds a fixed bound"
      ],
      answer: 0,
      explanation: "When chain-rule products span many layers, gradients can shrink to ~0 or grow unboundedly. Residual connections (ResNets, transformers) provide a direct gradient path; LayerNorm/BatchNorm stabilize activations; careful initialization (He/Xavier) keeps variances under control; gradient clipping caps explosions. Together these made very deep networks trainable."
    }
  ]
});
