import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import { useUserProgress } from '../lib/useUserProgress'

const COMPLETION_COLORS = ['#FFCBA4', '#FFF8F2', '#2e2e2e']

const TOOLTIP_STYLE = {
  contentStyle: {
    background: '#FFFAF6',
    border: '1px solid rgba(255,230,0,0.3)',
    borderRadius: 12,
    color: '#222222',
    fontFamily: 'Inter',
    fontSize: 12,
  },
  labelStyle: { color: '#FFCBA4' },
}

function StatCard({ value, label, icon }: { value: string; label: string; icon: string }) {
  return (
    <div className="glass-navy rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="text-3xl">{icon}</div>
      </div>
      <p className="font-display text-ink text-3xl font-light mb-1">{value}</p>
      <p className="font-body text-ink-muted text-sm">{label}</p>
    </div>
  )
}

interface InsightsData {
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

export default function TeacherInsights() {
  const { authToken } = useUserProgress()
  const [insights, setInsights] = useState<InsightsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)
    api.insights.math(authToken || undefined)
      .then((r: any) => setInsights(r.insights))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [authToken])

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-28 pb-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    )
  }

  if (error || !insights) {
    return (
      <div className="min-h-screen bg-white pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 text-center py-24">
          <div className="text-5xl mb-6">📊</div>
          <h2 className="font-display text-ink text-2xl mb-4">Unable to load insights</h2>
          <p className="font-body text-ink-muted">Please check that the backend server is running and try again.</p>
        </div>
      </div>
    )
  }

  const {
    totalStudents,
    completionRate,
    avgScore,
    activeUsersToday,
    weakConcepts,
    enrollmentTrend,
    completionBreakdown,
    studentOverview,
  } = insights

  const hasData = totalStudents > 0

  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <p className="font-body text-gold text-sm tracking-widest uppercase mb-3">Teacher Dashboard</p>
          <h1
            className="font-display text-ink mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300 }}
          >
            Class insights at a glance
          </h1>
          <p className="font-body text-ink-muted">
            See where students are struggling and which concepts need the most attention.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {[
            { value: totalStudents.toLocaleString(), label: 'Total Students', icon: '👥' },
            { value: `${completionRate}%`, label: 'Completion Rate', icon: '✅' },
            { value: `${avgScore}/100`, label: 'Avg Score', icon: '⭐' },
            { value: activeUsersToday.toString(), label: 'Active Today', icon: '📈' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <StatCard {...s} />
            </motion.div>
          ))}
        </div>

        {!hasData ? (
          /* Empty state */
          <div className="text-center py-20">
            <div className="text-6xl mb-6">📚</div>
            <h2 className="font-display text-ink-soft text-2xl mb-4">No student data yet</h2>
            <p className="font-body text-ink-muted max-w-md mx-auto">
              Once students enroll in courses and start learning, their progress, scores, and weak concepts will appear here in real time.
            </p>
          </div>
        ) : (
          <>
            {/* Charts row */}
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              {/* Enrollment trend */}
              <div className="lg:col-span-2 bg-white border-2 border-[#111] p-8" style={{ boxShadow: '8px 8px 0 #111' }}>
                <h3 className="font-display text-[#111] text-2xl mb-6 font-bold">Enrollment Trend</h3>
                {enrollmentTrend.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={enrollmentTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis dataKey="month" stroke="#111" tick={{ fill: '#666', fontSize: 12, fontFamily: 'Inter' }} />
                      <YAxis stroke="#111" tick={{ fill: '#666', fontSize: 12, fontFamily: 'Inter' }} />
                      <Tooltip {...TOOLTIP_STYLE} />
                      <Line
                        type="step"
                        dataKey="enrollments"
                        stroke="#FFCBA4"
                        strokeWidth={3}
                        dot={{ fill: '#111', r: 4, strokeWidth: 2, stroke: '#FFCBA4' }}
                        activeDot={{ r: 6, fill: '#111', strokeWidth: 2, stroke: '#FFCBA4' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[220px] text-ink-muted font-body text-sm">
                    No enrollment data recorded yet
                  </div>
                )}
              </div>

              {/* Completion pie */}
              <div className="bg-white border-2 border-[#111] p-8" style={{ boxShadow: '8px 8px 0 #111' }}>
                <h3 className="font-display text-[#111] text-2xl mb-6 font-bold">Completion Rate</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={completionBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="#111"
                      strokeWidth={2}
                    >
                      {completionBreakdown.map((_entry, index) => (
                        <Cell key={index} fill={COMPLETION_COLORS[index % COMPLETION_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip {...TOOLTIP_STYLE} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {completionBreakdown.map((d, i) => (
                    <div key={d.name} className="flex items-center justify-between font-body text-xs font-bold uppercase tracking-widest">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 border border-[#111]" style={{ background: COMPLETION_COLORS[i % COMPLETION_COLORS.length] }} />
                        <span className="text-[#666]">{d.name}</span>
                      </div>
                      <span className="text-[#111]">{d.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Weak concepts bar chart */}
            {weakConcepts.length > 0 && (
              <div className="bg-[#FFFAF6] border-2 border-[#111] p-8 mb-8" style={{ boxShadow: '12px 12px 0 #111' }}>
                <h3 className="font-display text-[#111] text-3xl mb-2 font-bold flex items-center gap-3">
                  <span className="text-red-500">⚠</span> Common Weak Concepts
                </h3>
                <p className="font-body text-[#666] text-sm mb-8 uppercase tracking-widest font-bold">Number of students requiring root-cause intervention</p>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={weakConcepts.slice(0, 6)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" horizontal={false} />
                    <XAxis type="number" stroke="#111" tick={{ fill: '#666', fontSize: 12, fontFamily: 'Inter' }} />
                    <YAxis dataKey="concept" type="category" width={160} tick={{ fill: '#111', fontSize: 12, fontFamily: 'Inter', fontWeight: 'bold' }} />
                    <Tooltip {...TOOLTIP_STYLE} />
                    <Bar dataKey="count" fill="#FFCBA4" stroke="#111" strokeWidth={2} radius={[0, 0, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Student table */}
            {studentOverview.length > 0 && (
              <div className="glass-navy rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-ink/8">
                  <h3 className="font-display text-ink text-xl">Student Overview</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-ink/5">
                        {['Student', 'Course', 'Progress', 'Score', 'Weak Areas'].map(h => (
                          <th key={h} className="text-left px-6 py-3 font-body text-ink-muted text-xs uppercase tracking-wider">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {studentOverview.map((student, i) => (
                        <tr key={i} className="border-b border-ink/5 hover:bg-ink/3 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold font-body text-sm font-semibold">
                                {student.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-body text-ink text-sm">{student.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-body text-ink-soft text-sm">{student.course}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-24 h-1.5 bg-ink/5 rounded-full">
                                <div
                                  className="h-full bg-gold rounded-full"
                                  style={{ width: `${student.progress}%` }}
                                />
                              </div>
                              <span className="font-body text-ink-soft text-sm">{student.progress}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`font-body text-sm font-medium ${
                              student.score >= 80 ? 'text-emerald-400' : student.score >= 65 ? 'text-amber-400' : 'text-red-400'
                            }`}>
                              {student.score}/100
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1.5">
                              {student.weakAreas.length === 0 ? (
                                <span className="font-body text-emerald-400/60 text-xs">No weak areas</span>
                              ) : student.weakAreas.map(w => (
                                <span key={w} className="font-body text-xs text-red-400 bg-red-500/10 border border-red-500/15 px-2 py-0.5 rounded">
                                  {w}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
