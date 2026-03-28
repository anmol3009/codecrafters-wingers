import { motion } from 'framer-motion'
import IntroText from './IntroText'

interface IntroExperienceProps {
  onComplete: () => void
}

export default function IntroExperience({ onComplete }: IntroExperienceProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <IntroText onComplete={onComplete} />
    </motion.div>
  )
}
