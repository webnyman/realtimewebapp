/**
 * Issues routes.
 *
 * @author Björn Nyman
 * @version 1.0.0
 */

import express from 'express'
import { IssueController } from '../controllers/issue-controller.js'

export const router = express.Router()

const controller = new IssueController()

// Map HTTP verbs and route paths to controller action methods.

router.get('/', controller.index)

router.get('/:id/close', controller.close)

router.get('/:id/update', controller.edit)

router.post('/:id/update', controller.update)
