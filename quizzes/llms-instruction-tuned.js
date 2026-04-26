registerQuiz({
  collection: "llms",
  key: "instruction",
  title: "Instruction-Tuned LLMs",
  icon: "I",
  description: "Models fine-tuned to follow natural-language instructions.",
  createdAt: "2026-04-25T18:01:00Z",
  updatedAt: "2026-04-26T17:50:00Z",
  questions: [
    {
      q: "What is the main goal of instruction tuning?",
      choices: [
        "To significantly speed up token generation at inference time",
        "To shrink the model's footprint so it fits on smaller consumer hardware",
        "To train the model to follow natural-language instructions across many tasks",
        "To make the model memorize one specific knowledge base it can recite verbatim"
      ],
      answer: 2,
      explanation: "Instruction tuning fine-tunes a pretrained model on a curated dataset of (instruction, response) pairs across many task types. The result is a model that interprets requests like 'Summarize this' or 'Translate to French' even on task descriptions it has never seen verbatim."
    },
    {
      q: "Which of these is a well-known instruction-tuning dataset / approach?",
      choices: [
        "GLUE — General Language Understanding Evaluation benchmark",
        "FLAN / Super-NaturalInstructions — collections of NLP tasks as prompts",
        "ImageNet — labeled image dataset for visual classification",
        "WMT Newstest — annual machine-translation evaluation set"
      ],
      answer: 1,
      explanation: "FLAN (Google) and Super-NaturalInstructions (AI2) collected hundreds to thousands of NLP tasks rephrased as natural-language instructions. Fine-tuning on them dramatically improved zero-shot generalization. The other options are evaluation/benchmark datasets, not instruction-tuning corpora."
    },
    {
      q: "InstructGPT, the instruction-tuned predecessor of ChatGPT, was trained using which two-stage post-training recipe?",
      choices: [
        "Knowledge distillation from a larger teacher, followed by int8 quantization",
        "Supervised fine-tuning on human demonstrations, followed by RLHF with PPO",
        "Adversarial robustness training, followed by structured magnitude pruning",
        "Continued pretraining on new web data, followed by curriculum-based fine-tuning"
      ],
      answer: 1,
      explanation: "OpenAI's InstructGPT paper (Ouyang et al., 2022) introduced the SFT + RLHF recipe: first fine-tune on human-written demonstrations, then train a reward model from human preferences and optimize the LLM against it with PPO."
    },
    {
      q: "Compared to a base GPT-3 model, InstructGPT (1.3B parameters) was preferred by human raters over the much larger 175B base model. What does this primarily demonstrate?",
      choices: [
        "Smaller language models are universally better than larger ones",
        "RLHF is unnecessary once supervised fine-tuning has been applied",
        "The quality of pretraining data does not actually matter at scale",
        "Alignment via instruction tuning can outweigh raw parameter count for usefulness"
      ],
      answer: 3,
      explanation: "The InstructGPT result is a landmark demonstration that *alignment* — teaching a model to follow intent — adds far more practical usefulness than scaling alone. A 1.3B aligned model beat 175B base GPT-3 in human preference, even though the larger model knew more facts."
    },
    {
      q: "Which statement about instruction-tuned models is most accurate?",
      choices: [
        "They no longer need a pretrained base model and are trained from scratch",
        "They generally generalize zero-shot to unseen instructions, but still hallucinate",
        "They can only handle the specific tasks that appeared during fine-tuning",
        "They are guaranteed to be factually correct on any topic in their training data"
      ],
      answer: 1,
      explanation: "Instruction tuning gives strong zero-shot generalization to unseen tasks because the model learns the *format* of following instructions. But it does not fix factual reliability — instruction-tuned models still hallucinate, and they always start from a pretrained base."
    }
  ]
});
