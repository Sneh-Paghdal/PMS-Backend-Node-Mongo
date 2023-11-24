const UserService = require('../services/user.service');
const userModel = require('../models/user.model')

exports.register = async (req,res,next)=>{
    try{
        console.log(req.body);
        const {firstName,lastName,mobileNumber,password} = req.body;
        const Res = await UserService.registerUser(firstName,lastName,mobileNumber,password);
        if(Res == "user already exist"){
            res.status(401).json({message:Res});
        }else{
            res.status(200).json({success:"User has been registered successfuly"});
        }
    }catch(err){
        throw err;
    }
}

exports.adminRegister = async (req,res,next) => {
    try {
        console.log("Controller Done!");
        const {orgName,mobileNumber,password,address} = req.body;
        const Res = await UserService.registerAdminUser(orgName,mobileNumber,password,address);
        if(Res == "User already exist"){
            res.status(401).json({message:Res});
        }else{
            res.status(200).json({success:"User has been submitted successfuly as admin"})
        }
    } catch (error) {
        throw error;
    }
}

exports.login = async (req,res,next) => {
    try {
        const{mobileNumber,password}=req.body;
        const user = await UserService.checkuser(mobileNumber);
        if(!user){
            res.status(404).json({status:false,message:'User not found with this email, please proceed to register'});
        }else{
            const isMatch = await user.comparePassword(password);
            if(isMatch == false){
                res.status(401).json({message : "Invalid Password"});
            }else{
            let tokenData = {_id : user._id,mobileNumber:user.mobileNumber};
            const token = await UserService.generateToken(tokenData,'HMAC SHA256','365d');
            console.log(token);
            var resJson = {
                "userId" : user['_id'],
                "firstName":user['firstName'],
                "lastName":user['lastName'],
                "mobileNumber":user['mobileNumber'],
                "token":token,
            };
            res.status(200).json(resJson);
            }
        }
    } catch (error) {
        throw error;
    }
}

    exports.adminLogin = async (req,res,next) => {
        try {
            const{mobileNumber,password}=req.body;
            const user = await UserService.checkAdminUser(mobileNumber);
            if(!user){
                res.status(404).json({status:false,message:'User not found with this mobile number, please proceed to register'});
            }else{
                const isMatch = await user.comparePassword(password);
                if(isMatch == false){
                    res.status(401).json({message : "Invalid Password"});
                }else{
                let tokenData = {_id : user._id,mobileNumber:user.mobileNumber};
                const token = await UserService.generateToken(tokenData,'HMAC SHA256','365d');
                console.log(token);
                var resJson = {
                    "orgName":user['orgName'],
                    "mobileNumber":user['mobileNumber'],
                    "token":token,
                };
                res.status(200).json(resJson);
                }
            }
        } catch (error) {
            throw error;
        }
    }

