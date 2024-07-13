const express = require('express')
const router = express.Router()
const ProductController = require('../controllers/ProductController')
const { authMiddleWare } = require('../middleware/authMiddleWare')

router.post('/create' , ProductController.createProduct)
router.put('/update-product/:id',authMiddleWare , ProductController.updateProduct)
router.get('/get-details/:id', ProductController.getDetailsProduct)
router.delete('/delete-product/:id', ProductController.deleteProduct)
router.get('/getAll', ProductController.getAllProduct)

module.exports = router