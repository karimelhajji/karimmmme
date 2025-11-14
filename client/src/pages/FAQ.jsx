import { useState } from 'react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      category: 'Général',
      questions: [
        {
          q: 'Qu\'est-ce que GENZ212 France ?',
          a: 'GENZ212 France est une plateforme participative dédiée à la préservation et au partage de la mémoire collective d\'un mouvement social important. C\'est un espace où chacun peut contribuer en partageant ses témoignages, photos, vidéos et récits.'
        },
        {
          q: 'Le site est-il gratuit ?',
          a: 'Oui, GENZ212 France est entièrement gratuit. Nous croyons que la mémoire collective doit être accessible à tous, sans barrière financière.'
        },
        {
          q: 'Qui peut contribuer ?',
          a: 'Toute personne ayant vécu, participé ou témoigné du mouvement social peut contribuer. Il suffit de créer un compte pour commencer à partager vos contenus.'
        }
      ]
    },
    {
      category: 'Compte et inscription',
      questions: [
        {
          q: 'Comment créer un compte ?',
          a: 'Cliquez sur "Inscription" dans le menu, remplissez le formulaire avec votre email et un mot de passe, et validez. Vous pourrez ensuite immédiatement commencer à publier.'
        },
        {
          q: 'Mes données sont-elles protégées ?',
          a: 'Oui, nous prenons la sécurité très au sérieux. Vos données sont chiffrées et nous ne les partageons jamais avec des tiers. Consultez notre politique de confidentialité pour plus de détails.'
        },
        {
          q: 'Puis-je utiliser un pseudonyme ?',
          a: 'Oui, vous pouvez utiliser un prénom et nom de votre choix lors de l\'inscription. Nous respectons votre choix de discrétion.'
        }
      ]
    },
    {
      category: 'Publier du contenu',
      questions: [
        {
          q: 'Quels types de contenus puis-je publier ?',
          a: 'Vous pouvez publier des témoignages écrits, des articles longs, des photos, des vidéos, des enregistrements audio, ainsi que des documents. Tous les formats courants sont acceptés.'
        },
        {
          q: 'Y a-t-il une limite de taille pour les fichiers ?',
          a: 'Les photos peuvent aller jusqu\'à 10 Mo, les vidéos jusqu\'à 500 Mo, et les documents jusqu\'à 50 Mo.'
        },
        {
          q: 'Puis-je modifier ou supprimer mes publications ?',
          a: 'Oui, vous pouvez modifier ou supprimer vos publications à tout moment depuis votre profil.'
        },
        {
          q: 'Comment sont organisées les publications ?',
          a: 'Les publications sont organisées par date, catégorie (manifestations, police, solidarité, etc.), lieu, et tags. Vous pouvez explorer les archives via une timeline, une carte interactive, ou par thématiques.'
        }
      ]
    },
    {
      category: 'Interaction et communauté',
      questions: [
        {
          q: 'Puis-je commenter les publications ?',
          a: 'Oui, vous pouvez commenter, aimer et partager toutes les publications de la communauté.'
        },
        {
          q: 'Comment signaler un contenu inapproprié ?',
          a: 'Chaque publication dispose d\'un bouton "Signaler". L\'équipe de modération examinera le contenu dans les plus brefs délais.'
        },
        {
          q: 'Puis-je suivre d\'autres utilisateurs ?',
          a: 'Oui, vous pouvez suivre d\'autres contributeurs pour voir leurs publications dans votre fil d\'actualité.'
        }
      ]
    },
    {
      category: 'Archives et mémoire collective',
      questions: [
        {
          q: 'Comment fonctionne la section "Mémoire Collective" ?',
          a: 'La Mémoire Collective organise tous les contenus publiés sous trois formats : une timeline chronologique, une carte interactive géolocalisée, et des catégories thématiques.'
        },
        {
          q: 'Puis-je exporter les archives ?',
          a: 'Oui, une fonction d\'export permet de télécharger une archive complète des contenus publics au format PDF ou JSON.'
        },
        {
          q: 'Les contenus sont-ils permanents ?',
          a: 'Oui, notre mission est de préserver ces témoignages sur le long terme. Nous effectuons des sauvegardes régulières pour garantir la pérennité des archives.'
        }
      ]
    },
    {
      category: 'Confidentialité et sécurité',
      questions: [
        {
          q: 'Qui peut voir mes publications ?',
          a: 'Par défaut, toutes les publications sont publiques et visibles par tous les visiteurs du site. Cela permet de maximiser la portée de la mémoire collective.'
        },
        {
          q: 'Puis-je publier anonymement ?',
          a: 'Vous pouvez utiliser un pseudonyme lors de l\'inscription, mais toutes les publications sont associées à votre compte.'
        },
        {
          q: 'Que faire si je veux supprimer mon compte ?',
          a: 'Vous pouvez supprimer votre compte à tout moment depuis les paramètres de votre profil. Vos publications seront alors rendues anonymes mais resteront dans les archives.'
        }
      ]
    }
  ]

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-4">
            Questions fréquentes
          </h1>
          <p className="text-lg text-gray-600">
            Tout ce que vous devez savoir sur GENZ212 France
          </p>
        </div>

        <div className="space-y-8">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">
                {category.category}
              </h2>
              <div className="space-y-3">
                {category.questions.map((faq, questionIndex) => {
                  const index = `${categoryIndex}-${questionIndex}`
                  const isOpen = openIndex === index

                  return (
                    <div key={questionIndex} className="card overflow-hidden">
                      <button
                        onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                        {isOpen ? (
                          <FiChevronUp className="w-5 h-5 text-primary-600 flex-shrink-0" />
                        ) : (
                          <FiChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-6 text-gray-700 animate-fade-in">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 card p-8 text-center">
          <h3 className="font-display text-xl font-bold text-gray-900 mb-2">
            Vous n'avez pas trouvé votre réponse ?
          </h3>
          <p className="text-gray-600 mb-6">
            N'hésitez pas à nous contacter directement
          </p>
          <a href="/contact" className="btn btn-primary">
            Nous contacter
          </a>
        </div>
      </div>
    </div>
  )
}

export default FAQ
