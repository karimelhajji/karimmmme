import express from 'express'
import { authenticate } from '../middleware/auth.middleware.js'
import {
  getComments,
  createComment,
  updateComment,
  deleteComment
} from '../controllers/comment.controller.js'

const router = express.Router()

router.get('/:id/comments', getComments)
router.post('/:id/comments', authenticate, createComment)
router.put('/comments/:commentId', authenticate, updateComment)
router.delete('/comments/:commentId', authenticate, deleteComment)

export default router
