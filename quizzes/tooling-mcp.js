registerStructuredQuiz({
  collection: "tooling",
  key: "mcp",
  title: "Model Context Protocol (MCP)",
  icon: "M",
  description: "The open standard for connecting AI apps to tools and data — hosts, clients, servers, primitives, and transports.",
  createdAt: "2026-06-27T19:05:00Z",
  updatedAt: "2026-06-27T19:05:00Z",
  sections: [
    {
      category: "priming",
      questions: [
        {
          type: "open_ended",
          question: "Before reading anything formal: integrating an LLM app with N data sources and M tools can mean writing N×M bespoke connectors. What might a shared 'protocol' change about that, and why would standardizing it matter?",
          difficulty: "easy"
        },
        {
          type: "open_ended",
          question: "Predict: if an external server can expose 'tools' that a model is allowed to call, what new safety and trust questions does that raise compared with a model that only generates text?",
          difficulty: "medium"
        },
        {
          type: "open_ended",
          question: "Some MCP features run a server locally as a subprocess; others reach a remote server over the network. Guess two practical differences you'd expect between those two deployment styles.",
          difficulty: "medium"
        }
      ]
    },
    {
      category: "comprehension",
      questions: [
        {
          type: "flashcard",
          question: "What is the Model Context Protocol (MCP)?",
          answer: "An open standard, introduced by Anthropic, for connecting AI applications to external tools, data, and context through a common client-server protocol — reducing custom one-off integrations.",
          difficulty: "easy"
        },
        {
          type: "flashcard",
          question: "What are the three roles in MCP's architecture: host, client, and server?",
          answer: "The host is the AI application (e.g. Claude Desktop or an IDE). It runs one client per server, and each client keeps a dedicated connection to one server. A server is a program that exposes context and capabilities.",
          difficulty: "easy"
        },
        {
          type: "flashcard",
          question: "What are the three server-side primitives MCP servers can expose?",
          answer: "Tools (functions the model can invoke to take actions), resources (data and content the app can read for context), and prompts (reusable templates or workflows).",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "What client-side features can a server make use of, such as sampling and elicitation?",
          answer: "Sampling lets a server ask the host's LLM to generate a completion; elicitation lets a server ask the user for additional input; roots let the client share filesystem boundaries; servers can also send log messages.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "What message format and session model does MCP use?",
          answer: "MCP messages are JSON-RPC 2.0, exchanged within a stateful session. The session opens with an initialization handshake where the two sides negotiate capabilities.",
          difficulty: "medium"
        },
        {
          type: "flashcard",
          question: "What are MCP's two standard transports?",
          answer: "stdio, for a local server run as a subprocess communicating over standard input/output, and Streamable HTTP, for remote servers over the network (which superseded the earlier HTTP+SSE transport).",
          difficulty: "medium"
        }
      ]
    },
    {
      category: "application",
      questions: [
        {
          type: "multiple_choice",
          question: "You want a local MCP server, run as a subprocess on the same machine, with no network exposure. Which transport fits?",
          options: [
            "Streamable HTTP, because every MCP server communicates over HTTP",
            "WebSocket, the only transport MCP defines for low-latency local use",
            "stdio, which talks over the subprocess's standard input and output",
            "gRPC, since MCP is built directly on top of protocol-buffer streams"
          ],
          correct_option: "C",
          explanation: "stdio is designed for a local server launched as a subprocess, exchanging JSON-RPC over stdin/stdout with no network. Streamable HTTP is for remote servers; MCP does not define WebSocket or gRPC transports."
        },
        {
          type: "multiple_choice",
          question: "A weather MCP server wants the model to be able to fetch a live forecast on demand during a conversation. Which primitive should it expose?",
          options: [
            "A resource, since forecasts are read-only context data",
            "A tool, because the model needs to invoke an action with inputs",
            "A prompt, so the user can pick a forecast template to run",
            "A root, to scope which files the server is allowed to read"
          ],
          correct_option: "B",
          explanation: "Tools are model-invocable functions that take parameters and perform actions — exactly what 'fetch a forecast for a city' is. Resources are passive context, prompts are user-selected templates, and roots define filesystem boundaries."
        },
        {
          type: "multiple_choice",
          question: "An MCP server needs a short LLM-generated summary mid-task but has no model of its own. How does MCP let it get one?",
          options: [
            "It embeds its own model, since servers must ship their own LLM",
            "It returns raw data and hopes the host summarizes it afterward",
            "It opens a direct API connection to a provider, bypassing the host",
            "It uses sampling to ask the host's client to run a completion"
          ],
          correct_option: "D",
          explanation: "Sampling lets a server request a completion from the host's LLM through the client, so the server can use model capabilities without bundling or paying for its own. The host stays in control of which model runs and can gate the request."
        },
        {
          type: "multiple_choice",
          question: "In a host that connects to three different MCP servers, how are the client connections arranged?",
          options: [
            "One shared client multiplexes traffic to all three servers at once",
            "The host runs one client per server, each with its own connection",
            "The three servers elect a leader client that proxies for the others",
            "Each server opens a client back into the host to push it context"
          ],
          correct_option: "B",
          explanation: "The host creates a separate client for each server, and every client maintains its own dedicated connection. There is no shared multiplexer, no leader election, and the connection is initiated by the host's client, not the server."
        }
      ]
    },
    {
      category: "transfer_synthesis",
      questions: [
        {
          type: "flashcard",
          question: "Why is MCP often described as 'a USB-C port for AI applications'?",
          answer: "Like a universal port, it replaces many bespoke one-off integrations with a single standard interface: any MCP-compatible host can connect to any MCP server, so tools and data sources are built once and reused everywhere.",
          difficulty: "hard"
        },
        {
          type: "multiple_choice",
          question: "MCP separates 'tools' (model-controlled) from 'resources' (application-controlled). Why does that distinction matter for safety?",
          options: [
            "It doesn't; the labels are cosmetic and both behave identically at runtime",
            "Because resources can take destructive actions while tools are always read-only",
            "Because the model decides when to call tools, so actions warrant tighter control than reads",
            "Because tools are always local and resources are always fetched from remote servers"
          ],
          correct_option: "C",
          explanation: "Tools are invoked at the model's discretion and can have side effects, so hosts typically gate them (for example with user approval), whereas resources are passive data surfaced by the application. The split is about who initiates and the blast radius, not read-only-ness or locality."
        },
        {
          type: "flashcard",
          question: "How does capability negotiation during initialization keep MCP extensible?",
          answer: "At session start the host and server each advertise which features they support, so newer capabilities can be added without breaking older peers — each side only uses what both have agreed on.",
          difficulty: "hard"
        }
      ]
    }
  ]
});
