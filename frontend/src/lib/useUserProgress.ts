import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from './api'

export interface MCQAttempt {
  questionId: string
  concept: string
  courseId: string
  sectionId: string
  correct: boolean
  timestamp: number
}

interface UserProgressState {
  // Auth
  isLoggedIn: boolean
  userName: string
  userEmail: string
  /** Firebase ID token — set after login, used for all protected API calls */
  authToken: string

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
  login: (name: string, email: string, token?: string) => void
  logout: () => void
  setAuthToken: (token: string) => void
  /** Validates persisted token against backend; auto-logouts if stale */
  validateSession: () => Promise<void>
  enrollCourse: (courseId: string) => void
  completeSection: (courseId: string, sectionId: string) => void
  resetProgressFromSection: (courseId: string, fromSectionId: string, allSectionIds: string[]) => void
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
      authToken: '',
      enrolledCourses: [],
      completedSections: {},
      currentSections: {},
      weakConcepts: [],
      confidenceScores: {},
      mcqAttempts: [],

      login: (name, email, token = '') =>
        set({ isLoggedIn: true, userName: name, userEmail: email, authToken: token }),

      logout: () => set({ isLoggedIn: false, userName: '', userEmail: '', authToken: '' }),

      setAuthToken: (token) => set({ authToken: token }),

      validateSession: async () => {
        const { isLoggedIn, authToken } = get()
        if (!isLoggedIn || !authToken) {
          // No session persisted — nothing to validate
          if (isLoggedIn) set({ isLoggedIn: false, userName: '', userEmail: '', authToken: '' })
          return
        }
        try {
          await api.auth.me(authToken)
          // Token is still valid — keep session
        } catch {
          // Token expired or invalid — clear session
          set({ isLoggedIn: false, userName: '', userEmail: '', authToken: '' })
        }
      },

      enrollCourse: (courseId) => {
        // Optimistic local update
        set(state => ({
          enrolledCourses: state.enrolledCourses.includes(courseId)
            ? state.enrolledCourses
            : [...state.enrolledCourses, courseId],
          completedSections: {
            ...state.completedSections,
            [courseId]: state.completedSections[courseId] ?? [],
          },
        }))
        // Sync with backend (fire-and-forget; local state is already updated)
        const token = get().authToken
        if (token) {
          api.enrollment.enroll(courseId, token).catch(console.warn)
        }
      },

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

      resetProgressFromSection: (courseId, fromSectionId, allSectionIds) => set(state => {
        const existing = state.completedSections[courseId] ?? []
        const cutIdx = allSectionIds.indexOf(fromSectionId)
        const trimmed = cutIdx >= 0
          ? existing.filter(sid => allSectionIds.indexOf(sid) < cutIdx)
          : existing
        return {
          completedSections: { ...state.completedSections, [courseId]: trimmed },
          currentSections: { ...state.currentSections, [courseId]: fromSectionId },
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
      name: 'saraswati-progress',
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        userName: state.userName,
        userEmail: state.userEmail,
        authToken: state.authToken,
        enrolledCourses: state.enrolledCourses,
        completedSections: state.completedSections,
        currentSections: state.currentSections,
        weakConcepts: state.weakConcepts,
        confidenceScores: state.confidenceScores,
      }),
    }
  )
)
