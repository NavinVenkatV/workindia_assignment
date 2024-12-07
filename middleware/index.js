import { API_KEY, JWT_KEY } from "../config.js";
import jwt from "jsonwebtoken"

export const checkToken = (req,res,next)=>{
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(400).json({
            message: "headers header is missing"
        });
    }
    const token = authHeader.split(' ')[1];
    if(!token){
        res.status(400).json({
            message : "Token is missing"
        })
        return
    }
    try{
        const decoded = jwt.verify(token, JWT_KEY);
        req.user = decoded;
        next();
    }catch(e){
        console.log(e)
        res.status(400).json({
            message : "Invalid or expired token"
        })
        return;
    }
}

export const checkApi = (req,res,next)=>{
    console.log("Inside middleware")
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({
            message: "Authorization header is missing"
        });
    }
    console.log("after key found")
    const apiKey = authHeader.split(' ')[1];
    if(!apiKey){
        return res.status(400).json({
            message : "Api key is missing"
        })
    }
    try{
        const decoded = jwt.verify(apiKey, API_KEY);
        req.user = decoded;
        next();
    }catch(e){
        return res.status(400).json({
            message : "Invalid api key or expired api key"
        })
    }
}