registerQuiz({
  collection: "gpus",
  key: "architecture",
  title: "GPU Architecture",
  icon: "A",
  description: "Cores, warps, memory hierarchy, and the SIMT execution model.",
  questions: [
    {
      q: "Which execution model best describes how modern NVIDIA GPUs run code?",
      choices: [
        "MIMD — every core fetches a different instruction per cycle",
        "SIMT — groups of threads execute the same instruction together in lock-step",
        "Pure scalar execution, one instruction per thread per cycle, fully independent",
        "Dataflow — instructions fire when their inputs are ready"
      ],
      answer: 1,
      explanation: "NVIDIA calls its model SIMT (Single Instruction, Multiple Threads). Threads are grouped into warps of 32 that share an instruction pointer; if threads in a warp take different branches, the warp serializes them (warp divergence). It's a generalization of classic SIMD."
    },
    {
      q: "On NVIDIA GPUs, how many threads make up a single warp?",
      choices: ["8", "16", "32", "64"],
      answer: 2,
      explanation: "An NVIDIA warp is 32 threads. AMD's analogous unit is the wavefront — historically 64 threads on GCN, and 32 on RDNA. Warp/wavefront size matters because divergent branches inside one warp serialize and waste lanes."
    },
    {
      q: "Which is the typical memory hierarchy ordering on a GPU, from fastest to slowest?",
      choices: [
        "Global memory → L2 cache → shared memory → registers",
        "Registers → shared memory / L1 → L2 cache → global (HBM/GDDR) memory",
        "HBM → registers → shared memory → L2",
        "L2 → registers → L1 → shared memory"
      ],
      answer: 1,
      explanation: "From fastest/smallest to slowest/largest: per-thread registers, then per-block shared memory / L1 (on-chip SRAM), then a shared L2 cache, then off-chip global memory (GDDR or HBM). Good GPU code keeps hot data in registers and shared memory."
    },
    {
      q: "What is a Streaming Multiprocessor (SM) on an NVIDIA GPU?",
      choices: [
        "The PCIe interconnect block",
        "A scheduler block containing many CUDA cores, warp schedulers, registers, and shared memory",
        "The video output engine",
        "An on-chip cache only"
      ],
      answer: 1,
      explanation: "An SM is the GPU's basic compute building block. It bundles execution units (CUDA cores, tensor cores, special-function units), warp schedulers, a register file, and shared memory / L1. A modern GPU has dozens to over a hundred SMs working in parallel."
    },
    {
      q: "What are Tensor Cores designed to accelerate?",
      choices: [
        "General double-precision scalar arithmetic",
        "Ray-triangle intersection tests",
        "Small matrix-multiply-and-accumulate operations, often in lower precision (FP16/BF16/FP8/INT8)",
        "Memory copies between host and device"
      ],
      answer: 2,
      explanation: "Tensor Cores (introduced in Volta, 2017) execute small matrix-multiply-accumulate (MMA) operations as one instruction, primarily in reduced precision. They are the workhorses behind modern deep-learning throughput, often offering 5–20× the FLOPs of regular CUDA cores for matmul."
    },
    {
      q: "What is 'warp divergence' and why does it hurt performance?",
      choices: [
        "When two GPUs in NVLink fall out of sync — fixed by NVLink topology tools",
        "When threads in the same warp take different branches and the warp must serialize each branch path, idling other lanes",
        "When the GPU clock drifts from the CPU clock, causing missed frames",
        "When PCIe DMA transfers are reordered"
      ],
      answer: 1,
      explanation: "Because a warp shares one program counter, if its 32 threads take different branches the hardware executes each path with the non-participating lanes masked off. The cost scales with the number of distinct paths, so data-dependent branching inside a warp is a classic GPU performance pitfall."
    },
    {
      q: "Why does GPU memory bandwidth (e.g., HBM3) matter so much for deep-learning workloads?",
      choices: [
        "Because deep learning runs entirely from disk",
        "Many DL kernels are memory-bandwidth bound — feeding tensor cores fast enough requires very high off-chip bandwidth",
        "Because GPUs cannot cache anything",
        "Because PCIe bandwidth is unlimited so HBM is irrelevant"
      ],
      answer: 1,
      explanation: "Modern accelerators have so much compute that many real workloads are limited by how fast data can be moved into the chip — not by FLOPs. HBM (High-Bandwidth Memory) stacks DRAM dies next to the GPU die over a wide interface, delivering TB/s of bandwidth that GDDR can't match."
    }
  ]
});
