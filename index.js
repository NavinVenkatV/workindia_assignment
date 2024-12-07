import express, { Router } from "express";
import {userRouter} from "./routes/user.js"; // Ensure the .js extension
import { trainRouter } from "./routes/train.js";
import { bookingRouter } from "./routes/booking.js";

const app = express();

app.use(express.json());
app.use('/api/v1', userRouter);
app.use('/api/v1/train', trainRouter);
app.use('/api/v1/booking', bookingRouter);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
