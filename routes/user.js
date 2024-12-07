// import { PrismaClient } from "@prisma/client";
import { Router } from "express"
import { SigninSchema, SignupSchema } from "../types/index.js";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken"
import { API_KEY, JWT_KEY } from "../config.js";
import bcrypt from "bcrypt"
const prisma = new PrismaClient();

export const userRouter = Router();

userRouter.post('/signup',async (req,res)=>{
    const parsedBody = SignupSchema.safeParse(req.body)
    if(!parsedBody.success){
        res.status(400).json({
            message : "Invalid credentials"
        })
        return;
    }
    const hashedPassword = await bcrypt.hash(parsedBody.data.password, 10)
    try{
        const body = await prisma.user.create({
            data : {
                username : parsedBody.data.username,
                password : hashedPassword,
                role : parsedBody.data.role === 'Admin' ? 'Admin' : "User"
            }
        })
        return res.json({
            userId : body.id
        })
    }catch(e){
        console.log(e);
        return res.json({
            message : "Error creating user"
        })
    }
})

userRouter.post('/signin',async (req, res) => {
    console.log("inside signin");

    // Validate input using the schema
    const parsedBody = SigninSchema.safeParse(req.body);
    if (!parsedBody.success) {
        res.status(400).json({
            message: "Invalid inputs",
        });
        return;
    }

    try {
        // Fetch user from the database
        const finduser = await prisma.user.findUnique({
            where: {
                username: parsedBody.data.username,
            },
        });

        // Check if user exists
        if (!finduser) {
            res.status(403).json({
                message: "User doesn't exist",
            });
            return;
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(parsedBody.data.password, finduser.password);
        if (!isPasswordValid) {
            console.log("inside pass check");
            res.status(400).json({
                message: "Invalid password",
            });
            return;
        }

        // Generate token
        const token = jwt.sign(
            {
                userId: finduser.id,
                role: finduser.role,
            },
            JWT_KEY
        );
        let apiKey = null;
        if(finduser.role === 'Admin'){
            apiKey = jwt.sign({
                userId : finduser.id,
                role : finduser.role
            },API_KEY,{expiresIn : '30d'}) 
        }

        // Respond with the token
        return res.json({
            token: token,
            apiKey: apiKey
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong",
        });
    }
});


export default userRouter;
