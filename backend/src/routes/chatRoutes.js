const router = require('express').Router()
const { chat, explainMistake } = require('../controllers/chatController')

router.post('/', chat)
router.post('/explain-mistake', explainMistake)

module.exports = router
