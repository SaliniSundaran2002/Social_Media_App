import { Router } from 'express'
import { user } from '../models/User.js'
import { Posts } from '../models/Posts.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { authenticate } from '../middleware/Authenticate.js'
import multer from 'multer'
import path from 'path'

const userRoute = Router();

userRoute.get('/', (req, res) => {
    res.send("HI");
})

userRoute.post('/register', async (req, res) => {
    try {
        const { name, email, username, password } = req.body;
        // console.log(req.body);

        const existUsername = await user.findOne({ username });
        // console.log(user.findOne({ username}));

        if (existUsername) {
            return res.status(409).json({ message: "Already existed!" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new user({ name, email, username, password: hashedPassword });
        await newUser.save();
        return res.status(201).json({ message: "User successfully registered" });

    } catch (error) {
        console.error(error);
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
        const passwordMatch = await bcrypt.compare(password, existUser.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid Password!" })
        }
        const token = jwt.sign({ id: existUser._id, username: existUser.username }, process.env.SECRET_KEY, { expiresIn: "1h" });
        res.cookie("UserToken", token, { httpOnly: true, secure: false });
        return res.status(200).json({ token, message: "Login successfull!" })

    } catch (error) {
        console.log(error);

        return res.status(500).json({ message: "Internal server error!" })
    }
})

userRoute.post('/profile', authenticate, async (req, res) => {
    try {
        console.log(req.user);
        const { bio, phonenumber, gender, birthday } = req.body;
        const userId = req.user.id;
        const updatedUser = await user.findByIdAndUpdate(userId,
            { bio, phonenumber, gender, birthday },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log("Updated User:", updatedUser);
        return res.status(200).json({ message: "Profile updated successfully", user: updatedUser });


    } catch (error) {
        console.error("Error in profile update:", error);
        return res.status(500).json({ message: "Internal server error!" });
    }

});

const storage1 = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = file.fieldname === 'music' ? 'music' : 'file';
        cb(null, path.join('uploads', folder)); 
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // 
    },
});

const upload = multer({ storage: storage1, limits: { fileSize: 20 * 1024 * 1024 } });

userRoute.post('/api/upload', upload.fields([{ name: 'files' }, { name: 'music' }]), async (req, res) => {
    // console.log('Files received:', req.files);
    const { files, music } = req.files;
    const {description} = req.body;

    const newPost = new Posts({
        files: files ? files[0].path : null,
        music: music ? music[0].path : null,
        description,
    })
    await newPost.save()

    res.json({
        message: 'Post created successfully',
        post: newPost,
        uploadedFile: files ? files[0] : null,
        uploadedMusic: music ? music[0] : null,
    });
})

userRoute.get('/viewallposts',async (req,res)=>{
    try{
        const posts = await Posts.find();
        if(posts.length>0){
        return res.status(200).json({message:posts});}
        else{
            return res.status(404).json({message:"No posts"})
        }
    } catch(error){
        return res.status(500).json({message:error});
    }
})
export { userRoute }