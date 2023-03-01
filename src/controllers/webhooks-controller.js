/**
 * Module for the WebhooksController.
 *
 * @author Björn Nyman
 * @version 1.0.0
 */

/**
 * Encapsulates a controller.
 */
export class WebhooksController {
  /**
   * Authenticates the webhook.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  authenticate (req, res, next) {
    // Use the GitLab secret token to validate the received payload.
    if (req.headers['x-gitlab-token'] !== process.env.WEBHOOK_SECRET) {
      const error = new Error('Invalid token')
      error.status = 401
      next(error)
      return
    }
    next()
  }

  /**
   * Receives a webhook, and creates a new issue.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async webhook (req, res, next) {
    try {
      // Only interested in issues events. (But still, respond with a 200
      // for events not supported.)
      let issue = null
      if (req.body.event_type === 'issue') {
        issue = {
          id: req.body.object_attributes.id,
          iid: req.body.object_attributes.iid,
          title: req.body.object_attributes.title,
          description: req.body.object_attributes.description,
          createdBy: req.body.user.name,
          action: req.body.object_attributes.action,
          avatar: req.body.user.avatar_url
        }
      }

      // It is important to respond quickly!
      if (req.headers['x-gitlab-event']) {
        res.status(200).send()
      }

      // Put this last because socket communication can take long time.
      if (issue.action === 'open' || issue.action === 'reopen') {
        res.io.emit('newIssue', issue)
      } else if (issue.action === 'close') {
        res.io.emit('closeIssue', issue)
      } else if (issue.action === 'update') {
        res.io.emit('updateIssue', issue)
      }
    } catch (error) {
      const err = new Error('Internal Server Error')
      err.status = 500
      next(err)
    }
  }
}
