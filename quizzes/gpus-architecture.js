registerQuiz({
  collection: "gpus",
  key: "architecture",
  title: "GPU Architecture",
  icon: "A",
  description: "Cores, warps, memory hierarchy, and the SIMT execution model.",
  createdAt: "2026-04-25T18:30:00Z",
  updatedAt: "2026-04-26T17:50:00Z",
  questions: [
    {
      q: "Which execution model best describes how modern NVIDIA GPUs run code?",
      choices: [
        "MIMD — every core fetches a different instruction independently each cycle",
        "SIMT — groups of threads execute the same instruction in lock-step warps",
        "Pure scalar — one instruction per thread per cycle, fully independent control",
        "Dataflow — instructions fire whenever all of their input operands become ready"
      ],
      answer: 1,
      explanation: "NVIDIA calls its model SIMT (Single Instruction, Multiple Threads). Threads are grouped into warps of 32 that share an instruction pointer; if threads in a warp take different branches, the warp serializes them (warp divergence). It's a generalization of classic SIMD."
    },
    {
      q: "On NVIDIA GPUs, how many threads make up a single warp?",
      choices: ["8 threads", "16 threads", "32 threads", "64 threads"],
      answer: 2,
      explanation: "An NVIDIA warp is 32 threads. AMD's analogous unit is the wavefront — historically 64 threads on GCN, and 32 on RDNA. Warp/wavefront size matters because divergent branches inside one warp serialize and waste lanes."
    },
    {
      q: "Which is the typical memory hierarchy ordering on a GPU, from fastest to slowest?",
      choices: [
        "Global DRAM (HBM/GDDR) → L2 cache → shared memory / L1 → per-thread registers",
        "Per-thread registers → shared memory / L1 → L2 cache → global DRAM (HBM/GDDR)",
        "Off-chip HBM stacks → per-thread registers → shared memory → unified L2 cache",
        "Unified L2 cache → per-thread registers → shared memory / L1 → off-chip DRAM"
      ],
      answer: 1,
      explanation: "From fastest/smallest to slowest/largest: per-thread registers, then per-block shared memory / L1 (on-chip SRAM), then a shared L2 cache, then off-chip global memory (GDDR or HBM). Good GPU code keeps hot data in registers and shared memory."
    },
    {
      q: "What is a Streaming Multiprocessor (SM) on an NVIDIA GPU?",
      choices: [
        "The PCIe interconnect block that handles host-device DMA over the bus",
        "A scheduler block bundling CUDA cores, warp schedulers, registers, and shared memory",
        "The video output engine that drives display connectors and frame buffers",
        "An on-chip cache that simply mirrors a slice of global memory and nothing else"
      ],
      answer: 1,
      explanation: "An SM is the GPU's basic compute building block. It bundles execution units (CUDA cores, tensor cores, special-function units), warp schedulers, a register file, and shared memory / L1. A modern GPU has dozens to over a hundred SMs working in parallel."
    },
    {
      q: "What are Tensor Cores designed to accelerate?",
      choices: [
        "General double-precision (FP64) scalar arithmetic for scientific computing",
        "Hardware ray-triangle intersection tests for real-time ray-tracing pipelines",
        "Small matrix-multiply-accumulate ops, especially in low precision (FP16/BF16/FP8)",
        "Memory copies between host system memory and device global memory over PCIe"
      ],
      answer: 2,
      explanation: "Tensor Cores (introduced in Volta, 2017) execute small matrix-multiply-accumulate (MMA) operations as one instruction, primarily in reduced precision. They are the workhorses behind modern deep-learning throughput, often offering 5–20× the FLOPs of regular CUDA cores for matmul."
    },
    {
      q: "What is 'warp divergence' and why does it hurt performance?",
      choices: [
        "Two GPUs in an NVLink topology fall out of sync, fixed via topology tooling",
        "Threads in one warp take different branches, forcing each path to serialize",
        "The GPU clock drifts away from the host CPU clock and frames are missed",
        "PCIe DMA transfers from host to device get reordered relative to issue order"
      ],
      answer: 1,
      explanation: "Because a warp shares one program counter, if its 32 threads take different branches the hardware executes each path with the non-participating lanes masked off. The cost scales with the number of distinct paths, so data-dependent branching inside a warp is a classic GPU performance pitfall."
    },
    {
      q: "Why does GPU memory bandwidth (e.g., HBM3) matter so much for deep-learning workloads?",
      choices: [
        "Because deep-learning training runs entirely from spinning disk during the epoch",
        "Many DL kernels are bandwidth-bound — feeding tensor cores demands huge HBM throughput",
        "Because GPUs lack any kind of on-chip cache and must hit DRAM on every access",
        "Because PCIe bandwidth is effectively unlimited, making HBM bandwidth irrelevant"
      ],
      answer: 1,
      explanation: "Modern accelerators have so much compute that many real workloads are limited by how fast data can be moved into the chip — not by FLOPs. HBM (High-Bandwidth Memory) stacks DRAM dies next to the GPU die over a wide interface, delivering TB/s of bandwidth that GDDR can't match."
    }
  ]
});
