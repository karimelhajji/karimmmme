import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import prisma from '../config/db.js'

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  })
}

// Register new user
export const register = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password, firstName, lastName } = req.body

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true
      }
    })

    // Generate token
    const token = generateToken(user.id)

    res.status(201).json({
      message: 'Inscription réussie',
      token,
      user
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ message: 'Erreur lors de l\'inscription' })
  }
}

// Login user
export const login = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    // Find user
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
    }

    // Generate token
    const token = generateToken(user.id)

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    res.json({
      message: 'Connexion réussie',
      token,
      user: userWithoutPassword
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Erreur lors de la connexion' })
  }
}

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        bio: true,
        location: true,
        avatar: true,
        role: true,
        createdAt: true
      }
    })

    res.json({ user })
  } catch (error) {
    console.error('Get current user error:', error)
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur' })
  }
}
