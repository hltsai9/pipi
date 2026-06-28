registerStructuredQuiz({
  collection: "kubernetes",
  key: "deployments",
  title: "Deployments",
  icon: "D",
  description: "A structured study set on Deployments: priming, comprehension, application, synthesis.",
  createdAt: "2026-06-28T10:00:00Z",
  updatedAt: "2026-06-28T10:00:00Z",
  sections: [
    {
      category: "priming",
      questions: [
        {
          type: "open_ended",
          question: "Before reading anything formal: you want to upgrade a running app to a new version with no downtime. What would a system have to do behind the scenes to swap versions gradually rather than all at once?",
          difficulty: "easy"
        },
        {
          type: "open_ended",
          question: "Predict: if a freshly rolled-out version turns out to be broken, what information would the system need to have kept around in order to let you go back to the previous version quickly?",
          difficulty: "medium"
        },
        {
          type: "open_ended",
          question: "You declare 'I want 5 replicas of version 2 of my app.' Guess what objects and steps stand between that single declaration and 5 healthy containers actually running.",
          difficulty: "medium"
        }
      ]
    },
    {
      category: "comprehension",
      questions: [
        {
          type: "flashcard",
          question: "What is a Deployment, and what does it manage?",
          answer: "A controller that provides declarative updates for Pods and ReplicaSets. You describe a desired state, and the Deployment controller changes the actual state to match at a controlled rate. It manages ReplicaSets, which in turn manage Pods.",
          difficulty: "easy"
        },
        {
          type: "flashcard",
          question: "What is the relationship between a Deployment, its ReplicaSets, and Pods?",
          answer: "A Deployment owns one or more ReplicaSets — typically one per template revision — and the active ReplicaSet keeps the desired number of Pods running. You don't manage the ReplicaSets directly; the Deployment does.",
          difficulty: "easy"
        },
        {
          type: "flashcard",
          question: "What are the two Deployment strategy types?",
          answer: "RollingUpdate (the default), which gradually replaces old Pods with new ones, and Recreate, which terminates all existing Pods before creating new ones (incurring downtime).",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "What do maxSurge and maxUnavailable control in a RollingUpdate?",
          answer: "maxSurge caps how many Pods can exist above the desired replica count during the update; maxUnavailable caps how many can be unavailable below it. Both default to 25%.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "When does a Deployment create a new revision?",
          answer: "Only when the Pod template (.spec.template) changes — for example a new container image or changed template labels. Scaling the replica count alone does not create a new revision.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "What is revisionHistoryLimit, and what's its default?",
          answer: "The number of old ReplicaSets the Deployment retains so you can roll back. It defaults to 10. Retained ReplicaSets consume space in etcd and clutter `kubectl get rs`.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "How do you roll a Deployment back to a previous version?",
          answer: "`kubectl rollout undo deployment/<name>` reverts to the previous revision (its prior ReplicaSet); add `--to-revision=N` to target a specific kept revision.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "What must .spec.selector match, and can it change later?",
          answer: "Its matchLabels must match the labels in .spec.template.metadata.labels, since that's how the Deployment finds the Pods it owns. The selector is immutable after the Deployment is created.",
          difficulty: "hard"
        }
      ]
    },
    {
      category: "application",
      questions: [
        {
          type: "multiple_choice",
          question: "You need a zero-downtime upgrade where the old and new versions briefly run side by side. Which strategy fits, and why?",
          options: [
            "Recreate, because it cleanly replaces every Pod in a single step",
            "RollingUpdate, which incrementally swaps Pods so some keep serving",
            "Recreate, because rolling updates always require manual approval first",
            "RollingUpdate, but only after scaling the Deployment down to zero"
          ],
          correct_option: "B",
          explanation: "RollingUpdate replaces Pods incrementally, so capacity keeps serving throughout — exactly what zero-downtime needs. Recreate kills all Pods first (downtime), and you would never scale to zero before a rolling update."
        },
        {
          type: "multiple_choice",
          question: "You run `kubectl scale` to go from 3 to 5 replicas without touching the image. Does this create a new Deployment revision?",
          options: [
            "Yes, because any change to the Deployment object is a new revision",
            "Yes, because adding Pods always starts a fresh ReplicaSet rollout",
            "No, because a revision is created only when the Pod template changes",
            "No, because revisions are created only by an explicit rollout command"
          ],
          correct_option: "C",
          explanation: "Revisions are tied to changes in the Pod template (.spec.template). Scaling changes the replica count, not the template, so no new revision (and no new ReplicaSet) is created."
        },
        {
          type: "multiple_choice",
          question: "In a RollingUpdate with maxUnavailable: 25% on a Deployment of 8 replicas, what does that limit mean?",
          options: [
            "At most 2 Pods may be unavailable below the desired count during the update",
            "At most 2 extra Pods may be created above the desired count of eight",
            "Exactly 2 Pods are always recreated together in each rollout batch",
            "The rollout pauses automatically once 2 Pods have become available"
          ],
          correct_option: "A",
          explanation: "maxUnavailable bounds how far below the desired count availability may drop — 25% of 8 is 2. The 'extra Pods above desired' limit is maxSurge, a separate setting; there is no fixed batch size or auto-pause here."
        },
        {
          type: "multiple_choice",
          question: "A new rollout is failing in production. Which command reverts the Deployment to its previous version?",
          options: [
            "kubectl delete deployment, then re-apply the old manifest by hand",
            "kubectl scale deployment --replicas=0 to drain the bad version",
            "kubectl rollout pause deployment to freeze the broken rollout",
            "kubectl rollout undo deployment to roll back to the prior revision"
          ],
          correct_option: "D",
          explanation: "`kubectl rollout undo` rolls back to the previous kept revision by scaling its ReplicaSet back up. Deleting and re-applying loses history, scaling to zero just causes an outage, and pausing only halts the current rollout."
        },
        {
          type: "multiple_choice",
          question: "You scale a Deployment up while a rolling update is still in progress across two ReplicaSets. How are the new replicas distributed?",
          options: [
            "All new replicas go to the newest ReplicaSet to finish the rollout first",
            "They are spread proportionally, with larger shares to the bigger ReplicaSets",
            "They are split exactly evenly between the old and the new ReplicaSet",
            "Scaling is rejected until the in-progress rollout has fully completed"
          ],
          correct_option: "B",
          explanation: "The Deployment applies proportional scaling: added replicas are spread across the active ReplicaSets in proportion to their sizes (leftovers go to the largest). It neither favors only the newest, splits evenly, nor blocks scaling mid-rollout."
        }
      ]
    },
    {
      category: "transfer_synthesis",
      questions: [
        {
          type: "flashcard",
          question: "How does a Deployment carry out a rolling update using ReplicaSets under the hood?",
          answer: "It creates a new ReplicaSet for the new Pod template and scales it up while scaling the old ReplicaSet down — honoring maxSurge and maxUnavailable — until the new ReplicaSet holds all the desired replicas.",
          difficulty: "hard"
        },
        {
          type: "multiple_choice",
          question: "Why does a Deployment add a layer on top of a ReplicaSet instead of having you manage ReplicaSets directly?",
          options: [
            "Because a ReplicaSet can't keep a set number of Pods running on its own",
            "Because a ReplicaSet runs only one Pod each and can't scale horizontally",
            "Because ReplicaSets don't manage rollouts or rollbacks; Deployments add that",
            "Because ReplicaSets are deprecated and kept only for backward compatibility"
          ],
          correct_option: "C",
          explanation: "A ReplicaSet just maintains a stable set of replicas; it has no rolling-update or rollback logic. The Deployment orchestrates ReplicaSets over time to provide versioned, controlled updates. ReplicaSets are neither single-Pod nor deprecated."
        },
        {
          type: "flashcard",
          question: "Why must .spec.selector be stable and match the template's labels?",
          answer: "The selector is how a Deployment (and its ReplicaSets) finds the Pods it owns. If it doesn't match the template labels, Pods become orphaned or unmanaged — so the selector is immutable after creation to avoid losing track of existing Pods.",
          difficulty: "hard"
        }
      ]
    }
  ]
});
