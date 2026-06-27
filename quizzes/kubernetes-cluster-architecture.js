registerQuiz({
  collection: "kubernetes",
  key: "cluster-architecture",
  title: "Cluster Architecture",
  icon: "K",
  description: "The control plane, worker nodes, and the components that run and manage your Pods.",
  createdAt: "2026-06-27T17:50:00Z",
  updatedAt: "2026-06-27T17:50:00Z",
  questions: [
    {
      q: "Which control plane component is the front end that exposes the Kubernetes API and is what clients like kubectl talk to?",
      choices: [
        "kube-scheduler, which assigns newly created Pods to suitable worker nodes",
        "etcd, the consistent key-value store that backs all of the cluster's data",
        "kube-apiserver, the front end that exposes the Kubernetes API to clients",
        "kubelet, the per-node agent that starts and stops a node's containers"
      ],
      answer: 2,
      explanation: "The kube-apiserver is the front end of the control plane and exposes the Kubernetes API; almost every interaction goes through it. It is designed to scale horizontally — you can run several instances and balance traffic between them. etcd is the backing store, not the API surface."
    },
    {
      q: "Which component serves as Kubernetes' backing store for all cluster data?",
      choices: [
        "etcd, a consistent and highly-available key-value store for cluster data",
        "kube-controller-manager, which runs the cluster's core control loops",
        "the container runtime, which manages container execution on each node",
        "kube-proxy, which maintains Service networking rules on every node"
      ],
      answer: 0,
      explanation: "etcd is a consistent and highly-available key-value store used as Kubernetes' backing store for all cluster data. The docs advise having a backup plan for that data. The controller manager and kube-proxy run logic; they don't persist cluster state."
    },
    {
      q: "What is the specific job of the kube-scheduler?",
      choices: [
        "Persisting the desired and observed state of every API object to disk",
        "Maintaining iptables or IPVS rules so Services can reach their Pods",
        "Running controllers such as the Node and Job controllers in one process",
        "Selecting a node for newly created Pods that don't yet have one assigned"
      ],
      answer: 3,
      explanation: "The kube-scheduler watches for newly created Pods with no assigned node and picks a node for each. It weighs factors like resource requirements, hardware/software/policy constraints, affinity and anti-affinity rules, data locality, and deadlines. Persistence is etcd's job; networking rules are kube-proxy's."
    },
    {
      q: "How does the kube-controller-manager run the individual controllers (Node, Job, EndpointSlice, ServiceAccount, etc.)?",
      choices: [
        "Each controller runs as its own separate operating-system process and binary",
        "They are compiled into one binary and run together in a single process",
        "Each controller runs as a separate Pod scheduled onto a worker node",
        "They run inside etcd as stored procedures triggered on data changes"
      ],
      answer: 1,
      explanation: "Logically each controller is a separate process, but to reduce complexity they are all compiled into a single binary and run in a single process. Each controller is a control loop that drives the cluster's current state toward the desired state."
    },
    {
      q: "What is the purpose of the cloud-controller-manager?",
      choices: [
        "It schedules Pods onto the cheapest available nodes in a cloud region",
        "It stores cloud credentials and encrypts every Secret kept in etcd",
        "It embeds cloud-specific control logic, linking the cluster to a provider's API",
        "It is required on every cluster, including on-premises bare-metal setups"
      ],
      answer: 2,
      explanation: "The cloud-controller-manager embeds cloud-specific control logic — running controllers like the node, route, and service controllers that talk to a cloud provider's API. It separates cloud-dependent logic from the rest of the cluster. Clusters running on-premises or in a learning environment have no cloud-controller-manager."
    },
    {
      q: "What does the kubelet do on each node?",
      choices: [
        "Ensures the containers described in a set of PodSpecs are running and healthy",
        "Maintains the network rules that let outside traffic reach a node's Pods",
        "Watches for unscheduled Pods and binds each one to a chosen worker node",
        "Stores the cluster's desired state and serves it to the other components"
      ],
      answer: 0,
      explanation: "The kubelet is the agent on every node; it takes a set of PodSpecs and makes sure the containers they describe are running and healthy. It only manages containers created by Kubernetes — containers started by other means are not its concern."
    },
    {
      q: "Which statement best describes kube-proxy?",
      choices: [
        "A mandatory agent that pulls and unpacks every container image on a node",
        "The control plane process that decides which node each new Pod runs on",
        "A control plane process that runs the cluster's core reconciliation loops",
        "An optional per-node network proxy that maintains Service networking rules"
      ],
      answer: 3,
      explanation: "kube-proxy is an optional network proxy on each node that implements part of the Service concept by maintaining network rules. It uses the operating system's packet filtering layer when available, otherwise forwarding traffic itself. If a network plugin already does Service packet forwarding, you may not need kube-proxy at all."
    },
    {
      q: "Which interface lets Kubernetes work with container runtimes such as containerd and CRI-O?",
      choices: [
        "CNI, the Container Network Interface used to configure Pod networking",
        "CSI, the Container Storage Interface used to attach persistent volumes",
        "CRI, the Container Runtime Interface for managing container lifecycle",
        "OCI, the image-format spec the API server uses to validate manifests"
      ],
      answer: 2,
      explanation: "The container runtime manages the execution and lifecycle of containers, and Kubernetes supports any runtime that implements the Container Runtime Interface (CRI) — including containerd and CRI-O. CNI handles networking and CSI handles storage; neither is the runtime interface."
    },
    {
      q: "Where do the namespaced resources for cluster addons (like cluster DNS) live?",
      choices: [
        "In the default namespace, right alongside ordinary user workloads",
        "In the kube-system namespace, which holds cluster-level addon resources",
        "In etcd only, with no representation as Kubernetes API objects at all",
        "In the kube-public namespace, readable anonymously by every client"
      ],
      answer: 1,
      explanation: "Addons use standard Kubernetes resources (DaemonSets, Deployments, and so on), and the namespaced ones belong to the kube-system namespace. Cluster DNS is one such addon — all clusters should have it, since Kubernetes automatically adds it to containers' DNS searches."
    },
    {
      q: "How do nodes report their health to the control plane?",
      choices: [
        "Through Lease objects in the kube-node-lease namespace plus updates to a node's .status",
        "Through a persistent gRPC stream the scheduler keeps open to each running kubelet",
        "Through ICMP echo pings that the API server sends to every node's primary IP",
        "Through rows that the kubelet writes directly into the etcd key-value store"
      ],
      answer: 0,
      explanation: "Nodes send heartbeats in two forms: periodic updates to the node's .status, and Lease objects in the kube-node-lease namespace (each node has an associated Lease). Lightweight leases let the control plane detect failures cheaply. Components never write to etcd directly — only the API server does."
    }
  ]
});
