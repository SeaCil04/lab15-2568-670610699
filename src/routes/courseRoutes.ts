import { Router, type Request, type Response } from "express";
import { courses } from "../db/db.js";
import {
  zCourseDeleteBody,
  zCourseId,
  zCoursePostBody,
  zCoursePutBody,
} from "../schemas/courseValidator.js";
import { type Course } from "../libs/types.js";
const router1: Router = Router();

// READ all
router1.get("/courses", (req: Request, res: Response) => {
  try {
    return res.status(200).json(courses);
  } catch (error) {
    return res.json({
      success: false,
      message: "Something is wrong, please try again",
      error: error,
    });
  }
});

// Params URL
router1.get("/courses/:courseId", (req: Request, res: Response) => {
  try {
    const CourseId = Number(req.params.courseId);
    const result = zCourseId.safeParse(CourseId);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues[0]?.message,
      });
    }
    const findcourse = courses.findIndex(
      (course) => course.courseId === CourseId
    );

    if (findcourse === -1) {
      return res.status(404).json({
        success: false,
        message: "Course dose not exists",
      });
    }
    res.set("Link", `/courses/${CourseId}`);
    return res.status(200).json({
      success: true,
      message: `Get course ${CourseId} successfully`,
      data: courses[findcourse],
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Something is wrong, please try again",
      error: error,
    });
  }
});

router1.post("/courses", (req: Request, res: Response) => {
  try {
    const body = req.body as Course;
    const result = zCoursePostBody.safeParse(body);
    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues[0]?.message,
      });
    }
    const foundcourse = courses.find(
      (course) => course.courseId === body.courseId
    );
    if (foundcourse) {
      return res.status(409).json({
        success: false,
        message: "Course is already exists",
      });
    }
    res.set("link", `/courses/${body.courseId}`);
    courses.push(body);

    return res.status(201).json({
      success: true,
      message: `Course ${body.courseId} has been added successfully`,
      data: { body },
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Something is wrong, please try again",
      error: error,
    });
  }
});

router1.put("/courses", (req: Request, res: Response) => {
  try {
    const body = req.body as Course;
    const result = zCoursePutBody.safeParse(body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues[0]?.message,
      });
    }
    const foundcourse = courses.findIndex(
      (course) => course.courseId === body.courseId
    );
    if (foundcourse === -1) {
      return res.status(404).json({
        success: false,
        message: "Course Id is not exists",
      });
    }
    res.set("link", `/courses/${body.courseId}`);
    courses[foundcourse] = { ...courses[foundcourse], ...body };
    return res.status(200).json({
      success: true,
      message: `course ${courses[foundcourse].courseId} has been updated successfully`,
      data: courses[foundcourse],
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Somthing is wrong, please try again",
      error: error,
    });
  }
});

router1.delete("/courses", (req: Request, res: Response) => {
  try {
    const body = req.body;

    const result = zCourseDeleteBody.safeParse(body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues[0]?.message,
      });
    }

    const foundcourse = courses.findIndex(
      (course) => body.courseId === course.courseId
    );

    if (foundcourse === -1) {
      return res.status(404).json({
        success: false,
        message: "Course Id is not exists",
      });
    }
    const deletecourse = courses[foundcourse];
    courses.splice(foundcourse, 1);
    res.set("link", `/courses/${body.courseId}`);
    return res.status(200).json({
      success: true,
      message: `Course ${deletecourse?.courseId} has been deleted successfully`,
      data: deletecourse,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Somthing is wrong, please try again",
      error: error,
    });
  }
});

export default router1;
