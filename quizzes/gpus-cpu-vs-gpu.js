registerQuiz({
  collection: "gpus",
  key: "cpu_vs_gpu",
  title: "CPU vs. GPU",
  icon: "C",
  description: "Latency vs. throughput, control flow vs. data parallelism.",
  createdAt: "2026-04-25T18:31:00Z",
  updatedAt: "2026-04-25T18:31:00Z",
  questions: [
    {
      q: "Which one-line summary best captures the architectural difference between CPUs and GPUs?",
      choices: [
        "CPUs are analog; GPUs are digital",
        "CPUs are latency-optimized with few powerful cores; GPUs are throughput-optimized with many simpler cores",
        "GPUs run only graphics; CPUs run only general code",
        "CPUs are 64-bit; GPUs are 32-bit"
      ],
      answer: 1,
      explanation: "A CPU dedicates lots of transistors to making a single thread fast: deep pipelines, big caches, branch prediction, out-of-order execution. A GPU dedicates transistors to running thousands of simpler threads in parallel — sacrificing single-thread latency for aggregate throughput."
    },
    {
      q: "Which feature is far more developed on a CPU than on a GPU?",
      choices: [
        "High aggregate floating-point throughput",
        "Sophisticated per-core branch prediction and out-of-order execution",
        "Wide SIMD-style execution across thousands of lanes",
        "On-chip HBM memory"
      ],
      answer: 1,
      explanation: "CPUs put enormous die area into making sequential code fast: branch predictors, large reorder buffers, speculative execution, deep cache hierarchies. GPUs largely skip this complexity per core and instead hide latency by switching to other ready warps."
    },
    {
      q: "Which workload is best suited to a GPU?",
      choices: [
        "A small recursive parser with heavy data-dependent branching",
        "A 16-core build of a C++ project",
        "Multiplying two 8192×8192 matrices with millions of independent multiply-adds",
        "Booting an operating system"
      ],
      answer: 2,
      explanation: "GPUs shine on workloads that are massively data-parallel, regular, and arithmetic-heavy — exactly like dense linear algebra, image filters, and physics simulations. Code with heavy serial dependencies or unpredictable branches stays on the CPU."
    },
    {
      q: "How do CPUs and GPUs differ in how they hide memory latency?",
      choices: [
        "CPUs ignore memory latency entirely",
        "CPUs rely on big caches, prefetchers, and out-of-order execution; GPUs rely on massive thread-level parallelism, swapping in other ready warps when one stalls",
        "GPUs use no caches, only registers",
        "Both rely solely on prefetchers"
      ],
      answer: 1,
      explanation: "The CPU strategy is to keep one thread fast: deep caches, prefetching, OOO. The GPU strategy is the opposite: when a warp stalls on memory, the SM instantly switches to another ready warp. With thousands of in-flight threads, latency is amortized across them."
    },
    {
      q: "Which statement about cache sizes is most accurate?",
      choices: [
        "GPUs typically have larger per-core caches than CPUs",
        "CPUs have much larger per-core caches; GPU caches are smaller per thread but feed thousands of threads",
        "Neither CPUs nor GPUs use caches",
        "GPU L2 caches are always bigger than CPU L3 caches"
      ],
      answer: 1,
      explanation: "Server CPUs often have tens of MB of L3 per core's reach. GPUs have proportionally less cache per thread because they are not trying to keep one thread fast — they're keeping thousands of threads fed, mostly via high-bandwidth memory and software-managed shared memory."
    },
    {
      q: "Why are GPUs so dominant for deep-learning training?",
      choices: [
        "Because neural networks require an OS",
        "Because matmul-heavy workloads map naturally to thousands of parallel multiply-accumulate units, and tensor cores accelerate the dominant kernels further",
        "Because CPUs cannot do floating-point math",
        "Because GPUs have higher clock speeds than CPUs"
      ],
      answer: 1,
      explanation: "Training is dominated by large dense matrix multiplications and convolutions — embarrassingly data-parallel and arithmetic-intensive. GPUs offer one to two orders of magnitude more relevant FLOPs and bandwidth than CPUs, and tensor cores extend that lead in low precision."
    },
    {
      q: "Which is a typical reason to keep a workload on the CPU rather than offload to a GPU?",
      choices: [
        "The workload is small or highly serial, and PCIe transfer overhead would dominate any speedup",
        "GPUs cannot do integer arithmetic",
        "GPUs cannot run code written in C",
        "CPUs are always faster"
      ],
      answer: 0,
      explanation: "Moving data over PCIe and launching a kernel has measurable overhead. For small, latency-sensitive, or serial tasks the round trip eats any compute advantage. Heuristic: GPUs win when the data is big and the work per byte is high."
    }
  ]
});
