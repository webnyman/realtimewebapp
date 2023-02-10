/**
 * Mongoose model User.
 *
 * @author Björn Nyman
 * @version 1.0.0
 */

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid e-mail address'],
    trim: true
  },
  nickname: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    minlength: [3, 'Your nickname must be of minimun lenght 3 characters']
  },
  password: {
    type: String,
    minlength: [10, 'The password must be of minimum length 10 characters'],
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
})

/**
 * Static function for authentication.
 *
 * @param  {any} email E-mail
 * @param  {any} password password
 */
userSchema.statics.authenticate = async function (email, password) {
  const user = await User.findOne({ email })

  // If no user found or password is wrong, throw an error
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid login attempt.')
  }

  // User found and password correct, return the user
  return user
}

// hashing a password before saving it to the database
userSchema.pre('save', async function () {
  const user = this
  user.password = await bcrypt.hash(user.password, 10)
})

// Create a model using the schema.
export const User = mongoose.model('User', userSchema)
