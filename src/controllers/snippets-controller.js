/**
 * Module for the SnippetsController.
 *
 * @author Björn Nyman
 * @version 1.0.0
 */

import { Snippet } from '../models/Snippet.js'

/**
 * Encapsulates a controller.
 */
export class SnippetsController {
  /**
   * Displays a list of snippets.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      const snippetData = {
        snippets: (await Snippet.find().sort({ createdAt: 'desc' }))
          .map(snippet => snippet.toObject())
      }

      res.render('snippets/index', { snippetData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Displays a list of filtered snippets.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async filtered (req, res, next) {
    try {
      let filterSnippets
      req.query.tag ? (filterSnippets = { tag: req.query.tag }) : (filterSnippets = { createdBy: req.query.user })
      const snippetData = {
        snippets: (await Snippet.find(filterSnippets).sort({ createdAt: 'desc' }))
          .map(snippet => snippet.toObject())
      }
      res.locals.filtered = true
      res.render('snippets/index', { snippetData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Returns a HTML form for creating a new snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async create (req, res) {
    res.render('snippets/create')
  }

  /**
   * Creates a new snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async createPost (req, res) {
    try {
      const snippet = new Snippet({
        snippetName: req.body.snippetName,
        snippet: req.body.snippetCode,
        createdBy: req.session.nickname,
        tag: req.body.tag
      })

      await snippet.save()

      req.session.flash = { type: 'success', text: 'The snippet was created successfully.' }
      res.redirect('./')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./create')
    }
  }

  /**
   * Returns a HTML form for updating a snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async update (req, res) {
    try {
      const snippet = await Snippet.findById(req.params.id)

      res.render('snippets/update', { snippetData: snippet.toObject() })
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('..')
    }
  }

  /**
   * Updates a specific snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async updatePost (req, res) {
    try {
      const snippet = await Snippet.findById(req.params.id)

      if (snippet) {
        snippet.snippetName = req.body.snippetName
        snippet.snippet = req.body.snippetCode
        snippet.tag = req.body.tag

        await snippet.save()

        req.session.flash = { type: 'success', text: 'The snippet was updated successfully.' }
      } else {
        req.session.flash = {
          type: 'danger',
          text: 'The snippet you attempted to update was removed.'
        }
      }
      res.redirect('..')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./update')
    }
  }

  /**
   * Returns a HTML form for deleting a snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async delete (req, res) {
    try {
      const snippet = await Snippet.findById(req.params.id)
      res.render('snippets/delete', { snippetData: snippet.toObject() })
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('..')
    }
  }

  /**
   * Deletes the specified snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async deletePost (req, res) {
    try {
      await Snippet.findByIdAndDelete(req.body.id)

      req.session.flash = { type: 'success', text: 'The snippet was deleted successfully.' }
      res.redirect('..')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./delete')
    }
  }
}
