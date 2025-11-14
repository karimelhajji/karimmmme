// Simple contact controller (can be extended to send emails)
export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Tous les champs sont requis' })
    }

    // Here you would typically send an email or store in database
    // For now, just log it
    console.log('Contact message received:', { name, email, subject, message })

    res.json({
      message: 'Message envoyé avec succès. Nous vous répondrons dans les plus brefs délais.'
    })
  } catch (error) {
    console.error('Contact error:', error)
    res.status(500).json({ message: 'Erreur lors de l\'envoi du message' })
  }
}
