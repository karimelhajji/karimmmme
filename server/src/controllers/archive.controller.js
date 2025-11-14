import prisma from '../config/db.js'

// Get archives for collective memory
export const getArchives = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        media: true,
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    })

    // Get all categories
    const categories = await prisma.post.groupBy({
      by: ['category'],
      where: {
        category: {
          not: null
        }
      },
      _count: true
    })

    const formattedPosts = posts.map(post => ({
      ...post,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      _count: undefined
    }))

    res.json({
      posts: formattedPosts,
      categories: categories.map(c => ({
        name: c.category,
        count: c._count
      }))
    })
  } catch (error) {
    console.error('Get archives error:', error)
    res.status(500).json({ message: 'Erreur lors de la récupération des archives' })
  }
}

// Export archives (simplified version)
export const exportArchives = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        media: true,
        comments: {
          include: {
            author: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    })

    // Return JSON export
    res.json({
      exportDate: new Date(),
      totalPosts: posts.length,
      posts
    })
  } catch (error) {
    console.error('Export archives error:', error)
    res.status(500).json({ message: 'Erreur lors de l\'export des archives' })
  }
}

// Get statistics
export const getStats = async (req, res) => {
  try {
    const [totalUsers, totalPosts, totalComments, totalLikes] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.comment.count(),
      prisma.like.count()
    ])

    res.json({
      totalUsers,
      totalPosts,
      totalComments,
      totalLikes
    })
  } catch (error) {
    console.error('Get stats error:', error)
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' })
  }
}
