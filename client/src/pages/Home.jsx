import { Link } from 'react-router-dom'
import { FiBook, FiUsers, FiHeart, FiArchive, FiMapPin, FiClock } from 'react-icons/fi'
import { motion } from 'framer-motion'

const Home = () => {
  const features = [
    {
      icon: FiBook,
      title: 'Témoignages',
      description: 'Partagez vos récits personnels et témoignages pour construire une mémoire collective.'
    },
    {
      icon: FiArchive,
      title: 'Archives',
      description: 'Consultez et contribuez aux archives organisées du mouvement social.'
    },
    {
      icon: FiMapPin,
      title: 'Carte interactive',
      description: 'Explorez les événements sur une carte interactive avec géolocalisation.'
    },
    {
      icon: FiClock,
      title: 'Timeline',
      description: 'Parcourez l\'histoire du mouvement à travers une chronologie détaillée.'
    },
    {
      icon: FiUsers,
      title: 'Communauté',
      description: 'Échangez avec d\'autres participants dans un espace social dédié.'
    },
    {
      icon: FiHeart,
      title: 'Solidarité',
      description: 'Soutenez les témoignages et créez des liens avec la communauté.'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="font-display text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              GENZ212 France
            </h1>
            <h2 className="font-display text-2xl md:text-3xl text-primary-600 mb-8">
              Mémoire vivante & Archives
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mb-10 leading-relaxed">
              Une plateforme participative pour préserver et partager les témoignages,
              récits et contenus d'un mouvement social important.
              Ne laissons pas la mémoire s'effacer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn btn-primary text-lg px-8 py-3">
                Rejoindre la communauté
              </Link>
              <Link to="/collective-memory" className="btn btn-secondary text-lg px-8 py-3">
                Explorer les archives
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Une archive vivante et participative
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Ensemble, construisons une mémoire collective pour que chaque voix soit entendue et préservée.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-semibold text-xl text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="container-custom text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
            Votre voix compte
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Rejoignez des centaines de participants qui partagent leurs témoignages
            et construisent ensemble la mémoire de notre mouvement social.
          </p>
          <Link to="/publish" className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3">
            Partager mon témoignage
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">1000+</div>
              <div className="text-gray-600">Témoignages</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600">Contributeurs</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">2000+</div>
              <div className="text-gray-600">Photos & Vidéos</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">100%</div>
              <div className="text-gray-600">Gratuit</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
