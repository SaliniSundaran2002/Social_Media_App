import { Router } from 'express'
import { user } from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userRoute = Router();

userRoute.get('/', (req, res) => {
    res.send("HI");
})

userRoute.post('/register', async (req, res) => {
    try {
        const { name, email, username, password } = req.body;
        const existUsername = await user.findOne({ username });
        if (existUsername) {
            return res.status(409).json({ message: "Already existed!" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new user({ name, email, username, password: hashedPassword });
        await newUser.save();
        return res.status(201).json({ message: "User successfully registered" });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error..." })
    }
})

userRoute.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existUser = await user.findOne({ username });
        if (!existUser) {
            return res.status(401).json({ message: "user not found!" });
        }
        const passwordMatch = await bcrypt.compare({ password: existUser.password });
        if (!passwordMatch) {
            return res.status(401).json({message:"Invalid Password!"})
        }
        const token = jwt.sign({id:existUser._id, username:existUser.username},"hi",{expiresIn:"1h"});
        return res.status(200).json({token, message:"Login successfull!"})

    } catch (error) {
        return res.status(500).json({ message: "Internal server error!" })
    }
})

export { userRoute }