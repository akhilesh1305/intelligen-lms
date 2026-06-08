import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

type LessonSeed = {
  title: string;
  order: number;
  content: string;
  videoUrl?: string;
};

type ModuleSeed = {
  title: string;
  order: number;
  lessons: LessonSeed[];
};

type CourseSeed = {
  title: string;
  description: string;
  published: boolean;
  instructorEmail: string;
  modules: ModuleSeed[];
  enrollStudent?: boolean;
  completedLessonCount?: number;
};

const demoCourses: CourseSeed[] = [
  {
    title: "Introduction to Web Development",
    description:
      "Learn the fundamentals of HTML, CSS, and JavaScript. Build your first responsive website from scratch and understand how the modern web works.",
    published: true,
    instructorEmail: "instructor@intelligen.lms",
    enrollStudent: true,
    completedLessonCount: 1,
    modules: [
      {
        title: "Getting Started",
        order: 1,
        lessons: [
          {
            title: "Welcome to the Course",
            order: 1,
            content:
              "Welcome to Introduction to Web Development!\n\nIn this course, you'll learn the building blocks of the web. We'll start with HTML for structure, CSS for styling, and JavaScript for interactivity.\n\nBy the end, you'll have built a complete personal portfolio website.",
          },
          {
            title: "How the Web Works",
            order: 2,
            content:
              "The web is built on a client-server model. When you visit a website:\n\n1. Your browser sends a request to a server\n2. The server responds with HTML, CSS, and JavaScript\n3. Your browser renders the page\n\nUnderstanding this flow is essential for every web developer.",
          },
        ],
      },
      {
        title: "HTML Fundamentals",
        order: 2,
        lessons: [
          {
            title: "HTML Document Structure",
            order: 1,
            content:
              "Every HTML document follows a standard structure:\n\n<!DOCTYPE html>\n<html>\n  <head>\n    <title>Page Title</title>\n  </head>\n  <body>\n  </body>\n</html>\n\nThe head contains metadata, while the body contains visible content.",
          },
          {
            title: "Common HTML Elements",
            order: 2,
            content:
              "Key HTML elements include:\n\n- Headings: h1 through h6\n- Paragraphs: p\n- Links: a\n- Images: img\n- Lists: ul, ol, li\n- Divisions: div, span\n\nSemantic elements like header, nav, main, and footer improve accessibility.",
          },
        ],
      },
      {
        title: "CSS Styling",
        order: 3,
        lessons: [
          {
            title: "CSS Selectors and Properties",
            order: 1,
            content:
              "CSS selects HTML elements and applies styles. Common selectors:\n\n- Element: p { }\n- Class: .classname { }\n- ID: #idname { }\n\nProperties control color, font, spacing, layout, and more.",
          },
          {
            title: "Flexbox Layout",
            order: 2,
            content:
              "Flexbox makes responsive layouts easier. Key concepts:\n\n- display: flex on the container\n- flex-direction: row or column\n- justify-content: align along main axis\n- align-items: align along cross axis\n\nUse flexbox for navigation bars, card grids, and centering content.",
          },
        ],
      },
    ],
  },
  {
    title: "Python for Data Science",
    description:
      "Master Python programming for data analysis. Work with NumPy, Pandas, and Matplotlib to clean, analyze, and visualize real-world datasets.",
    published: true,
    instructorEmail: "marcus@intelligen.lms",
    modules: [
      {
        title: "Python Basics",
        order: 1,
        lessons: [
          {
            title: "Setting Up Your Environment",
            order: 1,
            content:
              "Before analyzing data, set up a productive Python environment:\n\n1. Install Python 3.11+\n2. Create a virtual environment: python -m venv venv\n3. Install core packages: pip install numpy pandas matplotlib jupyter\n4. Launch Jupyter: jupyter notebook\n\nA clean setup prevents dependency conflicts later.",
          },
          {
            title: "Variables, Types, and Control Flow",
            order: 2,
            content:
              "Python fundamentals for data work:\n\n- Numbers: int, float\n- Collections: list, dict, set, tuple\n- Loops: for item in data\n- Conditionals: if/elif/else\n\nData scientists use lists and dicts constantly when shaping raw data.",
          },
        ],
      },
      {
        title: "Working with Pandas",
        order: 2,
        lessons: [
          {
            title: "Loading and Exploring DataFrames",
            order: 1,
            content:
              "Pandas DataFrames are the heart of data analysis in Python:\n\nimport pandas as pd\ndf = pd.read_csv('sales.csv')\ndf.head()      # first rows\ndf.info()      # column types\ndf.describe()  # summary stats\n\nAlways explore your data before transforming it.",
          },
          {
            title: "Cleaning Missing Values",
            order: 2,
            content:
              "Real data is messy. Common cleaning steps:\n\n- df.isnull().sum() to find gaps\n- df.fillna(0) or df.dropna() to handle them\n- df['price'] = df['price'].astype(float)\n- Remove duplicates with df.drop_duplicates()\n\nClean data leads to trustworthy insights.",
          },
        ],
      },
      {
        title: "Data Visualization",
        order: 3,
        lessons: [
          {
            title: "Charts with Matplotlib",
            order: 1,
            content:
              "Visualize patterns with Matplotlib:\n\nimport matplotlib.pyplot as plt\nplt.bar(categories, values)\nplt.xlabel('Category')\nplt.ylabel('Count')\nplt.title('Sales by Region')\nplt.show()\n\nChoose chart types that match your question: trends (line), comparisons (bar), distributions (histogram).",
          },
        ],
      },
    ],
  },
  {
    title: "UI/UX Design Fundamentals",
    description:
      "Learn user-centered design principles, wireframing, prototyping, and usability testing. Create interfaces that are beautiful and intuitive.",
    published: true,
    instructorEmail: "emma@intelligen.lms",
    enrollStudent: true,
    completedLessonCount: 2,
    modules: [
      {
        title: "Design Thinking",
        order: 1,
        lessons: [
          {
            title: "What Is UX Design?",
            order: 1,
            content:
              "User Experience (UX) design focuses on how people feel when using a product. Good UX is:\n\n- Useful: solves a real problem\n- Usable: easy to learn and operate\n- Desirable: enjoyable to use\n- Accessible: works for diverse users\n\nUX is not just visuals — it's the entire journey.",
          },
          {
            title: "User Research Methods",
            order: 2,
            content:
              "Design decisions should be based on evidence:\n\n- User interviews: understand goals and pain points\n- Surveys: gather quantitative feedback at scale\n- Usability tests: watch users complete tasks\n- Analytics: see where users drop off\n\nResearch before you sketch saves time in development.",
          },
        ],
      },
      {
        title: "Wireframing & Prototyping",
        order: 2,
        lessons: [
          {
            title: "Low-Fidelity Wireframes",
            order: 1,
            content:
              "Wireframes are blueprints for screens. Start low-fidelity:\n\n- Use boxes and placeholders, not final colors\n- Focus on layout, hierarchy, and flow\n- Tools: Figma, Balsamiq, pen and paper\n\nIterate quickly. A rough wireframe tested with 5 users beats a polished mockup built on assumptions.",
          },
          {
            title: "Building Interactive Prototypes",
            order: 2,
            content:
              "Prototypes simulate the real product:\n\n1. Link wireframes into clickable flows\n2. Add basic transitions and states\n3. Test key tasks: sign up, checkout, search\n4. Gather feedback before writing code\n\nPrototyping is the cheapest place to fix usability problems.",
          },
        ],
      },
      {
        title: "Visual Design",
        order: 3,
        lessons: [
          {
            title: "Typography and Color",
            order: 1,
            content:
              "Visual design supports usability:\n\nTypography:\n- Limit to 2 font families\n- Use size and weight for hierarchy\n- Keep body text at 16px minimum\n\nColor:\n- Pick a primary, secondary, and neutral palette\n- Ensure sufficient contrast (WCAG AA: 4.5:1 for text)\n- Use color consistently for actions and states",
          },
        ],
      },
    ],
  },
  {
    title: "Introduction to Machine Learning",
    description:
      "Explore supervised and unsupervised learning, model training, and evaluation. Build your first ML models with scikit-learn using hands-on examples.",
    published: true,
    instructorEmail: "marcus@intelligen.lms",
    modules: [
      {
        title: "ML Foundations",
        order: 1,
        lessons: [
          {
            title: "What Is Machine Learning?",
            order: 1,
            content:
              "Machine learning teaches computers to learn from data instead of explicit rules.\n\nThree main types:\n- Supervised: learn from labeled examples (spam detection)\n- Unsupervised: find patterns without labels (clustering)\n- Reinforcement: learn through trial and reward (game AI)\n\nML is a subset of AI focused on prediction and pattern recognition.",
          },
          {
            title: "The ML Workflow",
            order: 2,
            content:
              "A typical machine learning project follows these steps:\n\n1. Define the problem and success metric\n2. Collect and explore data\n3. Preprocess features (scaling, encoding)\n4. Train a model\n5. Evaluate on held-out test data\n6. Deploy and monitor for drift\n\nMost of the work happens before model training.",
          },
        ],
      },
      {
        title: "Supervised Learning",
        order: 2,
        lessons: [
          {
            title: "Linear Regression",
            order: 1,
            content:
              "Linear regression predicts a continuous value:\n\nfrom sklearn.linear_model import LinearRegression\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\npredictions = model.predict(X_test)\n\nUse it for forecasting sales, estimating prices, or any numeric prediction task with linear relationships.",
          },
          {
            title: "Classification with Logistic Regression",
            order: 2,
            content:
              "Classification predicts categories (yes/no, A/B/C):\n\nfrom sklearn.linear_model import LogisticRegression\nclf = LogisticRegression()\nclf.fit(X_train, y_train)\naccuracy = clf.score(X_test, y_test)\n\nEvaluate classifiers with precision, recall, and F1 — not just accuracy, especially on imbalanced data.",
          },
        ],
      },
      {
        title: "Model Evaluation",
        order: 3,
        lessons: [
          {
            title: "Train/Test Split and Cross-Validation",
            order: 1,
            content:
              "Never evaluate a model on the same data you trained on.\n\nfrom sklearn.model_selection import train_test_split\ntrain, test = train_test_split(data, test_size=0.2)\n\nCross-validation rotates the split to get a more reliable performance estimate:\n\nfrom sklearn.model_selection import cross_val_score\ncross_val_score(model, X, y, cv=5)",
          },
        ],
      },
    ],
  },
  {
    title: "Digital Marketing Essentials",
    description:
      "Learn SEO, content marketing, social media strategy, and email campaigns. Build a complete digital marketing plan for any business or brand.",
    published: true,
    instructorEmail: "emma@intelligen.lms",
    modules: [
      {
        title: "Marketing Strategy",
        order: 1,
        lessons: [
          {
            title: "Understanding Your Audience",
            order: 1,
            content:
              "Effective marketing starts with knowing who you're talking to:\n\n- Build buyer personas (demographics, goals, pain points)\n- Map the customer journey: awareness → consideration → decision\n- Identify which channels your audience uses\n\nA message that resonates with everyone resonates with no one.",
          },
          {
            title: "Setting SMART Goals",
            order: 2,
            content:
              "Marketing goals should be SMART:\n\n- Specific: increase newsletter signups\n- Measurable: by 25%\n- Achievable: based on past benchmarks\n- Relevant: tied to business revenue\n- Time-bound: within Q2\n\nTrack KPIs like CTR, conversion rate, CAC, and ROAS.",
          },
        ],
      },
      {
        title: "SEO & Content",
        order: 2,
        lessons: [
          {
            title: "SEO Basics",
            order: 1,
            content:
              "Search Engine Optimization helps people find you organically:\n\nOn-page SEO:\n- Keyword research with tools like Google Keyword Planner\n- Title tags and meta descriptions\n- Header hierarchy (H1, H2, H3)\n- Internal linking\n\nTechnical SEO:\n- Fast page load times\n- Mobile-friendly design\n- Clean URL structure",
          },
          {
            title: "Content Marketing",
            order: 2,
            content:
              "Content builds trust and drives traffic:\n\n- Blog posts that answer real questions\n- Case studies showing results\n- Videos and infographics for engagement\n- Repurpose content across channels\n\nPublish consistently. One great article per month beats ten mediocre ones per week.",
          },
        ],
      },
      {
        title: "Social & Email",
        order: 3,
        lessons: [
          {
            title: "Social Media Strategy",
            order: 1,
            content:
              "Pick platforms where your audience is active:\n\n- LinkedIn: B2B, thought leadership\n- Instagram: visual brands, lifestyle\n- TikTok: short-form, younger audiences\n- X/Twitter: news, real-time engagement\n\nUse a content calendar. Mix educational, promotional, and community posts in a 4:1:1 ratio.",
          },
        ],
      },
    ],
  },
  {
    title: "Project Management Basics",
    description:
      "Master Agile and Scrum methodologies, sprint planning, stakeholder communication, and risk management. Lead projects from kickoff to delivery.",
    published: true,
    instructorEmail: "instructor@intelligen.lms",
    modules: [
      {
        title: "Project Fundamentals",
        order: 1,
        lessons: [
          {
            title: "The Project Lifecycle",
            order: 1,
            content:
              "Every project moves through phases:\n\n1. Initiation: define scope, stakeholders, and goals\n2. Planning: schedule, budget, resources, risks\n3. Execution: do the work, manage the team\n4. Monitoring: track progress against the plan\n5. Closing: deliver, document lessons learned\n\nSkipping planning is the fastest way to miss deadlines.",
          },
          {
            title: "Defining Scope and Requirements",
            order: 2,
            content:
              "Scope creep kills projects. Protect your timeline:\n\n- Write a clear project charter\n- List requirements as user stories or specs\n- Get stakeholder sign-off before building\n- Use a change request process for new asks\n\nIf everything is priority one, nothing is.",
          },
        ],
      },
      {
        title: "Agile & Scrum",
        order: 2,
        lessons: [
          {
            title: "Agile Principles",
            order: 1,
            content:
              "Agile values adaptability over rigid plans:\n\n- Individuals and interactions over processes\n- Working software over documentation\n- Customer collaboration over contract negotiation\n- Responding to change over following a plan\n\nDeliver value in small increments and gather feedback early.",
          },
          {
            title: "Running Effective Sprints",
            order: 2,
            content:
              "A Scrum sprint typically lasts 2 weeks:\n\n- Sprint Planning: pick items from the backlog\n- Daily Standup: 15 min — what I did, what I'll do, blockers\n- Sprint Review: demo completed work to stakeholders\n- Retrospective: what went well, what to improve\n\nVelocity = story points completed per sprint. Use it to forecast, not to pressure the team.",
          },
        ],
      },
      {
        title: "Risk & Communication",
        order: 3,
        lessons: [
          {
            title: "Risk Management",
            order: 1,
            content:
              "Identify risks before they become problems:\n\n1. Brainstorm risks with the team\n2. Score by likelihood × impact\n3. Plan mitigations for high-priority risks\n4. Assign an owner to each risk\n5. Review risks weekly\n\nCommon risks: key person dependency, unclear requirements, integration delays, budget overrun.",
          },
        ],
      },
    ],
  },
  {
    title: "Advanced React Patterns",
    description:
      "Deep dive into React hooks, state management, performance optimization, and server components. For developers ready to level up their frontend skills.",
    published: true,
    instructorEmail: "instructor@intelligen.lms",
    modules: [
      {
        title: "Hooks Deep Dive",
        order: 1,
        lessons: [
          {
            title: "useState and useEffect Patterns",
            order: 1,
            content:
              "Master the hooks you use every day:\n\nuseState: store component state\nconst [count, setCount] = useState(0)\n\nuseEffect: side effects with cleanup\nuseEffect(() => {\n  const sub = subscribe(data)\n  return () => sub.unsubscribe()\n}, [data])\n\nAlways include dependency arrays. Missing deps cause stale closures and bugs.",
          },
          {
            title: "useCallback, useMemo, and useRef",
            order: 2,
            content:
              "Optimize when it matters:\n\nuseCallback: memoize functions passed to children\nuseMemo: memoize expensive computations\nuseRef: persist values without re-renders\n\nDon't optimize prematurely. Profile first, then memoize hot paths. Over-memoization adds complexity without benefit.",
          },
        ],
      },
      {
        title: "State Management",
        order: 2,
        lessons: [
          {
            title: "Context vs External Stores",
            order: 1,
            content:
              "Choose the right tool for your state:\n\nReact Context: theme, auth, locale — low-frequency updates\nuseReducer: complex local state with predictable transitions\nZustand/Redux: shared app state with many subscribers\nReact Query: server state, caching, background refetch\n\nServer state and client state are different problems. Don't put API data in Redux.",
          },
        ],
      },
      {
        title: "Performance",
        order: 3,
        lessons: [
          {
            title: "React Server Components",
            order: 1,
            content:
              "Next.js App Router uses React Server Components (RSC):\n\n- Server Components: fetch data, no JS shipped to client\n- Client Components: interactivity, hooks, browser APIs\n\nMark client components with 'use client' at the top of the file. Keep as much as possible on the server to reduce bundle size and improve load times.",
          },
        ],
      },
    ],
  },
];

