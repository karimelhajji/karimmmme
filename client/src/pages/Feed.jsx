import { useState, useEffect } from 'react'
import axios from 'axios'
import PostCard from '../components/Posts/PostCard'
import SearchBar from '../components/Search/SearchBar'
import FilterTabs from '../components/Filter/FilterTabs'
import { FiLoader } from 'react-icons/fi'

const Feed = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('recent') // recent, popular, following
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchPosts()
  }, [filter, searchQuery])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filter) params.append('sort', filter)
      if (searchQuery) params.append('search', searchQuery)

      const response = await axios.get(`/api/posts?${params.toString()}`)
      setPosts(response.data.posts)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-4xl">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
            Publications
          </h1>
          <p className="text-gray-600">
            Découvrez les témoignages et contenus partagés par la communauté
          </p>
        </div>

        <SearchBar onSearch={handleSearch} />

        <FilterTabs activeFilter={filter} onFilterChange={setFilter} />

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <FiLoader className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-gray-600 text-lg">
              Aucune publication trouvée.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onUpdate={fetchPosts} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Feed
