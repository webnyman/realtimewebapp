/**
 * Module for the IssueController.
 *
 * @author Björn Nyman
 * @version 1.0.0
 */

import fetch from 'node-fetch'

/**
 * Encapsulates a controller.
 */
export class IssueController {
  /**
   * Displays a list of issues.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      const response = await fetch(`https://gitlab.lnu.se/api/v4/projects/${process.env.GITLAB_PROJECT_ID}/issues?state=opened`, {
        headers: {
          'Content-Type': 'application/json',
          'PRIVATE-TOKEN': process.env.GITLAB_API_TOKEN
        }
      })
      const data = await response.json()
      const issueData = {
        issues: data.map(data => data)
      }

      res.render('issues/index', { issueData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Closes an issue.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async close (req, res, next) {
    try {
      const response = await fetch(`https://gitlab.lnu.se/api/v4/projects/${process.env.GITLAB_PROJECT_ID}/issues/${req.params.id}?state_event=close`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'PRIVATE-TOKEN': process.env.GITLAB_API_TOKEN
        }
      })
      const data = await response.json()
      console.log(data.message)
      if (data.message) {
        req.session.flash = { type: 'danger', text: 'Something went wrong. Could not close the issue' }
      } else {
        req.session.flash = { type: 'success', text: 'The issue was successfully closed.' }
      }
      res.redirect('../')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Deletes an issue.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async delete (req, res, next) {
    try {
      const response = await fetch(`https://gitlab.lnu.se/api/v4/projects/${process.env.GITLAB_PROJECT_ID}/issues/${req.params.id}?state_event=close`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'PRIVATE-TOKEN': process.env.GITLAB_API_TOKEN
        }
      })
      const data = await response.json()
      console.log(data.message)
      if (data.message) {
        req.session.flash = { type: 'danger', text: 'Something went wrong. Could not close the issue' }
      } else {
        req.session.flash = { type: 'success', text: 'The issue was successfully closed.' }
      }
      res.redirect('../')
    } catch (error) {
      next(error)
    }
  }
}
