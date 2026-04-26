registerQuiz({
  collection: "llms",
  key: "nn-what-is-neural-network",
  title: "What is Neural Network?",
  icon: "N",
  description: "The basic ingredients: neurons, layers, weights, training, and what neural networks actually are.",
  createdAt: "2026-04-26T16:57:00Z",
  updatedAt: "2026-04-26T17:50:00Z",
  questions: [
    {
      q: "At the most basic level, what is an artificial neural network?",
      choices: [
        "A literal computational simulation of biological brain tissue and synapses",
        "A parameterized math function: layers of weighted sums and nonlinearities",
        "A hand-written rule-based system whose logic is encoded by domain experts",
        "A specialized database engine optimized for storing high-dimensional vectors"
      ],
      answer: 1,
      explanation: "Despite the biological inspiration, an artificial neural network is a parameterized mathematical function: layers of weighted sums followed by nonlinear activations, with millions to billions of trainable parameters that are fit to data. The biological analogy is loose, not literal."
    },
    {
      q: "What is an artificial 'neuron' (or unit) in a neural network?",
      choices: [
        "A physical processing element on the GPU's silicon die",
        "A single bit of memory used to store one activation value",
        "A unit computing y = activation(w·x + b) over its weighted inputs",
        "A loss function applied to the network's final scalar output"
      ],
      answer: 2,
      explanation: "An artificial neuron computes y = activation(w·x + b), where w is a vector of learned weights, b is a learned bias, and the activation introduces nonlinearity. Composing many such neurons into layers is the basic recipe for every neural network."
    },
    {
      q: "A typical feed-forward neural network has which kinds of layers?",
      choices: [
        "Only an output layer that maps inputs directly to predictions",
        "Only convolutional layers, with no other layer type allowed",
        "Only self-attention layers, regardless of the input modality",
        "An input layer, one or more hidden layers, and an output layer"
      ],
      answer: 3,
      explanation: "A standard feed-forward network has an input layer (the data), one or more hidden layers that progressively transform the representation, and an output layer that produces the prediction. 'Deep' learning just means many hidden layers."
    },
    {
      q: "What does it mean to 'train' a neural network?",
      choices: [
        "Run inference on as much production data as possible after deployment",
        "Iteratively adjust weights and biases to minimize a loss via gradient descent",
        "Hand-set every weight and bias to values chosen by a domain expert",
        "Compress the trained model so that it fits on a smaller embedded device"
      ],
      answer: 1,
      explanation: "Training means optimizing the parameters (weights, biases) so the model's predictions on training data come close to the targets, as measured by a loss function. The gradients used to update parameters come from backpropagation; the update rule comes from an optimizer like SGD or Adam."
    },
    {
      q: "The Universal Approximation Theorem says, roughly, that:",
      choices: [
        "Any neural network can solve any problem out of the box, without any training",
        "Neural networks always reach the global optimum of their training objective",
        "Two-layer networks are exactly as expressive as deep ones on every task",
        "A wide one-hidden-layer net can approximate any continuous function on a compact"
      ],
      answer: 3,
      explanation: "The classical theorem (Cybenko 1989, Hornik 1991) is an existence result: a sufficiently wide one-hidden-layer network with a nonlinear activation can approximate any continuous function arbitrarily well. It says nothing about trainability, sample efficiency, or generalization — and in practice, depth often beats sheer width."
    },
    {
      q: "Why 'deep' learning, rather than just wide shallow networks?",
      choices: [
        "Because GPU vendors only build hardware support for deep architectures",
        "Because shallow networks have been mathematically proven to learn nothing useful",
        "Because deep networks always have strictly fewer parameters than shallow ones",
        "Because depth lets nets learn hierarchical features more parameter-efficiently"
      ],
      answer: 3,
      explanation: "Although wide shallow networks are universal approximators in theory, deep networks tend to learn hierarchical representations far more parameter-efficiently and generalize better in practice. Innovations like residual connections, normalization, and attention made very deep networks practical to train."
    },
    {
      q: "How does a neural network differ from classical ML models like decision trees or linear regression?",
      choices: [
        "It is always strictly faster to train than any classical machine-learning model",
        "It does not require any training data, learning purely from architectural priors",
        "It learns its own feature representations end-to-end from raw input data",
        "It cannot be used for classification, only for regression-style continuous output"
      ],
      answer: 2,
      explanation: "A defining strength of neural networks is end-to-end representation learning: rather than feeding hand-crafted features into a fixed model, a deep network learns useful features at every layer, jointly with the prediction. Classical models often rely on careful feature engineering by humans."
    }
  ]
});
