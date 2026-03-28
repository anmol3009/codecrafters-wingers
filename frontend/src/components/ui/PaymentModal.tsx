import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './Button'
import { api } from '../../lib/api'
import { useUserProgress } from '../../lib/useUserProgress'

interface PaymentModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  courseTitle: string
  price: string
  courseId: string
}

export default function PaymentModal({ open, onClose, onSuccess, courseTitle, price, courseId }: PaymentModalProps) {
  const [loading, setLoading] = useState(false)
  const { authToken } = useUserProgress()

  const handlePayment = async () => {
    setLoading(true)
    try {
      // Call backend payment gateway (always succeeds)
      if (authToken) {
        await api.payment.process(courseId, price, authToken)
        await api.enrollment.enroll(courseId, authToken)
      }
    } catch (e) {
      console.warn('[Payment] backend call failed – continuing in demo mode', e)
    } finally {
      setLoading(false)
      onSuccess()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-md px-4"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: -50 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
          >
            <div className="bg-white border-2 border-[#111] p-8" style={{ boxShadow: '12px 12px 0 #111' }}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-display text-2xl font-bold text-[#111]">Complete Enrollment</h3>
                  <p className="font-body text-[#666] text-sm mt-1">{courseTitle}</p>
                </div>
                <div className="bg-[#FFCBA4] border-2 border-[#111] px-3 py-1 font-display font-bold text-lg" style={{ boxShadow: '3px 3px 0 #111' }}>
                  {price}
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="border-2 border-[#111] p-4 bg-[#FFFAF6]">
                  <p className="text-xs font-body font-bold uppercase tracking-widest text-[#999] mb-2 text-center">Demo Card Details</p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="font-display font-bold text-lg">**** **** **** 4242</p>
                      <div className="flex justify-between mt-1 text-[#666] text-xs font-body">
                        <span>EXP: 12/26</span>
                        <span>CVC: ***</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-body text-[#666] px-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px]">✓</div>
                  <span>Secure bank-level encryption (Demo)</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button 
                  variant="primary" 
                  fullWidth 
                  size="lg" 
                  onClick={handlePayment}
                  loading={loading}
                >
                  {loading ? 'Processing...' : `Pay ${price} & Start Learning`}
                </Button>
                <Button variant="ghost" fullWidth onClick={onClose}>
                  Cancel
                </Button>
              </div>

              <p className="text-[10px] text-center text-[#999] font-body mt-6">
                By completing this payment, you agree to the ConceptIQ Terms of Learning.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
