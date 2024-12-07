import { Router } from "express";
import { checkApi, checkToken } from "../middleware/index.js";
import { TrainAvailability, TrainSchema } from "../types/index.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const trainRouter = Router();


trainRouter.post('/', checkApi, async (req,res)=>{
    console.log("inside train")
    const parsedBody = TrainSchema.safeParse(req.body);
    if(!parsedBody.success){
        return res.status(400).json({
            message : "Invalid credentials"
        })
    }
    try{
        const createTrain = await prisma.train.create({
            data : {
                name : parsedBody.data.name,
                source : parsedBody.data.source,
                destination : parsedBody.data.destination,
                totalSeats : parsedBody.data.totalSeats,
                availableSeats : parsedBody.data.availableSeats
            }
        })
        return res.json({
            message : "Train created successfully"
        })
    }catch(e){
        console.log(e);
        res.status(400).json({
            message : "Something went wrong while creating the train"
        })
    }
})


trainRouter.get('/', checkToken, async (req,res)=>{
    console.log("inside middleware")
    const parsedQuery = TrainAvailability.safeParse(req.query);
    if(!parsedQuery.success){
        return res.status(400).json({
            message : "Invalid parameter"
        })
    }
    try{
        const findTrain = await prisma.train.findMany({
            where : {
                source : parsedQuery.data.source,
                destination : parsedQuery.data.destination
            }
        })
        if(findTrain.length === 0){
            return res.status(400).json({
                message : "Cannot find train"
            })
        }
        return res.status(200).json({
            message : "Train found Successfully",
            trains : findTrain.map((train)=>({
                id : train.id,
                name : train.name,
                source : train.source,
                destination : train.destination,
                availableSeats : train.availableSeats
            }))
        })
    }catch(e){
        console.log(e);
        return res.status(400).json({
            message : "something went wrong"
        })
    }
})