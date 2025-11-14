import prisma from '../config/db.js'

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params
    const currentUserId = req.user?.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        bio: true,
        location: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true
          }
        }
      }
    })

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' })
    }

    // Get user's posts
    const posts = await prisma.post.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        media: true,
        _count: {
          select: {
            likes: true,
            comments: true
          }
        },
        ...(currentUserId && {
          likes: {
            where: { userId: currentUserId },
            select: { id: true }
          }
        })
      }
    })

    const formattedPosts = posts.map(post => ({
      ...post,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      isLiked: currentUserId ? post.likes?.length > 0 : false,
      _count: undefined,
      likes: undefined
    }))

    res.json({
      user: {
        ...user,
        followersCount: user._count.followers,
        followingCount: user._count.following,
        postsCount: user._count.posts,
        _count: undefined
      },
      posts: formattedPosts
    })
  } catch (error) {
    console.error('Get user profile error:', error)
    res.status(500).json({ message: 'Erreur lors de la récupération du profil' })
  }
}

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const { firstName, lastName, bio, location } = req.body

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(bio !== undefined && { bio }),
        ...(location !== undefined && { location })
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        bio: true,
        location: true,
        avatar: true,
        role: true,
        createdAt: true
      }
    })

    res.json({
      message: 'Profil mis à jour',
      user
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil' })
  }
}

// Follow/Unfollow user
export const toggleFollow = async (req, res) => {
  try {
    const { userId } = req.params
    const currentUserId = req.user.id

    if (userId === currentUserId) {
      return res.status(400).json({ message: 'Vous ne pouvez pas vous suivre vous-même' })
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: userId
        }
      }
    })

    if (existingFollow) {
      await prisma.follow.delete({
        where: { id: existingFollow.id }
      })
      res.json({ message: 'Abonnement retiré', following: false })
    } else {
      await prisma.follow.create({
        data: {
          followerId: currentUserId,
          followingId: userId
        }
      })
      res.json({ message: 'Abonnement ajouté', following: true })
    }
  } catch (error) {
    console.error('Toggle follow error:', error)
    res.status(500).json({ message: 'Erreur lors de l\'action' })
  }
}

// Get user followers
export const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params

    const followers = await prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      }
    })

    res.json({
      followers: followers.map(f => f.follower)
    })
  } catch (error) {
    console.error('Get followers error:', error)
    res.status(500).json({ message: 'Erreur lors de la récupération des abonnés' })
  }
}

// Get user following
export const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params

    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      }
    })

    res.json({
      following: following.map(f => f.following)
    })
  } catch (error) {
    console.error('Get following error:', error)
    res.status(500).json({ message: 'Erreur lors de la récupération des abonnements' })
  }
}
