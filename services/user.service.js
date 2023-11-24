const { userModel, adminUserModel } = require('../models/user.model');
const jwt = require('jsonwebtoken');
class UserService {
    static async registerUser(firstName,lastName,mobileNumber,password){
        try{
            const user = await userModel.findOne({mobileNumber});
            if(user){
                return "user already exist";
            }else{
                const createUser = new userModel({firstName,lastName,mobileNumber,password});
                return await createUser.save();
            }
        }catch(err){
            throw err;
        }
    }

    static async checkuser(mobileNumber,password){
        try {
            return await userModel.findOne({mobileNumber});
        } catch (error) {
            throw error;
        }
    }

    static async generateToken(tokenData,secretKey,jwt_expiry){
        return jwt.sign(tokenData,secretKey,{expiresIn:jwt_expiry});
    }


    static async registerAdminUser(orgName,mobileNumber,password,address){
        try {
            console.log("Service Done!");
            const user = await adminUserModel.findOne({mobileNumber});
            if(user){
                return "User already exist";
            }else{
                const createAdminUser = new adminUserModel({orgName,mobileNumber,password,address});
                return await createAdminUser.save();
            }
        } catch (error) {
            throw error;
        }
    }

    static async checkAdminUser(mobileNumber,password){
        try {
            return adminUserModel.findOne({mobileNumber});
        } catch (error) {
            throw error;
        }
    }

}

module.exports = UserService;