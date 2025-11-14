import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import PostCard from '../components/Posts/PostCard'
import { FiMapPin, FiCalendar, FiEdit2 } from 'react-icons/fi'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const Profile = () => {
  const { userId } = useParams()
  const { user: currentUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [bio, setBio] = useState('')

  const isOwnProfile = !userId || userId === currentUser?.id

  useEffect(() => {
    fetchProfile()
  }, [userId])

  const fetchProfile = async () => {
    try {
      const id = userId || currentUser?.id
      const response = await axios.get(`/api/users/${id}`)
      setProfile(response.data.user)
      setPosts(response.data.posts)
      setBio(response.data.user.bio || '')
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveBio = async () => {
    try {
      await axios.put('/api/users/profile', { bio })
      setProfile({ ...profile, bio })
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating bio:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Utilisateur non trouvé</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-6xl">
        {/* Profile Header */}
        <div className="card p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-3xl font-bold">
                {profile.firstName[0]}{profile.lastName[0]}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
                {profile.firstName} {profile.lastName}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center space-x-1">
                  <FiCalendar className="w-4 h-4" />
                  <span>Membre depuis {format(new Date(profile.createdAt), 'MMMM yyyy', { locale: fr })}</span>
                </span>
                {profile.location && (
                  <span className="flex items-center space-x-1">
                    <FiMapPin className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </span>
                )}
              </div>
              {isEditing ? (
                <div className="space-y-2">
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="input resize-none"
                    rows={3}
                    placeholder="Parlez-nous de vous..."
                  />
                  <div className="flex space-x-2">
                    <button onClick={handleSaveBio} className="btn btn-primary btn-sm">
                      Enregistrer
                    </button>
                    <button onClick={() => setIsEditing(false)} className="btn btn-secondary btn-sm">
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start space-x-2">
                  <p className="text-gray-700 flex-1">
                    {profile.bio || 'Aucune biographie'}
                  </p>
                  {isOwnProfile && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{posts.length}</div>
              <div className="text-sm text-gray-600">Publications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{profile.followersCount || 0}</div>
              <div className="text-sm text-gray-600">Abonnés</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{profile.followingCount || 0}</div>
              <div className="text-sm text-gray-600">Abonnements</div>
            </div>
          </div>
        </div>

        {/* User Posts */}
        <div className="space-y-6">
          <h2 className="font-display text-2xl font-bold text-gray-900">
            Publications
          </h2>
          {posts.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-gray-600">Aucune publication</p>
            </div>
          ) : (
            posts.map(post => (
              <PostCard key={post.id} post={post} onUpdate={fetchProfile} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
