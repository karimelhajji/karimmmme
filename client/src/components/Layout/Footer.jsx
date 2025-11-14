import { Link } from 'react-router-dom'
import { FiHeart } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">GENZ212 France</h3>
            <p className="text-sm text-gray-400">
              Mémoire vivante & Archives du mouvement social. Une plateforme participative pour ne jamais oublier.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-white mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary-400 transition-colors">Accueil</Link></li>
              <li><Link to="/feed" className="hover:text-primary-400 transition-colors">Publications</Link></li>
              <li><Link to="/collective-memory" className="hover:text-primary-400 transition-colors">Mémoire Collective</Link></li>
              <li><Link to="/faq" className="hover:text-primary-400 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Informations</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="hover:text-primary-400 transition-colors">Contact</Link></li>
              <li><Link to="/contact#mentions" className="hover:text-primary-400 transition-colors">Mentions légales</Link></li>
              <li><Link to="/contact#privacy" className="hover:text-primary-400 transition-colors">Confidentialité</Link></li>
            </ul>
          </div>

          {/* Social / Stats */}
          <div>
            <h4 className="font-semibold text-white mb-4">Participer</h4>
            <p className="text-sm text-gray-400 mb-4">
              Contribuez à préserver la mémoire collective en partageant vos témoignages, photos et récits.
            </p>
            <Link to="/register" className="btn btn-primary text-sm">
              Rejoindre la communauté
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} GENZ212 France. Tous droits réservés.
          </p>
          <p className="text-sm text-gray-400 flex items-center space-x-1 mt-4 md:mt-0">
            <span>Créé avec</span>
            <FiHeart className="w-4 h-4 text-red-500" />
            <span>pour la mémoire collective</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
