import { Snippet } from '../models/Snippet.js'

/**
 * Credentials controller.
 *
 * @author Björn Nyman
 * @version 1.0.0
 */

/**
 * Encapsulates a middleware.
 */
export class CredentialController {
/**
 * Checks if user is logged in and sets locals.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
  setLocals (req, res, next) {
    if (req.session.email) {
      res.locals.isLoggedin = true
      res.locals.createdBy = req.session.nickname
    }
    next()
  }

  /**
   * Checks if user is logged in.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  isLoggedin (req, res, next) {
    if (req.session.email) {
      next()
    } else {
      res.sendStatus(404)
    }
  }

  /**
   * Checks if user is authorized to edit/delete snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async isAuthorized (req, res, next) {
    if (req.params.id) {
      const snippet = await Snippet.findById(req.params.id)
      if (!req.session.email) {
        res.sendStatus(404)
      } else if (snippet.createdBy !== req.session.nickname) {
        res.sendStatus(403)
      } else {
        next()
      }
    }
  }
}
