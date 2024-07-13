const mongoose = require('mongoose');
const userSchema =new mongoose.Schema(
    {   
        name: { type: String },
        email: {type: String , required:true , unique:true},
        password: { type: String, require:true },
        isAdmin: { type: Boolean, default: false, required: true},
        phone: { type: Number},
        address: { type: String}
    }, {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);
module.exports = User;