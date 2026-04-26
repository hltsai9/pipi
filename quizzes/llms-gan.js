registerQuiz({
  collection: "llms",
  key: "gan",
  title: "Generative Adversarial Networks",
  icon: "G",
  description: "A generator vs. a discriminator — adversarial training for synthesis.",
  createdAt: "2026-04-26T17:21:00Z",
  updatedAt: "2026-04-26T17:21:00Z",
  questions: [
    {
      q: "Who introduced Generative Adversarial Networks, and when?",
      choices: [
        "Yann LeCun, 1998",
        "Ian Goodfellow et al., 2014",
        "Geoffrey Hinton, 2006",
        "Andrew Ng, 2010"
      ],
      answer: 1,
      explanation: "GANs were introduced by Ian Goodfellow and colleagues in the 2014 paper 'Generative Adversarial Nets.' The framing of generative modeling as a two-player game between a generator and a discriminator was a major conceptual shift."
    },
    {
      q: "Which two networks make up a GAN?",
      choices: [
        "An encoder and a decoder",
        "A generator that maps noise to samples, and a discriminator that tries to tell real samples from generated ones",
        "A teacher and a student model",
        "A policy network and a value network"
      ],
      answer: 1,
      explanation: "A GAN pairs a generator (maps a random noise vector z to a sample, e.g., an image) with a discriminator (binary classifier: real vs. generated). They train against each other: the generator tries to fool the discriminator, the discriminator tries not to be fooled."
    },
    {
      q: "How is the training dynamic between generator and discriminator best described?",
      choices: [
        "Cooperative — both networks share a single loss they jointly minimize",
        "A two-player minimax game: the generator minimizes the same objective the discriminator tries to maximize",
        "Pure supervised classification only",
        "A reinforcement-learning policy iteration"
      ],
      answer: 1,
      explanation: "The original GAN formulation defines a minimax game with a value function V(G, D): the discriminator maximizes its ability to distinguish real from fake, while the generator minimizes the discriminator's success. At the global equilibrium, the generator's distribution matches the data distribution."
    },
    {
      q: "What is 'mode collapse' in GAN training?",
      choices: [
        "When the GPU runs out of memory",
        "When the generator produces only a small subset of the data distribution (a few 'modes'), ignoring the rest",
        "When the discriminator becomes perfect and stops learning",
        "When training data is corrupted"
      ],
      answer: 1,
      explanation: "Mode collapse is a common GAN failure where the generator finds a few outputs that consistently fool the discriminator and stops exploring the rest of the data distribution. Many GAN variants (Wasserstein GAN, mini-batch discrimination, unrolled GANs) were proposed largely to mitigate it and stabilize training."
    },
    {
      q: "Which of these is a well-known family of GAN variants?",
      choices: [
        "DCGAN, StyleGAN, CycleGAN",
        "BERT, GPT, T5",
        "ResNet, VGG, AlexNet",
        "LSTM, GRU, RNN"
      ],
      answer: 0,
      explanation: "DCGAN brought convolutional architectures to GANs; StyleGAN (NVIDIA) became famous for photorealistic face generation; CycleGAN enabled unpaired image-to-image translation. The other lists are language models, image classifiers, and recurrent nets respectively."
    },
    {
      q: "What is one common application of GANs?",
      choices: [
        "Compiling source code",
        "Generating realistic images, image-to-image translation, super-resolution, and synthetic data augmentation",
        "Routing network packets",
        "Solving differential equations symbolically"
      ],
      answer: 1,
      explanation: "GANs were the dominant approach for high-quality image synthesis throughout much of the 2010s — face generation (StyleGAN), super-resolution (SRGAN), style transfer (CycleGAN), and synthetic training data. They remain useful but have largely been overtaken for state-of-the-art image generation by diffusion models."
    },
    {
      q: "How do GANs compare to diffusion models, which now dominate state-of-the-art image generation?",
      choices: [
        "Diffusion models are a kind of GAN",
        "Diffusion models gradually denoise random noise into samples and tend to be more stable to train and produce higher-quality, more diverse images, but are typically slower at inference than a single GAN forward pass",
        "GANs are strictly better in every way",
        "Diffusion models do not require training data"
      ],
      answer: 1,
      explanation: "Diffusion models (DDPM, Stable Diffusion, Imagen, DALL·E 2/3) learn to reverse a noise process step by step. They tend to be more stable to train and cover the data distribution better than GANs (less mode collapse), at the cost of multi-step iterative inference. State-of-the-art image generation has largely shifted from GANs to diffusion since ~2020–2022."
    }
  ]
});
