registerStructuredQuiz({
  collection: "deep-dive",
  key: "self-attention",
  title: "Self-Attention",
  icon: "α",
  description: "A structured study set on self-attention: priming, comprehension, application, synthesis.",
  createdAt: "2026-04-26T20:30:00Z",
  updatedAt: "2026-04-26T20:30:00Z",
  sections: [
    {
      category: "priming",
      questions: [
        {
          type: "open_ended",
          question: "Before reading anything formal, write down what you think 'attention' means in a neural network. What is the model paying attention to, and why might that matter?",
          difficulty: "easy"
        },
        {
          type: "open_ended",
          question: "Predict: if every word in a sentence could 'look at' every other word when computing its representation, how would compute and memory scale as the sentence gets longer?",
          difficulty: "medium"
        },
        {
          type: "open_ended",
          question: "RNNs process tokens one at a time. List two consequences you'd expect from removing that sequential constraint and replacing it with all-pairs attention.",
          difficulty: "medium"
        }
      ]
    },
    {
      category: "comprehension",
      questions: [
        {
          type: "flashcard",
          question: "What do Q, K, and V stand for in self-attention, and where do they come from?",
          answer: "Query, Key, and Value. Each is a learned linear projection of the same input embeddings — three different W matrices applied to one sequence.",
          difficulty: "easy"
        },
        {
          type: "flashcard",
          question: "Write the scaled dot-product attention formula.",
          answer: "Attention(Q, K, V) = softmax(QKᵀ / √dₖ) · V",
          difficulty: "easy"
        },
        {
          type: "flashcard",
          question: "Why divide QKᵀ by √dₖ before the softmax?",
          answer: "Dot-product variance grows with dₖ; without scaling, softmax saturates and gradients vanish. Dividing by √dₖ keeps the variance roughly unit-scale.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "What does a causal (decoder) attention mask do, and why?",
          answer: "It sets attention weights to future positions to −∞ before softmax, so each token only attends to itself and earlier tokens. This is what makes autoregressive generation valid.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "How does cross-attention differ from self-attention?",
          answer: "In cross-attention, Q comes from one sequence and K/V from another (e.g. decoder queries attending to encoder outputs). In self-attention, all three come from the same sequence.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "What is the time and memory complexity of vanilla self-attention in sequence length n?",
          answer: "O(n²) in both. The n × n attention matrix is the bottleneck — every query-key pair is computed and stored.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "Why use multi-head attention rather than one large attention head?",
          answer: "Splitting Q/K/V into h smaller heads lets each one specialize on a different relation (syntax, coreference, distance, etc.). Concatenating them gives the model multiple views of the sequence at the same compute budget.",
          difficulty: "hard"
        }
      ]
    },
    {
      category: "application",
      questions: [
        {
          type: "multiple_choice",
          question: "You profile a Transformer at sequence length 8K and find attention dominates runtime. Which intervention most directly attacks the cost?",
          options: [
            "Add more layers, since deeper models compute attention more efficiently",
            "Use FlashAttention or a sparse/linear-attention variant to reduce attention cost",
            "Remove the residual connections so gradients flow through fewer paths",
            "Increase the number of attention heads h to spread the work over more units"
          ],
          correct_option: "B",
          explanation: "FlashAttention restructures the attention computation to reduce memory traffic; sparse/linear variants cut the asymptotic cost below O(n²). More layers or heads do the opposite — they increase total work — and removing residuals just hurts trainability.",
          difficulty: "medium"
        },
        {
          type: "multiple_choice",
          question: "If you accidentally remove the softmax in scaled dot-product attention but keep √dₖ scaling, what is the most likely consequence?",
          options: [
            "Attention weights are no longer normalized, so values stack up unboundedly across positions",
            "Training becomes faster and just as accurate, since softmax is mostly cosmetic",
            "The model becomes equivalent to a multi-layer perceptron with no positional structure",
            "The model gains the ability to attend to negative-similarity positions, improving recall"
          ],
          correct_option: "A",
          explanation: "Softmax turns scores into a convex combination of values. Without it, output is an unbounded weighted sum and the 'attention' loses its probabilistic interpretation — typically blowing up or learning very slowly. (Linear attention works only because it carefully reformulates the math, not by simply deleting softmax.)",
          difficulty: "hard"
        },
        {
          type: "multiple_choice",
          question: "A batch contains sequences of length 12 padded to 16. What's the standard way to keep padding tokens from polluting attention?",
          options: [
            "Truncate the batch to length 12 so padding never appears in the input at all",
            "Add a small bias to the value vectors at padded positions so their effect averages out",
            "Apply an attention mask that sets scores at padded positions to −∞ before softmax",
            "Replace softmax with a sigmoid so padded positions can be learned to attend to nothing"
          ],
          correct_option: "C",
          explanation: "Attention masking with −∞ before softmax forces those positions to receive zero weight. Truncating the batch defeats the purpose of padding (uniform shape), and biasing values still leaks signal through the matmul.",
          difficulty: "medium"
        },
        {
          type: "multiple_choice",
          question: "You set a self-attention layer's causal mask to the identity matrix (each token only attends to itself). What does the layer effectively become?",
          options: [
            "A pure positional encoding layer that adds position vectors to each token",
            "A bidirectional self-attention layer with no masking applied",
            "A position-wise linear projection of each token by V (with the value matrix)",
            "A convolutional layer with kernel size equal to the sequence length"
          ],
          correct_option: "C",
          explanation: "If each token only attends to itself, softmax(QKᵀ) becomes the identity, so the output is just V — i.e., a per-token linear transform W_v · x. No mixing across positions occurs, which is the opposite of what attention is for.",
          difficulty: "hard"
        }
      ]
    },
    {
      category: "transfer_synthesis",
      questions: [
        {
          type: "flashcard",
          question: "How is self-attention conceptually similar to message passing in a graph neural network?",
          answer: "Both update each node/token's representation as a weighted aggregation of its neighbors. In self-attention every token is connected to every other (a complete graph) and the edge weights are content-based via QKᵀ.",
          difficulty: "hard"
        },
        {
          type: "multiple_choice",
          question: "Suppose you swap the standard sinusoidal positional encodings for *no* positional information at all. Which property of self-attention now becomes a problem?",
          options: [
            "Attention scores can grow unboundedly because there's no length-dependent damping",
            "Self-attention is permutation-invariant, so the model can't distinguish word order",
            "The √dₖ scaling no longer applies, since dₖ depends on positional dimensions",
            "Multi-head attention collapses because heads need positions to specialize"
          ],
          correct_option: "B",
          explanation: "Without positional information, shuffling the input tokens would produce the same set of attention outputs (just shuffled). That's permutation invariance — fine for sets, fatal for language. Positional encodings (sinusoidal, RoPE, ALiBi…) are what break this symmetry.",
          difficulty: "hard"
        }
      ]
    }
  ]
});
