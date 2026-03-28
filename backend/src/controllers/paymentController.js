/**
 * POST /payment
 *
 * Simulated payment gateway — always returns success.
 * In production, replace with Razorpay / Stripe integration.
 *
 * Body: { courseId, amount, currency }
 */
function processPayment(req, res) {
  const { courseId, amount, currency = 'USD' } = req.body;

  if (!courseId) {
    return res.status(400).json({ error: 'courseId is required' });
  }

  // Simulate a successful payment
  res.json({
    success: true,
    transactionId: `txn_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    courseId,
    amount: amount ?? 0,
    currency,
    message: 'Payment processed successfully (simulated)',
    paidAt: new Date().toISOString(),
  });
}

module.exports = { processPayment };