async function seedCourse(
  courseData: CourseSeed,
  instructorId: string,
  studentId: string
) {
  const existing = await db.course.findFirst({
    where: { title: courseData.title },
  });

  if (existing) return;

  const course = await db.course.create({
    data: {
      title: courseData.title,
      description: courseData.description,
      published: courseData.published,
      status: courseData.published ? "APPROVED" : "DRAFT",
      instructorId,
      modules: {
        create: courseData.modules.map((mod) => ({
          title: mod.title,
          order: mod.order,
          lessons: {
            create: mod.lessons.map((lesson) => ({
              title: lesson.title,
              order: lesson.order,
              content: lesson.content,
              videoUrl: lesson.videoUrl ?? null,
            })),
          },
        })),
      },
    },
  });

  if (courseData.enrollStudent) {
    await db.enrollment.create({
      data: { userId: studentId, courseId: course.id },
    });

    if (courseData.completedLessonCount) {
      const lessons = await db.lesson.findMany({
        where: { module: { courseId: course.id } },
        orderBy: [{ module: { order: "asc" } }, { order: "asc" }],
        take: courseData.completedLessonCount,
      });

      for (const lesson of lessons) {
        await db.lessonProgress.create({
          data: {
            userId: studentId,
            lessonId: lesson.id,
            completed: true,
            completedAt: new Date(),
          },
        });
      }
    }
  }

  console.log(`  + ${courseData.title}`);
}

