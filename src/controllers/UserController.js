const UserService = require('../services/UserSevice')
const JwtService = require('../services/JwtService')

const createUser = async (req, res) => {
    
    try{
        const {name, phone, email, password, cfpassword } = req.body
        const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
        const isCheckEmail = reg.test(email)

        // Kiểm tra đầu vào
        if (!name || !phone|| !email || !password || !cfpassword  ){
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }else if(!isCheckEmail){
            return res.status(400).json({
                status: 'ERR',
                message: 'Email không hợp lệ'
            })
        }else if(password !== cfpassword){
            return res.status(400).json({
                status: 'ERR',
                message: 'Mật khẩu và xác nhận mật khẩu không trùng khớp'
            })
        }
        
        const response = await UserService.createUser(req.body)
        return res.status(200).json(response)
    }catch (e){

        return res.status(500).json({
            message: e
        })
    }
}

const loginUser = async (req, res) => {
    
    try{
        const {email, password} = req.body
        const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
        const isCheckEmail = reg.test(email)

        // Kiểm tra đầu vào
        if (!email || !password ){
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }else if(!isCheckEmail){
            return res.status(400).json({
                status: 'ERR',
                message: 'Email không hợp lệ'
            })
        }
        
        const response = await UserService.loginUser(req.body)
        const { refresh_token, ...newReponse} = response
        // console.log('response', response)
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            samesite: 'strict'
            
        })
        return res.status(200).json(newReponse)
    }catch (e){

        return res.status(500).json({
            message: e
        })
    }
}

const updateUser = async (req, res) => {
    
    try{
        const userId = req.params.id
        const data = req.body
        if (!userId){
            return res.status(400).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.updateUser(userId,data)
        return res.status(200).json(response)
    }catch (e){

        return res.status(500).json({
            message: e
        })
    }
}

const deleteUser = async (req, res) => {
    
    try{
        const userId = req.params.id
        if (!userId){
            return res.status(400).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.deleteUser(userId)
        return res.status(200).json(response)
    }catch (e){

        return res.status(500).json({
            message: e
        })
    }
}

const deleteMany = async (req, res) => {
    
    try{
        const ids = req.body
        if (!ids){
            return res.status(400).json({
                status: 'ERR',
                message: 'The ids is required'
            })
        }
        const response = await UserService.deleteManyUser(ids)
        return res.status(200).json(response)
    }catch (e){

        return res.status(500).json({
            message: e
        })
    }
}

const getAllUser = async (req, res) => {
    
    try{
        
        const response = await UserService.getAllUser()
        return res.status(200).json(response)
    }catch (e){

        return res.status(500).json({
            message: e
        })
    }
}

const getDetailsUser = async (req, res) => {
    
    try{
        const userId = req.params.id
        if (!userId){
            return res.status(400).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.getDetailsUser(userId)
        return res.status(200).json(response)
    }catch (e){

        return res.status(500).json({
            message: e
        })
    }
}

const refreshToken = async (req, res) => {
    try{
        const token = req.cookies.refresh_token
        if (!token){
            return res.status(400).json({
                status: 'ERR',
                message: 'The token is required'
            })
        }
        const response = await JwtService.refreshTokenJwtService(token)
        return res.status(200).json(response)
    }catch (e){

        return res.status(500).json({
            message: e
        })
    }
}

const logoutUser = async (req, res) => {
    try{
        res.clearCookie('refresh_token')
        return res.status(200).json({
            status: 'ok',
            message: 'Logout successfully'
        })
    }catch (e){

        return res.status(500).json({
            message: e
        })
    }
}

module.exports = {
    createUser,
    loginUser,
    logoutUser,
    updateUser,
    deleteUser,
    deleteMany,
    getAllUser,
    getDetailsUser,
    refreshToken
}
    