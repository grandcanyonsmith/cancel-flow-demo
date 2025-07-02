import { steps, ordered, StepID } from './steps'

/**
 * Validates that all flow paths are properly configured
 * and identifies any missing or unreachable states
 */
export function validateFlowPaths(): {
  isValid: boolean
  errors: string[]
  warnings: string[]
  reachableSteps: StepID[]
} {
  const errors: string[] = []
  const warnings: string[] = []
  const reachableSteps = new Set<StepID>()
  const allStepIds = Object.keys(steps) as StepID[]

  // Start from the initial step
  const initialStep = 'reason' as StepID
  const toVisit: StepID[] = [initialStep]
  const visited = new Set<StepID>()

  // Traverse all possible paths
  while (toVisit.length > 0) {
    const currentId = toVisit.pop()!
    
    if (visited.has(currentId)) continue
    visited.add(currentId)
    reachableSteps.add(currentId)

    const step = steps[currentId]
    
    if (!step) {
      errors.push(`Step '${currentId}' is referenced but not defined`)
      continue
    }

    if (step.kind === 'question') {
      // Test all possible answers for question steps
      const testAnswers = step.options.concat(['UNKNOWN_ANSWER'])
      
      for (const answer of testAnswers) {
        try {
          const nextId = step.next(answer, {})
          
          if (!steps[nextId]) {
            errors.push(`Step '${currentId}' with answer '${answer}' leads to undefined step '${nextId}'`)
          } else if (!visited.has(nextId)) {
            toVisit.push(nextId)
          }
        } catch (error) {
          errors.push(`Step '${currentId}' with answer '${answer}' throws error: ${error}`)
        }
      }
    } else if (step.kind === 'comment') {
      try {
        const nextId = step.next()
        
        if (!steps[nextId]) {
          errors.push(`Comment step '${currentId}' leads to undefined step '${nextId}'`)
        } else if (!visited.has(nextId)) {
          toVisit.push(nextId)
        }
      } catch (error) {
        errors.push(`Comment step '${currentId}' throws error: ${error}`)
      }
    }
    // Final steps don't have next functions, so nothing to validate
  }

  // Check for unreachable steps
  const unreachableSteps = allStepIds.filter(id => !reachableSteps.has(id))
  if (unreachableSteps.length > 0) {
    warnings.push(`Unreachable steps found: ${unreachableSteps.join(', ')}`)
  }

  // Check if ordered array matches reachable steps
  const orderedSet = new Set(ordered)
  const missingFromOrdered = Array.from(reachableSteps).filter(id => !orderedSet.has(id))
  const extraInOrdered = ordered.filter(id => !reachableSteps.has(id))

  if (missingFromOrdered.length > 0) {
    warnings.push(`Steps missing from ordered array: ${missingFromOrdered.join(', ')}`)
  }
  
  if (extraInOrdered.length > 0) {
    warnings.push(`Extra steps in ordered array: ${extraInOrdered.join(', ')}`)
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    reachableSteps: Array.from(reachableSteps)
  }
}

/**
 * Gets all possible flow paths from the initial step to final steps
 */
export function getAllFlowPaths(): string[][] {
  const paths: string[][] = []
  const initialStep = 'reason' as StepID

  function explorePath(currentId: StepID, currentPath: string[]) {
    const newPath = [...currentPath, currentId]
    const step = steps[currentId]

    if (step.kind === 'final') {
      paths.push(newPath)
      return
    }

    if (step.kind === 'question') {
      for (const answer of step.options) {
        try {
          const nextId = step.next(answer, {})
          explorePath(nextId, newPath)
        } catch {
          // Skip invalid paths
        }
      }
    } else if (step.kind === 'comment') {
      try {
        const nextId = step.next()
        explorePath(nextId, newPath)
      } catch {
        // Skip invalid paths
      }
    }
  }

  explorePath(initialStep, [])
  return paths
}