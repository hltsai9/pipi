registerStructuredQuiz({
  collection: "tooling",
  key: "claude-code-skills",
  title: "Claude Code Skills",
  icon: "S",
  description: "What skills are, how Claude Code loads them, and how to write a SKILL.md that actually fires.",
  createdAt: "2026-04-26T21:00:00Z",
  updatedAt: "2026-04-26T21:00:00Z",
  sections: [
    {
      category: "priming",
      questions: [
        {
          type: "open_ended",
          question: "Before reading anything: how would you guess Claude decides whether to use a 'skill' on a given user request, given that there can be many skills installed?",
          difficulty: "easy"
        },
        {
          type: "open_ended",
          question: "If you wanted Claude Code to behave consistently across one specific repo (lint conventions, deploy commands, etc.) — would you use a skill, CLAUDE.md, settings, or something else? Sketch the tradeoffs.",
          difficulty: "medium"
        },
        {
          type: "open_ended",
          question: "Predict: what's the single most common reason a freshly-written skill never fires when the user phrases a relevant request?",
          difficulty: "medium"
        }
      ]
    },
    {
      category: "comprehension",
      questions: [
        {
          type: "flashcard",
          question: "Where does a project-scoped skill live in a repository?",
          answer: "At .claude/skills/<skill-name>/SKILL.md, inside the repo root. The folder name and the frontmatter `name` typically match.",
          difficulty: "easy"
        },
        {
          type: "flashcard",
          question: "Which two YAML frontmatter fields does a SKILL.md require?",
          answer: "`name` and `description`. The name identifies the skill; the description tells Claude when to invoke it.",
          difficulty: "easy"
        },
        {
          type: "flashcard",
          question: "Where do user-scoped skills live, and how are they different from project-scoped?",
          answer: "At ~/.claude/skills/<name>/SKILL.md. They are available across every project on the machine, while project-scoped skills only apply inside their repo.",
          difficulty: "easy"
        },
        {
          type: "flashcard",
          question: "What is the role of the `description` field in a skill's frontmatter?",
          answer: "It is what Claude matches against the user's request to decide whether to invoke the skill. Effective descriptions name the task and include the kinds of phrases users will actually say.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "What goes in the body of SKILL.md (after the frontmatter)?",
          answer: "Markdown instructions Claude reads and follows after the skill is invoked: when to use it, the steps to perform, schemas, and what's out of scope.",
          difficulty: "easy"
        },
        {
          type: "flashcard",
          question: "How is a skill invoked at runtime?",
          answer: "Via the Skill tool, with the skill's name as an argument. The tool loads the SKILL.md body into the conversation so Claude can follow it.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "Can a skill ship with helper files alongside SKILL.md?",
          answer: "Yes. Other files in the skill's folder (scripts, references, examples) are bundled with the skill and can be referenced from SKILL.md by relative path.",
          difficulty: "medium"
        }
      ]
    },
    {
      category: "application",
      questions: [
        {
          type: "multiple_choice",
          question: "You want a skill to fire on phrases like 'deploy the app' or 'ship to staging.' Where do those phrases belong?",
          options: [
            "In the body of SKILL.md, listed as triggers Claude must match literally",
            "In a separate triggers.json file in the same folder as SKILL.md",
            "In the frontmatter description, where Claude uses them to decide invocation",
            "In the project's CLAUDE.md so the phrases apply to every Claude Code session"
          ],
          correct_option: "C",
          explanation: "The frontmatter description is the *only* trigger surface — Claude matches the user's request against it. There is no separate triggers file, and CLAUDE.md is project-wide context, not a skill router.",
          difficulty: "medium"
        },
        {
          type: "multiple_choice",
          question: "A teammate copies SKILL.md without the YAML frontmatter and reports the skill never fires. Most likely reason?",
          options: [
            "The body is too long for Claude to load on each invocation cycle",
            "Skills require Python or another runtime; plain markdown is not sufficient",
            "The SKILL.md filename must be entirely lower-case for the loader to see it",
            "Without frontmatter, there's no name or description for Claude to match against"
          ],
          correct_option: "D",
          explanation: "Frontmatter is what registers the skill in Claude's available list. Without it, Claude has no description to match the user's request against — the skill effectively doesn't exist. Body length and casing aren't the issue here, and skills are pure markdown.",
          difficulty: "medium"
        },
        {
          type: "multiple_choice",
          question: "You want one skill to be available in every project on your laptop, not just this repo. Where do you put it?",
          options: [
            "Copy .claude/skills/<name>/SKILL.md into every project root individually",
            "Place it at ~/.claude/skills/<name>/SKILL.md in your home directory",
            "Paste the SKILL.md body into the system prompt of every Claude Code session",
            "Add a source line to ~/.bashrc so the skill loads when a new shell starts"
          ],
          correct_option: "B",
          explanation: "User-scoped skills live under `~/.claude/skills/` and load in any project. Per-project copies work but defeat the point. The system prompt and shell rc files have nothing to do with how skills are loaded.",
          difficulty: "easy"
        },
        {
          type: "multiple_choice",
          question: "Your skill has solid step-by-step instructions but Claude never invokes it on requests it should obviously handle. The likeliest fix?",
          options: [
            "Trim the SKILL.md body — the loader rejects skills past a body length cap",
            "Rename SKILL.md to CLAUDE.md so the loader picks it up correctly",
            "Rewrite the description to include the phrases users actually use",
            "Add a /skills slash command to the project so the skill becomes invokable"
          ],
          correct_option: "C",
          explanation: "A skill that doesn't fire is almost always a description problem — the trigger surface didn't match the user's wording. Filename must stay SKILL.md, there's no body length cap to trim against, and slash commands aren't the routing mechanism.",
          difficulty: "medium"
        }
      ]
    },
    {
      category: "transfer_synthesis",
      questions: [
        {
          type: "flashcard",
          question: "How does a skill differ from instructions placed in CLAUDE.md?",
          answer: "CLAUDE.md is project-wide context loaded into every session by default. A skill is specialized instructions loaded *on demand* — only when its description matches the user's request — keeping the default context smaller.",
          difficulty: "medium"
        },
        {
          type: "multiple_choice",
          question: "You've duplicated the same long set of conventions across three projects' CLAUDE.md files. What's the cleanest move?",
          options: [
            "Extract it as a user-scoped skill at ~/.claude/skills/<name>/ so any project can invoke it",
            "Push the duplicated conventions into each project's git history with a header comment",
            "Move the conventions into a shared Python script the user runs before each session",
            "Save the conventions to a team Slack channel so people can paste them as needed"
          ],
          correct_option: "A",
          explanation: "A user-scoped skill is exactly the right abstraction: shared instructions, loaded only on demand, available everywhere. Stuffing them into git history doesn't deduplicate, and Slack/scripts are out-of-band workarounds — not how Claude actually loads context.",
          difficulty: "hard"
        },
        {
          type: "flashcard",
          question: "What's the single most load-bearing line in any SKILL.md, and why?",
          answer: "The frontmatter `description`. It's both the discovery mechanism (Claude lists skills by it) and the trigger (Claude matches the user's request against it). A vague or omitted description is the most common reason a skill never fires.",
          difficulty: "medium"
        }
      ]
    }
  ]
});
