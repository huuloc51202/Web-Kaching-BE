const Order = require("../models/OrderProduct")
const Product = require("../models/ProductModel")

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        const {
            orderItems,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
            fullName, address, phone, city, user,
        } = newOrder;

        try {
            // Xử lý từng sản phẩm trong orderItems
            const promises = orderItems.map(async (order) => {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        countInStock: { $gte: order.amount } // Kiểm tra số lượng tồn kho
                    },
                    {
                        $inc: {
                            countInStock: -order.amount, // Giảm số lượng tồn kho
                            selled: +order.amount, // Tăng số lượng đã bán
                        }
                    },
                    { new: true }
                );

                if (productData) {
                    return {
                        status: 'OK',
                        message: 'SUCCESS'
                    };
                } else {
                    return {
                        status: 'ERR',
                        message: 'ERR',
                        id: order.product // Lưu ID sản phẩm lỗi
                    };
                }
            });

            // Chờ tất cả các promises hoàn thành
            const results = await Promise.all(promises);

            // Kiểm tra xem có sản phẩm nào bị lỗi không
            const newData = results && results.filter((item) => item.status === 'ERR');

            if (newData.length) {
                // Nếu có sản phẩm hết hàng hoặc lỗi, trả về thông báo lỗi
                const arrId = newData.map((item) => item.id);
                resolve({
                    status: 'ERR',
                    message: `Sản phẩm với id ${arrId.join(', ')} tạm hết hàng`
                });
            } else {
                // Nếu tất cả sản phẩm đều hợp lệ, tạo đơn hàng
                const createdOrder = await Order.create({
                    orderItems,
                    shippingAddress: {
                        fullName,
                        address,
                        phone,
                        city,
                    },
                    paymentMethod,
                    itemsPrice,
                    shippingPrice,
                    totalPrice,
                    user: user,
                });

                if (createdOrder) {
                    resolve({
                        status: 'OK',
                        message: 'SUCCESS',
                        order: createdOrder // Trả về đơn hàng đã tạo
                    });
                } else {
                    reject({
                        status: 'ERR',
                        message: 'Không thể tạo đơn hàng'
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};


const getAllOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try{
            const order = await Order.find({
                user: id
            })
            if (order === null) {
                resolve({
                    status: 'OK',
                    message: 'The order is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'success',
                data: order
            })

            
        }catch (e){
            reject(e)
        }
    })
}

const getDetailsOrder = (id) => {
    return new Promise(async (resolve, reject) => {
        try{
            const order = await Order.findById({
                _id: id
            })
            if (order === null) {
                resolve({
                    status: 'OK',
                    message: 'The order is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'success',
                data: order
            })

            
        }catch (e){
            reject(e)
        }
    })
}

// const  cancleOrderDetails = (id,data) => {
//     return new Promise(async (resolve, reject) => {
//         try{
//             let order = []
//             const promises = data.map(async (order) => {

//                 const productData = await Product.findOneAndUpdate(
//                     {
//                         _id: order.product,
//                         selled: {$gte: order.amount}
//                     },
//                     {$inc: {
//                         countInStock: +order.amount,
//                         selled: -order.amount,
//                     }},
//                     {new: true}
                    
//                 )
//                 console.log('productData',productData)
//                 if(productData){
    
//                     order = await Order.findByIdAndDelete({
//                         id
//                     })
//                     if (order === null) {
//                         resolve({
//                             status: 'OK',
//                             message: 'The Order is not defined'
//                         })
//                     }
//                 }else{
//                     return{
//                         status: 'OK',
//                         message: 'ERR',
//                         id: order.product
                            
    
//                     }
//                 }
//             })
//             const results = await Promise.all(promises)
//             const newData = results && results.filter((item) => item)
//             if(newData.length){
//                 resolve({
//                     status: 'ERR',
//                     message: `Sản phẩm với id${newData.join(',')} không tồn tại`
//                 })
//             }
//             resolve({
//                 status: 'OK',
//                 message: 'SUCCESS',
//                 data: order
//             })
//             console.log('results',results)

            
//         }catch (e){
//             reject(e)
//         }
//     })
// }


const cancelOrderDetails = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Tìm đơn hàng theo ID
            const order = await Order.findById(id);
            if (!order) {
                return resolve({
                    status: 'ERR',
                    message: 'Order not found'
                });
            }

            // Duyệt qua từng sản phẩm trong đơn hàng và khôi phục số lượng tồn kho
            const promises = data.map(async (item) => {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: item.product,
                        selled: { $gte: item.amount }  // Kiểm tra số lượng đã bán có đủ để khôi phục không
                    },
                    {
                        $inc: {
                            countInStock: item.amount,  // Khôi phục lại số lượng tồn kho
                            selled: -item.amount        // Giảm số lượng đã bán
                        }
                    },
                    { new: true }
                );

                if (!productData) {
                    return { status: 'ERR', message: `Product ${item.product} not found or not enough selled quantity` };
                }
                return { status: 'OK' };
            });

            // Chờ tất cả các thao tác cập nhật sản phẩm hoàn thành
            const results = await Promise.all(promises);

            // Kiểm tra nếu có sản phẩm không cập nhật thành công
            const errors = results.filter(item => item.status === 'ERR');
            if (errors.length > 0) {
                return resolve({
                    status: 'ERR',
                    message: errors.map(err => err.message).join(', ')
                });
            }

            // Nếu tất cả sản phẩm được cập nhật thành công, xóa đơn hàng
            await Order.findByIdAndDelete(id);
            resolve({
                status: 'OK',
                message: 'Order cancelled successfully'
            });

        } catch (e) {
            reject(e);
        }
    });
};

const getAllOrder = () => {
    return new Promise(async (resolve, reject) => {
        try{
            const allOrder = await Order.find()
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allOrder
            })

            
        }catch (e){
            reject(e)
        }
    })
}

module.exports = {
    createOrder,
    getAllOrderDetails,
    getDetailsOrder,
    cancelOrderDetails,
    getAllOrder
}