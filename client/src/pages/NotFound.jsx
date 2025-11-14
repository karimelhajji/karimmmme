import { Link } from 'react-router-dom'
import { FiHome } from 'react-icons/fi'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="text-center px-4">
        <h1 className="font-display text-9xl font-bold text-primary-600 mb-4">404</h1>
        <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
          Page non trouvée
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Link to="/" className="btn btn-primary inline-flex items-center space-x-2">
          <FiHome className="w-5 h-5" />
          <span>Retour à l'accueil</span>
        </Link>
      </div>
    </div>
  )
}

export default NotFound
