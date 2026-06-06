registerStructuredQuiz({
  collection: "tooling",
  key: "harness-engineering",
  title: "Harness Engineering",
  icon: "H",
  description: "Designing the scaffolding around an LLM — the agent loop, context budget, tool surface, and guardrails that turn a model into an agent.",
  createdAt: "2026-06-06T00:25:00Z",
  updatedAt: "2026-06-06T00:25:00Z",
  sections: [
    {
      category: "priming",
      questions: [
        {
          type: "open_ended",
          question: "Before reading: a 'harness' wraps a raw language model and turns it into an agent. What pieces do you think that wrapper has to provide that the model itself does not?",
          difficulty: "easy"
        },
        {
          type: "open_ended",
          question: "An agent runs for 40 turns and the model 'forgets' an instruction it followed correctly at turn 3. Before knowing the mechanism, what would you guess the harness did — or failed to do — to cause that?",
          difficulty: "medium"
        },
        {
          type: "open_ended",
          question: "Predict the failure mode of a harness that hands the model 60 tools with terse, overlapping descriptions. What goes wrong, and where would you look first?",
          difficulty: "medium"
        }
      ]
    },
    {
      category: "comprehension",
      questions: [
        {
          type: "flashcard",
          question: "What is an agent 'harness'?",
          answer: "The scaffolding around the model — the loop that calls it, the context it assembles each turn, the tools it exposes, the parsing of tool calls, and the guardrails. The model reasons; the harness decides what the model sees and what it can do.",
          difficulty: "easy"
        },
        {
          type: "flashcard",
          question: "Describe the basic agent loop a harness runs.",
          answer: "Assemble context → call the model → if it requests a tool, execute the tool and append the result → feed the updated context back → repeat until the model emits a final answer or a stop condition fires.",
          difficulty: "easy"
        },
        {
          type: "flashcard",
          question: "Why is context management the central job of a harness?",
          answer: "The context window is finite and every turn adds to it. The harness must decide what to include, trim, or summarize so the relevant signal stays in-window — otherwise instructions and earlier results get pushed out or buried.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "What is context compaction (or summarization) in a harness?",
          answer: "When the running context approaches the window limit, the harness condenses older turns into a summary and continues from there — preserving the gist of prior work while freeing tokens for new turns.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "Why does the harness, not the model, enforce permissions and tool guardrails?",
          answer: "The model only emits a request to call a tool; it cannot actually run anything. The harness mediates execution, so that is the only place a permission check, allowlist, or sandbox can reliably sit.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "What's the difference between a 'tool' and the model's ability to 'use' it?",
          answer: "A tool is a typed interface the harness exposes and executes. The model can only request it by name with arguments. The harness validates the arguments, runs the tool, and returns the result into context — the model never touches the system directly.",
          difficulty: "medium"
        }
      ]
    },
    {
      category: "application",
      questions: [
        {
          type: "multiple_choice",
          question: "Your agent reliably follows a system instruction early but violates it after ~30 tool calls. Most likely harness-level cause?",
          options: [
            "The model was fine-tuned to ignore long-standing system prompts",
            "The instruction scrolled out of the window or got buried by tool output",
            "The temperature setting drifts upward automatically as the loop runs",
            "Tool results are immutable, so the model cannot reread the instruction"
          ],
          correct_option: "B",
          explanation: "As tool outputs accumulate, early context gets pushed toward (or past) the window edge, weakening its influence. The fix is harness-side: re-inject or pin the instruction, or compact intervening output. Temperature doesn't auto-drift, and the model can reread anything still in-window.",
          difficulty: "medium"
        },
        {
          type: "multiple_choice",
          question: "You expose 60 tools, many with overlapping one-line descriptions. The agent keeps picking the wrong one. Best first fix?",
          options: [
            "Lower the model temperature so its tool choices become deterministic",
            "Raise the per-turn token limit so more tools fit in the prompt",
            "Disambiguate descriptions and prune or group overlapping tools",
            "Retry every failed tool call automatically up to four times"
          ],
          correct_option: "C",
          explanation: "Tool selection is a routing problem driven by the descriptions the harness presents. Clear, non-overlapping descriptions and a smaller, well-grouped surface fix it directly. Temperature and retries treat symptoms; raising token limits doesn't make ambiguous descriptions distinguishable.",
          difficulty: "medium"
        },
        {
          type: "multiple_choice",
          question: "A tool returns a 200KB log file and your next model call errors on context length. Best harness response?",
          options: [
            "Truncate or summarize the tool result before appending it to context",
            "Drop the system prompt to make room for the full tool output",
            "Forward the entire log and let the model decide what to ignore",
            "Switch to a model with a smaller context so it fails faster"
          ],
          correct_option: "A",
          explanation: "Large tool outputs are a primary cause of context blowups; the harness should bound them — truncate, paginate, or summarize — before they enter context. Dropping the system prompt sacrifices behavior you need, and forwarding everything just reproduces the overflow.",
          difficulty: "medium"
        },
        {
          type: "multiple_choice",
          question: "What most distinguishes a good harness from simply calling the model in a `while` loop?",
          options: [
            "It uses a larger model so individual answers are higher quality",
            "It curates context, mediates tools, and defines clear stop conditions",
            "It always summarizes after every single turn to save token cost",
            "It prevents the model from ever calling more than one tool per turn"
          ],
          correct_option: "B",
          explanation: "The value of a harness is in deliberate context curation, safe tool mediation, and knowing when to stop. A bare loop has none of these. Model size is orthogonal; summarizing every turn is wasteful; and capping tools per turn is a narrow policy, not the defining trait.",
          difficulty: "easy"
        },
        {
          type: "multiple_choice",
          question: "Your agent occasionally enters an infinite loop, re-running the same tool with the same arguments. Which harness mechanism most directly prevents this?",
          options: [
            "A higher temperature to inject randomness into repeated calls",
            "A longer system prompt instructing the model not to repeat itself",
            "A bigger context window so the duplicate calls all fit at once",
            "A stop condition that detects repetition or caps total iterations"
          ],
          correct_option: "D",
          explanation: "Loop detection and an iteration/no-progress cap are harness responsibilities — the loop's terminal state has to be enforced outside the model. Prompt wording helps weakly at best, randomness can mask but not stop the loop, and a bigger window just lets the loop run longer.",
          difficulty: "medium"
        }
      ]
    },
    {
      category: "transfer_synthesis",
      questions: [
        {
          type: "flashcard",
          question: "How does the principle 'the harness owns context' connect to why skill descriptions, not bodies, control routing?",
          answer: "Both reflect the same layering: the harness decides what enters the model's context and when. A skill's body is only read after the harness has already routed to it via the description — just as a system instruction only matters while the harness keeps it in-window.",
          difficulty: "hard"
        },
        {
          type: "multiple_choice",
          question: "You're scaling an agent from short tasks to multi-hour sessions. Which harness change matters most for keeping behavior stable?",
          options: [
            "Switch to a smaller, faster model to reduce per-turn latency",
            "Disable all tools so the model cannot take irreversible actions",
            "Add context compaction that preserves goals and pinned instructions",
            "Increase temperature so the agent explores more solution paths"
          ],
          correct_option: "C",
          explanation: "Long sessions overflow the window; compaction that retains goals and pinned instructions is what preserves continuity. A smaller model trades away capability, disabling tools defeats the agent's purpose, and higher temperature increases drift rather than stability.",
          difficulty: "hard"
        },
        {
          type: "flashcard",
          question: "Why can improving the harness sometimes beat upgrading the model for agent reliability?",
          answer: "Many agent failures are context and control failures — buried instructions, overflowing tool output, missing stop conditions — not reasoning failures. A better harness fixes those directly, whereas a stronger model still loses instructions that the harness lets scroll out of context.",
          difficulty: "hard"
        }
      ]
    }
  ]
});
