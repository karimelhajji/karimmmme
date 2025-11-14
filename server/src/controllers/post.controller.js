import prisma from '../config/db.js'
import path from 'path'

// Get all posts with filters and search
export const getPosts = async (req, res) => {
  try {
    const { sort = 'recent', search, category, limit = 50, offset = 0 } = req.query
    const userId = req.user?.id

    // Build where clause
    const where = {}
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } }
      ]
    }
    if (category) {
      where.category = category
    }

    // Build orderBy clause
    let orderBy = { createdAt: 'desc' }
    if (sort === 'popular') {
      orderBy = { likes: { _count: 'desc' } }
    }

    const posts = await prisma.post.findMany({
      where,
      orderBy,
      take: parseInt(limit),
      skip: parseInt(offset),
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
        ...(userId && {
          likes: {
            where: { userId },
            select: { id: true }
          }
        })
      }
    })

    // Format response
    const formattedPosts = posts.map(post => ({
      ...post,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      isLiked: userId ? post.likes?.length > 0 : false,
      _count: undefined,
      likes: undefined
    }))

    res.json({ posts: formattedPosts })
  } catch (error) {
    console.error('Get posts error:', error)
    res.status(500).json({ message: 'Erreur lors de la récupération des publications' })
  }
}

// Get single post
export const getPost = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user?.id

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true
          }
        },
        media: true,
        _count: {
          select: {
            likes: true,
            comments: true
          }
        },
        ...(userId && {
          likes: {
            where: { userId },
            select: { id: true }
          }
        })
      }
    })

    if (!post) {
      return res.status(404).json({ message: 'Publication non trouvée' })
    }

    const comments = await prisma.comment.findMany({
      where: { postId: id },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
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
      post: {
        ...post,
        likesCount: post._count.likes,
        commentsCount: post._count.comments,
        isLiked: userId ? post.likes?.length > 0 : false,
        _count: undefined,
        likes: undefined
      },
      comments
    })
  } catch (error) {
    console.error('Get post error:', error)
    res.status(500).json({ message: 'Erreur lors de la récupération de la publication' })
  }
}

// Create post
export const createPost = async (req, res) => {
  try {
    const { title, content, type, category, location, date, tags } = req.body
    const userId = req.user.id
    const files = req.files || []

    // Parse tags if they're a string
    const parsedTags = typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags

    // Create post
    const post = await prisma.post.create({
      data: {
        title,
        content,
        type: type || 'TESTIMONY',
        category,
        location,
        date: date ? new Date(date) : null,
        tags: parsedTags || [],
        authorId: userId,
        media: {
          create: files.map(file => ({
            type: file.mimetype.startsWith('image/') ? 'IMAGE' :
                  file.mimetype.startsWith('video/') ? 'VIDEO' :
                  file.mimetype.startsWith('audio/') ? 'AUDIO' : 'DOCUMENT',
            url: `/uploads/${path.basename(path.dirname(file.path))}/${file.filename}`,
            filename: file.filename,
            mimeType: file.mimetype,
            size: file.size
          }))
        }
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        media: true
      }
    })

    res.status(201).json({
      message: 'Publication créée avec succès',
      post
    })
  } catch (error) {
    console.error('Create post error:', error)
    res.status(500).json({ message: 'Erreur lors de la création de la publication' })
  }
}

// Update post
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params
    const { title, content, category, location, date, tags } = req.body
    const userId = req.user.id

    // Check if post exists and belongs to user
    const existingPost = await prisma.post.findUnique({ where: { id } })
    if (!existingPost) {
      return res.status(404).json({ message: 'Publication non trouvée' })
    }
    if (existingPost.authorId !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Non autorisé' })
    }

    const parsedTags = typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(category && { category }),
        ...(location && { location }),
        ...(date && { date: new Date(date) }),
        ...(parsedTags && { tags: parsedTags })
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        media: true
      }
    })

    res.json({
      message: 'Publication mise à jour',
      post
    })
  } catch (error) {
    console.error('Update post error:', error)
    res.status(500).json({ message: 'Erreur lors de la mise à jour' })
  }
}

// Delete post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const post = await prisma.post.findUnique({ where: { id } })
    if (!post) {
      return res.status(404).json({ message: 'Publication non trouvée' })
    }
    if (post.authorId !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Non autorisé' })
    }

    await prisma.post.delete({ where: { id } })

    res.json({ message: 'Publication supprimée' })
  } catch (error) {
    console.error('Delete post error:', error)
    res.status(500).json({ message: 'Erreur lors de la suppression' })
  }
}

// Like/Unlike post
export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: id,
          userId
        }
      }
    })

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id }
      })
      res.json({ message: 'Like retiré', liked: false })
    } else {
      await prisma.like.create({
        data: {
          postId: id,
          userId
        }
      })
      res.json({ message: 'Like ajouté', liked: true })
    }
  } catch (error) {
    console.error('Toggle like error:', error)
    res.status(500).json({ message: 'Erreur lors de l\'action' })
  }
}

// Report post
export const reportPost = async (req, res) => {
  try {
    const { id } = req.params
    const { reason } = req.body
    const userId = req.user.id

    const report = await prisma.report.create({
      data: {
        postId: id,
        reporterId: userId,
        reason
      }
    })

    res.json({
      message: 'Signalement envoyé',
      report
    })
  } catch (error) {
    console.error('Report post error:', error)
    res.status(500).json({ message: 'Erreur lors du signalement' })
  }
}
