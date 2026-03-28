import { useState, useEffect, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

declare global {
  interface Window { YT: any; onYouTubeIframeAPIReady: () => void }
}

// ─── Career data ──────────────────────────────────────────────────────────────
const careerData: Record<string, {
  emoji: string; color: string; tagline: string
  facts: string[]
  steps: {
    id: number; title: string; description: string; icon: string
    skills: string[]; videoId: string; videoDuration: string
    quiz: { question: string; options: string[]; correct: number; explanation: string }[]
  }[]
}> = {
  'AI Engineer': {
    emoji: '🤖', color: '#FF6B6B', tagline: 'Build the minds of the future',
    facts: ['AI market worth $1.8T by 2030', 'Avg salary: $150k+/year', 'Fastest growing tech role', 'Used in every major industry'],
    steps: [
      { id: 1, title: 'Math Foundations', icon: '📐', description: 'Master the mathematics that powers every AI system — vectors, derivatives, and probability are the DNA of machine learning.', skills: ['Linear Algebra', 'Calculus', 'Probability', 'Statistics'], videoId: 'fNk_zzaMoSs', videoDuration: '3:42',
        quiz: [{ question: 'What is a vector?', options: ['A scalar value', 'A quantity with magnitude and direction', 'A type of matrix', 'A probability value'], correct: 1, explanation: 'A vector has both magnitude (size) and direction, unlike a scalar which only has magnitude. Vectors are fundamental in representing data in ML.' },
               { question: 'What does a derivative measure?', options: ['Area under a curve', 'Rate of change of a function', 'Average value of a function', 'Maximum value'], correct: 1, explanation: 'A derivative measures how quickly a function changes at any point. In ML, derivatives power gradient descent — the core of model training.' }] },
      { id: 2, title: 'Python & Data', icon: '🐍', description: 'Write code that transforms raw data into insight. Python is the universal language of AI and data science.', skills: ['Python Basics', 'NumPy', 'Pandas', 'Data Visualization'], videoId: '_uQrJ0TkZlc', videoDuration: '6:14',
        quiz: [{ question: 'What is NumPy primarily used for?', options: ['Web development', 'Numerical computing with arrays', 'Database queries', 'UI design'], correct: 1, explanation: 'NumPy (Numerical Python) provides fast multi-dimensional array operations — the foundation of all scientific computing in Python.' },
               { question: 'What does df.head() do in Pandas?', options: ['Shows the last 5 rows', 'Shows the first 5 rows of the DataFrame', 'Counts all rows', 'Sorts the data'], correct: 1, explanation: 'df.head() returns the first 5 rows by default, giving you a quick preview of your dataset structure.' }] },
      { id: 3, title: 'Machine Learning', icon: '🧠', description: 'Teach machines to learn patterns from data. You\'ll train your first model and understand why it works.', skills: ['Supervised Learning', 'Neural Networks', 'Model Evaluation', 'Scikit-learn'], videoId: 'ukzFI9rgwfU', videoDuration: '5:23',
        quiz: [{ question: 'What is overfitting?', options: ['Model is too simple', 'Model memorises training data and fails on new data', 'Model trains too fast', 'Model uses too little data'], correct: 1, explanation: 'Overfitting happens when a model learns the training data too well — including its noise — and loses the ability to generalise to unseen data.' },
               { question: 'What is a neural network?', options: ['A literal human brain', 'Layers of connected weighted nodes that learn', 'A type of database', 'A sorting algorithm'], correct: 1, explanation: 'Neural networks are composed of layers of interconnected nodes (neurons) with learnable weights. They approximate any function given enough data and layers.' }] },
      { id: 4, title: 'Deep Learning & LLMs', icon: '🚀', description: 'Build and fine-tune large language models. Go from zero to understanding how GPT, Gemini, and Claude work.', skills: ['PyTorch', 'Transformers', 'Fine-tuning', 'Prompt Engineering'], videoId: 'aircAruvnKk', videoDuration: '19:13',
        quiz: [{ question: 'What is a transformer architecture?', options: ['An electrical component', 'An attention-based neural network architecture', 'A type of relational database', 'A sorting method'], correct: 1, explanation: 'The transformer architecture uses self-attention mechanisms to weigh relationships between all words in a sequence simultaneously — far more powerful than RNNs.' },
               { question: 'What is fine-tuning in the context of LLMs?', options: ['Training from scratch', 'Adjusting a pre-trained model on a specific dataset', 'Removing layers from a model', 'Compressing a model to be smaller'], correct: 1, explanation: 'Fine-tuning takes a model already pre-trained on vast data and continues training it on a smaller, task-specific dataset — much cheaper than training from scratch.' }] },
    ]
  },
  'Software Engineer': {
    emoji: '💻', color: '#4ECDC4', tagline: 'Turn ideas into products millions use',
    facts: ['$120k avg starting salary', '25% job growth by 2032', 'Work remotely anywhere', 'Build products used by billions'],
    steps: [
      { id: 1, title: 'Programming Basics', icon: '⌨️', description: 'Learn to think like a computer and write clean, logical code. This is where every great engineer begins.', skills: ['Variables', 'Loops', 'Functions', 'Problem Solving'], videoId: 'zOjov-2OZ0E', videoDuration: '4:51',
        quiz: [{ question: 'What is a variable?', options: ['A fixed value', 'A named storage location that holds data', 'A type of loop', 'A function'], correct: 1, explanation: 'A variable is a named container in memory that stores a value. That value can change (vary) during the program\'s execution — hence the name.' },
               { question: 'What does a loop do?', options: ['Stops the program', 'Repeats a block of code while a condition is true', 'Defines a function', 'Stores data permanently'], correct: 1, explanation: 'A loop executes a block of code repeatedly. This is essential for processing collections of data, running games, and most real-world programming tasks.' }] },
      { id: 2, title: 'Data Structures & Algorithms', icon: '🌲', description: 'The craft that separates good engineers from great ones. Master these and no technical interview will scare you.', skills: ['Arrays', 'Trees', 'Sorting', 'Big O Notation'], videoId: 'bum_19loj9A', videoDuration: '9:32',
        quiz: [{ question: 'What is a binary tree?', options: ['A tree with exactly two roots', 'A tree where each node has at most 2 children', 'A sorted array of integers', 'A doubly linked list'], correct: 1, explanation: 'In a binary tree, each node has at most 2 children (left and right). This structure enables efficient search, insertion, and deletion operations.' },
               { question: 'What does O(n) time complexity mean?', options: ['Constant time regardless of input', 'Time grows linearly with input size', 'Exponential time growth', 'Logarithmic time growth'], correct: 1, explanation: 'O(n) means the algorithm\'s time grows proportionally to the input size n. If n doubles, the time roughly doubles too.' }] },
      { id: 3, title: 'Web Development', icon: '🌐', description: 'Build fast, beautiful applications that run in any browser. Learn the full stack from HTML to APIs.', skills: ['HTML/CSS', 'JavaScript', 'React', 'REST APIs'], videoId: 'ysEN5RaKOlA', videoDuration: '7:18',
        quiz: [{ question: 'What is React?', options: ['A database system', 'A JavaScript library for building user interfaces', 'A backend server framework', 'A CSS preprocessor'], correct: 1, explanation: 'React is a JavaScript library created by Meta for building component-based user interfaces. It uses a virtual DOM for efficient updates.' },
               { question: 'What is a REST API?', options: ['A programming language', 'An interface that lets software systems communicate over HTTP', 'A type of database', 'A UI component library'], correct: 1, explanation: 'A REST API (Representational State Transfer) is an architectural style for networked applications. It uses HTTP verbs (GET, POST, PUT, DELETE) to perform operations on resources.' }] },
      { id: 4, title: 'System Design', icon: '🏗️', description: 'Design systems that scale to millions of users. Learn how Netflix, Uber and Twitter architect their backends.', skills: ['Databases', 'Load Balancing', 'Caching', 'Microservices'], videoId: 'xpDnVSmNFX0', videoDuration: '10:47',
        quiz: [{ question: 'What does a load balancer do?', options: ['Stores frequently accessed data', 'Distributes incoming traffic across multiple servers', 'Encrypts network traffic', 'Manages database connections'], correct: 1, explanation: 'A load balancer sits in front of your servers and distributes incoming requests across them. This prevents any one server from being overwhelmed and improves availability.' },
               { question: 'What is caching?', options: ['Permanently deleting old data', 'Storing frequently accessed data for much faster retrieval', 'Encrypting sensitive data', 'Backing up data to a secondary server'], correct: 1, explanation: 'Caching stores copies of frequently requested data in a fast storage layer (like Redis). Instead of hitting the database every time, the cache serves it in microseconds.' }] },
    ]
  },
  'Data Scientist': {
    emoji: '📊', color: '#45B7D1', tagline: 'Find the stories hidden in data',
    facts: ['$130k avg salary', 'Used in healthcare, finance, sport', '#1 most wanted skill by companies', 'Python + SQL open every door'],
    steps: [
      { id: 1, title: 'Statistics', icon: '📈', description: 'The language of data. Without statistics, you are just a person with a spreadsheet. With it, you can change decisions.', skills: ['Mean/Median', 'Distributions', 'Hypothesis Testing', 'Regression'], videoId: 'xxpc-HPKN28', videoDuration: '8:15',
        quiz: [{ question: 'What is the median of a dataset?', options: ['The most frequently occurring value', 'The middle value when the data is sorted', 'The sum of values divided by the count', 'The maximum value'], correct: 1, explanation: 'The median is the middle value when your data is sorted in order. Unlike the mean, it is not affected by extreme outliers — making it more robust for skewed data.' },
               { question: 'What does standard deviation measure?', options: ['The average value of the dataset', 'The spread or dispersion of data around the mean', 'The maximum minus the minimum value', 'The sum of all values'], correct: 1, explanation: 'Standard deviation quantifies how spread out values are from the mean. A small SD means data is clustered tightly; a large SD means it is widely spread.' }] },
      { id: 2, title: 'Data Wrangling', icon: '🔧', description: 'Real data is messy. 80% of a data scientist\'s time is cleaning it. Master this and you master the field.', skills: ['Pandas', 'SQL', 'Data Cleaning', 'Feature Engineering'], videoId: 'vmEHCJofslg', videoDuration: '5:30',
        quiz: [{ question: 'What is data cleaning?', options: ['Deleting all rows with any missing values', 'Identifying and fixing errors, inconsistencies, and missing values', 'Encrypting data for security', 'Backing up raw data before analysis'], correct: 1, explanation: 'Data cleaning involves handling missing values, removing duplicates, correcting errors, and standardising formats — essential before any analysis.' },
               { question: 'What is SQL primarily used for?', options: ['Designing user interfaces', 'Querying and manipulating data in relational databases', 'Training machine learning models', 'Building web applications'], correct: 1, explanation: 'SQL (Structured Query Language) is the standard language for working with relational databases — retrieving, filtering, aggregating, and joining data.' }] },
      { id: 3, title: 'Machine Learning', icon: '🤖', description: 'Build predictive models that turn data into decisions. This is where data science becomes truly powerful.', skills: ['Classification', 'Clustering', 'Model Selection', 'Cross-validation'], videoId: 'ukzFI9rgwfU', videoDuration: '5:23',
        quiz: [{ question: 'What is clustering in machine learning?', options: ['Predicting a label for new data', 'Grouping similar data points together without labels', 'Reducing the number of features', 'Cleaning messy data'], correct: 1, explanation: 'Clustering is an unsupervised learning technique that groups data points by similarity — without any predefined labels. K-means and DBSCAN are popular algorithms.' },
               { question: 'What is cross-validation?', options: ['Testing a model on its own training data', 'Evaluating a model on multiple unseen data subsets', 'Removing outliers from the dataset', 'Selecting which features to use'], correct: 1, explanation: 'Cross-validation splits data into k folds, trains on k-1 and tests on 1, rotating through all folds. This gives a much more reliable performance estimate.' }] },
      { id: 4, title: 'Storytelling & Viz', icon: '🎨', description: 'Insights no one understands are worthless. Learn to make data impossible to ignore — charts that change minds.', skills: ['Matplotlib', 'Tableau', 'Dashboards', 'Presentation'], videoId: 'hVimVzgtD6w', videoDuration: '6:05',
        quiz: [{ question: 'What makes a data visualisation effective?', options: ['Using as many colors as possible', 'Being clear, accurate, and directly relevant to the insight', 'Making charts as complex as possible', 'Showing raw numbers instead of visuals'], correct: 1, explanation: 'An effective visualisation is honest, clear, and focused. It removes all chart junk and guides the viewer directly to the key insight.' },
               { question: 'What is Tableau?', options: ['A relational database system', 'A business intelligence and data visualisation tool', 'A Python machine learning library', 'A programming language for data'], correct: 1, explanation: 'Tableau is a leading data visualisation platform that allows analysts to create interactive dashboards and charts — without needing to write code.' }] },
    ]
  },
  'Businessman': {
    emoji: '💼', color: '#96CEB4', tagline: 'Build something the world needs',
    facts: ['$82k avg entrepreneur income', '627,000 new businesses/year in the US', 'Business skills transfer everywhere', 'Build multiple income streams'],
    steps: [
      { id: 1, title: 'Business Fundamentals', icon: '📚', description: 'How businesses actually work — from revenue models to reading a balance sheet. The basics most people never learn.', skills: ['Finance basics', 'Marketing 101', 'Operations', 'Business Models'], videoId: 'wMrVMNBOm5A', videoDuration: '7:02',
        quiz: [{ question: 'What is a business model?', options: ['A miniature physical replica of a business', 'How a company creates, delivers, and captures value', 'A financial statement', 'A marketing plan'], correct: 1, explanation: 'A business model describes how your company makes money — what you sell, to whom, through what channels, and how you keep more than you spend.' },
               { question: 'What is cash flow?', options: ['The total profit of a business', 'The movement of money in and out of a business over time', 'The total revenue generated', 'Investment capital'], correct: 1, explanation: 'Cash flow tracks actual money moving in (from sales) and out (expenses). A profitable business can still fail if it runs out of cash — making cash flow the lifeblood of operations.' }] },
      { id: 2, title: 'Entrepreneurship', icon: '💡', description: 'From zero to launch. Learn to validate ideas before you build, and build only what the market needs.', skills: ['Ideation', 'Validation', 'MVP', 'Pitching'], videoId: 'Lb7t7AxUZZo', videoDuration: '8:44',
        quiz: [{ question: 'What does MVP stand for in entrepreneurship?', options: ['Most Valuable Player', 'Minimum Viable Product', 'Maximum Value Proposition', 'Minimal Viable Plan'], correct: 1, explanation: 'An MVP (Minimum Viable Product) is the simplest version of your product that delivers core value. You launch it fast, learn from real users, and improve — saving time and money.' },
               { question: 'What is product-market fit?', options: ['Having a professional website', 'When your product strongly satisfies a real market demand', 'Successfully securing funding', 'Hiring your first employees'], correct: 1, explanation: 'Product-market fit means your product genuinely solves a problem people care enough about to pay for. Without it, no amount of marketing or funding will save a business.' }] },
      { id: 3, title: 'Marketing & Sales', icon: '📣', description: 'Get customers and keep them. The best product without customers is a hobby. Learn to build a pipeline.', skills: ['Digital Marketing', 'Sales Funnel', 'Branding', 'Customer Psychology'], videoId: '6hCVynkdYSk', videoDuration: '5:55',
        quiz: [{ question: 'What is a sales funnel?', options: ['A kitchen utensil used in cooking', 'The stages a potential customer moves through before buying', 'A marketing budget breakdown', 'A product design document'], correct: 1, explanation: 'A sales funnel models the customer journey from awareness → interest → decision → action. Understanding each stage helps you convert more leads to paying customers.' },
               { question: 'What is branding?', options: ['Just having a logo and colors', 'The overall identity and perception people have of your company', 'Your total advertising budget', 'A specific product feature'], correct: 1, explanation: 'Branding is the sum of every interaction people have with your business — your name, story, visual identity, tone, and values. It is what people think and feel about you.' }] },
      { id: 4, title: 'Leadership & Scale', icon: '👑', description: 'Lead teams and scale operations. The founder who cannot let go kills their own company. Learn to build people.', skills: ['Team Building', 'Delegation', 'Culture', 'Strategic Thinking'], videoId: 'XKUPDUDOBVo', videoDuration: '6:30',
        quiz: [{ question: 'What is delegation?', options: ['Doing every task yourself for quality control', 'Assigning responsibilities to others and trusting them', 'Avoiding accountability for results', 'Micromanaging every step of the process'], correct: 1, explanation: 'Delegation is the art of assigning authority and tasks to others. A leader who cannot delegate becomes the bottleneck — limiting everything the company can achieve.' },
               { question: 'What is company culture?', options: ['The physical office decorations and layout', 'The shared values, behaviors, and norms of an organization', 'The calendar of company events and parties', 'The official working hours and leave policies'], correct: 1, explanation: 'Culture is the invisible operating system of an organisation — it determines how decisions get made, how people treat each other, and what the team will and won\'t do.' }] },
    ]
  },
  'Teacher': {
    emoji: '🎓', color: '#F4A261', tagline: 'Shape the minds of tomorrow',
    facts: ['One of the most trusted professions', 'Digital teaching now global', 'EdTech market: $400B by 2028', 'Teaching sharpens your own thinking'],
    steps: [
      { id: 1, title: 'Subject Mastery', icon: '📖', description: 'You cannot teach what you do not know. Deep expertise builds student trust and enables you to answer any question.', skills: ['Deep Knowledge', 'Current Curriculum', 'Research Skills', 'Critical Thinking'], videoId: 'tkm0TNux_Ks', videoDuration: '5:18',
        quiz: [{ question: "What is Bloom's Taxonomy?", options: ['A biology classification system', 'A framework describing levels of cognitive learning', 'A specific teaching style or method', 'A student grading system'], correct: 1, explanation: "Bloom's Taxonomy organises learning into six levels: remember, understand, apply, analyse, evaluate, create. It helps teachers design lessons that build toward higher-order thinking." },
               { question: 'What is formative assessment?', options: ['The final exam at the end of a course', 'Ongoing checks during learning to guide instruction', 'Grading and scoring homework assignments', 'Standardised national tests'], correct: 1, explanation: 'Formative assessment happens throughout learning — quick checks, discussions, exit tickets — giving teachers real-time data to adjust their teaching before it is too late.' }] },
      { id: 2, title: 'Pedagogy', icon: '🧩', description: 'The science of how people actually learn. Knowing your subject is not enough — you must know how to transfer it.', skills: ['Learning Styles', 'Lesson Planning', 'Differentiation', 'Engagement'], videoId: 'gdtI2JvwcBk', videoDuration: '4:47',
        quiz: [{ question: 'What is differentiated instruction?', options: ['Teaching every student exactly the same way', 'Adapting teaching content and methods to meet diverse learners', 'Using only textbooks and worksheets', 'Giving different grades to different students'], correct: 1, explanation: 'Differentiation means recognising that students learn differently and adjusting your content, process, and products accordingly — so every student can access learning.' },
               { question: 'What is active learning?', options: ['Having students run or move around the classroom', 'Engaging students as active participants rather than passive listeners', 'Students only listening to teacher lectures', 'Students reading silently from textbooks'], correct: 1, explanation: 'Active learning puts students at the centre — they discuss, problem-solve, create, and teach each other. Research consistently shows it deepens retention far more than passive listening.' }] },
      { id: 3, title: 'Classroom Management', icon: '🏫', description: 'Create environments where learning thrives. Structure and relationships are not opposites — master both together.', skills: ['Routines', 'Conflict Resolution', 'Motivation', 'Inclusivity'], videoId: 'lBqKAzPEhUU', videoDuration: '6:22',
        quiz: [{ question: 'What is positive reinforcement?', options: ['Punishing negative behaviour', 'Rewarding desired behaviour to encourage its repetition', 'Ignoring all student behaviour', 'Applying strict rules uniformly'], correct: 1, explanation: 'Positive reinforcement adds something desirable (praise, reward, privilege) after a desired behaviour to increase the likelihood it will happen again — far more effective than punishment.' },
               { question: 'What is an IEP?', options: ['A standard lesson plan template', 'An Individualised Education Program for students with special needs', 'A standardised assessment tool', 'A national curriculum guide'], correct: 1, explanation: 'An IEP (Individualised Education Program) is a legally binding document that outlines specific goals and supports for a student with a disability — tailored to their unique needs.' }] },
      { id: 4, title: 'EdTech & Innovation', icon: '💻', description: 'Teach smarter with modern tools. AI, LMS platforms, and data-driven teaching are redefining what education looks like.', skills: ['LMS', 'AI in Education', 'Digital Content', 'Data-Driven Teaching'], videoId: 'yUTLMgtkuuI', videoDuration: '7:09',
        quiz: [{ question: 'What is a Learning Management System (LMS)?', options: ['A physical classroom resource centre', 'Software for delivering, tracking, and managing learning content', 'A digital gradebook only', 'A database of student personal information'], correct: 1, explanation: 'An LMS (like Moodle, Canvas, or Google Classroom) is a platform for delivering courses, tracking progress, hosting content, and communicating with learners — all in one place.' },
               { question: 'What is personalised learning?', options: ['Offering one-to-one private tutoring', 'Tailoring the learning experience to each individual student', 'Reducing class sizes to under 10 students', 'Moving all classes fully online'], correct: 1, explanation: 'Personalised learning uses data, flexible pacing, and varied resources to match each student\'s unique needs, interests, and learning speed — rather than one-size-fits-all instruction.' }] },
    ]
  },
  'Doctor': {
    emoji: '🩺', color: '#DDA0DD', tagline: 'Heal lives with knowledge and heart',
    facts: ['$220k avg physician salary', 'Most trusted profession globally', 'Combines science with compassion', 'Lifelong learning career'],
    steps: [
      { id: 1, title: 'Biology Foundations', icon: '🔬', description: 'Every diagnosis starts here. The human body is the most complex system ever studied — and your textbook.', skills: ['Cell Biology', 'Anatomy', 'Physiology', 'Genetics'], videoId: 'H0nMbkXK4-E', videoDuration: '8:55',
        quiz: [{ question: 'What is a cell?', options: ['A type of battery cell', 'The basic structural and functional unit of all life', 'A molecule made of atoms', 'A type of body tissue'], correct: 1, explanation: 'The cell is the smallest unit of life capable of performing all fundamental functions. The human body contains ~37 trillion cells, each performing specialised roles.' },
               { question: 'What does physiology study?', options: ['The causes and effects of diseases', 'How the body and its systems function normally', 'The structure and inheritance of genes', 'The structure of cells and tissues'], correct: 1, explanation: 'Physiology studies the normal functioning of living organisms and their parts. Knowing what\'s normal is essential for recognising and understanding what has gone wrong.' }] },
      { id: 2, title: 'Medical Sciences', icon: '💊', description: 'From biochemistry to pharmacology — the science behind every treatment, drug, and diagnosis you will make.', skills: ['Pharmacology', 'Pathology', 'Biochemistry', 'Microbiology'], videoId: 'kDIhzAkOEfo', videoDuration: '6:41',
        quiz: [{ question: 'What does pharmacology study?', options: ['The study of plant classification', 'The study of drugs and their effects on the body', 'The study of genetic inheritance', 'The study of cell structure'], correct: 1, explanation: 'Pharmacology studies how drugs interact with biological systems — mechanisms of action, side effects, dosing, and interactions — essential for safe and effective prescribing.' },
               { question: 'What is pathology?', options: ['The study of plant diseases', 'The study of the nature, causes, and effects of disease', 'The study of normal human anatomy', 'The study of drug interactions'], correct: 1, explanation: 'Pathology examines what goes wrong in disease — at the cellular, tissue, and organ level. Pathologists diagnose disease from biopsies, blood tests, and autopsies.' }] },
      { id: 3, title: 'Clinical Skills', icon: '🏥', description: 'Patient care in practice. This is where textbooks meet real human beings — where empathy is as vital as knowledge.', skills: ['Diagnosis', 'Patient Communication', 'Clinical Ethics', 'Procedures'], videoId: 'Jq1OFcEiLes', videoDuration: '5:50',
        quiz: [{ question: 'What is a differential diagnosis?', options: ['Confirming a single definitive cause', 'A ranked list of possible conditions explaining the symptoms', 'A specific treatment plan for one condition', 'A specialised type of surgical procedure'], correct: 1, explanation: 'A differential diagnosis is the list of possible conditions that could explain a patient\'s symptoms, ranked by likelihood. Doctors narrow it down through tests and history.' },
               { question: 'What is informed consent?', options: ['The patient signing a standard form', 'The patient understanding and voluntarily agreeing to treatment', 'The doctor deciding the best treatment', 'Insurance company approval for a procedure'], correct: 1, explanation: 'Informed consent requires that patients are given clear information about a treatment — its risks, benefits, and alternatives — and freely agree to it. It is a legal and ethical cornerstone of medicine.' }] },
      { id: 4, title: 'Specialisation & Research', icon: '🔭', description: 'Choose your specialty and keep learning for life. Medicine advances every year — the best doctors never stop.', skills: ['Research Methods', 'Specialty Choice', 'Evidence-Based Medicine', 'Continuous Learning'], videoId: 'F3Ztb3lT4Ks', videoDuration: '7:33',
        quiz: [{ question: 'Why is medical research important?', options: ['Primarily to publish academic papers', 'It advances evidence-based care and improves patient outcomes', 'It is only relevant for professors and academics', 'It is only needed for rare diseases'], correct: 1, explanation: 'Medical research generates the evidence base that guides clinical decisions. Without it, medicine would stagnate and treatments would remain based on tradition rather than proof.' },
               { question: 'What is evidence-based medicine (EBM)?', options: ['Using only the oldest and most established treatments', 'Integrating the best current research with clinical expertise and patient values', 'Making decisions based solely on doctor intuition', 'Following only patient preferences regardless of evidence'], correct: 1, explanation: 'EBM combines the best available research evidence, the clinician\'s expertise, and the patient\'s values and circumstances to make optimal clinical decisions.' }] },
    ]
  },
  'Game Developer': {
    emoji: '🎮', color: '#98D8C8', tagline: 'Build worlds people escape into',
    facts: ['Gaming industry: $200B+ market', 'Indies can earn millions solo', 'Combines art, code & design', 'Remote-friendly career'],
    steps: [
      { id: 1, title: 'Game Design Basics', icon: '🎲', description: 'Understand why games feel fun. Without design principles, even beautiful games feel empty and forgettable.', skills: ['Game Loops', 'Player Psychology', 'Level Design', 'Game Feel'], videoId: 'G8AT01tuyrk', videoDuration: '6:25',
        quiz: [{ question: 'What is a core game loop?', options: ['A programming bug that causes infinite looping', 'The repeating cycle of actions that forms the heart of gameplay', 'A specific level in a game', 'A type of character movement'], correct: 1, explanation: 'The core game loop is the fundamental cycle players repeat (e.g., explore → fight → loot → level up → explore). A compelling loop is what makes players stay for hours.' },
               { question: 'What primarily makes a game fun?', options: ['High-quality 3D graphics only', 'The right balance of challenge, feedback, and meaningful reward', 'Extremely long cutscenes and story', 'Perfect photorealistic visuals'], correct: 1, explanation: 'Fun emerges from a balance of challenge (not too hard, not too easy), clear feedback (players know what happened and why), and meaningful rewards that make progress feel worthwhile.' }] },
      { id: 2, title: 'Programming for Games', icon: '⚙️', description: 'Code that runs at 60 frames per second. Games are one of the most demanding programming environments that exist.', skills: ['C# or C++', 'Physics Systems', 'Collision Detection', 'Performance Optimisation'], videoId: 'vn8W_R0K0vc', videoDuration: '8:12',
        quiz: [{ question: 'What is a game engine?', options: ['The actual engine inside a gaming PC', 'A software framework providing tools and systems for building games', 'A type of graphics processing card', 'A surround sound system for games'], correct: 1, explanation: 'A game engine (like Unity or Unreal) provides rendering, physics, audio, input, and scripting systems — saving developers from building everything from scratch.' },
               { question: 'What is collision detection?', options: ['Finding and fixing code bugs', 'Detecting when game objects overlap or intersect in the game world', 'The process of rendering frames to the screen', 'Playing sound effects in games'], correct: 1, explanation: 'Collision detection determines when two objects in a game world occupy the same space — essential for walls you cannot walk through, bullets hitting targets, and character physics.' }] },
      { id: 3, title: 'Unity / Unreal Engine', icon: '🛠️', description: 'Master the tools that ship 80% of commercial games. These engines power everything from mobile apps to AAA blockbusters.', skills: ['Scene Building', 'C# Scripting', 'Assets & Shaders', 'Animation Systems'], videoId: 'gB1F9G0JXOo', videoDuration: '9:44',
        quiz: [{ question: 'What is Unity primarily used for?', options: ['Video editing and post-production', 'Building 2D and 3D games and interactive experiences', 'Web application development', 'Scientific data analysis'], correct: 1, explanation: 'Unity is one of the most popular game engines, supporting 2D, 3D, VR, and AR. It uses C# for scripting and powers games across mobile, console, PC, and beyond.' },
               { question: 'What is a shader in game development?', options: ['A light bulb or lighting fixture', 'A program that runs on the GPU to determine how pixels are rendered', 'A type of texture image file', 'A type of audio sound file'], correct: 1, explanation: 'Shaders are programs executed on the GPU that control how surfaces look — their color, reflectivity, transparency, and visual effects. They are what make games look visually stunning.' }] },
      { id: 4, title: 'Launch & Monetise', icon: '🚀', description: 'Ship your game and turn your passion into income. The best game no one can find earns nothing.', skills: ['Publishing Platforms', 'Monetisation Models', 'Marketing', 'Community Building'], videoId: 'yUTLMgtkuuI', videoDuration: '5:58',
        quiz: [{ question: 'What is a soft launch?', options: ['Cancelling a planned game release', 'Releasing a game in limited markets to test and gather feedback', 'Releasing a completely free version forever', 'Publishing a beta version only to friends'], correct: 1, explanation: 'A soft launch releases the game in select regions or to a limited audience before the full global launch. It reveals real bugs, monetisation issues, and retention problems cheaply.' },
               { question: 'What is an in-app purchase (IAP)?', options: ['The initial price to download the game', 'Optional purchases made within a free game for items or features', 'A monthly subscription fee', 'A banner advertisement in the game'], correct: 1, explanation: 'IAPs allow players to buy virtual items, currency, cosmetics, or features inside a game — often the primary revenue model for free-to-play mobile games.' }] },
    ]
  },
  'Designer': {
    emoji: '🎨', color: '#F7DC6F', tagline: 'Create beauty with purpose',
    facts: ['$85k avg UX designer salary', 'Every product needs a designer', 'Most creative technical role', 'Figma is now industry standard'],
    steps: [
      { id: 1, title: 'Design Principles', icon: '📐', description: 'The rules before you break them. Every great designer knows these principles deeply — and uses them to communicate powerfully.', skills: ['Colour Theory', 'Typography', 'Composition', 'Hierarchy'], videoId: 'YqQx75OPRa0', videoDuration: '7:33',
        quiz: [{ question: 'What is the rule of thirds in composition?', options: ['Always using exactly three colors in a design', 'A grid-based guide for placing visual elements at intersection points', 'Using three different typefaces in one design', 'Dividing a design into three equal text sections'], correct: 1, explanation: 'The rule of thirds divides a frame into a 3×3 grid. Placing key elements at the grid intersections creates natural, balanced compositions that feel more engaging than centred placement.' },
               { question: 'What is kerning in typography?', options: ['The overall height of letterforms', 'The spacing adjustment between individual letter pairs', 'The weight or thickness of a font', 'The spacing between lines of text'], correct: 1, explanation: 'Kerning adjusts the space between specific pairs of letters (like "AV" or "To") that would otherwise look awkwardly spaced. Good kerning is invisible; bad kerning screams amateur.' }] },
      { id: 2, title: 'UI Design', icon: '📱', description: 'Build interfaces people love to use. Good UI is invisible — users just accomplish their goals without thinking about the design.', skills: ['Wireframing', 'Components', 'Design Systems', 'Accessibility'], videoId: 'c9Wg6Cb_YlU', videoDuration: '6:18',
        quiz: [{ question: 'What is a wireframe?', options: ['A metal structural frame for a building', 'A low-fidelity layout sketch showing structure without visual design', 'The final polished UI design ready for development', 'A clickable prototype for user testing'], correct: 1, explanation: 'A wireframe is a simple, low-fidelity sketch (digital or paper) showing the layout and structure of an interface — without colors, fonts, or imagery. It focuses purely on placement and flow.' },
               { question: 'What is a design system?', options: ['An operating system for designers', 'A collection of reusable components, patterns, and guidelines for consistent design', 'A single color palette document', 'A library of font families'], correct: 1, explanation: 'A design system (like Google\'s Material Design) is the single source of truth for a product\'s design — containing components, tokens, guidelines, and principles used consistently across the product.' }] },
      { id: 3, title: 'UX Research', icon: '🔍', description: 'Design for real humans, not hypothetical ones. Research replaces assumptions with evidence — and saves enormous rework.', skills: ['User Interviews', 'Usability Testing', 'Personas', 'Journey Mapping'], videoId: 'tKUT-_SxEck', videoDuration: '5:44',
        quiz: [{ question: 'What is a user persona?', options: ['An actual real user participating in research', 'A fictional character representing a segment of your target audience', 'A formal survey sent to customers', 'A standard UI design pattern'], correct: 1, explanation: 'A persona is a fictional but research-grounded character representing a key user group — their goals, frustrations, behaviors, and context. It keeps the team focused on real human needs.' },
               { question: 'What is usability testing?', options: ['Testing your code for software bugs', 'Observing real users attempting to complete tasks with your product', 'A team design review or critique session', 'A/B testing two different visual designs'], correct: 1, explanation: 'Usability testing puts real users in front of your design with specific tasks and observes where they struggle, get confused, or fail. It reveals problems that designers are too close to see.' }] },
      { id: 4, title: 'Figma & Portfolio', icon: '💼', description: 'Master the tool every design team uses. Your portfolio is your CV — show real work, real process, real thinking.', skills: ['Figma', 'Prototyping', 'Portfolio Building', 'Case Studies'], videoId: 'FTFaQWZBqQ8', videoDuration: '8:20',
        quiz: [{ question: 'What is Figma?', options: ['A type of camera for product photography', 'A collaborative interface design tool used across the industry', 'A programming language for web design', 'A relational database management system'], correct: 1, explanation: 'Figma is the industry-standard collaborative design tool where teams design, prototype, and hand off to developers — all in the browser, in real-time, together.' },
               { question: 'Why is a portfolio critical for a designer?', options: ['It is not important — degrees matter more', 'It demonstrates your actual design thinking and skills to employers', 'It is mainly used for social media presence', 'It is a legal requirement for the design profession'], correct: 1, explanation: 'Designers are hired on portfolio, not CV. Your portfolio shows how you think, how you solve problems, and the quality of your output. A strong portfolio opens every door.' }] },
    ]
  },
}

// ─── YouTube Video Player ─────────────────────────────────────────────────────
function StepVideo({ videoId, onEnded }: { videoId: string; onEnded: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)

  useEffect(() => {
    if (!document.getElementById('yt-api-script')) {
      const tag = document.createElement('script')
      tag.id = 'yt-api-script'
      tag.src = 'https://www.youtube.com/iframe_api'
      document.body.appendChild(tag)
    }

    const initPlayer = () => {
      if (playerRef.current) { try { playerRef.current.destroy() } catch(_) {} playerRef.current = null }
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
        const div = document.createElement('div')
        div.id = `yt-career-${videoId}`
        containerRef.current.appendChild(div)
      }
      playerRef.current = new window.YT.Player(`yt-career-${videoId}`, {
        videoId,
        playerVars: { rel: 0, modestbranding: 1 },
        width: '100%', height: '100%',
        events: {
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.ENDED) onEnded()
          }
        }
      })
    }

    if (window.YT && window.YT.Player) initPlayer()
    else {
      const prev = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => { if (prev) prev(); initPlayer() }
    }

    return () => { if (playerRef.current) { try { playerRef.current.destroy() } catch(_) {} playerRef.current = null } }
  }, [videoId])

  return (
    <div className="aspect-video bg-black rounded-xl overflow-hidden relative">
      <div ref={containerRef} className="absolute inset-0 w-full h-full">
        <div id={`yt-career-${videoId}`} className="w-full h-full" />
      </div>
    </div>
  )
}

