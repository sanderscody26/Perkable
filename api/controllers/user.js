import User from '../models/user.js'

import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export const signin = async (req, res) => {
  const { email, password } = req.body

  try {
    const existingUser = await User.findOne({ email })

    if (!existingUser)
      return res.status(404).json({ message: 'User does not exist.' })

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    )

    if (!isPasswordCorrect)
      return res.status(400).json({ message: 'Invalid credentials.' })

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      'test',
      { expiresIn: '1h' }
    )

    res.status(200).json({ profile: existingUser, token })
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error.' })
  }
}

export const signup = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser)
      return res.status(400).json({ message: 'User already exists.' })

    if (password !== confirmPassword)
      return res.status(400).json({ message: 'Passwords do not match.' })

    const hashedPassword = await bcrypt.hash(password, 12)

    const profile = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`
    })

    const token = jwt.sign({ email: profile.email, id: profile._id }, 'test', {
      expiresIn: '1h'
    })

    res.status(200).json({ profile, token })
  } catch (error) {
    console.log(error)
  }
}
