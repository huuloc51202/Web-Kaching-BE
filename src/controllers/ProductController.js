const ProductService = require('../services/ProductService')
const JwtService = require('../services/JwtService')

const createProduct = async (req, res) => {
    
    try{
        const {name, image,typeimage, type, price, countInStock, description } = req.body
        

        // Kiểm tra đầu vào
        if (!name || !image || !typeimage || !type || !price || !countInStock    ){
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        
        
        const response = await ProductService.createProduct(req.body)
        return res.status(200).json(response)
    }catch (e){

        return res.status(500).json({
            message: e
        })
    }
}

const updateProduct = async (req, res) => {
    
    try{
        const productId = req.params.id
        const data = req.body
        if (!productId){
            return res.status(400).json({
                status: 'ERR',
                message: 'The productId is required'
            })
        }
        const response = await ProductService.updateProduct(productId,data)
        return res.status(200).json(response)
    }catch (e){

        return res.status(500).json({
            message: e
        })
    }
}

const getDetailsProduct = async (req, res) => {
    
    try{
        const productId = req.params.id
        if (!productId){
            return res.status(400).json({
                status: 'ERR',
                message: 'The productId is required'
            })
        }
        const response = await ProductService.getDetailsProduct(productId)
        return res.status(200).json(response)
    }catch (e){

        return res.status(500).json({
            message: e
        })
    }
}

const deleteProduct = async (req, res) => {
    
    try{
        const productId = req.params.id
        if (!productId){
            return res.status(400).json({
                status: 'ERR',
                message: 'The productId is required'
            })
        }
        const response = await ProductService.deleteProduct(productId)
        return res.status(200).json(response)
    }catch (e){

        return res.status(500).json({
            message: e
        })
    }
}

const deleteMany = async (req, res) => {
    
    try{
        const ids = req.body.ids
        if (!ids){
            return res.status(400).json({
                status: 'ERR',
                message: 'The ids is required'
            })
        }
        const response = await ProductService.deleteManyProduct(ids)
        return res.status(200).json(response)
    }catch (e){

        return res.status(500).json({
            message: e
        })
    }
}

const getAllProduct = async (req, res) => {
    
    try{
        const {limit, page, sort, filter} = req.query
        // const response = await ProductService.getAllProduct(Number(limit) || 8, Number(page) || 0, sort, filter)
        const response = await ProductService.getAllProduct(limit ? Number(limit) : undefined, Number(page) || 0, sort, filter);
        return res.status(200).json(response)
    }catch (e){

        return res.status(500).json({
            message: e
        })
    }
}

const getAllType = async (req, res) => {
    
    try{
        const response = await ProductService.getAllType()
        return res.status(200).json(response)
    }catch (e){

        return res.status(500).json({
            message: e
        })
    }
}



module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    deleteMany,
    getAllProduct,
    getAllType
}
    