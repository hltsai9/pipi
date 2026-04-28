registerStructuredQuiz({
  collection: "tooling",
  key: "skill-authoring-best-practices",
  title: "Skill Authoring Best Practices",
  icon: "B",
  description: "How to write SKILL.md files that fire reliably, scope cleanly, and stay maintainable.",
  createdAt: "2026-04-28T06:25:00Z",
  updatedAt: "2026-04-28T06:25:00Z",
  sections: [
    {
      category: "priming",
      questions: [
        {
          type: "open_ended",
          question: "Before reading: what do you think makes a 'good' SKILL.md? Is it primarily about length, specificity of the description, examples, scope discipline — or something else?",
          difficulty: "easy"
        },
        {
          type: "open_ended",
          question: "Predict the failure mode of a skill whose description is something generic like 'use for software development tasks.' What goes wrong, and how would you notice?",
          difficulty: "medium"
        },
        {
          type: "open_ended",
          question: "If you shipped a skill and discovered it fires on the wrong kinds of requests, where's the first place you'd look — body, frontmatter, scope, or somewhere else? Why?",
          difficulty: "medium"
        }
      ]
    },
    {
      category: "comprehension",
      questions: [
        {
          type: "flashcard",
          question: "What is the primary job of the frontmatter `description` field?",
          answer: "It is the trigger surface. Claude matches the user's request against it to decide whether to invoke the skill — so it has to capture both what the skill does and how users actually phrase requests for it.",
          difficulty: "easy"
        },
        {
          type: "flashcard",
          question: "Why should the description mirror user phrasing rather than internal jargon?",
          answer: "Because Claude routes by matching the user's words to the description. If users say 'deploy the app' but the description only says 'orchestrate canary release pipelines,' the skill won't fire.",
          difficulty: "easy"
        },
        {
          type: "flashcard",
          question: "What's the rule of thumb for skill scope?",
          answer: "One skill, one concern. Cohesive, focused skills route reliably; mega-skills that try to cover code review, deployment, and incident triage bleed across requests and become unmaintainable.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "When should a skill be project-scoped vs user-scoped?",
          answer: "Project-scoped (.claude/skills/) when the instructions are repo-specific (this project's conventions). User-scoped (~/.claude/skills/) when the same workflow applies across projects on your machine.",
          difficulty: "easy"
        },
        {
          type: "flashcard",
          question: "Why include an explicit 'out of scope' section in a skill?",
          answer: "It tells Claude what NOT to do when the skill fires — preventing scope creep, keeping the skill predictable, and making it safer to invoke. Implicit scope tends to drift.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "What's the practical test for 'are my trigger phrases concrete enough'?",
          answer: "Read the description out loud as if you were a user typing the request. If the phrasing feels like marketing copy or jargon ('orchestrate enterprise pipelines'), it's not concrete enough.",
          difficulty: "medium"
        }
      ]
    },
    {
      category: "application",
      questions: [
        {
          type: "multiple_choice",
          question: "You're writing a skill that helps deploy microservices to Kubernetes. Which description is the best fit?",
          options: [
            "Use for any general deployment-related task in this codebase",
            "The world's best DevOps skill — use for any DevOps-shaped work",
            "Use only when the user invokes the /deploy slash command",
            "Author k8s manifests, debug rollouts, deploy services to staging/prod"
          ],
          correct_option: "D",
          explanation: "A good description names the concrete tasks and likely user phrasings. 'Use for deployment tasks' is too vague (over-fires); the slash-command framing is too narrow (descriptions are not invocation guards); the marketing one provides no useful routing signal.",
          difficulty: "medium"
        },
        {
          type: "multiple_choice",
          question: "Your frontmatter description packs in 12 trigger phrases plus a 200-word usage explanation. Most likely problem?",
          options: [
            "The body is too short — Claude has no instruction text to follow",
            "Frontmatter is bloated; over-fire risk plus poor signal-to-noise",
            "Markdown will render the frontmatter block as a top-level heading",
            "YAML cannot represent that many phrases in a single description field"
          ],
          correct_option: "B",
          explanation: "A bloated description matches too much, making the skill greedy on routing. It also dilutes the signal — Claude can't tell what the skill is really for. YAML handles the text fine; the issue is *quality*, not capacity.",
          difficulty: "medium"
        },
        {
          type: "multiple_choice",
          question: "A teammate proposes one mega-skill covering code review, deploy, and incident triage. Cleaner approach?",
          options: [
            "Build it as one big skill with H2-headed sections per concern",
            "Use CLAUDE.md instead, since it loads in every session globally",
            "Split it into three skills, each with its own focused description",
            "Keep one skill but split the body using top-level routing logic"
          ],
          correct_option: "C",
          explanation: "Three concerns means three trigger surfaces. Splitting lets each description match its own user phrasing cleanly. Stuffing routing into a single body forces Claude to pick a sub-mode after invocation, which is brittle compared to letting the description do the routing.",
          difficulty: "medium"
        },
        {
          type: "multiple_choice",
          question: "Your skill's workflow needs a validation script to run as part of the steps. Best pattern?",
          options: [
            "Inline the script's full source code directly in the SKILL.md body",
            "Bundle the script in the skill folder; reference it by relative path",
            "Tell the user to copy-paste the script and run it manually first",
            "Store the script as a code block inside the project's CLAUDE.md"
          ],
          correct_option: "B",
          explanation: "Helper files ship alongside SKILL.md and stay version-locked with the instructions. Inlining the source bloats the body and gets stale; copy-paste invites drift; CLAUDE.md is project-wide context, not a script store.",
          difficulty: "easy"
        },
        {
          type: "multiple_choice",
          question: "You notice your skill is firing on tangential requests it shouldn't. Most direct fix?",
          options: [
            "Tighten the description to name the specific task and required context",
            "Add a 'STOP — only fire if X' instruction at the top of the body",
            "Move the skill to user scope so it loads less frequently overall",
            "Add more body text so Claude takes longer to decide whether to fire"
          ],
          correct_option: "A",
          explanation: "Routing happens at the description, not the body. By the time Claude is reading the body, the skill has already fired. A 'STOP' instruction in the body is a guard at the wrong layer; scope and length don't affect routing logic.",
          difficulty: "medium"
        }
      ]
    },
    {
      category: "transfer_synthesis",
      questions: [
        {
          type: "flashcard",
          question: "How does the principle 'the description IS the trigger' shape how you structure a SKILL.md?",
          answer: "It forces you to put routing intent into the description and operational instructions into the body, with no overlap. You can't bolt triggers on later via body conditions — you must capture them up front.",
          difficulty: "hard"
        },
        {
          type: "multiple_choice",
          question: "You inherit a 600-line SKILL.md that nobody can edit safely. Best path forward?",
          options: [
            "Add inline comments explaining each section so others can edit it",
            "Move it to user scope so it is only loaded on-demand by Claude",
            "Convert it to a Python script the user invokes when needed",
            "Split it into two or three smaller skills, each on one concern"
          ],
          correct_option: "D",
          explanation: "A 600-line skill almost always covers multiple concerns; splitting unlocks independent maintenance and gives each piece a focused description. Comments don't fix the routing problem; relocating to user scope just moves the mess; replacing with a script discards the on-demand trigger model.",
          difficulty: "hard"
        },
        {
          type: "flashcard",
          question: "When is a CLAUDE.md instruction a better fit than a skill?",
          answer: "When the instruction needs to apply to every session in a project (repo conventions, env layout, code style). Skills are for on-demand, focused tasks — CLAUDE.md is the always-on baseline.",
          difficulty: "medium"
        }
      ]
    }
  ]
});
