registerQuiz({
  collection: "gpus",
  key: "evolution",
  title: "Evolution of GPUs",
  icon: "E",
  description: "From fixed-function graphics pipelines to programmable AI accelerators.",
  questions: [
    {
      q: "What were early GPUs (late 1990s, e.g., NVIDIA RIVA / GeForce 256) primarily designed to do?",
      choices: [
        "Train neural networks",
        "Accelerate fixed-function 3D graphics pipelines — transform, lighting, and rasterization",
        "Mine cryptocurrency",
        "Run general-purpose C code"
      ],
      answer: 1,
      explanation: "The original GPUs offloaded the fixed-function 3D graphics pipeline — vertex transform & lighting (T&L), rasterization, texture mapping — from the CPU. NVIDIA marketed the GeForce 256 (1999) as 'the world's first GPU' because it integrated T&L on the chip."
    },
    {
      q: "What major shift did programmable shaders (early 2000s, e.g., GeForce 3, DirectX 8) introduce?",
      choices: [
        "GPUs gained their own operating system",
        "Parts of the pipeline (vertex and pixel processing) became programmable, enabling custom per-vertex/per-pixel code",
        "GPUs stopped supporting 3D graphics",
        "GPUs moved off the PCIe bus"
      ],
      answer: 1,
      explanation: "Programmable vertex and pixel shaders replaced fixed-function stages with small programs. This is the foundation everything else built on — once you can run arbitrary code per-pixel, the GPU is on its way to becoming a general parallel processor."
    },
    {
      q: "Which 2006 release made GPUs broadly usable for general-purpose computation?",
      choices: [
        "AMD's Radeon HD 2900",
        "NVIDIA's G80 / GeForce 8800 with the launch of CUDA",
        "Intel's Larrabee",
        "Apple's Metal API"
      ],
      answer: 1,
      explanation: "NVIDIA's G80 (2006) introduced a unified shader architecture and shipped alongside CUDA, a C-like programming model for general computation on the GPU. It turned GPUs from graphics-only chips into general parallel processors and kicked off the GPGPU era."
    },
    {
      q: "Which moment is widely credited with sparking the modern deep-learning boom on GPUs?",
      choices: [
        "Quake III being released in 1999",
        "AlexNet winning ImageNet 2012, trained on two NVIDIA GTX 580 GPUs",
        "The launch of OpenGL 1.0",
        "The release of Windows Vista"
      ],
      answer: 1,
      explanation: "Krizhevsky, Sutskever, and Hinton's AlexNet (2012) cut ImageNet error dramatically and was trained on consumer GPUs. It demonstrated that GPU-accelerated deep learning was practical and effective, triggering the modern surge in DL research and GPU demand."
    },
    {
      q: "Which NVIDIA architecture introduced Tensor Cores for accelerating mixed-precision matrix math?",
      choices: ["Kepler (2012)", "Maxwell (2014)", "Pascal (2016)", "Volta (2017)"],
      answer: 3,
      explanation: "Volta (V100, 2017) was the first NVIDIA architecture with Tensor Cores. They've been a centerpiece of every datacenter generation since: Turing, Ampere (A100), Hopper (H100, with FP8), and Blackwell (B100/B200)."
    },
    {
      q: "Which architecture introduced dedicated RT (ray-tracing) cores for real-time ray-triangle intersection?",
      choices: ["Pascal", "Volta", "Turing (2018)", "Ampere"],
      answer: 2,
      explanation: "Turing (RTX 20-series, 2018) added RT cores for hardware-accelerated BVH traversal and ray-triangle tests, enabling real-time ray tracing in games. Turing also brought tensor cores to consumer GPUs, powering DLSS."
    },
    {
      q: "What does HBM (High-Bandwidth Memory) provide that GDDR does not, and why does it matter for AI GPUs?",
      choices: [
        "HBM is cheaper per GB than GDDR",
        "HBM stacks DRAM dies and uses a very wide interface for far higher bandwidth, which is critical for memory-bound DL workloads",
        "HBM stores data on disk for persistence",
        "HBM is non-volatile"
      ],
      answer: 1,
      explanation: "HBM places stacked DRAM next to the GPU on a silicon interposer, with a much wider interface than GDDR. The result is dramatically higher bandwidth (TB/s), at higher cost. Datacenter AI GPUs (P100/V100/A100/H100/B200, MI200/MI300) all use HBM because DL is bandwidth-hungry."
    },
    {
      q: "Roughly, what is the chronological order of these recent NVIDIA datacenter architectures?",
      choices: [
        "Hopper → Ampere → Volta → Blackwell",
        "Volta (2017) → Ampere (2020) → Hopper (2022) → Blackwell (2024)",
        "Ampere → Volta → Blackwell → Hopper",
        "Blackwell → Hopper → Volta → Ampere"
      ],
      answer: 1,
      explanation: "The datacenter line ran Volta (V100) → Turing (T4) → Ampere (A100) → Hopper (H100, with FP8 and the Transformer Engine) → Blackwell (B100/B200, ~2024). Each generation pushed tensor throughput, memory bandwidth, and interconnect (NVLink/NVSwitch) for ever-larger models."
    },
    {
      q: "Which trend has most defined GPU evolution since ~2017?",
      choices: [
        "A return to fixed-function graphics-only pipelines",
        "Specialization for AI: tensor cores, lower-precision formats (FP16/BF16/FP8), HBM, fast interconnects, and multi-GPU scale-out",
        "Dropping floating-point support",
        "Moving entirely off PCIe to USB"
      ],
      answer: 1,
      explanation: "Modern GPU roadmaps are increasingly shaped by AI workloads: tensor/matrix engines, ever-lower precision (FP16 → BF16 → FP8 → FP4), HBM stacks for bandwidth, NVLink/NVSwitch for tight multi-GPU coupling, and rack-scale systems (DGX/HGX, GB200 NVL72) optimized for training and serving large models."
    }
  ]
});
