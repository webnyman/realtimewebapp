/**
 * User routes.
 *
 * @author Björn Nyman
 * @version 1.0.0
 */

import express from 'express'
import { UserController } from '../controllers/user-controller.js'

export const router = express.Router()

const controller = new UserController()

router.get('/register', controller.register)

router.post('/register', controller.createUser)

router.get('/login', controller.login)

router.post('/login', controller.loginUser)

router.get('/logout', controller.logout)
