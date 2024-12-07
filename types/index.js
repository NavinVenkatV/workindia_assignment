import z from "zod"

export const SignupSchema = z.object({
    username : z.string(),
    password : z.string(),
    role : z.enum(['Admin','User'])
})

export const SigninSchema = z.object({
    username : z.string(),
    password : z.string()
})


export const TrainSchema = z.object({
    name : z.string(),
    source : z.string(),
    destination : z.string(),
    totalSeats : z.number(),
    availableSeats : z.number()
})

export const TrainAvailability = z.object({
    source : z.string(),
    destination : z.string()
})

export const BookingTrain = z.object({
    trainId : z.number(),
    seatNo  : z.number(),  
})

export const BookingDetails = z.object({
    bookingId : z.number(),
})