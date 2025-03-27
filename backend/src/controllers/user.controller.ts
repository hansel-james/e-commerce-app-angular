import { Request, Response } from "express";
import User from "../models/user.model";
import jwt from "jsonwebtoken";

export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;

        // Check if the username is already taken
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            res.status(400).json({ error: "Username already exists" });
            return;
        }

        // Create new user
        const user = new User({ username, password });
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
        );

        res.status(201).json({ message: "User created", token });
    } catch (error) {
        res.status(500).json({ error: "Signup failed" });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user || user.password !== password) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ error: "Logout failed" });
    }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ _id: id }).select("-password");

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        res.status(200).json(user); // No need to wrap `user` in an object
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
