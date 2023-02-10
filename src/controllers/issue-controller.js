/**
 * Module for the IssueController.
 *
 * @author Björn Nyman
 * @version 1.0.0
 */

import { Issue } from '../models/Issue.js'

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
      const issueData = {
        issues: (await Issue.find().sort({ _id: 'desc' }))
          .map(issue => issue.toObject())
      }

      res.render('issues/index', { issueData })
    } catch (error) {
      next(error)
    }
  }
}
