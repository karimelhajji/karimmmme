import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { FiHeart, FiMessageCircle, FiShare2, FiMapPin, FiClock } from 'react-icons/fi'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'

const PostCard = ({ post, onUpdate }) => {
  const [liked, setLiked] = useState(post.isLiked)
  const [likesCount, setLikesCount] = useState(post.likesCount || 0)
  const { isAuthenticated } = useAuth()

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.info('Connectez-vous pour aimer cette publication')
      return
    }

    try {
      if (liked) {
        await axios.delete(`/api/posts/${post.id}/like`)
        setLikesCount(prev => prev - 1)
      } else {
        await axios.post(`/api/posts/${post.id}/like`)
        setLikesCount(prev => prev + 1)
      }
      setLiked(!liked)
    } catch (error) {
      console.error('Error liking post:', error)
      toast.error('Erreur lors de l\'action')
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content.substring(0, 100) + '...',
        url: window.location.origin + `/post/${post.id}`
      })
    } else {
      navigator.clipboard.writeText(window.location.origin + `/post/${post.id}`)
      toast.success('Lien copié !')
    }
  }

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
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
                <span>{format(new Date(post.createdAt), 'PPP', { locale: fr })}</span>
              </p>
            </div>
          </Link>
          {post.category && (
            <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
              {post.category}
            </span>
          )}
        </div>

        {/* Content */}
        <Link to={`/post/${post.id}`} className="block group">
          <h3 className="font-display font-semibold text-xl text-gray-900 mb-2 group-hover:text-primary-600">
            {post.title}
          </h3>
          <p className="text-gray-700 line-clamp-3 mb-4">
            {post.content}
          </p>
        </Link>

        {/* Media Preview */}
        {post.media && post.media.length > 0 && (
          <div className="mb-4 grid grid-cols-2 gap-2">
            {post.media.slice(0, 4).map((media, index) => (
              <div key={index} className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                {media.type === 'image' && (
                  <img
                    src={media.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
                {media.type === 'video' && (
                  <video
                    src={media.url}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Location */}
        {post.location && (
          <div className="flex items-center space-x-1 text-sm text-gray-600 mb-4">
            <FiMapPin className="w-4 h-4" />
            <span>{post.location}</span>
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-6 pt-4 border-t border-gray-100">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 transition-colors ${
              liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
            }`}
          >
            <FiHeart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{likesCount}</span>
          </button>
          <Link
            to={`/post/${post.id}`}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <FiMessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{post.commentsCount || 0}</span>
          </Link>
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <FiShare2 className="w-5 h-5" />
            <span className="text-sm font-medium">Partager</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default PostCard
