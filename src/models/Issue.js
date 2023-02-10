/**
 * Mongoose model Issue.
 *
 * @author Björn Nyman
 * @version 1.0.0
 */

import mongoose from 'mongoose'
const Schema = mongoose.Schema

// Create a schema.
const issueSchema = new Schema({
  issue: {
    type: String,
    required: true,
    maxlength: 4000
  },
  createdBy: {
    type: String,
    minlength: 1,
    required: true
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

issueSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

// Create a model using the schema.
export const Issue = mongoose.model('Issue', issueSchema)
