registerStructuredQuiz({
  collection: "kubernetes",
  key: "pods",
  title: "Pods",
  icon: "P",
  description: "A structured study set on Pods: priming, comprehension, application, synthesis.",
  createdAt: "2026-06-27T18:40:00Z",
  updatedAt: "2026-06-27T18:40:00Z",
  sections: [
    {
      category: "priming",
      questions: [
        {
          type: "open_ended",
          question: "Before reading anything formal: a Pod can hold more than one container. Why might you ever want to bundle several containers into one Pod instead of giving each its own Pod?",
          difficulty: "easy"
        },
        {
          type: "open_ended",
          question: "Predict: Pods are described as 'ephemeral' and 'disposable.' If a Pod can vanish at any moment, how would you design an application so that its data and its identity survive?",
          difficulty: "medium"
        },
        {
          type: "open_ended",
          question: "You usually don't create Pods directly — you create them through higher-level objects like Deployments and Jobs. Guess what those objects add on top of a bare Pod.",
          difficulty: "medium"
        }
      ]
    },
    {
      category: "comprehension",
      questions: [
        {
          type: "flashcard",
          question: "What is a Pod?",
          answer: "The smallest deployable unit you can create and manage in Kubernetes: a group of one or more containers with shared storage and network resources, plus a spec for how to run them. A Pod's containers are always co-located and co-scheduled.",
          difficulty: "easy"
        },
        {
          type: "flashcard",
          question: "How do containers within the same Pod communicate?",
          answer: "They share a network namespace — the same IP address and port space — so they reach each other over localhost and can use standard inter-process communication. Containers in different Pods have distinct IPs and must use the network.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "How is storage shared inside a Pod?",
          answer: "A Pod can declare a set of shared volumes that all of its containers can mount. This lets containers share data, and the data can persist across container restarts within the Pod.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "How are Pods normally created, and why not directly?",
          answer: "Through workload resources — Deployment, StatefulSet, Job, DaemonSet — using a Pod template. Those controllers add replication, rollout, and self-healing that a bare Pod created by hand doesn't have.",
          difficulty: "easy"
        },
        {
          type: "flashcard",
          question: "What are the five Pod phases?",
          answer: "Pending, Running, Succeeded, Failed, and Unknown. The phase is a high-level summary of where the Pod is in its lifecycle, not a comprehensive state machine.",
          difficulty: "easy"
        },
        {
          type: "flashcard",
          question: "What are the container restartPolicy values, the default, and the back-off behavior?",
          answer: "Always (the default), OnFailure, and Never. The kubelet restarts a failed container with an exponential back-off (10s, 20s, 40s …) capped at 5 minutes, resetting after a container runs 10 minutes without trouble.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "What is an init container?",
          answer: "A container that runs to completion before the app containers start. Init containers run one at a time in order, and each must finish successfully before the next begins — useful for setup and pre-conditions.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "What is a static Pod?",
          answer: "A Pod managed directly by the kubelet on a specific node, without the API server overseeing it. The kubelet creates a read-only 'mirror Pod' on the API server so the Pod is visible, but it can't be controlled from there.",
          difficulty: "hard"
        }
      ]
    },
    {
      category: "application",
      questions: [
        {
          type: "multiple_choice",
          question: "A Pod is assigned the Guaranteed Quality of Service class when which condition holds?",
          options: [
            "No container sets any CPU or memory requests or limits at all",
            "Every container sets a memory and CPU limit equal to its request",
            "At least one container sets a request but its limits are left unset",
            "The Pod's total requests stay under the node's allocatable capacity"
          ],
          correct_option: "B",
          explanation: "Guaranteed requires every container to set both CPU and memory limits equal to their requests. Setting nothing yields BestEffort; a request without matching limits yields Burstable. Fitting under node capacity is about scheduling, not QoS."
        },
        {
          type: "multiple_choice",
          question: "A Pod's containers have all terminated, and one of them exited with a non-zero status. Which phase is the Pod in?",
          options: [
            "Succeeded, because every one of its containers has finished",
            "Pending, because the Pod is waiting to be retried elsewhere",
            "Failed, because at least one container terminated in failure",
            "Unknown, because an exit status could not be determined here"
          ],
          correct_option: "C",
          explanation: "Failed means all containers have terminated and at least one ended in failure (non-zero exit or killed by the system). Succeeded requires every container to exit successfully; Pending and Unknown describe different situations entirely."
        },
        {
          type: "multiple_choice",
          question: "How does Kubernetes natively model a sidecar container?",
          options: [
            "As an init container whose restartPolicy is set to Always",
            "As a regular app container tagged with a sidecar: true field",
            "As an ephemeral container injected after the Pod is running",
            "As a second Pod scheduled onto the same node via affinity"
          ],
          correct_option: "A",
          explanation: "A sidecar is defined as an init container with restartPolicy: Always — it starts before the main containers but keeps running alongside them. There is no sidecar: true field, and a sidecar lives inside the same Pod, not a separate one."
        },
        {
          type: "multiple_choice",
          question: "Your Pod's image has no shell, and you need to debug a running container without restarting it. Which feature fits?",
          options: [
            "Add an init container that opens a debugging shell first",
            "Set the Pod's restartPolicy to Never and re-create the Pod",
            "Mount a new shared volume that contains debugging binaries",
            "Attach an ephemeral container to the already-running Pod"
          ],
          correct_option: "D",
          explanation: "Ephemeral containers are added to a running Pod specifically for interactive debugging, without restarting it. Init containers run before the app and can't help a live one; changing restartPolicy or mounting a volume both require recreating the Pod."
        },
        {
          type: "multiple_choice",
          question: "The node running one of your Pods suddenly dies. What happens to that Pod?",
          options: [
            "The same Pod object is rescheduled onto a healthy node unchanged",
            "It is marked for deletion and a controller creates a replacement Pod",
            "The kubelet on another node adopts the Pod and resumes its old UID",
            "It stays Running until the original node comes back online again"
          ],
          correct_option: "B",
          explanation: "A given Pod is never moved between nodes. Once its node is lost, the Pod is scheduled for deletion, and its controller creates a near-identical replacement Pod — with a new UID — elsewhere. Pods are disposable; identity is not preserved across this swap."
        }
      ]
    },
    {
      category: "transfer_synthesis",
      questions: [
        {
          type: "flashcard",
          question: "How does a Pod relate to a Deployment?",
          answer: "A Deployment manages a ReplicaSet, which in turn creates and maintains Pods from a Pod template. The Deployment supplies scaling, rolling updates, and self-healing, while the Pod is the unit that actually runs the containers.",
          difficulty: "hard"
        },
        {
          type: "multiple_choice",
          question: "Why are liveness and readiness probes configured per container rather than once for the whole Pod?",
          options: [
            "Because a Pod can only ever contain exactly one container",
            "Because probes execute on the control plane, not on the node",
            "Because containers have independent states and roles in a Pod",
            "Because the Pod phase already covers Pod-level health checks"
          ],
          correct_option: "C",
          explanation: "Each container has its own state and job, so probes target containers individually: readiness gates traffic to that container, while liveness restarts it if it hangs. A Pod can hold several containers, and the coarse Pod phase isn't a substitute for probes."
        },
        {
          type: "flashcard",
          question: "Why does scaling an application mean running more Pods rather than adding containers to one Pod?",
          answer: "Each Pod is meant to run a single instance of an application, so you scale horizontally by replicating Pods (usually via a controller). Extra containers in one Pod are for tightly-coupled helpers that must share the Pod's resources, not for adding capacity.",
          difficulty: "hard"
        }
      ]
    }
  ]
});
