import express from 'express'
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware.js'
import upload from '../middleware/upload.middleware.js'
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  reportPost
} from '../controllers/post.controller.js'

const router = express.Router()

// Public routes
router.get('/', optionalAuthenticate, getPosts)
router.get('/:id', optionalAuthenticate, getPost)

// Protected routes
router.post('/', authenticate, upload.array('files', 10), createPost)
router.put('/:id', authenticate, updatePost)
router.delete('/:id', authenticate, deletePost)
router.post('/:id/like', authenticate, toggleLike)
router.delete('/:id/like', authenticate, toggleLike)
router.post('/:id/report', authenticate, reportPost)

export default router
