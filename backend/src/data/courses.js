/**
 * SARASWATI – Courses Catalogue 
 * Merged Backend fully-implemented sections with Frontend Aesthetic tokens
 */

const courses = [
  {
    "id": "algebra-foundations",
    "title": "Algebra Foundations",
    "subject": "Mathematics",
    "level": "Beginner",
    "price": 4900,
    "duration": "6 weeks",
    "validity": "12 months",
    "thumbnail": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600",
    "description": "Build confident algebra habits and symbolic thinking from the ground up.",
    "prerequisites": [
      "Arithmetic"
    ],
    "rating": 4.8,
    "students": 2840,
    "syllabus": [
      {
        "id": "alg-01",
        "title": "Introduction to Variables",
        "videoUrl": "https://www.youtube.com/watch?v=NybHckSEQBI",
        "duration": "12:30",
        "conceptTag": "Algebra Basics",
        "unlockAfter": null,
        "mcqs": [
          {
            "id": "alg-q1a",
            "question": "What does a variable represent in an algebraic expression?",
            "options": [
              "A fixed number that never changes",
              "An unknown quantity that can take different values",
              "A mathematical operation like addition",
              "The result of an equation"
            ],
            "correctAnswer": 1,
            "explanation": "A variable is a symbol (usually a letter) that represents an unknown or changing quantity — the foundation of algebra.",
            "conceptTag": "Algebra Basics"
          },
          {
            "id": "alg-q1b",
            "question": "In the expression 3x + 5, what is the coefficient of x?",
            "options": [
              "5",
              "x",
              "3",
              "3x"
            ],
            "correctAnswer": 2,
            "explanation": "The coefficient is the number multiplied by the variable. In 3x, the coefficient is 3.",
            "conceptTag": "Algebra Basics"
          },
          {
            "id": "alg-q1c",
            "question": "Which of these is a valid algebraic expression?",
            "options": [
              "3 + = 7",
              "2x + 5y",
              "÷4",
              "× 3 ="
            ],
            "correctAnswer": 1,
            "explanation": "'2x + 5y' combines two variable terms with coefficients — a valid algebraic expression.",
            "conceptTag": "Algebra Basics"
          }
        ],
        "videoId": "NybHckSEQBI",
        "locked": false
      },
      {
        "id": "alg-02",
        "title": "Solving One-Step Equations",
        "videoUrl": "https://www.youtube.com/watch?v=l3XzepN03KQ",
        "duration": "15:45",
        "conceptTag": "Algebra Basics",
        "unlockAfter": "alg-01",
        "mcqs": [
          {
            "id": "alg-q2a",
            "question": "To solve x + 7 = 12, what do you do to both sides?",
            "options": [
              "Add 7",
              "Subtract 7",
              "Multiply by 7",
              "Divide by 7"
            ],
            "correctAnswer": 1,
            "explanation": "Subtract 7 from both sides: x + 7 − 7 = 12 − 7 → x = 5.  Inverse operations maintain balance.",
            "conceptTag": "Algebra Basics"
          },
          {
            "id": "alg-q2b",
            "question": "What is the value of x in: x − 4 = 11?",
            "options": [
              "7",
              "15",
              "44",
              "−7"
            ],
            "correctAnswer": 1,
            "explanation": "Add 4 to both sides: x = 11 + 4 = 15.",
            "conceptTag": "Algebra Basics"
          },
          {
            "id": "alg-q2c",
            "question": "Solve: 3x = 21. What is x?",
            "options": [
              "18",
              "63",
              "7",
              "24"
            ],
            "correctAnswer": 2,
            "explanation": "Divide both sides by 3: x = 21 ÷ 3 = 7.",
            "conceptTag": "Algebra Basics"
          }
        ],
        "videoId": "l3XzepN03KQ",
        "locked": true
      },
      {
        "id": "alg-03",
        "title": "Two-Step Equations",
        "videoUrl": "https://www.youtube.com/watch?v=9IUEk9fn2Vs",
        "duration": "18:20",
        "conceptTag": "Linear Equations",
        "unlockAfter": "alg-02",
        "mcqs": [
          {
            "id": "alg-q3a",
            "question": "Solve: 2x + 3 = 11. What is x?",
            "options": [
              "4",
              "7",
              "3",
              "5"
            ],
            "correctAnswer": 0,
            "explanation": "Subtract 3 from both sides: 2x = 8. Then divide by 2: x = 4.",
            "conceptTag": "Linear Equations"
          },
          {
            "id": "alg-q3b",
            "question": "Solve: 5x − 10 = 15. What is x?",
            "options": [
              "1",
              "5",
              "25",
              "3"
            ],
            "correctAnswer": 1,
            "explanation": "Add 10: 5x = 25. Divide by 5: x = 5.",
            "conceptTag": "Linear Equations"
          },
          {
            "id": "alg-q3c",
            "question": "Which inverse operation isolates x in 4x = 20?",
            "options": [
              "Add 4",
              "Subtract 4",
              "Multiply by 4",
              "Divide by 4"
            ],
            "correctAnswer": 3,
            "explanation": "Division by 4 undoes multiplication: 4x ÷ 4 = 20 ÷ 4 → x = 5.",
            "conceptTag": "Linear Equations"
          }
        ],
        "videoId": "9IUEk9fn2Vs",
        "locked": true
      },
      {
        "id": "alg-04",
        "title": "Inequalities and Number Lines",
        "videoUrl": "https://www.youtube.com/watch?v=HL3fhRDmJAY",
        "duration": "14:10",
        "conceptTag": "Linear Equations",
        "unlockAfter": "alg-03",
        "mcqs": [
          {
            "id": "alg-q4a",
            "question": "What does x > 3 mean on a number line?",
            "options": [
              "x is less than 3",
              "x equals 3",
              "x is greater than 3",
              "x is at most 3"
            ],
            "correctAnswer": 2,
            "explanation": "The \">\" symbol means greater than. x > 3 means x can be 4, 5, 3.1, … but not 3 itself.",
            "conceptTag": "Linear Equations"
          },
          {
            "id": "alg-q4b",
            "question": "When you multiply both sides of an inequality by −1, what happens?",
            "options": [
              "Nothing changes",
              "The inequality sign flips",
              "The inequality becomes an equality",
              "The values stay the same"
            ],
            "correctAnswer": 1,
            "explanation": "Multiplying (or dividing) by a negative number reverses the inequality direction.",
            "conceptTag": "Linear Equations"
          },
          {
            "id": "alg-q4c",
            "question": "Solve: x + 5 ≤ 9",
            "options": [
              "x ≤ 4",
              "x ≥ 4",
              "x < 4",
              "x > 4"
            ],
            "correctAnswer": 0,
            "explanation": "Subtract 5 from both sides: x ≤ 9 − 5 = 4.",
            "conceptTag": "Linear Equations"
          }
        ],
        "videoId": "HL3fhRDmJAY",
        "locked": true
      },
      {
        "id": "alg-05",
        "title": "Final Assessment",
        "videoUrl": "https://www.youtube.com/watch?v=NybHckSEQBI",
        "duration": "20:00",
        "conceptTag": "Algebra Basics",
        "unlockAfter": "alg-04",
        "mcqs": [
          {
            "id": "alg-q5a",
            "question": "Simplify: 4(x + 3) − 2x",
            "options": [
              "2x + 12",
              "6x + 3",
              "2x + 3",
              "4x + 12"
            ],
            "correctAnswer": 0,
            "explanation": "Distribute: 4x + 12 − 2x = 2x + 12.",
            "conceptTag": "Algebra Basics"
          },
          {
            "id": "alg-q5b",
            "question": "Which property allows you to write 3(x + 2) = 3x + 6?",
            "options": [
              "Commutative property",
              "Associative property",
              "Distributive property",
              "Identity property"
            ],
            "correctAnswer": 2,
            "explanation": "The distributive property: a(b + c) = ab + ac.",
            "conceptTag": "Algebra Basics"
          },
          {
            "id": "alg-q5c",
            "question": "If y = 2x + 1 and x = 3, what is y?",
            "options": [
              "5",
              "6",
              "7",
              "8"
            ],
            "correctAnswer": 2,
            "explanation": "Substitute x = 3: y = 2(3) + 1 = 7.",
            "conceptTag": "Algebra Basics"
          }
        ],
        "videoId": "NybHckSEQBI",
        "locked": true
      }
    ],
    "difficulty": "Beginner",
    "formattedPrice": "$49",
    "mockIncluded": true,
    "coverGradient": "from-blue-900 via-navy to-navy-dark",
    "coverAccent": "#3b82f6",
    "outcomes": [
      "Variables & Expressions",
      "Linear Equations",
      "Inequalities"
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
