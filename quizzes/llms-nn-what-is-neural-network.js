registerQuiz({
  collection: "llms",
  key: "nn-what-is-neural-network",
  title: "What is Neural Network?",
  icon: "N",
  description: "The basic ingredients: neurons, layers, weights, training, and what neural networks actually are.",
  createdAt: "2026-04-26T16:57:00Z",
  updatedAt: "2026-04-26T16:57:00Z",
  questions: [
    {
      q: "At the most basic level, what is an artificial neural network?",
      choices: [
        "A literal simulation of biological brain tissue",
        "A mathematical function — stacked layers of weighted sums and nonlinear activations, with parameters learned from data",
        "A rule-based system whose logic is written by domain experts",
        "A type of database optimized for vectors"
      ],
      answer: 1,
      explanation: "Despite the biological inspiration, an artificial neural network is a parameterized mathematical function: layers of weighted sums followed by nonlinear activations, with millions to billions of trainable parameters that are fit to data. The biological analogy is loose, not literal."
    },
    {
      q: "What is an artificial 'neuron' (or unit) in a neural network?",
      choices: [
        "A physical chip on the GPU",
        "A small unit that computes a weighted sum of its inputs plus a bias, then applies a nonlinear activation function",
        "A single bit of memory",
        "A loss function"
      ],
      answer: 1,
      explanation: "An artificial neuron computes y = activation(w·x + b), where w is a vector of learned weights, b is a learned bias, and the activation introduces nonlinearity. Composing many such neurons into layers is the basic recipe for every neural network."
    },
    {
      q: "A typical feed-forward neural network has which kinds of layers?",
      choices: [
        "Only an output layer",
        "An input layer, one or more hidden layers, and an output layer — each layer feeding the next",
        "Only convolutional layers",
        "Only attention layers"
      ],
      answer: 1,
      explanation: "A standard feed-forward network has an input layer (the data), one or more hidden layers that progressively transform the representation, and an output layer that produces the prediction. 'Deep' learning just means many hidden layers."
    },
    {
      q: "What does it mean to 'train' a neural network?",
      choices: [
        "Run it on as much data as possible at inference time",
        "Iteratively adjust the network's weights and biases to minimize a loss function on training data, typically using gradient descent",
        "Manually set every weight by hand",
        "Compress the model to fit on a smaller device"
      ],
      answer: 1,
      explanation: "Training means optimizing the parameters (weights, biases) so the model's predictions on training data come close to the targets, as measured by a loss function. The gradients used to update parameters come from backpropagation; the update rule comes from an optimizer like SGD or Adam."
    },
    {
      q: "The Universal Approximation Theorem says, roughly, that:",
      choices: [
        "Any neural network can solve any problem with no training",
        "A feed-forward network with one hidden layer of nonlinear units can approximate any continuous function on a compact domain — but it does not say how to find the weights or how big the network must be",
        "Two-layer networks are always exactly as expressive as deep networks for every task",
        "Neural networks always reach the global optimum"
      ],
      answer: 1,
      explanation: "The classical theorem (Cybenko 1989, Hornik 1991) is an existence result: a sufficiently wide one-hidden-layer network with a nonlinear activation can approximate any continuous function arbitrarily well. It says nothing about trainability, sample efficiency, or generalization — and in practice, depth often beats sheer width."
    },
    {
      q: "Why 'deep' learning, rather than just wide shallow networks?",
      choices: [
        "Because GPUs only support deep networks",
        "Empirically, depth lets networks learn hierarchical, reusable features (edges → shapes → objects, or characters → words → semantics) far more parameter-efficiently than equivalent shallow networks",
        "Because shallow networks cannot learn anything",
        "Because deep networks always have fewer parameters in total"
      ],
      answer: 1,
      explanation: "Although wide shallow networks are universal approximators in theory, deep networks tend to learn hierarchical representations far more parameter-efficiently and generalize better in practice. Innovations like residual connections, normalization, and attention made very deep networks practical to train."
    },
    {
      q: "How does a neural network differ from classical (non-neural) machine learning models like decision trees or linear regression?",
      choices: [
        "It is always faster to train",
        "It learns its own feature representations end-to-end from raw data, rather than relying on hand-engineered features and a fixed model structure",
        "It does not need any training data",
        "It cannot be used for classification"
      ],
      answer: 1,
      explanation: "A defining strength of neural networks is end-to-end representation learning: rather than feeding hand-crafted features into a fixed model, a deep network learns useful features at every layer, jointly with the prediction. Classical models often rely on careful feature engineering by humans."
    }
  ]
});
