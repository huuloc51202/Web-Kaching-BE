const Product = require("../models/ProductModel")

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
       
        const {name, image,typeimage, type, price, countInStock, description } = newProduct
        try{
            const checkProduct = await Product.findOne({
                name: name
            })
            if (checkProduct !== null) {
                resolve({
                    status: 'OK',
                    message: 'The name of product is already'
                })
            }
            const createdProduct = await Product.create({
                name, 
                image,
                typeimage, 
                type, 
                price,
                countInStock, 
                description
            })
            if (createdProduct){
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdProduct
                })
            }
            
        }catch (e){
            reject(e)
        }
    })
}

const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try{
            const checkProduct = await Product.findOne({
                _id: id
            })
            if (checkProduct === null) {
                resolve({
                    status: 'OK',
                    message: 'The product is not defined'
                })
            }else{
                // Cập nhật san pham
                const updateProduct = await Product.findByIdAndUpdate(id, data, { new: true})
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: updateProduct
                })
            }

            
        }catch (e){
            reject(e)
        }
    })
}

const getDetailsProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try{
            const product = await Product.findOne({
                _id: id
            })
            if (product === null) {
                resolve({
                    status: 'OK',
                    message: 'The product is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'success',
                data: product
            })

            
        }catch (e){
            reject(e)
        }
    })
}

const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try{
            const checkProduct = await Product.findOne({
                _id: id
            })
            if (checkProduct === null) {
                resolve({
                    status: 'OK',
                    message: 'The Product is not defined'
                })
            }
            // Xoá thông tin người dùng
            await Product.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete Product success'
            })

            
        }catch (e){
            reject(e)
        }
    })
}

const deleteManyProduct = (ids) => {
    return new Promise(async (resolve, reject) => {
        try{
            // Xoá thông tin người dùng
            await Product.deleteMany( {_id : ids})
            resolve({
                status: 'OK',
                message: 'Delete Product success'
            })

            
        }catch (e){
            reject(e)
        }
    })
}

const getAllProduct = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = {};
            const options = {
                limit: limit,
                skip: page * limit,
                sort: {}, // Khởi tạo object sort
            };

            // Xây dựng điều kiện lọc nếu có
            if (filter) {
                const [label, regex] = filter;
                query[label] = { '$regex': regex, '$options': 'i' }; // Thêm '$options': 'i' để không phân biệt hoa thường
            }

            // Xây dựng điều kiện sắp xếp nếu có
            if (sort) {
                const [order, field] = sort;
                options.sort[field] = order;
            }

            // Thêm điều kiện sắp xếp theo `createdAt` để sản phẩm mới nhất lên đầu
            if (!options.sort.createdAt) {
                options.sort.createdAt = -1; // Sắp xếp theo createdAt giảm dần
            }

            // Lấy tổng số sản phẩm (có thể cần điều kiện lọc)
            const totalProduct = await Product.countDocuments(query);

            // Lấy sản phẩm với các điều kiện lọc và sắp xếp
            const allProducts = await Product.find(query, null, options);

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allProducts,
                total: totalProduct,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(totalProduct / limit)
            });
        } catch (e) {
            reject(e);
        }
    });
}


const getAllType = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allType = await Product.distinct('type')

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allType,
            });
        } catch (e) {
            reject(e);
        }
    });
}



module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    deleteManyProduct,
    getAllProduct,
    getAllType
}