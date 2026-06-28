registerStructuredQuiz({
  collection: "kubernetes",
  key: "statefulsets",
  title: "StatefulSets",
  icon: "T",
  description: "A structured study set on StatefulSets: priming, comprehension, application, synthesis.",
  createdAt: "2026-06-28T11:00:00Z",
  updatedAt: "2026-06-28T11:00:00Z",
  sections: [
    {
      category: "priming",
      questions: [
        {
          type: "open_ended",
          question: "Before reading anything formal: a Deployment treats its Pods as interchangeable. What kinds of applications would break if you couldn't tell one replica from another, or if a replica lost its disk every time it restarted?",
          difficulty: "easy"
        },
        {
          type: "open_ended",
          question: "Predict: if each replica needs its own stable disk and a fixed name like 'node-0', what would the system have to guarantee whenever it creates, restarts, or reschedules those Pods?",
          difficulty: "medium"
        },
        {
          type: "open_ended",
          question: "Many databases start a 'primary' before its 'replicas' and shut them down in a careful order. Guess why the order in which Pods start up and tear down might matter for stateful systems.",
          difficulty: "medium"
        }
      ]
    },
    {
      category: "comprehension",
      questions: [
        {
          type: "flashcard",
          question: "What is a StatefulSet, and how does it differ from a Deployment?",
          answer: "A workload controller for stateful apps that gives each Pod a sticky, persistent identity — a stable name, network ID, and storage that survive rescheduling. Deployment Pods are interchangeable; StatefulSet Pods are not.",
          difficulty: "easy"
        },
        {
          type: "flashcard",
          question: "What four guarantees does a StatefulSet provide?",
          answer: "Stable, unique network identifiers; stable, persistent storage; ordered, graceful deployment and scaling; and ordered, automated rolling updates.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "How are StatefulSet Pods named and addressed?",
          answer: "As <statefulset-name>-<ordinal> (web-0, web-1, …). Each Pod gets a stable hostname and DNS record through the governing headless Service: <pod>.<service>.<namespace>.svc.cluster.local.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "Why does a StatefulSet require a headless Service?",
          answer: "The headless Service (named via serviceName) controls the Pods' network domain and gives each Pod its own stable DNS name and direct IP, rather than load-balancing traffic across them behind one virtual IP.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "How does stable storage work through volumeClaimTemplates?",
          answer: "Each Pod gets its own PersistentVolumeClaim generated from the template, bound to that Pod's ordinal. The same PVC and volume are re-attached to the Pod's identity across rescheduling, and PVCs are retained by default when Pods are removed.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "What is the default deployment and scaling order (OrderedReady)?",
          answer: "Pods are created sequentially from ordinal 0 to N-1, each waiting until its predecessor is Running and Ready. Scale-down and deletion go in reverse, from the highest ordinal down to 0.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "What are the two pod management policies?",
          answer: "OrderedReady (the default), which starts and stops Pods one at a time in ordinal order with readiness gating, and Parallel, which launches or terminates all Pods at once without waiting for ordering.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "What are the two update strategies, and what does partition do?",
          answer: "RollingUpdate (default), which updates Pods one at a time from the highest ordinal down, and OnDelete, where you manually delete Pods to apply the new template. A partition restricts RollingUpdate to Pods with ordinal ≥ the partition value, enabling staged or canary rollouts.",
          difficulty: "hard"
        }
      ]
    },
    {
      category: "application",
      questions: [
        {
          type: "multiple_choice",
          question: "You create a StatefulSet named `db` with 3 replicas. What are the Pod names, and are they stable?",
          options: [
            "Random hashes like db-7f9c2 that change whenever a Pod restarts",
            "db-0, db-1, db-2, but the names are reassigned randomly on reschedule",
            "db-0, db-1, db-2, and each keeps its name and identity across restarts",
            "Three Pods that share the single hostname db for load balancing"
          ],
          correct_option: "C",
          explanation: "StatefulSet Pods get stable ordinal names (db-0, db-1, db-2) that stick to the same identity and storage across restarts and rescheduling. Random, changing names are how a Deployment's ReplicaSet behaves, not a StatefulSet."
        },
        {
          type: "multiple_choice",
          question: "Why must you pair a StatefulSet with a headless Service?",
          options: [
            "To give each Pod a stable DNS name instead of load-balancing across them",
            "To provide a single virtual IP that round-robins requests across the Pods",
            "To store the StatefulSet's revision history outside of the cluster's etcd",
            "To force the scheduler to place every replica onto the very same node"
          ],
          correct_option: "A",
          explanation: "A headless Service has no cluster IP and returns each Pod's own address, giving every Pod a stable per-Pod DNS name. A normal (non-headless) Service would load-balance behind one virtual IP, which defeats stable identity."
        },
        {
          type: "multiple_choice",
          question: "You scale a StatefulSet down from 5 to 3 replicas. By default, what happens to the PersistentVolumeClaims of the removed Pods?",
          options: [
            "They are deleted immediately along with their Pods and underlying volumes",
            "They are retained by default, so the data survives if you scale back up",
            "They are merged into the remaining Pods' claims to avoid wasting storage",
            "They are turned into snapshots and then the original volumes are released"
          ],
          correct_option: "B",
          explanation: "The default PVC retention policy is Retain, so a scaled-down Pod's PVC (and its data) is kept; scaling back up reattaches it to the same ordinal. Auto-deletion only happens if you opt in via the whenScaled/whenDeleted retention policy."
        },
        {
          type: "multiple_choice",
          question: "A StatefulSet with the default update strategy gets a new container image. In what order are its Pods updated?",
          options: [
            "All Pods at once, since image updates don't need ordering guarantees",
            "In ascending ordinal order, from Pod 0 upward to the highest ordinal",
            "Only after you manually delete each Pod to trigger its replacement",
            "In descending ordinal order, highest first, one at a time when ready"
          ],
          correct_option: "D",
          explanation: "RollingUpdate (the default) recreates Pods from the largest ordinal down to 0, one at a time, waiting for each updated Pod to be Running and Ready before moving to its predecessor. Manual deletion is the OnDelete strategy."
        },
        {
          type: "multiple_choice",
          question: "Your stateful Pods are independent of each other and you want them all to start at once rather than waiting through the ordinals in sequence. What do you set?",
          options: [
            "updateStrategy: OnDelete, so that Pods update without any ordering",
            "A headless Service with clusterIP set to a fixed virtual address",
            "podManagementPolicy: Parallel, so Pods launch without waiting in order",
            "revisionHistoryLimit: 0, to disable the ordered rollout machinery"
          ],
          correct_option: "C",
          explanation: "podManagementPolicy: Parallel tells the controller to create and delete all Pods at once without the OrderedReady sequencing. OnDelete only affects updates, a headless Service isn't about ordering, and revisionHistoryLimit just trims old revisions."
        }
      ]
    },
    {
      category: "transfer_synthesis",
      questions: [
        {
          type: "flashcard",
          question: "How does a StatefulSet's per-Pod storage differ from a Deployment sharing one PVC?",
          answer: "volumeClaimTemplates give each StatefulSet Pod its own PVC, bound to that Pod's ordinal, so every replica has private, stable storage that follows its identity across rescheduling. A Deployment can't hand each replica its own persistent volume that travels with it.",
          difficulty: "hard"
        },
        {
          type: "multiple_choice",
          question: "Why does the default OrderedReady policy wait for Pod N to be Running and Ready before creating Pod N+1?",
          options: [
            "Because Kubernetes can only schedule one Pod onto a node at a time",
            "Because stateful systems often need earlier members healthy before peers join",
            "Because PVCs can only be provisioned strictly one at a time per node",
            "Because the headless Service can register only one Pod's DNS at a time"
          ],
          correct_option: "B",
          explanation: "Ordered, readiness-gated startup matches how clustered stateful apps form — a primary or seed member must be up before followers join. The other options aren't real constraints; scheduling, provisioning, and DNS registration are not serialized like this."
        },
        {
          type: "flashcard",
          question: "When should you choose a Deployment instead of a StatefulSet?",
          answer: "When your Pods are stateless and interchangeable, with no need for stable identity, ordered rollout, or per-Pod persistent storage. Deployments are simpler and update faster; reserve StatefulSets for apps that truly need sticky identity or storage.",
          difficulty: "hard"
        }
      ]
    }
  ]
});
