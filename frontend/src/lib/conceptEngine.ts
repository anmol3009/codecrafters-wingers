import conceptGraph from '../data/concept-graph.json'

type ConceptGraph = Record<string, string[]>

const graph = conceptGraph as ConceptGraph

/**
 * Post-order DFS: builds chain root → leaf naturally.
 * Returns ordered array from deepest prerequisite to given concept.
 */
export function getPrerequisiteChain(concept: string): string[] {
  const chain: string[] = []
  const visited = new Set<string>()

  function traverse(node: string): void {
    if (visited.has(node)) return
    visited.add(node)
    const prereqs = graph[node] ?? []
    for (const prereq of prereqs) {
      traverse(prereq)
    }
    chain.push(node)
  }

  traverse(concept)
  return chain
  // e.g. ['Arithmetic', 'Algebra Basics', 'Linear Equations', 'Quadratic Equations']
}

/**
 * Root cause = weak concept with no weak prerequisites.
 */
export function findRootCause(weakConcepts: string[]): string {
  const weakSet = new Set(weakConcepts)

  for (const concept of weakConcepts) {
    const prereqs = graph[concept] ?? []
    const hasWeakPrereq = prereqs.some(p => weakSet.has(p))
    if (!hasWeakPrereq) return concept
  }

  return weakConcepts[0] ?? 'Arithmetic'
}

/**
 * Annotate chain with isWeak flag for ConceptGraph SVG rendering.
 */
export function annotateChain(
  failedConcept: string,
  weakConcepts: string[]
): Array<{ name: string; isWeak: boolean }> {
  const chain = getPrerequisiteChain(failedConcept)
  const weakSet = new Set(weakConcepts)
  return chain.map(name => ({ name, isWeak: weakSet.has(name) || name === failedConcept }))
}

/**
 * Suggested revision path: all weak prerequisites ordered root-first.
 */
export function getSuggestedRevisionPath(weakConcepts: string[]): string[] {
  const rootCause = findRootCause(weakConcepts)
  const chain = getPrerequisiteChain(rootCause)
  const weakSet = new Set(weakConcepts)
  return chain.filter(c => weakSet.has(c) || c === rootCause)
}

/**
 * Get immediate prerequisites for a concept.
 */
export function getPrerequisites(concept: string): string[] {
  return graph[concept] ?? []
}

/**
 * Check if concept has any prerequisites in the graph.
 */
export function isRootConcept(concept: string): boolean {
  return (graph[concept] ?? []).length === 0
}
