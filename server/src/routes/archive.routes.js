import express from 'express'
import { getArchives, exportArchives, getStats } from '../controllers/archive.controller.js'

const router = express.Router()

router.get('/', getArchives)
router.get('/export', exportArchives)
router.get('/stats', getStats)

export default router
