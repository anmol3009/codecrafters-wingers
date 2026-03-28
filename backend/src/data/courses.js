/**
 * SARASWATI – Courses Catalogue 
 * Merged Backend fully-implemented sections with Frontend Aesthetic tokens
 */

const courses = [
    {
    "id": "algebra-foundations",
    "title": "Trigonometric Functions",
    "subject": "Mathematics",
    "level": "Beginner",
    "price": 4900,
    "duration": "6 weeks",
    "validity": "12 months",
    "thumbnail": "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&auto=format&fit=crop",
    "description": "Master the fundamental concepts of sine, cosine, tangent and circular motion from the ground up.",
    "prerequisites": [
      "Geometry",
      "Basic Algebra"
    ],
    "rating": 4.8,
    "students": 2840,
    "syllabus": [
      {
        "id": "trig-01",
        "title": "Introduction to Right Triangles",
        "videoUrl": "https://www.youtube.com/watch?v=Jsiy4TxgIME",
        "duration": "14:30",
        "conceptTag": "Trigonometry Basics",
        "unlockAfter": null,
        "mcqs": [
          {
            "id": "trig-q1a",
            "question": "What does SOH CAH TOA stand for?",
            "options": [
              "Sine=Opposite/Hypotenuse, Cosine=Adjacent/Hypotenuse, Tangent=Opposite/Adjacent",
              "Sine=Adjacent/Hypotenuse, Cosine=Opposite/Hypotenuse, Tangent=Opposite/Adjacent",
              "Sine=Opposite/Adjacent, Cosine=Hypotenuse/Adjacent, Tangent=Hypotenuse/Opposite",
              "Sine=Hypotenuse/Opposite, Cosine=Hypotenuse/Adjacent, Tangent=Adjacent/Opposite"
            ],
            "correctAnswer": 0,
            "explanation": "SOH CAH TOA is a mnemonic to remember the definitions of the basic trigonometric functions for a right triangle.",
            "conceptTag": "Trigonometry Basics"
          },
          {
            "id": "trig-q1b",
            "question": "In a right triangle, the longest side is called the:",
            "options": [
              "Opposite",
              "Adjacent",
              "Hypotenuse",
              "Base"
            ],
            "correctAnswer": 2,
            "explanation": "The hypotenuse is the longest side of a right-angled triangle, always opposite to the right angle.",
            "conceptTag": "Trigonometry Basics"
          },
          {
            "id": "trig-q1c",
            "question": "What is the sine of a 30-degree angle?",
            "options": [
              "1",
              "0.5",
              "0.866",
              "0"
            ],
            "correctAnswer": 1,
            "explanation": "In a 30-60-90 triangle, the exact value of sin(30°) is 1/2 or 0.5.",
            "conceptTag": "Trigonometry Basics"
          }
        ],
        "videoId": "Jsiy4TxgIME",
        "locked": false
      },
      {
        "id": "trig-02",
        "title": "The Unit Circle",
        "videoUrl": "https://www.youtube.com/watch?v=1m9pKisJpII",
        "duration": "18:45",
        "conceptTag": "Unit Circle",
        "unlockAfter": "trig-01",
        "mcqs": [
          {
            "id": "trig-q2a",
            "question": "What is the radius of the unit circle?",
            "options": [
              "π",
              "2π",
              "1",
              "0"
            ],
            "correctAnswer": 2,
            "explanation": "The unit circle is defined as a circle with a radius of exactly 1.",
            "conceptTag": "Unit Circle"
          },
          {
            "id": "trig-q2b",
            "question": "On the unit circle, the x-coordinate of a point represents:",
            "options": [
              "sine",
              "cosine",
              "tangent",
              "cotangent"
            ],
            "correctAnswer": 1,
            "explanation": "For any angle θ, the coordinates on the unit circle are (cos(θ), sin(θ)). Thus, x represents cosine.",
            "conceptTag": "Unit Circle"
          },
          {
            "id": "trig-q2c",
            "question": "What is the value of cos(90°)?",
            "options": [
              "1",
              "-1",
              "0",
              "Undefined"
            ],
            "correctAnswer": 2,
            "explanation": "At 90 degrees (or π/2 radians), the point on the unit circle is (0, 1). The x-coordinate (cosine) is 0.",
            "conceptTag": "Unit Circle"
          }
        ],
        "videoId": "1m9pKisJpII",
        "locked": true
      },
      {
        "id": "trig-03",
        "title": "Graphing Sine and Cosine",
        "videoUrl": "https://www.youtube.com/watch?v=0_uEheWw01U",
        "duration": "22:20",
        "conceptTag": "Sine Waves",
        "unlockAfter": "trig-02",
        "mcqs": [
          {
            "id": "trig-q3a",
            "question": "What is the amplitude of y = 3sin(x)?",
            "options": [
              "1",
              "3",
              "2π",
              "π/3"
            ],
            "correctAnswer": 1,
            "explanation": "The amplitude is the magnitude of the coefficient in front of the sine function. Here, it is 3.",
            "conceptTag": "Sine Waves"
          },
          {
            "id": "trig-q3b",
            "question": "What is the period of the standard sine wave y = sin(x)?",
            "options": [
              "π",
              "2π",
              "1/2",
              "1"
            ],
            "correctAnswer": 1,
            "explanation": "The standard sine function repeats completely every 2π radians.",
            "conceptTag": "Sine Waves"
          },
          {
            "id": "trig-q3c",
            "question": "Which transformation does the '+ 2' cause in y = cos(x) + 2?",
            "options": [
              "Vertical shift up by 2",
              "Vertical shift down by 2",
              "Phase shift left by 2",
              "Horizontal stretch by factor of 2"
            ],
            "correctAnswer": 0,
            "explanation": "A positive constant added to the entire function shifts its graph vertically upwards.",
            "conceptTag": "Sine Waves"
          }
        ],
        "videoId": "0_uEheWw01U",
        "locked": true
      }
    ],
    "difficulty": "Beginner",
    "formattedPrice": "$49",
    "mockIncluded": true,
    "coverGradient": "from-blue-950 via-cyan-900 to-blue-900",
    "coverAccent": "#0891b2",
    "outcomes": [
      "Right Triangles",
      "Unit Circle",
      "Sine & Cosine Graphs"
    ]
  },
  {
    "id": "dsa-basics",
    "title": "DSA Basics",
    "subject": "Computer Science",
    "level": "Beginner",
    "price": 5900,
    "duration": "8 weeks",
    "validity": "12 months",
    "thumbnail": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600",
    "description": "Master arrays, linked lists, stacks, queues, and Big-O notation from scratch.",
    "prerequisites": [
      "Basic Programming"
    ],
    "rating": 4.7,
    "students": 1920,
    "syllabus": [
      {
        "id": "dsa-01",
        "title": "Big-O Notation",
        "videoUrl": "https://www.youtube.com/watch?v=Mo4vesaut8g",
        "duration": "14:00",
        "conceptTag": "Data Structures",
        "unlockAfter": null,
        "mcqs": [
          {
            "id": "dsa-q1a",
            "question": "What does O(1) mean?",
            "options": [
              "The algorithm runs in one second",
              "Constant time — performance does not depend on input size",
              "The algorithm makes one comparison",
              "Linear time"
            ],
            "correctAnswer": 1,
            "explanation": "O(1) means the operation takes the same amount of time regardless of how many elements are in the data set.",
            "conceptTag": "Data Structures"
          },
          {
            "id": "dsa-q1b",
            "question": "Which complexity is better for large inputs?",
            "options": [
              "O(n²)",
              "O(n log n)",
              "O(n)",
              "O(log n)"
            ],
            "correctAnswer": 3,
            "explanation": "O(log n) grows the slowest of the four options — ideal for large datasets.",
            "conceptTag": "Data Structures"
          },
          {
            "id": "dsa-q1c",
            "question": "A nested loop iterating over n elements has what complexity?",
            "options": [
              "O(n)",
              "O(log n)",
              "O(n²)",
              "O(1)"
            ],
            "correctAnswer": 2,
            "explanation": "Each loop runs n times; nesting them multiplies: n × n = n².",
            "conceptTag": "Data Structures"
          }
        ]
      },
      {
        "id": "dsa-02",
        "title": "Arrays and Strings",
        "videoUrl": "https://www.youtube.com/watch?v=Dj5PsIHQLVo",
        "duration": "18:30",
        "conceptTag": "Data Structures",
        "unlockAfter": "dsa-01",
        "mcqs": [
          {
            "id": "dsa-q2a",
            "question": "What is the time complexity of accessing an array element by index?",
            "options": [
              "O(n)",
              "O(log n)",
              "O(1)",
              "O(n²)"
            ],
            "correctAnswer": 2,
            "explanation": "Array elements are stored contiguously in memory; index-based access is O(1).",
            "conceptTag": "Data Structures"
          },
          {
            "id": "dsa-q2b",
            "question": "Inserting at the beginning of an unsorted array costs:",
            "options": [
              "O(1)",
              "O(n)",
              "O(log n)",
              "O(n²)"
            ],
            "correctAnswer": 1,
            "explanation": "All existing elements must shift right by one position — O(n).",
            "conceptTag": "Data Structures"
          },
          {
            "id": "dsa-q2c",
            "question": "Strings in most languages are:",
            "options": [
              "Mutable arrays of integers",
              "Immutable sequences of characters",
              "Linked lists of characters",
              "Fixed-size hash maps"
            ],
            "correctAnswer": 1,
            "explanation": "In Java, Python, and JavaScript, strings are immutable — a new string is created for each modification.",
            "conceptTag": "Data Structures"
          }
        ]
      },
      {
        "id": "dsa-03",
        "title": "Linked Lists",
        "videoUrl": "https://www.youtube.com/watch?v=njTh_OwMljA",
        "duration": "20:00",
        "conceptTag": "Data Structures",
        "unlockAfter": "dsa-02",
        "mcqs": [
          {
            "id": "dsa-q3a",
            "question": "What does each node in a singly linked list store?",
            "options": [
              "Only data",
              "Data and a pointer to the next node",
              "Data and two pointers",
              "Only a pointer"
            ],
            "correctAnswer": 1,
            "explanation": "A singly linked list node holds a value and a \"next\" pointer.",
            "conceptTag": "Data Structures"
          },
          {
            "id": "dsa-q3b",
            "question": "Random access (get element at index k) in a linked list is:",
            "options": [
              "O(1)",
              "O(k)",
              "O(n)",
              "O(log n)"
            ],
            "correctAnswer": 2,
            "explanation": "You must traverse from head to reach index k — worst case O(n).",
            "conceptTag": "Data Structures"
          },
          {
            "id": "dsa-q3c",
            "question": "Inserting a node at the head of a linked list costs:",
            "options": [
              "O(n)",
              "O(log n)",
              "O(1)",
              "O(n²)"
            ],
            "correctAnswer": 2,
            "explanation": "Update the head pointer and link the new node — only one operation regardless of list size.",
            "conceptTag": "Data Structures"
          }
        ]
      },
      {
        "id": "dsa-04",
        "title": "Stacks and Queues",
        "videoUrl": "https://www.youtube.com/watch?v=wjI1WNcIntg",
        "duration": "16:45",
        "conceptTag": "Algorithms",
        "unlockAfter": "dsa-03",
        "mcqs": [
          {
            "id": "dsa-q4a",
            "question": "A Stack follows which principle?",
            "options": [
              "FIFO",
              "LIFO",
              "Random Access",
              "Priority-based"
            ],
            "correctAnswer": 1,
            "explanation": "Last In First Out — the most recently pushed element is popped first (like a stack of plates).",
            "conceptTag": "Algorithms"
          },
          {
            "id": "dsa-q4b",
            "question": "A Queue follows which principle?",
            "options": [
              "LIFO",
              "Random Access",
              "FIFO",
              "Priority-based"
            ],
            "correctAnswer": 2,
            "explanation": "First In First Out — the element added earliest is removed first (like a real queue).",
            "conceptTag": "Algorithms"
          },
          {
            "id": "dsa-q4c",
            "question": "Which data structure is suited for undo/redo operations?",
            "options": [
              "Queue",
              "Hash Map",
              "Stack",
              "Binary Tree"
            ],
            "correctAnswer": 2,
            "explanation": "Each action is pushed; undoing pops the last action. LIFO matches perfectly.",
            "conceptTag": "Algorithms"
          }
        ]
      }
    ],
    "difficulty": "Beginner",
    "formattedPrice": "$59",
    "mockIncluded": false,
    "coverGradient": "from-gray-900 to-gray-800",
    "outcomes": []
  },
  {
    "id": "linear-equations-mastery",
    "title": "Linear Equations Mastery",
    "subject": "Mathematics",
    "level": "Intermediate",
    "price": 6900,
    "duration": "8 weeks",
    "validity": "12 months",
    "thumbnail": "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600",
    "description": "Solve and model linear problems with confidence and precision.",
    "prerequisites": [
      "Algebra Basics"
    ],
    "rating": 4.9,
    "students": 3210,
    "syllabus": [
      {
        "id": "lin-01",
        "title": "Slope and Intercepts",
        "videoUrl": "",
        "duration": "16:20",
        "conceptTag": "Linear Equations",
        "unlockAfter": null,
        "mcqs": [],
        "videoId": "l3XzepN03KQ",
        "locked": false
      },
      {
        "id": "lin-02",
        "title": "Graphing Linear Equations",
        "videoUrl": "",
        "duration": "19:45",
        "conceptTag": "Linear Equations",
        "unlockAfter": "lin-01",
        "mcqs": [],
        "videoId": "NybHckSEQBI",
        "locked": true
      },
      {
        "id": "lin-03",
        "title": "Systems of Equations",
        "videoUrl": "",
        "duration": "22:10",
        "conceptTag": "Linear Equations",
        "unlockAfter": "lin-02",
        "mcqs": [],
        "videoId": "9IUEk9fn2Vs",
        "locked": true
      },
      {
        "id": "lin-04",
        "title": "Word Problem Patterns",
        "videoUrl": "",
        "duration": "25:30",
        "conceptTag": "Linear Equations",
        "unlockAfter": "lin-03",
        "mcqs": [],
        "videoId": "HL3fhRDmJAY",
        "locked": true
      }
    ],
    "difficulty": "Intermediate",
    "formattedPrice": "$69",
    "mockIncluded": true,
    "coverGradient": "from-indigo-900 via-navy to-navy-dark",
    "coverAccent": "#6366f1",
    "outcomes": [
      "Graphing",
      "Systems of Equations",
      "Word Problems"
    ]
  },
  {
    "id": "quadratic-concepts",
    "title": "Quadratic Concepts",
    "subject": "Mathematics",
    "level": "Intermediate",
    "price": 7900,
    "duration": "7 weeks",
    "validity": "6 months",
    "thumbnail": "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=600",
    "description": "From parabolas to real-world modeling — master quadratics completely.",
    "prerequisites": [
      "Linear Equations",
      "Algebra Basics"
    ],
    "rating": 4.7,
    "students": 1890,
    "syllabus": [
      {
        "id": "quad-01",
        "title": "Introduction to Parabolas",
        "videoUrl": "",
        "duration": "14:20",
        "conceptTag": "Quadratic Equations",
        "unlockAfter": null,
        "mcqs": [],
        "videoId": "NybHckSEQBI",
        "locked": false
      },
      {
        "id": "quad-02",
        "title": "Factoring Quadratics",
        "videoUrl": "",
        "duration": "21:15",
        "conceptTag": "Quadratic Equations",
        "unlockAfter": "quad-01",
        "mcqs": [],
        "videoId": "l3XzepN03KQ",
        "locked": true
      },
      {
        "id": "quad-03",
        "title": "Quadratic Formula",
        "videoUrl": "",
        "duration": "18:40",
        "conceptTag": "Quadratic Equations",
        "unlockAfter": "quad-02",
        "mcqs": [],
        "videoId": "9IUEk9fn2Vs",
        "locked": true
      }
    ],
    "difficulty": "Intermediate",
    "formattedPrice": "$79",
    "mockIncluded": false,
    "coverGradient": "from-purple-900 via-navy to-navy-dark",
    "coverAccent": "#a855f7",
    "outcomes": [
      "Factoring",
      "Vertex Form",
      "Finding Roots"
    ]
  },
  {
    "id": "physics-fundamentals",
    "title": "Physics Fundamentals",
    "subject": "Physics",
    "level": "Beginner",
    "price": 5900,
    "duration": "8 weeks",
    "validity": "12 months",
    "thumbnail": "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600",
    "description": "Build physical intuition with rigorous mathematical foundations.",
    "prerequisites": [
      "Algebra Basics"
    ],
    "rating": 4.8,
    "students": 2150,
    "syllabus": [
      {
        "id": "phy-01",
        "title": "Motion and Velocity",
        "videoUrl": "",
        "duration": "17:30",
        "conceptTag": "Newton's Laws",
        "unlockAfter": null,
        "mcqs": [],
        "videoId": "ZM8ECpBuQYE",
        "locked": false
      },
      {
        "id": "phy-02",
        "title": "Newton's Three Laws",
        "videoUrl": "",
        "duration": "20:15",
        "conceptTag": "Newton's Laws",
        "unlockAfter": "phy-01",
        "mcqs": [],
        "videoId": "NybHckSEQBI",
        "locked": true
      },
      {
        "id": "phy-03",
        "title": "Work, Energy & Power",
        "videoUrl": "",
        "duration": "22:45",
        "conceptTag": "Newton's Laws",
        "unlockAfter": "phy-02",
        "mcqs": [],
        "videoId": "l3XzepN03KQ",
        "locked": true
      }
    ],
    "difficulty": "Beginner",
    "formattedPrice": "$59",
    "mockIncluded": true,
    "coverGradient": "from-cyan-900 via-navy to-navy-dark",
    "coverAccent": "#06b6d4",
    "outcomes": [
      "Newton's Laws",
      "Kinematics",
      "Energy Conservation"
    ]
  },
  {
    "id": "ai-machine-learning",
    "title": "AI & Machine Learning",
    "subject": "Computer Science",
    "level": "Intermediate",
    "price": 9900,
    "duration": "10 weeks",
    "validity": "18 months",
    "thumbnail": "https://images.unsplash.com/photo-1677442136095-a9b8a7b1c0cc?w=600",
    "description": "Build real ML models from scratch with solid mathematical grounding.",
    "prerequisites": [
      "Statistics",
      "Linear Equations"
    ],
    "rating": 4.9,
    "students": 4120,
    "syllabus": [
      {
        "id": "ml-01",
        "title": "What is Machine Learning?",
        "videoUrl": "",
        "duration": "18:20",
        "conceptTag": "Machine Learning",
        "unlockAfter": null,
        "mcqs": [],
        "videoId": "ukzFI9rgwfU",
        "locked": false
      },
      {
        "id": "ml-02",
        "title": "Linear Regression",
        "videoUrl": "",
        "duration": "25:10",
        "conceptTag": "Machine Learning",
        "unlockAfter": "ml-01",
        "mcqs": [],
        "videoId": "l3XzepN03KQ",
        "locked": true
      },
      {
        "id": "ml-03",
        "title": "Classification & Decision Trees",
        "videoUrl": "",
        "duration": "22:45",
        "conceptTag": "Machine Learning",
        "unlockAfter": "ml-02",
        "mcqs": [],
        "videoId": "9IUEk9fn2Vs",
        "locked": true
      },
      {
        "id": "ml-04",
        "title": "Neural Networks Basics",
        "videoUrl": "",
        "duration": "28:30",
        "conceptTag": "Machine Learning",
        "unlockAfter": "ml-03",
        "mcqs": [],
        "videoId": "NybHckSEQBI",
        "locked": true
      }
    ],
    "difficulty": "Intermediate",
    "formattedPrice": "$99",
    "mockIncluded": true,
    "coverGradient": "from-rose-900 via-navy to-navy-dark",
    "coverAccent": "#f43f5e",
    "outcomes": [
      "Supervised Learning",
      "Neural Networks",
      "Model Evaluation"
    ]
  }
];

module.exports = courses;
