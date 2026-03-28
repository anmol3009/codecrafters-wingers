/**
 * SARASWATI – Concept Dependency Graph
 *
 * Key   = concept name
 * Value = array of prerequisite concepts (empty = root concept)
 *
 * The graph is used by the MCQ engine to trace root causes when a
 * student answers incorrectly.
 */

const conceptGraph = {
  // Mathematics
  Arithmetic: [],
  'Algebra Basics': ['Arithmetic'],
  'Linear Equations': ['Algebra Basics'],
  'Quadratic Equations': ['Linear Equations'],
  Trigonometry: ['Algebra Basics'],
  Calculus: ['Quadratic Equations', 'Trigonometry'],
  Functions: ['Linear Equations'],
  Statistics: ['Arithmetic'],
  Probability: ['Statistics'],

  // Physics
  "Newton's Laws": ['Algebra Basics'],
  Kinematics: ["Newton's Laws", 'Algebra Basics'],
  Thermodynamics: ['Algebra Basics'],
  Optics: ['Trigonometry'],

  // Chemistry
  'Atomic Theory': ['Arithmetic'],
  'Chemical Bonding': ['Atomic Theory'],
  Stoichiometry: ['Chemical Bonding', 'Arithmetic'],
  'Organic Chemistry': ['Chemical Bonding'],

  // Computer Science
  'Data Structures': ['Arithmetic'],
  Algorithms: ['Data Structures'],
  'Machine Learning': ['Statistics', 'Linear Equations'],
};

module.exports = conceptGraph;
