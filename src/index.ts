import express from "express";
import morgan from 'morgan';
import { Router, type Request, type Response } from "express";
import router1 from "./routes/courseRoutes.js";
import router2 from "./routes/studentRoutes.js";
const app: any = express();

//Middleware
app.use(express.json());
app.use(morgan('dev'));

app.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000")
);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "lab 15 API service successfully",
  });
});
app.get("/me", (req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      message: "Student Information",
      data: {
        studentId: "670610699",
        firstName: "Tanakrit",
        lastName: "Jeenamuangjai",
        program: "CPE",
        section: "001",
      },
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Somthing is wrong, please try again",
      error: error,
    });
  }
});

 app.use("/api/v2",router1);
 app.use("/api/v2",router2);

export default app;
