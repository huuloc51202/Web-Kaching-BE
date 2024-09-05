const OrderService = require('../services/OrderService')

const createOrder = async (req, res) => {
    
    try{
        const {
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
            fullName,
            address,
            phone ,city
        } = req.body
        

        // Kiểm tra đầu vào
        if (!paymentMethod || !itemsPrice || !shippingPrice || !totalPrice  || !fullName || !address || !phone || !city  ){
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        
        
        const response = await OrderService.createOrder(req.body)
        return res.status(200).json(response)
    }catch (e){

        return res.status(500).json({
            message: e
        })
    }
}



module.exports = {
    createOrder,
    
}
    