import { Router } from "express";
import { checkToken } from "../middleware/index.js";
import { BookingDetails, BookingTrain } from "../types/index.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const bookingRouter = Router();

// Transaction
bookingRouter.post('/', checkToken, async (req, res) => {
    console.log(req.user)
    const parsedBody = BookingTrain.safeParse(req.body);
    if (!parsedBody.success) {
        console.log("Validation Error: ", parsedBody.error);
        return res.status(400).json({
            message: "Invalid inputs"
        });
    }
    const { trainId, seatNo } = parsedBody.data;

    try {
        const result = await prisma.$transaction(async (tx) => {
            const train = await tx.train.findUnique({ where: { id: trainId } });
            if (!train) {
                throw new Error("Train not found");
            }
            if (seatNo <= 0 || seatNo > train.availableSeats) {
                throw new Error("Invalid seat number");
            }
            const existingBooking = await tx.booking.findFirst({
                where: { trainId, seatNo }
            });
            if (existingBooking) {
                throw new Error(`Seat number ${seatNo} is already booked`);
            }

            const userId = req.user.userId;
            const booking = await tx.booking.create({
                data: {
                    userId,
                    trainId,
                    seatNo
                }
            });

            await tx.train.update({
                where: { id: trainId },
                data: {
                    availableSeats: train.availableSeats - 1
                }
            });

            return booking;
        });
        
        return res.status(200).json({
            message: "Seat booked successfully",
            booking: {
                bookingId: result.id,
                seatNumber: result.seatNo,
                trainId: result.trainId,
                userId: result.userId,
                bookingDate: result.bookingDate
            }
        });
    } catch (e) {
        console.error("Error: ", e.message);
        return res.status(400).json({
            message: e.message || "Something went wrong"
        });
    }
});


bookingRouter.get('/bookingDetails/:bookingId',checkToken, async(req,res)=>{
    const bookingId = parseInt(req.params.bookingId);
    const validationResult = BookingDetails.safeParse({ bookingId });
    if(!validationResult){
        console.log(bookingId.error)
        return res.json({
            message : "Invalid Booking Id"
        })
    }
    try{
        const booking = await prisma.booking.findUnique({
            where : {id : bookingId},
            include : {
                train : true,
                user : true
            }
        })
        if(!booking){
            return res.status(400).json({
                message : "Booking not found"
            })
        }
        return res.status(200).json({
            message: 'Booking details retrieved successfully',
            booking: {
                bookingId: booking.id,
                seatNumber: booking.seatNo,
                train: {
                    id: booking.trainId,
                    name: booking.train.name,
                    source: booking.train.source,
                    destination: booking.train.destination,
                },
                username: booking.user.username,
                userId: booking.userId,
                bookingDate: booking.createdAt,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
})