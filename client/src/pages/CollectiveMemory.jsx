import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { FiCalendar, FiMapPin, FiDownload, FiGrid, FiMap, FiClock } from 'react-icons/fi'
import axios from 'axios'
import 'leaflet/dist/leaflet.css'
import { Link } from 'react-router-dom'

const CollectiveMemory = () => {
  const [view, setView] = useState('timeline') // timeline, map, categories
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArchives()
  }, [])

  const fetchArchives = async () => {
    try {
      const response = await axios.get('/api/archives')
      setPosts(response.data.posts)
      setCategories(response.data.categories)
    } catch (error) {
      console.error('Error fetching archives:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    // Export functionality
    window.location.href = '/api/archives/export'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-4">
            Mémoire Collective
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explorez les archives organisées du mouvement social à travers le temps, l'espace et les thématiques
          </p>
        </div>

        {/* View Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setView('timeline')}
            className={`btn flex items-center space-x-2 ${
              view === 'timeline' ? 'btn-primary' : 'btn-secondary'
            }`}
          >
            <FiClock className="w-5 h-5" />
            <span>Timeline</span>
          </button>
          <button
            onClick={() => setView('map')}
            className={`btn flex items-center space-x-2 ${
              view === 'map' ? 'btn-primary' : 'btn-secondary'
            }`}
          >
            <FiMap className="w-5 h-5" />
            <span>Carte</span>
          </button>
          <button
            onClick={() => setView('categories')}
            className={`btn flex items-center space-x-2 ${
              view === 'categories' ? 'btn-primary' : 'btn-secondary'
            }`}
          >
            <FiGrid className="w-5 h-5" />
            <span>Catégories</span>
          </button>
          <button onClick={handleExport} className="btn btn-accent flex items-center space-x-2">
            <FiDownload className="w-5 h-5" />
            <span>Exporter</span>
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            {view === 'timeline' && <TimelineView posts={posts} />}
            {view === 'map' && <MapView posts={posts} />}
            {view === 'categories' && <CategoriesView categories={categories} posts={posts} />}
          </>
        )}
      </div>
    </div>
  )
}

const TimelineView = ({ posts }) => {
  const groupedPosts = posts.reduce((acc, post) => {
    const date = new Date(post.date || post.createdAt)
    const monthYear = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    if (!acc[monthYear]) acc[monthYear] = []
    acc[monthYear].push(post)
    return acc
  }, {})

  return (
    <div className="max-w-4xl mx-auto">
      {Object.entries(groupedPosts).map(([period, periodPosts]) => (
        <div key={period} className="mb-12">
          <div className="flex items-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full flex-shrink-0">
              <FiCalendar className="w-8 h-8 text-white" />
            </div>
            <div className="ml-6">
              <h2 className="font-display text-2xl font-bold text-gray-900">{period}</h2>
              <p className="text-gray-600">{periodPosts.length} événements</p>
            </div>
          </div>
          <div className="ml-8 border-l-2 border-primary-200 pl-8 space-y-6">
            {periodPosts.map((post) => (
              <Link key={post.id} to={`/post/${post.id}`} className="block card p-6 hover:shadow-lg transition-shadow">
                <h3 className="font-display font-semibold text-xl text-gray-900 mb-2 hover:text-primary-600">
                  {post.title}
                </h3>
                <p className="text-gray-700 line-clamp-2 mb-3">{post.content}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  {post.location && (
                    <span className="flex items-center space-x-1">
                      <FiMapPin className="w-4 h-4" />
                      <span>{post.location}</span>
                    </span>
                  )}
                  {post.category && (
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded">
                      {post.category}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const MapView = ({ posts }) => {
  const postsWithLocation = posts.filter(post => post.latitude && post.longitude)

  return (
    <div className="card overflow-hidden" style={{ height: '600px' }}>
      <MapContainer
        center={[48.8566, 2.3522]} // Paris
        zoom={6}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {postsWithLocation.map((post) => (
          <Marker key={post.id} position={[post.latitude, post.longitude]}>
            <Popup>
              <Link to={`/post/${post.id}`} className="block">
                <h3 className="font-semibold">{post.title}</h3>
                <p className="text-sm text-gray-600">{post.location}</p>
              </Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

const CategoriesView = ({ categories, posts }) => {
  const groupedByCategory = posts.reduce((acc, post) => {
    const category = post.category || 'Autre'
    if (!acc[category]) acc[category] = []
    acc[category].push(post)
    return acc
  }, {})

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(groupedByCategory).map(([category, categoryPosts]) => (
        <div key={category} className="card p-6 hover:shadow-lg transition-shadow">
          <h3 className="font-display text-xl font-bold text-gray-900 mb-2">{category}</h3>
          <p className="text-gray-600 mb-4">{categoryPosts.length} publications</p>
          <div className="space-y-2">
            {categoryPosts.slice(0, 5).map((post) => (
              <Link
                key={post.id}
                to={`/post/${post.id}`}
                className="block text-sm text-primary-600 hover:text-primary-700 truncate"
              >
                • {post.title}
              </Link>
            ))}
            {categoryPosts.length > 5 && (
              <p className="text-sm text-gray-500">
                + {categoryPosts.length - 5} autres
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default CollectiveMemory
