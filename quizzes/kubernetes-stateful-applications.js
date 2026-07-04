registerStructuredQuiz({
  collection: "kubernetes",
  key: "stateful-applications",
  title: "Stateful Applications",
  icon: "A",
  description: "Running real stateful apps hands-on: StatefulSet basics, WordPress + MySQL, Cassandra, and ZooKeeper.",
  createdAt: "2026-07-04T12:00:00Z",
  updatedAt: "2026-07-04T12:00:00Z",
  sections: [
    {
      category: "priming",
      questions: [
        {
          type: "open_ended",
          question: "Before reading anything formal: these tutorials run real databases (MySQL, Cassandra, ZooKeeper) on Kubernetes. What's fundamentally harder about running a database on a cluster than running a stateless web server?",
          difficulty: "easy"
        },
        {
          type: "open_ended",
          question: "Predict: a coordinator like ZooKeeper needs a majority of its members alive to accept writes. How might that requirement shape where you place its Pods and how many disruptions you'd allow at once?",
          difficulty: "medium"
        },
        {
          type: "open_ended",
          question: "A single MySQL Pod owns exactly one disk. Guess why you couldn't just do a normal rolling update — briefly running the old and new Pod together — for it.",
          difficulty: "medium"
        }
      ]
    },
    {
      category: "comprehension",
      questions: [
        {
          type: "flashcard",
          question: "In the StatefulSet Basics tutorial, which two objects do you create, and how are the Pods named?",
          answer: "A headless Service (nginx) and a StatefulSet (web). The Pods get stable ordinal names — web-0, web-1, … — and are created in order.",
          difficulty: "easy"
        },
        {
          type: "flashcard",
          question: "What does the headless Service (clusterIP: None) give you in these examples?",
          answer: "Instead of one virtual IP, a DNS lookup of the Service returns the Pods' individual IPs, and each Pod gets a stable per-Pod DNS name like web-0.nginx.default.svc.cluster.local.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "What happens to a StatefulSet Pod's PersistentVolumeClaim when you delete the Pod?",
          answer: "The Pod is recreated with the same name and identity, and its existing PVC is re-attached, so the data persists. Deleting Pods (or the StatefulSet) does not delete the PVCs automatically.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "In the WordPress + MySQL example, how is the MySQL password supplied?",
          answer: "Through a Secret created by kustomize's secretGenerator in kustomization.yaml; WordPress reads it via the WORDPRESS_DB_PASSWORD environment variable rather than a hard-coded value.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "Why do the WordPress and MySQL Deployments use strategy Recreate?",
          answer: "Each owns a single ReadWriteOnce PVC that can't be mounted by two Pods at once, so the old Pod must be stopped before the new one starts — which rules out an overlapping rolling update.",
          difficulty: "hard"
        },
        {
          type: "flashcard",
          question: "In the Cassandra tutorial, how do new nodes discover the cluster, and how do you check the ring?",
          answer: "A headless Service plus a custom seed provider (KubernetesSeedProvider) let nodes find seeds; each node gets its own volume via volumeClaimTemplates. You inspect the ring with `kubectl exec ... -- nodetool status`.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "What four objects does the ZooKeeper manifest define?",
          answer: "A headless Service, a client Service, a PodDisruptionBudget, and a StatefulSet (zk) with 3 replicas.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "What is a ZooKeeper quorum, and why does it matter?",
          answer: "A majority of the ensemble — for 3 servers, 2 (the leader plus one follower). Without a quorum the ensemble can't accept writes, so keeping a majority available is essential.",
          difficulty: "hard"
        }
      ]
    },
    {
      category: "application",
      questions: [
        {
          type: "multiple_choice",
          question: "You apply the StatefulSet Basics manifest with 3 replicas. In what order do web-0, web-1, and web-2 come up?",
          options: [
            "All three at once, since the headless Service load-balances them evenly",
            "web-2 first, then web-1, then web-0, mirroring how they are torn down",
            "web-0 first; web-1 only once web-0 is Running and Ready, then web-2",
            "In a random order determined by which node has free capacity first"
          ],
          correct_option: "C",
          explanation: "The default OrderedReady policy creates Pods sequentially from ordinal 0, waiting for each to be Running and Ready before the next. Reverse order is how they're deleted, not created; the headless Service doesn't load-balance."
        },
        {
          type: "multiple_choice",
          question: "The ZooKeeper tutorial adds a PodDisruptionBudget with maxUnavailable: 1. What does that protect against?",
          options: [
            "It caps CPU so no single ZooKeeper Pod can starve the others of resources",
            "It stops voluntary disruptions (like node drains) from breaking the quorum",
            "It automatically restarts any ZooKeeper Pod that fails its liveness probe",
            "It limits how many client connections each ZooKeeper server will accept"
          ],
          correct_option: "B",
          explanation: "A PDB bounds voluntary disruptions — e.g. draining nodes — so at most one ensemble member goes down at a time, preserving the majority needed for quorum. It isn't a resource cap, a restart mechanism, or a connection limit."
        },
        {
          type: "multiple_choice",
          question: "The ZooKeeper Pods use anti-affinity so no two share a node. Why does that matter for the ensemble?",
          options: [
            "So a single node failure can't take out enough servers to break the quorum",
            "So each Pod can mount the same shared volume without any file-lock conflicts",
            "So the headless Service can assign each Pod its lower-numbered ordinal first",
            "So rolling updates can proceed in parallel instead of one Pod at a time"
          ],
          correct_option: "A",
          explanation: "Spreading Pods across nodes means losing one node removes at most one member, keeping a majority alive. The Pods don't share a volume, anti-affinity doesn't set ordinals, and it doesn't parallelize the ordered rollout."
        },
        {
          type: "multiple_choice",
          question: "In the WordPress + MySQL example, each Deployment sets strategy Recreate. Why not the usual rolling update?",
          options: [
            "Because Recreate rolls out faster by starting every replacement Pod at once",
            "Because a Deployment can never do a rolling update when it mounts any volume",
            "Because WordPress requires all of its Pods to restart together on every change",
            "Because the single ReadWriteOnce PVC can't be mounted by two Pods at once"
          ],
          correct_option: "D",
          explanation: "A rolling update briefly runs old and new Pods together, but a ReadWriteOnce PVC allows only one Pod to mount it, so the old Pod must stop first — hence Recreate. Recreate is not faster, and volumes don't universally forbid rolling updates."
        },
        {
          type: "multiple_choice",
          question: "You run `kubectl delete statefulset web --cascade=orphan`. What happens?",
          options: [
            "Both the Pods and their PersistentVolumeClaims are removed immediately",
            "The StatefulSet is recreated automatically because orphaned Pods re-adopt it",
            "The Pods are left running and unmanaged, and their PVCs are also left in place",
            "Nothing is deleted until you first scale the StatefulSet down to zero Pods"
          ],
          correct_option: "C",
          explanation: "A non-cascading delete (--cascade=orphan) removes only the StatefulSet object, leaving its Pods running but unmanaged; PVCs are never auto-deleted. Orphaned Pods don't recreate the controller, and no scale-down is required first."
        }
      ]
    },
    {
      category: "transfer_synthesis",
      questions: [
        {
          type: "flashcard",
          question: "Across these tutorials, what common role does the headless Service play?",
          answer: "It gives each Pod a stable, individually-addressable DNS name instead of a single virtual IP, so members of MySQL, Cassandra, or ZooKeeper can find and talk to specific peers — which clustered stateful systems depend on.",
          difficulty: "hard"
        },
        {
          type: "multiple_choice",
          question: "A single-instance MySQL (Recreate + one PVC) and a 3-node ZooKeeper ensemble are both 'stateful.' How do they differ in availability during an update?",
          options: [
            "Both stay fully available, because StatefulSets never cause any downtime at all",
            "MySQL has a brief outage as its one Pod restarts; ZooKeeper keeps a quorum serving",
            "ZooKeeper goes fully down while MySQL keeps serving from its other replica Pods",
            "Neither one can be updated at all once its PersistentVolumeClaim has been bound"
          ],
          correct_option: "B",
          explanation: "The single MySQL Pod must stop and restart (a short outage), while ZooKeeper updates one member at a time and keeps its majority available throughout. MySQL has no extra replicas, and bound PVCs don't block updates."
        },
        {
          type: "flashcard",
          question: "Why is per-Pod persistent storage (volumeClaimTemplates) essential for Cassandra and ZooKeeper but not for a stateless web tier?",
          answer: "Each database node holds a distinct slice of state — its data and logs — that must survive restarts and stay bound to that node's identity. A stateless web Pod stores no such data, so any replica is interchangeable and needs no durable per-Pod volume.",
          difficulty: "hard"
        }
      ]
    }
  ]
});
