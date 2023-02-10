/**
 * Mongoose model Snippet.
 *
 * @author Björn Nyman
 * @version 1.0.0
 */

import mongoose from 'mongoose'
const Schema = mongoose.Schema

// Create a schema.
const snippetSchema = new Schema({
  snippetName: {
    type: String,
    required: true,
    minlength: 1
  },
  snippet: {
    type: String,
    maxlength: 4000
  },
  createdBy: {
    type: String,
    minlength: 1,
    required: true
  },
  tag: {
    type: String,
    minlength: 2,
    maxlength: 10
  }
}, {
  timestamps: true,
  toObject: {
    virtuals: true, // ensure virtual fields are serialized
    /**
     * Performs a transformation of the resulting object to remove sensitive information.
     *
     * @param {object} doc - The mongoose document which is being converted.
     * @param {object} ret - The plain object representation which has been converted.
     */
    transform: function (doc, ret) {
      delete ret._id
      delete ret.__v
    }
  }
})

snippetSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

// Create a model using the schema.
export const Snippet = mongoose.model('Snippet', snippetSchema)
