import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FiImage, FiVideo, FiMusic, FiMapPin } from 'react-icons/fi'

const PublishTestimony = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'testimony', // testimony, article, media
    category: '',
    location: '',
    tags: '',
    date: new Date().toISOString().split('T')[0]
  })
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const categories = [
    'Police',
    'Manifestations',
    'Organisation',
    'Émotions',
    'Solidarité',
    'Revendications',
    'Répression',
    'Victoire',
    'Autre'
  ]

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setFiles([...files, ...selectedFiles])
  }

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = new FormData()
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key])
      })
      files.forEach(file => {
        data.append('files', file)
      })

      const response = await axios.post('/api/posts', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      toast.success('Publication créée avec succès !')
      navigate(`/post/${response.data.post.id}`)
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error('Erreur lors de la création de la publication')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-4xl">
        <div className="card p-8">
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
            Publier un témoignage
          </h1>
          <p className="text-gray-600 mb-8">
            Partagez votre récit avec la communauté
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Type de publication
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="input"
              >
                <option value="testimony">Témoignage</option>
                <option value="article">Article</option>
                <option value="media">Média</option>
              </select>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Titre *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                className="input"
                placeholder="Donnez un titre à votre publication"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Contenu *
              </label>
              <textarea
                id="content"
                name="content"
                required
                value={formData.content}
                onChange={handleChange}
                rows={10}
                className="input resize-none"
                placeholder="Partagez votre témoignage, récit ou article..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Date de l'événement
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                <FiMapPin className="inline w-4 h-4 mr-1" />
                Lieu
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                className="input"
                placeholder="Ville, région..."
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags (séparés par des virgules)
              </label>
              <input
                id="tags"
                name="tags"
                type="text"
                value={formData.tags}
                onChange={handleChange}
                className="input"
                placeholder="manifestation, solidarité, police..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Médias (photos, vidéos, audio)
              </label>
              <div className="flex flex-wrap gap-4 mb-4">
                {files.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                      {file.type.startsWith('image/') ? (
                        <FiImage className="w-8 h-8 text-gray-400" />
                      ) : file.type.startsWith('video/') ? (
                        <FiVideo className="w-8 h-8 text-gray-400" />
                      ) : (
                        <FiMusic className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                    <p className="text-xs text-gray-600 mt-1 w-24 truncate">{file.name}</p>
                  </div>
                ))}
              </div>
              <input
                type="file"
                multiple
                accept="image/*,video/*,audio/*"
                onChange={handleFileChange}
                className="input"
              />
              <p className="text-sm text-gray-500 mt-2">
                Formats acceptés : images, vidéos, audio
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary flex-1 py-3 disabled:opacity-50"
              >
                {loading ? 'Publication...' : 'Publier'}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-secondary px-8"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PublishTestimony
