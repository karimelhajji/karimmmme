import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { FiHeart, FiMessageCircle, FiShare2, FiMapPin, FiClock, FiSend } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useAuth } from '../contexts/AuthContext'

const PostDetail = () => {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
      const response = await axios.get(`/api/posts/${id}`)
      setPost(response.data.post)
      setComments(response.data.comments)
      setLiked(response.data.post.isLiked)
    } catch (error) {
      console.error('Error fetching post:', error)
      toast.error('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.info('Connectez-vous pour aimer cette publication')
      return
    }

    try {
      if (liked) {
        await axios.delete(`/api/posts/${id}/like`)
        setPost({ ...post, likesCount: post.likesCount - 1 })
      } else {
        await axios.post(`/api/posts/${id}/like`)
        setPost({ ...post, likesCount: post.likesCount + 1 })
      }
      setLiked(!liked)
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.info('Connectez-vous pour commenter')
      return
    }
    if (!newComment.trim()) return

    try {
      const response = await axios.post(`/api/posts/${id}/comments`, {
        content: newComment
      })
      setComments([response.data.comment, ...comments])
      setNewComment('')
      toast.success('Commentaire ajouté')
    } catch (error) {
      console.error('Error posting comment:', error)
      toast.error('Erreur lors de l\'ajout du commentaire')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Publication non trouvée</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-4xl">
        {/* Post */}
        <div className="card p-8 mb-8">
          {/* Author */}
          <div className="flex items-center justify-between mb-6">
            <Link to={`/profile/${post.author.id}`} className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {post.author.firstName[0]}{post.author.lastName[0]}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-primary-600">
                  {post.author.firstName} {post.author.lastName}
                </p>
                <p className="text-sm text-gray-500 flex items-center space-x-2">
                  <FiClock className="w-3 h-3" />
                  <span>{format(new Date(post.createdAt), 'PPP à HH:mm', { locale: fr })}</span>
                </p>
              </div>
            </Link>
            {post.category && (
              <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                {post.category}
              </span>
            )}
          </div>

          {/* Content */}
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* Media */}
          {post.media && post.media.length > 0 && (
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {post.media.map((media, index) => (
                <div key={index} className="rounded-lg overflow-hidden">
                  {media.type === 'image' && (
                    <img src={media.url} alt="" className="w-full" />
                  )}
                  {media.type === 'video' && (
                    <video src={media.url} controls className="w-full" />
                  )}
                  {media.type === 'audio' && (
                    <audio src={media.url} controls className="w-full" />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Location & Tags */}
          <div className="space-y-2 mb-6">
            {post.location && (
              <div className="flex items-center space-x-1 text-gray-600">
                <FiMapPin className="w-4 h-4" />
                <span>{post.location}</span>
              </div>
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 transition-colors ${
                liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
              }`}
            >
              <FiHeart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              <span className="font-medium">{post.likesCount || 0}</span>
            </button>
            <div className="flex items-center space-x-2 text-gray-600">
              <FiMessageCircle className="w-5 h-5" />
              <span className="font-medium">{comments.length}</span>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                toast.success('Lien copié !')
              }}
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-600"
            >
              <FiShare2 className="w-5 h-5" />
              <span className="font-medium">Partager</span>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="card p-8">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">
            Commentaires ({comments.length})
          </h2>

          {/* Add Comment */}
          {isAuthenticated ? (
            <form onSubmit={handleSubmitComment} className="mb-8">
              <div className="flex space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-semibold">
                    {user.firstName[0]}{user.lastName[0]}
                  </span>
                </div>
                <div className="flex-1 flex space-x-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Ajouter un commentaire..."
                    className="input flex-1"
                  />
                  <button type="submit" className="btn btn-primary">
                    <FiSend className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600">
                <Link to="/login" className="text-primary-600 hover:underline">Connectez-vous</Link>
                {' '}pour commenter
              </p>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <Link to={`/profile/${comment.author.id}`} className="w-10 h-10 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-semibold">
                    {comment.author.firstName[0]}{comment.author.lastName[0]}
                  </span>
                </Link>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <Link to={`/profile/${comment.author.id}`} className="font-semibold text-gray-900 hover:text-primary-600">
                      {comment.author.firstName} {comment.author.lastName}
                    </Link>
                    <p className="text-gray-700 mt-1">{comment.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {format(new Date(comment.createdAt), 'PPP à HH:mm', { locale: fr })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetail
