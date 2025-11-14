import express from 'express'
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware.js'
import {
  getUserProfile,
  updateProfile,
  toggleFollow,
  getFollowers,
  getFollowing
} from '../controllers/user.controller.js'

const router = express.Router()

router.get('/:userId', optionalAuthenticate, getUserProfile)
router.put('/profile', authenticate, updateProfile)
router.post('/:userId/follow', authenticate, toggleFollow)
router.delete('/:userId/follow', authenticate, toggleFollow)
router.get('/:userId/followers', getFollowers)
router.get('/:userId/following', getFollowing)

export default router
