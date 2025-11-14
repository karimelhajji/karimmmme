import { useState } from 'react'
import { FiMail, FiMessageCircle, FiSend } from 'react-icons/fi'
import { toast } from 'react-toastify'
import axios from 'axios'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post('/api/contact', formData)
      toast.success('Message envoyé avec succès !')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Erreur lors de l\'envoi du message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-4">
            Contact
          </h1>
          <p className="text-lg text-gray-600">
            Une question ? Une suggestion ? N'hésitez pas à nous contacter
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="card p-8">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">
              Envoyez-nous un message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                  placeholder="votre@email.fr"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Sujet
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="input"
                  placeholder="Sujet de votre message"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="input resize-none"
                  placeholder="Votre message..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary py-3 flex items-center justify-center space-x-2"
              >
                <FiSend className="w-5 h-5" />
                <span>{loading ? 'Envoi...' : 'Envoyer'}</span>
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="card p-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiMail className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg text-gray-900 mb-2">
                    Email
                  </h3>
                  <p className="text-gray-600">contact@genz212france.fr</p>
                </div>
              </div>
            </div>

            <div className="card p-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiMessageCircle className="w-6 h-6 text-accent-600" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg text-gray-900 mb-2">
                    Réseaux sociaux
                  </h3>
                  <p className="text-gray-600">Suivez-nous sur nos réseaux pour rester informés</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Sections */}
        <div className="space-y-8">
          <div id="mentions" className="card p-8">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">
              Mentions légales
            </h2>
            <div className="prose max-w-none text-gray-700">
              <p className="mb-4">
                <strong>Nom du site :</strong> GENZ212 France - Mémoire vivante & Archives
              </p>
              <p className="mb-4">
                <strong>Éditeur :</strong> Collectif GENZ212 France
              </p>
              <p className="mb-4">
                <strong>Hébergement :</strong> [Informations d'hébergement à compléter]
              </p>
              <p>
                Le site GENZ212 France est une plateforme participative dédiée à la préservation
                de la mémoire collective d'un mouvement social. Tous les contenus publiés sont
                sous la responsabilité de leurs auteurs respectifs.
              </p>
            </div>
          </div>

          <div id="privacy" className="card p-8">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">
              Politique de confidentialité
            </h2>
            <div className="prose max-w-none text-gray-700">
              <h3 className="font-semibold text-lg mb-2">Collecte des données</h3>
              <p className="mb-4">
                Nous collectons uniquement les données nécessaires au fonctionnement du site :
                email, nom, prénom, et contenus publiés volontairement par les utilisateurs.
              </p>

              <h3 className="font-semibold text-lg mb-2">Utilisation des données</h3>
              <p className="mb-4">
                Vos données sont utilisées exclusivement pour le fonctionnement du site et ne
                sont jamais partagées avec des tiers à des fins commerciales.
              </p>

              <h3 className="font-semibold text-lg mb-2">Sécurité</h3>
              <p className="mb-4">
                Nous mettons en œuvre toutes les mesures techniques nécessaires pour protéger
                vos données personnelles.
              </p>

              <h3 className="font-semibold text-lg mb-2">Vos droits</h3>
              <p>
                Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de
                suppression de vos données personnelles. Pour exercer ces droits, contactez-nous
                à l'adresse : contact@genz212france.fr
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
