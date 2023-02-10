/**
 * Snippets routes.
 *
 * @author Björn Nyman
 * @version 1.0.0
 */

import express from 'express'
import { SnippetsController } from '../controllers/snippets-controller.js'
import { CredentialController } from '../middlewares/credentials.js'

export const router = express.Router()

const controller = new SnippetsController()
const credentials = new CredentialController()

// Map HTTP verbs and route paths to controller action methods.

router.get('/', controller.index)
router.get('/query', controller.filtered)

router.get('/create', credentials.isLoggedin, controller.create)
router.post('/create', credentials.isLoggedin, controller.createPost)

router.get('/:id/update', credentials.isAuthorized, controller.update)
router.post('/:id/update', credentials.isAuthorized, controller.updatePost)

router.get('/:id/delete', credentials.isAuthorized, controller.delete)
router.post('/:id/delete', credentials.isAuthorized, controller.deletePost)
