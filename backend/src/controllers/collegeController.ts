import { Request, Response } from "express";
import College from "../models/College";

export const getColleges = async (
  req: Request,
  res: Response
) => {
  try {
    const colleges = await College.find();

    res.json(colleges);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const addCollege = async (
  req: Request,
  res: Response
) => {
  try {
    const college = await College.create(req.body);

    res.status(201).json(college);
  } catch (error) {
    res.status(500).json({
      message: "Error adding college",
    });
  }
};