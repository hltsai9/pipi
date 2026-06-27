registerStructuredQuiz({
  collection: "kubernetes",
  key: "storage",
  title: "Storage",
  icon: "S",
  description: "A structured study set on storage: priming, comprehension, application, synthesis.",
  createdAt: "2026-06-27T19:10:00Z",
  updatedAt: "2026-06-27T19:10:00Z",
  sections: [
    {
      category: "priming",
      questions: [
        {
          type: "open_ended",
          question: "Before reading anything formal: a container's filesystem is wiped when the container restarts. What problems does that create for real applications, and how might a 'volume' abstraction help?",
          difficulty: "easy"
        },
        {
          type: "open_ended",
          question: "Predict: why might it be useful to split storage into two separate objects — 'a request for storage' and 'the actual piece of storage' — instead of one combined thing?",
          difficulty: "medium"
        },
        {
          type: "open_ended",
          question: "Imagine a cluster where every app needs a disk on demand, without an admin manually preparing one first. What would have to exist behind the scenes to make that automatic?",
          difficulty: "medium"
        }
      ]
    },
    {
      category: "comprehension",
      questions: [
        {
          type: "flashcard",
          question: "How does a Volume's lifetime relate to its containers versus its Pod?",
          answer: "A volume shares the Pod's lifetime and outlives any individual container, so its data survives container restarts. Ephemeral volumes are destroyed when the Pod goes away; persistent volumes are not.",
          difficulty: "easy"
        },
        {
          type: "flashcard",
          question: "What is the difference between a PersistentVolume and a PersistentVolumeClaim?",
          answer: "A PV is a piece of cluster storage (provisioned by an admin or dynamically); a PVC is a user's request for storage, specifying size and access mode. PVCs consume PVs much as Pods consume node resources.",
          difficulty: "easy"
        },
        {
          type: "flashcard",
          question: "What are the four PersistentVolume access modes?",
          answer: "ReadWriteOnce (read-write by a single node), ReadOnlyMany (read-only by many nodes), ReadWriteMany (read-write by many nodes), and ReadWriteOncePod (read-write by a single Pod).",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "What does a StorageClass describe?",
          answer: "A 'class' of storage, defined by a provisioner, parameters, reclaim policy, and binding mode. It lets admins offer tiers of storage and is what makes dynamic provisioning possible.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "What is dynamic volume provisioning?",
          answer: "Storage volumes are created on demand from a StorageClass the moment a PVC requests them, instead of an administrator pre-creating PersistentVolumes by hand.",
          difficulty: "easy"
        },
        {
          type: "flashcard",
          question: "What are the PersistentVolume reclaim policies?",
          answer: "Retain (keep the volume and data for manual cleanup), Delete (remove the underlying storage when the claim is gone), and the deprecated Recycle (scrub and reuse).",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "What is the Container Storage Interface (CSI)?",
          answer: "A standard that lets external storage vendors expose block and file storage to Kubernetes through plugins, replacing the older in-tree volume drivers built into Kubernetes itself.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "What does volumeBindingMode: WaitForFirstConsumer do?",
          answer: "It delays binding and provisioning a PersistentVolume until a Pod that uses the PVC is scheduled, so the volume can be created with the right topology (the Pod's zone or node).",
          difficulty: "hard"
        }
      ]
    },
    {
      category: "application",
      questions: [
        {
          type: "multiple_choice",
          question: "A PVC is bound with the access mode ReadWriteOnce. What does that actually permit?",
          options: [
            "Read-write access from exactly one Pod, even within a single node",
            "Read-only mounting by many Pods spread across several nodes at once",
            "Read-write mounting by Pods, but only from a single node at a time",
            "Read-write access from any node, with writes serialized by the volume"
          ],
          correct_option: "C",
          explanation: "ReadWriteOnce allows read-write mounting from a single node (multiple Pods on that node can share it). Restricting to one Pod is ReadWriteOncePod; read-only from many nodes is ReadOnlyMany; there is no built-in cross-node write serialization."
        },
        {
          type: "multiple_choice",
          question: "You use an emptyDir volume in a Pod. When is its data deleted?",
          options: [
            "When the Pod's first container restarts after a crash or update",
            "When the Pod is removed from the node it was running on",
            "When the node reboots, even if the Pod is later rescheduled back",
            "Never automatically; an admin must clean the directory by hand"
          ],
          correct_option: "B",
          explanation: "An emptyDir lives as long as the Pod runs on that node and is deleted when the Pod is removed. It deliberately survives container restarts within the Pod, which is the opposite of option A."
        },
        {
          type: "multiple_choice",
          question: "A PVC is dynamically provisioned through a StorageClass that doesn't set a reclaim policy. What happens to the underlying storage when the PVC is deleted?",
          options: [
            "It is deleted, because dynamically provisioned volumes default to Delete",
            "It is retained, because Retain is the default for every StorageClass",
            "It is recycled and scrubbed, then offered back to the next claim",
            "It stays Bound until an administrator manually releases it from the PVC"
          ],
          correct_option: "A",
          explanation: "Dynamically provisioned PVs default to the Delete reclaim policy, so the backing storage is removed with the claim. Retain is not the default, and Recycle is deprecated; nothing keeps the volume Bound after the PVC is gone."
        },
        {
          type: "multiple_choice",
          question: "Several Pods running on different nodes must all write to the same volume simultaneously. Which access mode do you need?",
          options: [
            "ReadWriteOnce, mounted by each node in turn as it needs the volume",
            "ReadOnlyMany, since several different nodes are involved in the access",
            "ReadWriteOncePod, to let each individual Pod take its turn writing data",
            "ReadWriteMany, which allows many nodes to mount the volume read-write"
          ],
          correct_option: "D",
          explanation: "Concurrent read-write access from multiple nodes requires ReadWriteMany. ReadWriteOnce is limited to one node, ReadOnlyMany forbids writes, and ReadWriteOncePod is the most restrictive — a single Pod only."
        },
        {
          type: "multiple_choice",
          question: "Your storage backend is zone-specific, and you want each volume provisioned in the same zone as the Pod that will use it. Which StorageClass setting helps?",
          options: [
            "Setting reclaimPolicy: Retain so the volume is not deleted too early",
            "Setting allowVolumeExpansion: true so the volume can grow on demand",
            "Setting volumeBindingMode: WaitForFirstConsumer to defer the binding",
            "Setting volumeMode: Block so a raw block device is exposed to the Pod"
          ],
          correct_option: "C",
          explanation: "WaitForFirstConsumer delays provisioning until the Pod is scheduled, letting the provisioner place the volume in the Pod's zone. Reclaim policy, volume expansion, and volume mode address entirely different concerns."
        }
      ]
    },
    {
      category: "transfer_synthesis",
      questions: [
        {
          type: "flashcard",
          question: "How does the PV/PVC split mirror the way Pods consume node compute?",
          answer: "Just as a Pod requests CPU and memory without naming which node provides them, a PVC requests size and access mode without naming which PV or backend satisfies it. A binding layer decouples the request from the supply in both cases.",
          difficulty: "hard"
        },
        {
          type: "multiple_choice",
          question: "A generic ephemeral volume is provisioned by a full storage driver yet disappears when its Pod does. When is it a better fit than a PVC you create yourself?",
          options: [
            "When the data must outlive the Pod and be reused by a later Pod",
            "When you want per-Pod scratch space that still has real storage features",
            "When many Pods across different nodes must share one read-write volume",
            "When an admin has pre-created PVs that should be bound to it manually"
          ],
          correct_option: "B",
          explanation: "Generic ephemeral volumes give per-Pod scratch space with the capabilities of a real storage driver (snapshots, sizing) while being created and deleted with the Pod. Data that must outlive the Pod, or be shared across nodes, calls for an ordinary PVC instead."
        },
        {
          type: "flashcard",
          question: "Why does dynamic provisioning reduce the need for admins to pre-create PersistentVolumes?",
          answer: "Because a StorageClass lets the cluster create a matching PV automatically the instant a PVC requests storage. Admins define a few classes once, rather than hand-provisioning every individual volume.",
          difficulty: "hard"
        }
      ]
    }
  ]
});
