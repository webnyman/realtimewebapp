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
      const response = await fetch(`https://gitlab.lnu.se/api/v4/projects/${process.env.GITLAB_PROJECT_ID}/issues?state=opened&per_page=100`, {
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
   * Returns an issue for edit.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async edit (req, res, next) {
    try {
      const response = await fetch(`https://gitlab.lnu.se/api/v4/projects/${process.env.GITLAB_PROJECT_ID}/issues/${req.params.id}`, {
        headers: {
          'Content-Type': 'application/json',
          'PRIVATE-TOKEN': process.env.GITLAB_API_TOKEN
        }
      })
      const issueData = await response.json()
      res.render('issues/edit', { issueData })
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
   * Updates an issues description.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async update (req, res, next) {
    try {
      const description = {
        description: req.body.description
      }
      const response = await fetch(`https://gitlab.lnu.se/api/v4/projects/${process.env.GITLAB_PROJECT_ID}/issues/${req.params.id}`, {
        method: 'PUT',
        body: JSON.stringify(description),
        headers: {
          'Content-Type': 'application/json',
          'PRIVATE-TOKEN': process.env.GITLAB_API_TOKEN
        }
      })
      const data = await response.json()
      if (data.error) {
        req.session.flash = { type: 'danger', text: 'Something went wrong. Could not update the issue' }
      } else {
        req.session.flash = { type: 'success', text: 'The issue was successfully updated.' }
      }
      res.redirect('../')
    } catch (error) {
      next(error)
    }
  }
}
