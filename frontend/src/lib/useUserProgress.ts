import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface MCQAttempt {
  questionId: string
  concept: string
  courseId: string
  sectionId: string
  correct: boolean
  timestamp: number
}

interface UserProgressState {
  // Auth (demo)
  isLoggedIn: boolean
  userName: string
  userEmail: string

  // Enrollment
  enrolledCourses: string[]

  // Progress
  completedSections: Record<string, string[]>  // courseId → sectionId[]
  currentSections: Record<string, string>       // courseId → current sectionId

  // Weak concepts
  weakConcepts: string[]
  confidenceScores: Record<string, number>      // concept → 0-100

  // Attempt history (not persisted — derived)
  mcqAttempts: MCQAttempt[]

  // Actions
  login: (name: string, email: string) => void
  logout: () => void
  enrollCourse: (courseId: string) => void
  completeSection: (courseId: string, sectionId: string) => void
  setCurrentSection: (courseId: string, sectionId: string) => void
  recordMCQAttempt: (attempt: MCQAttempt) => void
  markWeakConcept: (concept: string) => void
  removeWeakConcept: (concept: string) => void
  updateConfidence: (concept: string, delta: number) => void
  getCourseProgress: (courseId: string, totalSections: number) => number
}

export const useUserProgress = create<UserProgressState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      userName: '',
      userEmail: '',
      enrolledCourses: [],
      completedSections: {},
      currentSections: {},
      weakConcepts: [],
      confidenceScores: {},
      mcqAttempts: [],

      login: (name, email) => set({ isLoggedIn: true, userName: name, userEmail: email }),
      logout: () => set({ isLoggedIn: false, userName: '', userEmail: '' }),

      enrollCourse: (courseId) => set(state => ({
        enrolledCourses: state.enrolledCourses.includes(courseId)
          ? state.enrolledCourses
          : [...state.enrolledCourses, courseId],
        completedSections: {
          ...state.completedSections,
          [courseId]: state.completedSections[courseId] ?? [],
        },
      })),

      completeSection: (courseId, sectionId) => set(state => {
        const existing = state.completedSections[courseId] ?? []
        if (existing.includes(sectionId)) return state
        return {
          completedSections: {
            ...state.completedSections,
            [courseId]: [...existing, sectionId],
          },
        }
      }),

      setCurrentSection: (courseId, sectionId) => set(state => ({
        currentSections: { ...state.currentSections, [courseId]: sectionId },
      })),

      recordMCQAttempt: (attempt) => set(state => ({
        mcqAttempts: [...state.mcqAttempts, attempt],
      })),

      markWeakConcept: (concept) => set(state => ({
        weakConcepts: state.weakConcepts.includes(concept)
          ? state.weakConcepts
          : [...state.weakConcepts, concept],
        confidenceScores: {
          ...state.confidenceScores,
          [concept]: Math.max(0, (state.confidenceScores[concept] ?? 60) - 15),
        },
      })),

      removeWeakConcept: (concept) => set(state => ({
        weakConcepts: state.weakConcepts.filter(c => c !== concept),
      })),

      updateConfidence: (concept, delta) => set(state => ({
        confidenceScores: {
          ...state.confidenceScores,
          [concept]: Math.min(100, Math.max(0, (state.confidenceScores[concept] ?? 60) + delta)),
        },
      })),

      getCourseProgress: (courseId, totalSections) => {
        const completed = get().completedSections[courseId]?.length ?? 0
        return totalSections > 0 ? Math.round((completed / totalSections) * 100) : 0
      },
    }),
    {
      name: 'conceptiq-progress',
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        userName: state.userName,
        userEmail: state.userEmail,
        enrolledCourses: state.enrolledCourses,
        completedSections: state.completedSections,
        currentSections: state.currentSections,
        weakConcepts: state.weakConcepts,
        confidenceScores: state.confidenceScores,
      }),
    }
  )
)
