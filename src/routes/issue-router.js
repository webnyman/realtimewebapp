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