// ─── Quiz (mirrors MCQEngine style: answering → correct/wrong → approach → analysis) ──
type QuizState = 'answering' | 'correct' | 'wrong' | 'approach' | 'done'

function StepQuiz({ questions, color, onPass }: {
  questions: { question: string; options: string[]; correct: number; explanation: string }[]
  color: string; onPass: () => void
}) {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [state, setState] = useState<QuizState>('answering')
  const [approach, setApproach] = useState('')
  const [score, setScore] = useState(0)
  const [allDone, setAllDone] = useState(false)
  const [passed, setPassed] = useState(false)

  const q = questions[idx]

  function reset() { setIdx(0); setSelected(null); setState('answering'); setApproach(''); setScore(0); setAllDone(false); setPassed(false) }

  function handleSelect(i: number) {
    if (state !== 'answering') return
    setSelected(i)
    if (i === q.correct) { setState('correct'); setScore(s => s + 1) }
    else setState('wrong')
  }

  function handleNext() {
    const nextIdx = idx + 1
    if (nextIdx < questions.length) { setIdx(nextIdx); setSelected(null); setState('answering'); setApproach('') }
    else {
      const finalScore = score + (state === 'correct' ? 1 : 0)
      setAllDone(true)
      setPassed(finalScore >= Math.ceil(questions.length / 2))
    }
  }

  if (allDone && passed) return (
    <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
      <div className="text-6xl mb-3">🎉</div>
      <p className="font-bold text-2xl text-[#111] mb-1">Quiz Passed!</p>
      <p className="text-[#666] text-sm mb-6">Next stop is now unlocked 🔓</p>
      <button onClick={onPass} className="px-8 py-3 text-white font-bold text-sm border-2 border-[#111] hover:opacity-90 transition-opacity"
        style={{ backgroundColor: color, boxShadow: '3px 3px 0 #111' }}>
        Continue Journey →
      </button>
    </motion.div>
  )

  if (allDone && !passed) return (
    <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
      <div className="text-5xl mb-3">😅</div>
      <p className="font-bold text-xl text-[#111] mb-1">Not quite — rewatch and retry</p>
      <p className="text-[#666] text-sm mb-6">You need at least {Math.ceil(questions.length / 2)}/{questions.length} correct</p>
      <button onClick={reset} className="px-8 py-3 bg-[#111] text-white font-bold text-sm border-2 border-[#111] hover:bg-[#333] transition-colors" style={{ boxShadow: '3px 3px 0 #555' }}>
        Try Again
      </button>
    </motion.div>
  )

  const optionStyle = (i: number) => {
    const base = 'w-full text-left px-4 py-3.5 border-2 font-body text-sm transition-all flex items-center gap-3 '
    if (state === 'answering') return base + 'border-[#e5e7eb] hover:border-[#111] hover:bg-[#FAFAFA] cursor-pointer text-[#333]'
    if (i === q.correct) return base + 'border-green-500 bg-green-50 text-green-800 font-semibold'
    if (i === selected && i !== q.correct) return base + 'border-red-400 bg-red-50 text-red-700'
    return base + 'border-[#e5e7eb] text-[#bbb]'
  }

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs font-bold text-[#999] uppercase tracking-wider">Question {idx + 1} of {questions.length}</p>
        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <div key={i} className="w-8 h-1.5 rounded-full" style={{ backgroundColor: i < idx ? color : i === idx ? color + '80' : '#e5e7eb' }} />
          ))}
        </div>
      </div>

      <p className="font-bold text-[#111] text-base mb-5 leading-snug">{q.question}</p>

      {/* Options */}
      <div className="space-y-2.5 mb-4">
        {q.options.map((opt, i) => (
          <button key={i} onClick={() => handleSelect(i)} disabled={state !== 'answering'} className={optionStyle(i)}>
            <span className="w-6 h-6 flex-shrink-0 flex items-center justify-center border text-xs font-bold rounded-full"
              style={{ borderColor: state === 'answering' ? '#ddd' : i === q.correct ? '#22c55e' : i === selected ? '#f87171' : '#ddd', backgroundColor: state === 'answering' ? 'white' : i === q.correct ? '#dcfce7' : i === selected ? '#fee2e2' : 'white' }}>
              {String.fromCharCode(65 + i)}
            </span>
            {opt}
          </button>
        ))}
      </div>

      {/* CORRECT state */}
      <AnimatePresence>
        {state === 'correct' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
            <div className="border-2 border-green-400 bg-green-50 rounded-xl p-4 mb-3">
              <p className="font-bold text-green-700 mb-1">✅ Correct!</p>
              <p className="text-green-700 text-sm leading-relaxed">{q.explanation}</p>
            </div>
            <button onClick={handleNext} className="w-full py-3 text-white font-bold text-sm border-2 border-[#111] hover:opacity-90 transition-opacity"
              style={{ backgroundColor: color, boxShadow: '3px 3px 0 #111' }}>
              {idx + 1 < questions.length ? 'Next Question →' : 'See Result →'}
            </button>
          </motion.div>
        )}

        {/* WRONG state */}
        {state === 'wrong' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
            <div className="border-2 border-red-300 bg-red-50 rounded-xl p-4 mb-3">
              <p className="font-bold text-red-600 mb-1">❌ Incorrect</p>
              <p className="text-red-600 text-sm">Correct answer: <span className="font-bold">{q.options[q.correct]}</span></p>
            </div>
            <button onClick={() => setState('approach')} className="w-full py-3 bg-[#111] text-white font-bold text-sm border-2 border-[#111] hover:bg-[#333] transition-colors mb-2"
              style={{ boxShadow: '3px 3px 0 #555' }}>
              What went wrong? →
            </button>
          </motion.div>
        )}

        {/* APPROACH INPUT state */}
        {state === 'approach' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mb-4">
            <div className="border-2 border-[#ddd] bg-[#fafafa] rounded-xl p-4 mb-3">
              <p className="font-bold text-[#111] text-sm mb-2">🧠 What was your thinking?</p>
              <p className="text-[#666] text-xs mb-3">This helps identify exactly where the gap is</p>
              <textarea value={approach} onChange={e => setApproach(e.target.value)}
                placeholder="e.g. I thought it meant the average of all values..."
                className="w-full bg-white border border-[#ddd] rounded-lg p-3 text-[#111] text-sm resize-none outline-none focus:border-[#111] min-h-[70px] font-body" />
            </div>
            <div className="border-2 border-amber-200 bg-amber-50 rounded-xl p-4 mb-3">
              <p className="font-bold text-amber-800 text-sm mb-1">📖 Explanation</p>
              <p className="text-amber-800 text-sm leading-relaxed">{q.explanation}</p>
            </div>
            <button onClick={handleNext} className="w-full py-3 text-white font-bold text-sm border-2 border-[#111] hover:opacity-90 transition-opacity"
              style={{ backgroundColor: color, boxShadow: '3px 3px 0 #111' }}>
              {idx + 1 < questions.length ? 'Next Question →' : 'See Result →'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Right-side info panel ────────────────────────────────────────────────────
function CareerInfoPanel({ career, careerName, completedSteps, totalSteps }: {
  career: any; careerName: string; completedSteps: number[]; totalSteps: number
}) {
  return (
    <div className="space-y-4">
      {/* Career overview card */}
      <div className="border-2 border-[#111] bg-white p-5" style={{ boxShadow: '4px 4px 0 #111' }}>
        <p className="text-xs font-bold text-[#999] uppercase tracking-widest mb-3">Career Overview</p>
        <div className="grid grid-cols-2 gap-3">
          {career.facts.map((fact: string, i: number) => (
            <div key={i} className="flex items-start gap-2 p-3 border border-[#eee] bg-[#fafafa]">
              <span className="text-base mt-0.5">{['💰','📈','🌍','⭐'][i]}</span>
              <p className="text-xs text-[#444] font-medium leading-snug">{fact}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Journey progress */}
      <div className="border-2 border-[#111] bg-white p-5" style={{ boxShadow: '4px 4px 0 #111' }}>
        <p className="text-xs font-bold text-[#999] uppercase tracking-widest mb-3">Your Journey</p>
        <div className="space-y-2">
          {Array.from({ length: totalSteps }, (_, i) => {
            const done = completedSteps.includes(i)
            const step = career.steps[i]
            return (
              <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg border ${done ? 'border-green-300 bg-green-50' : 'border-[#eee] bg-[#fafafa]'}`}>
                <span className={`w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full text-xs font-bold border ${done ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-[#ddd] text-[#999]'}`}>
                  {done ? '✓' : i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold truncate ${done ? 'text-green-700' : 'text-[#444]'}`}>{step.title}</p>
                  <p className="text-xs text-[#999]">{step.videoDuration} video · {step.quiz.length} questions</p>
                </div>
                {done && <span className="text-green-500 text-sm">✓</span>}
              </div>
            )
          })}
        </div>
      </div>

      {/* Tips card */}
      <div className="border-2 border-[#111] p-5" style={{ backgroundColor: career.color + '15', boxShadow: '4px 4px 0 #111' }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: career.color }}>Pro Tips</p>
        <div className="space-y-2.5">
          {['Watch each video in full before attempting the quiz', 'If you get a question wrong, read the explanation carefully', 'Take notes while watching — it improves retention by 40%', 'Complete all stops to unlock your career certificate'].map((tip, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-xs font-bold mt-0.5" style={{ color: career.color }}>→</span>
              <p className="text-xs text-[#444] leading-snug">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CareerRoadmap() {
  const [searchParams] = useSearchParams()
  const careerName = searchParams.get('career') || 'AI Engineer'
  const career = careerData[careerName] || careerData['AI Engineer']

  const [unlockedUpTo, setUnlockedUpTo] = useState(0)
  const [activeStep, setActiveStep] = useState<number | null>(null)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [stepPhase, setStepPhase] = useState<'overview' | 'video' | 'quiz'>('overview')
  const [videoEnded, setVideoEnded] = useState(false)

  useEffect(() => {
    setUnlockedUpTo(0); setActiveStep(null); setCompletedSteps([])
    setStepPhase('overview'); setVideoEnded(false)
  }, [careerName])

  function handleStepClick(idx: number) {
    if (idx > unlockedUpTo) return
    setActiveStep(idx); setStepPhase('overview'); setVideoEnded(false)
  }

  function handleQuizPass() {
    if (activeStep === null) return
    const newCompleted = [...completedSteps, activeStep]
    setCompletedSteps(newCompleted)
    setUnlockedUpTo(Math.max(unlockedUpTo, activeStep + 1))
    const next = activeStep + 1
    setTimeout(() => {
      if (next < career.steps.length) { setActiveStep(next); setStepPhase('overview'); setVideoEnded(false) }
      else setActiveStep(null)
    }, 700)
  }

  const step = activeStep !== null ? career.steps[activeStep] : null
  const progressPct = Math.round((completedSteps.length / career.steps.length) * 100)

  return (
    <div className="min-h-screen bg-[#FFFAF6] pt-20 font-body">
      {/* Header */}
      <div className="bg-white border-b-2 border-[#111] px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <Link to="/courses" className="text-xs font-bold text-[#999] hover:text-[#111] mb-3 inline-flex items-center gap-1 transition-colors">← Back</Link>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 text-3xl flex items-center justify-center border-2 border-[#111] flex-shrink-0"
                style={{ backgroundColor: career.color + '30', boxShadow: '3px 3px 0 #111' }}>
                {career.emoji}
              </div>
              <div>
                <p className="text-xs font-bold text-[#999] uppercase tracking-widest">Career Roadmap</p>
                <h1 className="font-bold text-2xl text-[#111]">{careerName}</h1>
                <p className="text-[#666] text-sm">{career.tagline}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-[#999] mb-1">{completedSteps.length}/{career.steps.length} stops complete</p>
              <div className="w-44 h-2 bg-[#eee] border border-[#ddd] rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full" style={{ backgroundColor: career.color }}
                  animate={{ width: `${progressPct}%` }} transition={{ duration: 0.6 }} />
              </div>
              <p className="text-xs font-bold mt-1" style={{ color: career.color }}>{progressPct}% complete</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-[300px_1fr_280px] gap-8 items-start">

        {/* ── LEFT: Vertical stop list (same as before) ── */}
        <div className="relative lg:sticky lg:top-28">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[#ddd]" />
          <div className="space-y-4">
            {career.steps.map((s: any, idx: number) => {
              const isUnlocked = idx <= unlockedUpTo
              const isCompleted = completedSteps.includes(idx)
              const isActive = activeStep === idx
              return (
                <motion.div key={s.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.08 }}>
                  <button onClick={() => handleStepClick(idx)} disabled={!isUnlocked}
                    className={`w-full text-left flex items-start gap-4 p-4 border-2 transition-all duration-200 relative ${
                      isActive ? 'border-[#111] bg-white' : isCompleted ? 'border-green-400 bg-green-50 hover:border-green-600' : isUnlocked ? 'border-[#111] bg-white hover:bg-[#FFFAF6]' : 'border-[#ddd] bg-[#f9f9f9] opacity-40 cursor-not-allowed'
                    }`}
                    style={isActive ? { boxShadow: `4px 4px 0 ${career.color}` } : isCompleted ? { boxShadow: '4px 4px 0 #4ade80' } : isUnlocked ? { boxShadow: '3px 3px 0 #111' } : {}}>
                    <div className={`w-9 h-9 flex-shrink-0 flex items-center justify-center border-2 text-base relative z-10 ${isCompleted ? 'border-green-500 bg-green-100' : isActive ? 'border-[#111]' : isUnlocked ? 'border-[#111] bg-white' : 'border-[#ddd] bg-[#f0f0f0]'}`}
                      style={{ backgroundColor: isActive ? career.color + '30' : undefined }}>
                      {isCompleted ? '✓' : isUnlocked ? s.icon : '🔒'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-xs font-bold text-[#999] uppercase tracking-wider">Stop {s.id}</span>
                        {isCompleted && <span className="text-xs font-bold text-green-600">✓</span>}
                        {!isUnlocked && <span className="text-xs text-[#bbb]">🔒</span>}
                      </div>
                      <p className="font-bold text-[#111] text-sm leading-tight">{s.title}</p>
                      <p className="text-xs text-[#999] mt-0.5">{s.videoDuration} · {s.quiz.length}Q quiz</p>
                    </div>
                    <span className="text-[#bbb] text-sm flex-shrink-0">{isActive ? '▶' : '›'}</span>
                  </button>
                </motion.div>
              )
            })}
            {completedSteps.length === career.steps.length && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="border-2 border-[#111] bg-[#111] text-white p-5 text-center"
                style={{ boxShadow: `5px 5px 0 ${career.color}` }}>
                <div className="text-3xl mb-2">🏆</div>
                <p className="font-bold text-base">Roadmap Complete!</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* ── CENTRE: Step content ── */}
        <div>
          <AnimatePresence mode="wait">
            {activeStep === null ? (
              <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="border-2 border-[#111] bg-white overflow-hidden" style={{ boxShadow: '5px 5px 0 #111' }}>
                <div className="px-8 py-10 text-center border-b-2 border-[#111]" style={{ backgroundColor: career.color + '15' }}>
                  <div className="text-5xl mb-4">{career.emoji}</div>
                  <h2 className="font-bold text-2xl text-[#111] mb-2">Ready to become a {careerName}?</h2>
                  <p className="text-[#666] text-sm max-w-sm mx-auto">Your roadmap has <strong>{career.steps.length} stops</strong>. At each stop, watch a video then pass a short quiz to unlock the next milestone.</p>
                </div>
                <div className="p-6 grid grid-cols-2 gap-3 border-b-2 border-[#111]">
                  {career.steps.map((s: any, i: number) => (
                    <div key={i} className="flex items-center gap-2.5 p-3 border border-[#eee] bg-[#fafafa]">
                      <span className="text-xl">{s.icon}</span>
                      <div>
                        <p className="font-bold text-xs text-[#111]">{s.title}</p>
                        <p className="text-xs text-[#999]">{s.videoDuration} video</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-6 text-center">
                  <button onClick={() => handleStepClick(0)}
                    className="px-10 py-4 text-white font-bold border-2 border-[#111] hover:opacity-90 transition-opacity text-sm"
                    style={{ backgroundColor: career.color, boxShadow: '4px 4px 0 #111' }}>
                    🚀 Start Stop 1
                  </button>
                </div>
              </motion.div>
            ) : step && (
              <motion.div key={`step-${activeStep}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="border-2 border-[#111] bg-white overflow-hidden" style={{ boxShadow: '5px 5px 0 #111' }}>

                {/* Step header */}
                <div className="px-6 py-4 border-b-2 border-[#111] flex items-center gap-3" style={{ backgroundColor: career.color + '15' }}>
                  <span className="text-2xl">{step.icon}</span>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#999] uppercase tracking-wider">Stop {step.id} of {career.steps.length}</p>
                    <p className="font-bold text-[#111] text-lg leading-tight">{step.title}</p>
                  </div>
                  {/* Phase tabs */}
                  <div className="flex gap-1.5">
                    {(['overview','video','quiz'] as const).map(phase => (
                      <span key={phase} className={`text-xs font-bold px-2.5 py-1 border ${stepPhase === phase ? 'text-white border-[#111]' : 'border-[#ddd] text-[#aaa]'}`}
                        style={stepPhase === phase ? { backgroundColor: career.color } : {}}>
                        {phase === 'overview' ? '📋' : phase === 'video' ? '📹' : '📝'} {phase.charAt(0).toUpperCase() + phase.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-6">
                  {/* OVERVIEW PHASE */}
                  {stepPhase === 'overview' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <p className="text-[#555] text-sm mb-5 leading-relaxed">{step.description}</p>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#999] mb-3">What you will learn</p>
                      <div className="grid grid-cols-2 gap-2 mb-6">
                        {step.skills.map((sk: string) => (
                          <div key={sk} className="flex items-center gap-2 text-sm text-[#333] p-2.5 border border-[#eee] bg-[#fafafa]">
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: career.color }} />
                            {sk}
                          </div>
                        ))}
                      </div>
                      <div className="border-2 border-[#eee] p-4 bg-[#fafafa] flex items-center justify-between mb-5">
                        <div>
                          <p className="font-bold text-sm text-[#111]">📹 Video Lesson</p>
                          <p className="text-xs text-[#999]">{step.videoDuration} · Watch fully to unlock quiz</p>
                        </div>
                        <p className="text-xs text-[#999]">📝 {step.quiz.length} quiz questions</p>
                      </div>
                      {completedSteps.includes(activeStep) ? (
                        <div className="border-2 border-green-400 bg-green-50 p-4 text-center">
                          <p className="font-bold text-green-700">✓ Stop Completed! Well done.</p>
                        </div>
                      ) : (
                        <button onClick={() => setStepPhase('video')}
                          className="w-full py-3.5 text-white font-bold text-sm border-2 border-[#111] hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: career.color, boxShadow: '3px 3px 0 #111' }}>
                          📹 Watch the Lesson →
                        </button>
                      )}
                    </motion.div>
                  )}

                  {/* VIDEO PHASE */}
                  {stepPhase === 'video' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <StepVideo key={`vid-${activeStep}`} videoId={step.videoId} onEnded={() => setVideoEnded(true)} />

                      <div className="mt-4 flex items-center justify-between border-2 border-[#eee] p-4 bg-[#fafafa]">
                        <div>
                          <p className="font-bold text-sm text-[#111]">{step.title}</p>
                          <p className="text-xs text-[#999]">⏱ {step.videoDuration}</p>
                        </div>
                        {!videoEnded ? (
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🔒</span>
                            <div>
                              <p className="text-xs font-bold text-[#111]">Quiz Locked</p>
                              <p className="text-xs text-[#999]">Finish video to unlock</p>
                            </div>
                          </div>
                        ) : (
                          <motion.button initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                            onClick={() => setStepPhase('quiz')}
                            className="px-5 py-2.5 text-white font-bold text-sm border-2 border-[#111] hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: career.color, boxShadow: '3px 3px 0 #111' }}>
                            🎯 Take Quiz →
                          </motion.button>
                        )}
                      </div>

                      <button onClick={() => setStepPhase('overview')} className="mt-3 text-xs text-[#999] hover:text-[#111] font-bold transition-colors">← Back to Overview</button>
                    </motion.div>
                  )}

                  {/* QUIZ PHASE */}
                  {stepPhase === 'quiz' && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                      <div className="mb-5 flex items-center gap-3 p-4 border border-[#eee] bg-[#fafafa]">
                        <span className="text-2xl">📝</span>
                        <div className="flex-1">
                          <p className="font-bold text-sm text-[#111]">Quiz: {step.title}</p>
                          <p className="text-xs text-[#999]">Answer correctly to unlock the next stop</p>
                        </div>
                        <button onClick={() => { setStepPhase('video'); setVideoEnded(false) }}
                          className="text-xs text-[#999] hover:text-[#111] font-bold border border-[#ddd] px-3 py-1.5 hover:border-[#111] transition-colors">
                          ← Rewatch
                        </button>
                      </div>
                      <StepQuiz key={`quiz-${activeStep}`} questions={step.quiz} color={career.color} onPass={handleQuizPass} />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── RIGHT: Info panel ── */}
        <div className="lg:sticky lg:top-28">
          <CareerInfoPanel career={career} careerName={careerName} completedSteps={completedSteps} totalSteps={career.steps.length} />
        </div>

      </div>
    </div>
  )
}