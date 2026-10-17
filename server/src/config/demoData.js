export const initialUsers = [
  {
    name: "Alex Rivera",
    email: "alex@journal.dev",
    password: "password123",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    bio: "Staff Software Architect & Tech Writer. Exploring large-scale web systems, edge runtimes, and developer joy."
  },
  {
    name: "Sarah Chen",
    email: "sarah@design.io",
    password: "password123",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    bio: "Design Director & Typographer. Obsessed with minimalist aesthetics, micro-interactions, and humane interfaces."
  }
];

export const initialPosts = [
  {
    title: "Building Resilient Distributed Systems with Micro-Frontends",
    slug: "building-resilient-distributed-systems",
    excerpt: "How modern engineering teams decouple large monolithic frontends into autonomous, independently deployable domain applications without sacrificing performance.",
    content: `When web applications cross certain organizational and technical thresholds, the classic monolithic repository model begins showing severe friction points. Build times balloon, release coordination turns into endless meeting chains, and small changes carry disproportionate blast radiuses.\n\n### The Core Philosophy of Micro-Frontends\nMuch like backend microservices allowed teams to scale databases and APIs independently, micro-frontends bring domain isolation to client applications. Each team owns their slice of the user journey—from customer cart to catalog search—with full deployment autonomy.\n\n### Architectural Approaches: Module Federation vs. Iframes\nModern approaches rely heavily on Webpack and Vite module federation over legacy iframes. Shared dependencies like React or styling design systems can be deduplicated dynamically at runtime, reducing overhead while preserving total independence.\n\n### Key Takeaways for High-Growth Teams\n- Treat internal packages as products with strict semantic versioning.\n- Invest in cohesive shared design systems before splitting team boundaries.\n- Continuous monitoring and end-to-end synthetic testing are non-negotiable.`,
    category: "Engineering",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    readTime: "5 min read",
    authorIndex: 0 // Alex Rivera
  },
  {
    title: "The Anatomy of Clean Minimal UI: Lessons from Scandinavian Design",
    slug: "the-anatomy-of-clean-minimal-ui",
    excerpt: "True minimalism isn't about stark emptiness—it is the deliberate subtraction of the unnecessary so that the essential may speak clearly.",
    content: `In an era of relentless notifications, glowing badges, and aggressive interface clutter, intentional whitespace is the greatest luxury you can offer your user.\n\n### Visual Hierarchy and Intentional Restraint\nScandinavian design has long championed form following function without discarding warmth. When translating this to digital software:\n\n1. **Limit Type Sizes to a Cohesive Scale**: Avoid picking random font sizes. Stick to an 8-step modular typographic scale with generous line heights.\n2. **Colors with Purpose**: A palette with 90% neutral slates and a single vibrant accent color creates high contrast without fatigue.\n3. **Tactile Subtle Shadows**: Avoid heavy black drop-shadows. Use soft, multi-layered ambient light with low opacity.\n\nSimplicity isn't the absence of detail; it is the presence of clarity.`,
    category: "Design",
    coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
    readTime: "4 min read",
    authorIndex: 1 // Sarah Chen
  },
  {
    title: "How Product Velocity Beats Perfection in Early-Stage Startups",
    slug: "how-product-velocity-beats-perfection",
    excerpt: "Why the fastest-learning teams ship imperfect software, listen intently to real users, and rapidly iterate toward true market fit.",
    content: `Perfectionism is often fear in a polished disguise. In the early stages of building any software product, your biggest risk is not having bugs; your biggest risk is building something nobody actually cares about.\n\n### The Feedback Loop That Wins\nThe teams that succeed are those that shorten the time between an idea, code in production, and an actual customer reaction. Every week spent debating an edge-case feature in a spreadsheet is a week delayed in validating core assumptions.\n\n### Practical Rules for Shipping Fast\n- Ship the core value proposition first.\n- Instrument events so you see where drop-off happens.\n- Never compromise on database integrity or customer security, but be ruthless with secondary UI frills.`,
    category: "Product",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    readTime: "3 min read",
    authorIndex: 0 // Alex Rivera
  },
  {
    title: "The Future of AI-Assisted Pair Programming and Agentic Workflows",
    slug: "future-of-ai-assisted-pair-programming",
    excerpt: "Exploring how agentic assistants are shifting developer workflows from syntax writing to system architecture and high-level evaluation.",
    content: `We are witnessing a profound inflection point in how software is created. Early coding tools acted as smart autocomplete engines. Today's agentic systems understand multi-file architectures, run command-line test suites, and write end-to-end integration tests.\n\n### The New Role of the Software Engineer\nRather than typing out boilerplate CRUD endpoints line-by-line, developers are becoming conductors of intelligent agents. The premium skills in this new landscape are:\n- Clear, unambiguous domain modeling.\n- Rigorous verification and test-driven specifications.\n- High-level architectural trade-off evaluation.\n\nThose who embrace this leverage will build at 10x the velocity of traditional workflows.`,
    category: "AI & Future",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    readTime: "6 min read",
    authorIndex: 1 // Sarah Chen
  }
];

export const initialComments = [
  {
    postIndex: 0,
    authorIndex: 1, // Sarah Chen commenting on Alex's post
    content: "Spot on analysis regarding Module Federation! We recently migrated our core design library to dynamic federated remotes and cut our deployment cycle by 60%."
  },
  {
    postIndex: 1,
    authorIndex: 0, // Alex commenting on Sarah's post
    content: "The section on subtle multi-layered shadows resonated deeply. Too many apps still look like 2012 Bootstrap with harsh 20px black shadows."
  }
];
