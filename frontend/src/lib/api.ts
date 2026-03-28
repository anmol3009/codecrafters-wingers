/**
 * SARASWATI API client
 *
 * All backend calls go through here.
 * Reads the backend URL from VITE_API_URL env (falls back to localhost:5000).
 *
 * Auth: The backend expects  Authorization: Bearer <firebase-id-token>
 * We store the token in useUserProgress (Zustand) and pass it here.
 * If no token is available (demo mode), requests are still sent but
 * protected routes will 401 – the UI handles that gracefully.
 */

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'

async function req<T = unknown>(
  method: string,
  path: string,
  body?: unknown,
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error ?? `API error ${res.status}`)
  }

  return res.json() as Promise<T>
}

// ── Auth ────────────────────────────────────────────────────────────────────

export const api = {
  auth: {
    login: (token: string) => req('POST', '/auth/login', {}, token),
    google: (token: string) => req('POST', '/auth/google', {}, token),
    me: (token: string) => req('GET', '/auth/me', undefined, token),
  },

  // ── Courses ───────────────────────────────────────────────────────────────

  courses: {
    list: (params?: { subject?: string; level?: string }) => {
      const qs = new URLSearchParams()
      if (params?.subject) qs.set('subject', params.subject)
      if (params?.level) qs.set('level', params.level)
      const q = qs.toString()
      return req<{ courses: unknown[] }>('GET', `/courses${q ? `?${q}` : ''}`)
    },
    get: (id: string) => req<{ course: any }>('GET', `/courses/${id}`),
  },

  // ── Concepts ──────────────────────────────────────────────────────────────

  concepts: {
    graph: () => req<{ graph: Record<string, string[]> }>('GET', '/concepts/graph'),
  },

  // ── Enrollment ────────────────────────────────────────────────────────────

  enrollment: {
    enroll: (courseId: string, token: string) =>
      req('POST', `/enroll/${courseId}`, {}, token),
    myCourses: (token: string) =>
      req<{ courses: unknown[] }>('GET', '/my-courses', undefined, token),
  },

  // ── Payment ───────────────────────────────────────────────────────────────

  payment: {
    process: (courseId: string, price: string, token: string) =>
      req('POST', '/payment', { courseId, amount: price, currency: 'USD' }, token),
  },

  // ── Progress ──────────────────────────────────────────────────────────────

  progress: {
    videoComplete: (courseId: string, sectionId: string, token: string) =>
      req('POST', '/progress/video-complete', { courseId, sectionId }, token),
    get: (courseId: string, token: string) =>
      req('GET', `/progress/${courseId}`, undefined, token),
  },

  // ── MCQ ───────────────────────────────────────────────────────────────────

  mcq: {
    mock: () => req<{ questions: any[] }>('GET', '/mcq/mock'),
    submit: (
      payload: {
        courseId: string
        sectionId: string
        questionId: string
        selectedAnswer: number
        explanationText?: string
      },
      token: string
    ) => req<McqSubmitResponse>('POST', '/mcq/submit', payload, token),
  },

  // ── Teacher Insights ──────────────────────────────────────────────────────

  insights: {
    math: (token?: string) =>
      req<{ insights: MathInsights }>('GET', '/teacher-insights/math', undefined, token),
  },

  // ── Chat ──────────────────────────────────────────────────────────────────

  chat: {
    send: (messages: { role: string; content: string }[]) =>
      req<{ reply: string }>('POST', '/chat', { messages }),
  },
}

// ── Types ─────────────────────────────────────────────────────────────────── 

export interface McqSubmitResponse {
  success: boolean
  correct: boolean
  correctIndex?: number
  explanation: string
  nextSectionId?: string | null
  message: string
  // only on incorrect:
  conceptTag?: string
  rootCause?: string
  path?: string[]
  restartFromSectionId?: string
}

export interface MathInsights {
  totalStudents: number
  completionRate: number
  avgScore: number
  activeUsersToday: number
  weakConcepts: Array<{ concept: string; count: number }>
  enrollmentTrend: Array<{ month: string; enrollments: number }>
  completionBreakdown: Array<{ name: string; value: number }>
  studentOverview: Array<{
    name: string
    course: string
    progress: number
    score: number
    weakAreas: string[]
  }>
}
