const mongoose = require('mongoose')
const db = require('../config/db')
const bcrypt = require('bcrypt')

const { Schema } = mongoose;
const userSchema = new Schema(
    {
        firstName : {
            type:String,
            required : true
        },
        lastName : {
            type:String,
            required : true
        },
        mobileNumber:{
            type:String,
            lowercase:true,
            unique:true,
            required:true
        },
        password:{
            type:String,
            required:true
        }
    },{ versionKey: false }
);

const adminUserSchema = new Schema(
    {
        orgName : {
            unique : true,
            type:String,
            required : true
        },
        mobileNumber:{
            type:String,
            lowercase:true,
            unique:true,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        address:{
            type:String,
            required:true
        }
    },{ versionKey: false }
)

userSchema.pre('save',async function(){
    try{
        var user = this;
        const salt = await(bcrypt.genSalt(10));
        const hashPass = await bcrypt.hash(user.password,salt);
        user.password = hashPass;
    }catch(err){
        throw err;
    }
});

adminUserSchema.pre('save',async function(){
    try {
        var user = this;
        const salt = await(bcrypt.genSalt(11));
        const hashPass = await bcrypt.hash(user.password,salt);
        user.password = hashPass;
    } catch (error) {
        throw error;
    }
});

userSchema.methods.comparePassword = async function(userPassword){
    try {
        const isMatch = await bcrypt.compare(userPassword,this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }
}

adminUserSchema.methods.comparePassword = async function(adminUserPassword){
    try {
        const isMatch = await bcrypt.compare(adminUserPassword,this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }
}

const adminUserModel = db.model('adminuser',adminUserSchema);
const userModel = db.model('user',userSchema);
// module.exports = userModel;
// module.exports = adminUserModel;
module.exports = {
    userModel: userModel,
    adminUserModel: adminUserModel
};
