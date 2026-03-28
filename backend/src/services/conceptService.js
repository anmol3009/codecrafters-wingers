const conceptGraph = require('../data/conceptGraph');

/**
 * Trace the full prerequisite chain for a concept, root-first.
 *
 * Uses post-order DFS so the array reads:
 *   deepest root → ... → given concept
 *
 * Example:
 *   getPrerequisiteChain('Quadratic Equations')
 *   → ['Arithmetic', 'Algebra Basics', 'Linear Equations', 'Quadratic Equations']
 */
function getPrerequisiteChain(concept) {
  const chain = [];
  const visited = new Set();

  function dfs(node) {
    if (visited.has(node)) return;
    visited.add(node);
    const prereqs = conceptGraph[node] ?? [];
    for (const prereq of prereqs) {
      dfs(prereq);
    }
    chain.push(node);
  }

  dfs(concept);
  return chain;
}

/**
 * Walk to the single deepest root of a concept.
 *
 * When the graph is a chain (a → b → c), this returns the first node
 * that has no prerequisites = the real root cause.
 *
 * For concepts with multiple prerequisites, we follow the FIRST one.
 */
function getRootConcept(concept) {
  const visited = new Set();
  let current = concept;

  while (true) {
    if (visited.has(current)) break; // cycle guard
    visited.add(current);
    const prereqs = conceptGraph[current] ?? [];
    if (prereqs.length === 0) break;
    current = prereqs[0];
  }

  return current;
}

/**
 * Given a failed concept, return:
 *   { rootCause, path }
 *
 * "path" is the full chain from root to the failed concept.
 *
 * Example (failed: 'Quadratic Equations'):
 *   {
 *     rootCause: 'Arithmetic',
 *     path: ['Arithmetic', 'Algebra Basics', 'Linear Equations', 'Quadratic Equations']
 *   }
 */
function traceRootCause(failedConcept) {
  const path = getPrerequisiteChain(failedConcept);
  const rootCause = path[0] ?? failedConcept;
  return { rootCause, path };
}

/**
 * Given a root concept, find the first section in a course that covers it.
 * Returns the section id or null if not found.
 */
function findSectionForConcept(course, conceptTag) {
  const section = course.syllabus.find((s) => s.conceptTag === conceptTag);
  return section ? section.id : null;
}

module.exports = { getPrerequisiteChain, getRootConcept, traceRootCause, findSectionForConcept };
