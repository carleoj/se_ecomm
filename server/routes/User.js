const express = require("express")
const userRoute = express.Router()
const AsyncHandler = require("express-async-handler")
const User = require("../models/User")
const generateToken = require("../tokenGenerate")
const protect = require("../middleware/Auth")

userRoute.post(
    '/login', 
    AsyncHandler(
    async(req, res) => {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(user && (await user.matchPassword(password))) {
            const userObj = user.toObject();
            res.json({
                _id: userObj._id,       
                name: userObj.name,
                email: userObj.email,  
                isAdmin: userObj.isAdmin,
                token: generateToken(userObj._id), 
                createdAt: userObj.createdAt
            });
        } else {
            res.status(401);
            throw new Error("Invalid Email or Password")
        }
    }
));

//register route
userRoute.post('/', AsyncHandler( 
    async(req, res) => {
        const {name, email, password} = req.body;
        const existUser = await User.findOne({email})
        if(existUser){
            res.status(400);
            throw new Error("User already exists");
        } else {
            const user = await User.create({
                name,
                email,
                password
            });
            
            if(user){
                const userObj = user.toObject();
                res.status(201).json({
                    _id: userObj._id,
                    name: userObj.name,
                    email: userObj.email,
                    isAdmin: userObj.isAdmin,
                    createdAt: userObj.createdAt,
                    token: generateToken(userObj._id)
                });
            } else {
                res.status(400);
                throw new Error("Invalid user data");
            }
        }
}));

//get auth profile data
userRoute.get("/profile", protect, AsyncHandler(
    async(req, res) => {
        const user = await User.findById(req.user._id);
        
        if(user){
            const userObj = user.toObject();
            const response = {
                _id: userObj._id,
                name: userObj.name,
                email: userObj.email,
                isAdmin: userObj.isAdmin,
                createdAt: userObj.createdAt
            };
            res.json(response);
        } else {
            res.status(404);
            throw new Error("USER NOT FOUND");
        }
    }
));

//user profile update
userRoute.put("/profile", protect, AsyncHandler(
    async(req, res) => {
        const user = await User.findById(req.user._id);
        if(user){
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            if(req.body.password){
                user.password = req.body.password;
            }
            
            const updatedUser = await user.save();
            const userObj = updatedUser.toObject();
            
            const response = {
                _id: userObj._id,
                name: userObj.name,
                email: userObj.email,
                isAdmin: userObj.isAdmin,
                createdAt: userObj.createdAt,
                token: generateToken(userObj._id)
            };

            res.json(response);
        } else {
            res.status(404);
            throw new Error("USER NOT FOUND");
        }
    }
));

module.exports = userRoute