/**
 * User controller.
 *
 * @author Björn Nyman
 * @version 1.0.0
 */

import { User } from '../models/User.js'

/**
 * Encapsulates a controller.
 */
export class UserController {
  /**
   * Returns a HTML form for register a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  register (req, res, next) {
    res.render('user/register')
  }

  /**
   * Creates a new user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async createUser (req, res, next) {
    try {
      const newUser = new User({
        email: req.body.email,
        nickname: req.body.nickname,
        password: req.body.password
      })

      await newUser.save()

      req.session.flash = { type: 'success', text: 'You have been registered, please login' }
      res.redirect('./login')
    } catch (error) {
      if (error.code === 11000) {
        error.message = req.body.email + 'E-mail already exists'
      }
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./register')
    }
  }

  /**
   * Returns a HTML form for login a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  login (req, res, next) {
    res.render('user/login')
  }

  /**
   * Login a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async loginUser (req, res, next) {
    try {
      const user = await User.authenticate(req.body.email, req.body.password)
      req.session.regenerate(() => {
        req.session.userId = user._id
        req.session.email = user.email
        req.session.nickname = user.nickname
        req.session.flash = { type: 'success', text: 'You have been logged in!' }
        res.redirect('./snippets')
      })
    } catch (error) {
      req.session.flash = { type: 'danger', text: 'Wrong e-mail or password!' }
      res.redirect('./login')
    }
  }

  /**
   * Logout a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  logout (req, res, next) {
    try {
      if (req.session.email) {
        req.session.destroy(() => {
          res.locals.isLoggedin = false
          res.locals.createdBy = null
          res.redirect('./')
        })
      } else {
        res.sendStatus(404)
      }
    } catch (error) {
      res.sendStatus(404)
    }
  }
}
