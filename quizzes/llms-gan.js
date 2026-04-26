registerQuiz({
  collection: "llms",
  key: "gan",
  title: "Generative Adversarial Networks",
  icon: "G",
  description: "A generator vs. a discriminator — adversarial training for synthesis.",
  createdAt: "2026-04-26T17:21:00Z",
  updatedAt: "2026-04-26T17:50:00Z",
  questions: [
    {
      q: "Who introduced Generative Adversarial Networks, and when?",
      choices: [
        "Yann LeCun and colleagues, 1998",
        "Geoffrey Hinton and colleagues, 2006",
        "Ian Goodfellow and colleagues, 2014",
        "Andrew Ng and colleagues, 2010"
      ],
      answer: 2,
      explanation: "GANs were introduced by Ian Goodfellow and colleagues in the 2014 paper 'Generative Adversarial Nets.' The framing of generative modeling as a two-player game between a generator and a discriminator was a major conceptual shift."
    },
    {
      q: "Which two networks make up a GAN?",
      choices: [
        "An encoder that compresses data and a decoder that reconstructs it",
        "A generator that maps noise to samples and a discriminator that judges them",
        "A teacher network producing soft targets and a student network mimicking them",
        "A policy network selecting actions and a value network estimating returns"
      ],
      answer: 1,
      explanation: "A GAN pairs a generator (maps a random noise vector z to a sample, e.g., an image) with a discriminator (binary classifier: real vs. generated). They train against each other: the generator tries to fool the discriminator, the discriminator tries not to be fooled."
    },
    {
      q: "How is the training dynamic between generator and discriminator best described?",
      choices: [
        "Cooperative — both networks share a single loss they jointly minimize together",
        "A two-player minimax game between the generator and the discriminator",
        "Pure supervised classification on labeled real-vs-fake training pairs only",
        "A reinforcement-learning policy iteration with a fixed environment dynamics"
      ],
      answer: 1,
      explanation: "The original GAN formulation defines a minimax game with a value function V(G, D): the discriminator maximizes its ability to distinguish real from fake, while the generator minimizes the discriminator's success. At the global equilibrium, the generator's distribution matches the data distribution."
    },
    {
      q: "What is 'mode collapse' in GAN training?",
      choices: [
        "When the GPU runs out of memory partway through a training run",
        "When the discriminator becomes perfect and the loss surface stops moving",
        "When the generator produces only a few outputs and ignores the rest of the data",
        "When the training images get corrupted on disk and the loader silently drops them"
      ],
      answer: 2,
      explanation: "Mode collapse is a common GAN failure where the generator finds a few outputs that consistently fool the discriminator and stops exploring the rest of the data distribution. Many GAN variants (Wasserstein GAN, mini-batch discrimination, unrolled GANs) were proposed largely to mitigate it and stabilize training."
    },
    {
      q: "Which of these is a well-known family of GAN variants?",
      choices: [
        "DCGAN, StyleGAN, CycleGAN — convolutional, style-based, and cycle-consistent",
        "BERT, GPT, T5 — large pretrained Transformer language models",
        "ResNet, VGG, AlexNet — classic image-classification convolutional networks",
        "LSTM, GRU, RNN — recurrent architectures for sequential data modeling"
      ],
      answer: 0,
      explanation: "DCGAN brought convolutional architectures to GANs; StyleGAN (NVIDIA) became famous for photorealistic face generation; CycleGAN enabled unpaired image-to-image translation. The other lists are language models, image classifiers, and recurrent nets respectively."
    },
    {
      q: "What is one common application of GANs?",
      choices: [
        "Compiling source code into optimized machine instructions for target CPUs",
        "Generating realistic images, image-to-image translation, and super-resolution",
        "Routing network packets across the internet to minimize end-to-end latency",
        "Solving partial differential equations symbolically and producing closed forms"
      ],
      answer: 1,
      explanation: "GANs were the dominant approach for high-quality image synthesis throughout much of the 2010s — face generation (StyleGAN), super-resolution (SRGAN), style transfer (CycleGAN), and synthetic training data. They remain useful but have largely been overtaken for state-of-the-art image generation by diffusion models."
    },
    {
      q: "How do GANs compare to diffusion models, which now dominate state-of-the-art image generation?",
      choices: [
        "Diffusion models are a special case of GANs with extra adversarial losses added",
        "Diffusion is more stable and diverse but slower at inference than a single GAN pass",
        "GANs are strictly better than diffusion models on every quality and speed metric",
        "Diffusion models require no training data, only random noise samples and priors"
      ],
      answer: 1,
      explanation: "Diffusion models (DDPM, Stable Diffusion, Imagen, DALL·E 2/3) learn to reverse a noise process step by step. They tend to be more stable to train and cover the data distribution better than GANs (less mode collapse), at the cost of multi-step iterative inference. State-of-the-art image generation has largely shifted from GANs to diffusion since ~2020–2022."
    }
  ]
});
