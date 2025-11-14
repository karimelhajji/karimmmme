import prisma from '../config/db.js'

// Get comments for a post
export const getComments = async (req, res) => {
  try {
    const { id } = req.params

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

    res.json({ comments })
  } catch (error) {
    console.error('Get comments error:', error)
    res.status(500).json({ message: 'Erreur lors de la récupération des commentaires' })
  }
}

// Create comment
export const createComment = async (req, res) => {
  try {
    const { id } = req.params
    const { content } = req.body
    const userId = req.user.id

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Le contenu du commentaire est requis' })
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId: id,
        authorId: userId
      },
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

    res.status(201).json({
      message: 'Commentaire créé',
      comment
    })
  } catch (error) {
    console.error('Create comment error:', error)
    res.status(500).json({ message: 'Erreur lors de la création du commentaire' })
  }
}

// Update comment
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params
    const { content } = req.body
    const userId = req.user.id

    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId }
    })

    if (!existingComment) {
      return res.status(404).json({ message: 'Commentaire non trouvé' })
    }

    if (existingComment.authorId !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Non autorisé' })
    }

    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
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
      message: 'Commentaire mis à jour',
      comment
    })
  } catch (error) {
    console.error('Update comment error:', error)
    res.status(500).json({ message: 'Erreur lors de la mise à jour du commentaire' })
  }
}

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params
    const userId = req.user.id

    const comment = await prisma.comment.findUnique({
      where: { id: commentId }
    })

    if (!comment) {
      return res.status(404).json({ message: 'Commentaire non trouvé' })
    }

    if (comment.authorId !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Non autorisé' })
    }

    await prisma.comment.delete({
      where: { id: commentId }
    })

    res.json({ message: 'Commentaire supprimé' })
  } catch (error) {
    console.error('Delete comment error:', error)
    res.status(500).json({ message: 'Erreur lors de la suppression du commentaire' })
  }
}
