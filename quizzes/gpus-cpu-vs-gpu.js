registerQuiz({
  collection: "gpus",
  key: "cpu_vs_gpu",
  title: "CPU vs. GPU",
  icon: "C",
  description: "Latency vs. throughput, control flow vs. data parallelism.",
  createdAt: "2026-04-25T18:31:00Z",
  updatedAt: "2026-06-06T00:35:00Z",
  questions: [
    {
      q: "Which one-line summary best captures the architectural difference between CPUs and GPUs?",
      choices: [
        "CPUs are latency-optimized with few powerful cores; GPUs are throughput-optimized",
        "CPUs use analog electronics, while GPUs are fully digital integrated circuits",
        "GPUs run graphics workloads exclusively; CPUs are the only path to general code",
        "CPUs operate on 64-bit data while GPUs are limited to 32-bit math by hardware"
      ],
      answer: 0,
      explanation: "A CPU dedicates lots of transistors to making a single thread fast: deep pipelines, big caches, branch prediction, out-of-order execution. A GPU dedicates transistors to running thousands of simpler threads in parallel — sacrificing single-thread latency for aggregate throughput."
    },
    {
      q: "Which feature is far more developed on a CPU than on a GPU?",
      choices: [
        "Aggregate floating-point throughput across the entire chip's compute units",
        "Wide SIMD-style execution across thousands of independent vector lanes",
        "Sophisticated per-core branch prediction and out-of-order execution logic",
        "On-package high-bandwidth memory (HBM) stacked next to the compute die"
      ],
      answer: 2,
      explanation: "CPUs put enormous die area into making sequential code fast: branch predictors, large reorder buffers, speculative execution, deep cache hierarchies. GPUs largely skip this complexity per core and instead hide latency by switching to other ready warps."
    },
    {
      q: "Which workload is best suited to a GPU?",
      choices: [
        "A small recursive parser with heavy data-dependent branching and short sequences",
        "Booting an operating system, scheduling processes, and servicing system calls",
        "Multiplying two large matrices with many independent multiply-adds in parallel",
        "Compiling a medium-sized C++ project across about 16 CPU build threads"
      ],
      answer: 2,
      explanation: "GPUs shine on workloads that are massively data-parallel, regular, and arithmetic-heavy — exactly like dense linear algebra, image filters, and physics simulations. Code with heavy serial dependencies or unpredictable branches stays on the CPU."
    },
    {
      q: "How do CPUs and GPUs differ in how they hide memory latency?",
      choices: [
        "Neither architecture treats memory latency as a real concern in modern designs",
        "Both architectures rely exclusively on hardware prefetchers and nothing else",
        "GPUs avoid caches entirely and rely only on per-thread register files",
        "CPUs use deep caches and out-of-order execution; GPUs swap to other warps"
      ],
      answer: 3,
      explanation: "The CPU strategy is to keep one thread fast: deep caches, prefetching, OOO. The GPU strategy is the opposite: when a warp stalls on memory, the SM instantly switches to another ready warp. With thousands of in-flight threads, latency is amortized across them."
    },
    {
      q: "Which statement about cache sizes is most accurate?",
      choices: [
        "GPUs typically have much larger per-core caches than server-class modern CPUs",
        "CPUs have larger per-core caches; GPU caches are smaller per thread but broader",
        "Neither CPUs nor GPUs use any kind of cache hierarchy in current designs",
        "GPU L2 caches are always strictly bigger than every CPU's L3 by design"
      ],
      answer: 1,
      explanation: "Server CPUs often have tens of MB of L3 per core's reach. GPUs have proportionally less cache per thread because they are not trying to keep one thread fast — they're keeping thousands of threads fed, mostly via high-bandwidth memory and software-managed shared memory."
    },
    {
      q: "Why are GPUs so dominant for deep-learning training?",
      choices: [
        "Because modern neural-network frameworks require a GPU-resident operating system",
        "Because dense matmul maps onto thousands of parallel MAC units, sped up by tensor cores",
        "Because CPUs do not implement IEEE-754 floating-point arithmetic in any form",
        "Because GPUs run at substantially higher clock speeds than server-class CPUs"
      ],
      answer: 1,
      explanation: "Training is dominated by large dense matrix multiplications and convolutions — embarrassingly data-parallel and arithmetic-intensive. GPUs offer one to two orders of magnitude more relevant FLOPs and bandwidth than CPUs, and tensor cores extend that lead in low precision."
    },
    {
      q: "Which is a typical reason to keep a workload on the CPU rather than offload to a GPU?",
      choices: [
        "The workload is small or serial, so PCIe transfer overhead dominates any speedup",
        "GPUs lack any hardware support for integer arithmetic of common bit widths",
        "GPUs cannot run kernels written in C-like languages such as CUDA C or HIP",
        "Modern server CPUs are always faster than GPUs across every workload type"
      ],
      answer: 0,
      explanation: "Moving data over PCIe and launching a kernel has measurable overhead. For small, latency-sensitive, or serial tasks the round trip eats any compute advantage. Heuristic: GPUs win when the data is big and the work per byte is high."
    }
  ]
});
