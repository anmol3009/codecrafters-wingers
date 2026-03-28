import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { motion } from 'framer-motion'

const enrollmentData = [
  { month: 'Jan', enrollments: 120 },
  { month: 'Feb', enrollments: 185 },
  { month: 'Mar', enrollments: 240 },
  { month: 'Apr', enrollments: 198 },
  { month: 'May', enrollments: 310 },
  { month: 'Jun', enrollments: 420 },
  { month: 'Jul', enrollments: 380 },
  { month: 'Aug', enrollments: 510 },
]

const completionData = [
  { name: 'Completed', value: 72, color: '#FFCBA4' },
  { name: 'In Progress', value: 18, color: '#FFF8F2' },
  { name: 'Not Started', value: 10, color: '#2e2e2e' },
]

const weakConceptsData = [
  { concept: 'Variable Isolation', count: 142 },
  { concept: 'Graph Interpretation', count: 118 },
  { concept: 'Factoring Patterns', count: 96 },
  { concept: 'Slope Calculation', count: 87 },
  { concept: 'Quadratic Formula', count: 74 },
  { concept: 'Chemical Bonding', count: 65 },
]

const students = [
  { name: 'Priya S.', course: 'Algebra Foundations', progress: 88, weakAreas: ['Variable Isolation'], score: 82 },
  { name: 'Arjun M.', course: 'Linear Equations Mastery', progress: 65, weakAreas: ['Graphing', 'Word Problems'], score: 71 },
  { name: 'Sophia L.', course: 'AI & Machine Learning', progress: 94, weakAreas: [], score: 95 },
  { name: 'Ravi K.', course: 'Physics Fundamentals', progress: 42, weakAreas: ['Newton\'s Laws', 'Kinematics'], score: 58 },
  { name: 'Emma W.', course: 'Quadratic Concepts', progress: 73, weakAreas: ['Factoring Patterns'], score: 76 },
  { name: 'Liam T.', course: 'Chemistry Essentials', progress: 55, weakAreas: ['Chemical Bonding', 'Stoichiometry'], score: 63 },
]

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

function StatCard({ value, label, icon, delta }: { value: string; label: string; icon: string; delta?: string }) {
  return (
    <div className="glass-navy rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="text-3xl">{icon}</div>
        {delta && (
          <span className="font-body text-emerald-400 text-xs bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            {delta}
          </span>
        )}
      </div>
      <p className="font-display text-ink text-3xl font-light mb-1">{value}</p>
      <p className="font-body text-ink-muted text-sm">{label}</p>
    </div>
  )
}

export default function TeacherInsights() {
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
            { value: '2,840', label: 'Total Students', icon: '👥', delta: '+12%' },
            { value: '72%', label: 'Completion Rate', icon: '✅', delta: '+5%' },
            { value: '78/100', label: 'Avg Score', icon: '⭐', delta: '+3pts' },
            { value: '486', label: 'Active Today', icon: '📈', delta: '+18%' },
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

        {/* Charts row */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Enrollment trend */}
          <div className="lg:col-span-2 glass-navy rounded-2xl p-6">
            <h3 className="font-display text-ink text-xl mb-6">Enrollment Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
                <XAxis dataKey="month" stroke="rgba(0,0,0,0.2)" tick={{ fill: 'rgba(0,0,0,0.45)', fontSize: 12, fontFamily: 'Inter' }} />
                <YAxis stroke="rgba(0,0,0,0.2)" tick={{ fill: 'rgba(0,0,0,0.45)', fontSize: 12, fontFamily: 'Inter' }} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Line
                  type="monotone"
                  dataKey="enrollments"
                  stroke="#FFCBA4"
                  strokeWidth={2.5}
                  dot={{ fill: '#FFCBA4', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#FFFAF6', strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Completion pie */}
          <div className="glass-navy rounded-2xl p-6">
            <h3 className="font-display text-ink text-xl mb-6">Completion Rate</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={completionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {completionData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip {...TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {completionData.map(d => (
                <div key={d.name} className="flex items-center justify-between font-body text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                    <span className="text-ink-soft">{d.name}</span>
                  </div>
                  <span className="text-ink">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weak concepts bar chart */}
        <div className="glass-navy rounded-2xl p-6 mb-8">
          <h3 className="font-display text-ink text-xl mb-2">Common Weak Concepts</h3>
          <p className="font-body text-ink-muted text-sm mb-6">Number of students struggling with each concept</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weakConceptsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" horizontal={false} />
              <XAxis type="number" stroke="rgba(0,0,0,0.2)" tick={{ fill: 'rgba(0,0,0,0.45)', fontSize: 12, fontFamily: 'Inter' }} />
              <YAxis dataKey="concept" type="category" width={160} tick={{ fill: 'rgba(0,0,0,0.55)', fontSize: 12, fontFamily: 'Inter' }} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="count" fill="#FFCBA4" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Student table */}
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
                {students.map((student, i) => (
                  <tr key={i} className="border-b border-ink/5 hover:bg-ink/3 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold font-body text-sm font-semibold">
                          {student.name.charAt(0)}
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
      </div>
    </div>
  )
}
