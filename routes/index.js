const express = require('express')
const router = express.Router()

const users = require('../controllers/users')
const items = require('../controllers/items')

router.route('/users')
	.get(users.getAllUsers)
	.post(users.createUser)

router.route('/users/:userId/id')
	.get(users.getUserById)
	.put(users.updateUser)
	.delete(users.deleteUser)

router.route('/users/:email/email')
	.get(users.getUserByEmail)

//new code under here
router.route('/items')
	.get(items.getAllItems)
	.post(items.createItem)

router.route('/items/:itemId/id')
	.get(items.getItemById)
	.put(items.updateItem)
	.delete(items.deleteItem)

router.route('/items/:itemId/purchase')
	.put(items.purchaseItem)
//update, delete, get user by id, get user by email
module.exports = router