async function main() {
  const passwordHash = await bcrypt.hash("password123", 12);

  await db.user.upsert({
    where: { email: "admin@intelligen.lms" },
    update: {},
    create: {
      email: "admin@intelligen.lms",
      name: "Admin User",
      passwordHash,
      role: "ADMIN",
    },
  });

  const instructor = await db.user.upsert({
    where: { email: "instructor@intelligen.lms" },
    update: {},
    create: {
      email: "instructor@intelligen.lms",
      name: "Dr. Sarah Chen",
      passwordHash,
      role: "INSTRUCTOR",
    },
  });

  const marcus = await db.user.upsert({
    where: { email: "marcus@intelligen.lms" },
    update: {},
    create: {
      email: "marcus@intelligen.lms",
      name: "Marcus Rivera",
      passwordHash,
      role: "INSTRUCTOR",
    },
  });

  const emma = await db.user.upsert({
    where: { email: "emma@intelligen.lms" },
    update: {},
    create: {
      email: "emma@intelligen.lms",
      name: "Emma Thompson",
      passwordHash,
      role: "INSTRUCTOR",
    },
  });

  const student = await db.user.upsert({
    where: { email: "student@intelligen.lms" },
    update: {},
    create: {
      email: "student@intelligen.lms",
      name: "Alex Johnson",
      passwordHash,
      role: "STUDENT",
    },
  });

  const instructors: Record<string, string> = {
    "instructor@intelligen.lms": instructor.id,
    "marcus@intelligen.lms": marcus.id,
    "emma@intelligen.lms": emma.id,
  };

  console.log("Seeding demo courses...");
  for (const course of demoCourses) {
    await seedCourse(course, instructors[course.instructorEmail], student.id);
  }

  // Migrate existing courses to APPROVED status
  await db.course.updateMany({
    where: { published: true },
    data: { status: "APPROVED" },
  });

  // Seed badges
  const badges = [
    { slug: "first-lesson", name: "First Steps", description: "Complete your first lesson", icon: "🎯", points: 10 },
    { slug: "first-quiz", name: "Quiz Taker", description: "Pass your first quiz", icon: "📝", points: 25 },
    { slug: "first-course", name: "Graduate", description: "Complete your first course", icon: "🎓", points: 100 },
    { slug: "forum-contributor", name: "Community Voice", description: "Post in a discussion forum", icon: "💬", points: 15 },
    { slug: "streak-5", name: "Dedicated Learner", description: "Earn 250 points", icon: "🔥", points: 50 },
    { slug: "quiz-master", name: "Quiz Master", description: "Pass 3 quizzes", icon: "🏆", points: 75 },
  ];
  for (const badge of badges) {
    await db.badge.upsert({ where: { slug: badge.slug }, update: {}, create: badge });
  }
  console.log("  + Badges");

  // Seed quiz & assignment for Web Development course
  const webCourse = await db.course.findFirst({
    where: { title: "Introduction to Web Development" },
  });

  if (webCourse) {
    const existingQuiz = await db.quiz.findFirst({
      where: { courseId: webCourse.id, title: "HTML & CSS Fundamentals Quiz" },
    });

    if (!existingQuiz) {
      await db.quiz.create({
        data: {
          courseId: webCourse.id,
          title: "HTML & CSS Fundamentals Quiz",
          passingScore: 70,
          questions: {
            create: [
              {
                question: "What does HTML stand for?",
                options: JSON.stringify([
                  "Hyper Text Markup Language",
                  "High Tech Modern Language",
                  "Home Tool Markup Language",
                  "Hyperlinks Text Mark Language",
                ]),
                correctIndex: 0,
                order: 1,
              },
              {
                question: "Which CSS property controls text color?",
                options: JSON.stringify(["font-weight", "color", "text-style", "foreground"]),
                correctIndex: 1,
                order: 2,
              },
              {
                question: "Which tag is used for the largest heading?",
                options: JSON.stringify(["<header>", "<h1>", "<head>", "<heading>"]),
                correctIndex: 1,
                order: 3,
              },
            ],
          },
        },
      });
      console.log("  + Web Dev quiz");
    }

    const existingAssignment = await db.assignment.findFirst({
      where: { courseId: webCourse.id, title: "Build a Personal Portfolio Page" },
    });

    if (!existingAssignment) {
      await db.assignment.create({
        data: {
          courseId: webCourse.id,
          title: "Build a Personal Portfolio Page",
          description:
            "Create a simple HTML page with your name, a short bio, and links to your social profiles. Include at least one image and use CSS for basic styling.",
        },
      });
      console.log("  + Web Dev assignment");
    }

    const existingThread = await db.forumThread.findFirst({
      where: { courseId: webCourse.id },
    });

    if (!existingThread) {
      await db.forumThread.create({
        data: {
          courseId: webCourse.id,
          userId: student.id,
          title: "Best resources for learning HTML?",
          content:
            "Hi everyone! I'm just starting out. What are your favorite free resources for practicing HTML and CSS?",
        },
      });
      console.log("  + Forum thread");
    }
  }

  // Give student some starting points
  await db.user.update({
    where: { id: student.id },
    data: { points: 20 },
  });

  console.log("\nSeed completed:");
  console.log(`  Admin:      admin@intelligen.lms / password123`);
  console.log(`  Instructor: instructor@intelligen.lms / password123`);
  console.log(`  Instructor: marcus@intelligen.lms / password123`);
  console.log(`  Instructor: emma@intelligen.lms / password123`);
  console.log(`  Student:    student@intelligen.lms / password123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
