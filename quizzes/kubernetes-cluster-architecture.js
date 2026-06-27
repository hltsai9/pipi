registerStructuredQuiz({
  collection: "kubernetes",
  key: "cluster-architecture",
  title: "Cluster Architecture",
  icon: "K",
  description: "A structured study set on cluster architecture: priming, comprehension, application, synthesis.",
  createdAt: "2026-06-27T17:50:00Z",
  updatedAt: "2026-06-27T18:10:00Z",
  sections: [
    {
      category: "priming",
      questions: [
        {
          type: "open_ended",
          question: "Before reading anything formal: in your own words, what do you think separates the 'control plane' of a cluster from the 'worker nodes'? What kind of job would you expect each part to do?",
          difficulty: "easy"
        },
        {
          type: "open_ended",
          question: "Predict: if a single component were the only one allowed to read and write the cluster's stored state, what advantages might that funnel give you for security and consistency? What risks would it introduce?",
          difficulty: "medium"
        },
        {
          type: "open_ended",
          question: "A cluster keeps your apps running even while nobody is watching. List two things you'd expect some component to be doing continuously, in the background, to make that self-healing behavior possible.",
          difficulty: "medium"
        }
      ]
    },
    {
      category: "comprehension",
      questions: [
        {
          type: "flashcard",
          question: "What two broad parts make up a Kubernetes cluster?",
          answer: "A control plane plus a set of worker machines, called nodes, that run containerized applications. Every cluster needs at least one worker node to run Pods.",
          difficulty: "easy"
        },
        {
          type: "flashcard",
          question: "What is the kube-apiserver?",
          answer: "The front end of the control plane; it exposes the Kubernetes API that all clients (kubectl, dashboards, controllers) talk to. It is designed to scale horizontally across multiple instances.",
          difficulty: "easy"
        },
        {
          type: "flashcard",
          question: "What role does etcd play?",
          answer: "It is a consistent and highly-available key-value store used as Kubernetes' backing store for all cluster data. The docs recommend having a backup plan for it.",
          difficulty: "easy"
        },
        {
          type: "flashcard",
          question: "What does the kube-scheduler do?",
          answer: "It watches for newly created Pods with no assigned node and selects a node for each, weighing resource requirements, hardware/software/policy constraints, affinity rules, data locality, and deadlines.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "How are the individual controllers packaged inside the kube-controller-manager?",
          answer: "Logically each controller is a separate control loop, but they are all compiled into a single binary and run together in one process to reduce complexity.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "When does a cluster have a cloud-controller-manager, and what does it do?",
          answer: "Only when running with a cloud provider. It embeds cloud-specific logic (node, route, and service controllers) and links the cluster to the provider's API. On-prem and learning clusters have none.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "What are the three node components, and what does the kubelet guarantee?",
          answer: "The kubelet, kube-proxy (optional), and a container runtime. The kubelet takes a set of PodSpecs and ensures the containers they describe are running and healthy; it ignores containers not created by Kubernetes.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "What is the Container Runtime Interface (CRI)?",
          answer: "The interface that lets Kubernetes work with any compliant container runtime — such as containerd or CRI-O — to manage the execution and lifecycle of containers.",
          difficulty: "easy"
        }
      ]
    },
    {
      category: "application",
      questions: [
        {
          type: "multiple_choice",
          question: "You're running a small learning cluster on one bare-metal machine with no cloud provider attached. Which control plane component will simply be absent?",
          options: [
            "kube-scheduler, the component that assigns Pods to suitable nodes",
            "cloud-controller-manager, which runs cloud-provider-specific logic",
            "kube-apiserver, the front end that serves the Kubernetes API",
            "etcd, the key-value store backing all of the cluster's state"
          ],
          correct_option: "B",
          explanation: "The cloud-controller-manager only runs controllers specific to a cloud provider, so a bare-metal or learning cluster simply doesn't have one. The scheduler, API server, and etcd are core and present on every cluster."
        },
        {
          type: "multiple_choice",
          question: "Your network plugin already programs Service packet forwarding on every node. Which node component might you then be able to leave out?",
          options: [
            "the kubelet, the agent that keeps each Pod's containers running",
            "the container runtime that actually executes the containers",
            "kube-proxy, which otherwise maintains Service network rules",
            "the cloud-controller-manager that integrates with the provider"
          ],
          correct_option: "C",
          explanation: "kube-proxy is optional — if a network plugin already implements Service packet forwarding, you may not need it. The kubelet and runtime are always required, and the cloud-controller-manager isn't even a node component."
        },
        {
          type: "multiple_choice",
          question: "A newly created Pod is stuck in Pending with no node assigned. Which component is responsible for choosing a node for it?",
          options: [
            "kube-scheduler, which selects a node for unscheduled Pods",
            "kube-proxy, which manages Service traffic rules on nodes",
            "the kubelet, which runs the containers once a node is chosen",
            "etcd, which stores the Pod object and its current status"
          ],
          correct_option: "A",
          explanation: "Selecting a node for Pods that don't have one is exactly the kube-scheduler's job. The kubelet only acts once a node is assigned; kube-proxy handles Service networking; etcd just stores state."
        },
        {
          type: "multiple_choice",
          question: "You install cluster DNS as an addon. By convention, in which namespace do its namespaced resources belong?",
          options: [
            "default, the namespace that ordinary user workloads land in",
            "kube-public, which is world-readable by anonymous clients",
            "kube-node-lease, which holds the per-node heartbeat Leases",
            "kube-system, which holds cluster-level addon resources"
          ],
          correct_option: "D",
          explanation: "Namespaced addon resources belong to kube-system. Cluster DNS is a standard addon; kube-public and kube-node-lease serve other specific purposes, and addons don't live in the default user namespace."
        },
        {
          type: "multiple_choice",
          question: "The control plane needs a cheap way, at scale, to tell whether thousands of nodes are still alive. Which mechanism is built for that?",
          options: [
            "the scheduler holding an open gRPC stream to every kubelet",
            "Lease objects in kube-node-lease that each node keeps renewing",
            "the API server pinging each node's primary IP over ICMP",
            "each kubelet writing heartbeat rows straight into etcd itself"
          ],
          correct_option: "B",
          explanation: "Each node has an associated Lease in the kube-node-lease namespace that it renews; these lightweight updates let the control plane detect failures cheaply. Components never write to etcd directly — only the API server does — and there is no ICMP ping mechanism."
        }
      ]
    },
    {
      category: "transfer_synthesis",
      questions: [
        {
          type: "flashcard",
          question: "What common 'control loop' pattern do the controllers in the control plane share, and how does it produce self-healing?",
          answer: "Each controller watches the current state through the API server and continuously drives it toward the declared desired state. When reality drifts (a Pod dies, a replica is missing), the loop notices and acts — that reconciliation is what makes the cluster self-heal.",
          difficulty: "hard"
        },
        {
          type: "multiple_choice",
          question: "Many components need cluster state, yet only one of them talks to etcd directly. Which is it, and why does that design matter?",
          options: [
            "the kubelet, because it sits closest to the running containers",
            "kube-scheduler, because it centralizes all placement decisions",
            "kube-apiserver, so auth, validation, and consistency live in one place",
            "kube-controller-manager, because it owns every control loop"
          ],
          correct_option: "C",
          explanation: "The kube-apiserver is the single front door to cluster state; routing all reads and writes through it means authentication, validation, and consistency are enforced in one place. Other components reach etcd only indirectly, through the API server."
        },
        {
          type: "flashcard",
          question: "If the kube-apiserver becomes unavailable for a while, what keeps working and what stops?",
          answer: "Already-running Pods and their containers keep running, because the kubelet manages them locally on each node. But you can't change anything — scheduling new Pods, controller reconciliation, and kubectl all depend on the API server.",
          difficulty: "hard"
        }
      ]
    }
  ]
});
