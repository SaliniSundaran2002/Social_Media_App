import { Router } from 'express'
import { user} from '../models/User.js'
import { Posts } from '../models/Posts.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { authenticate } from '../middleware/Authenticate.js'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import mongoose from 'mongoose'
import { fileURLToPath } from 'url';
import { dirname } from 'path';


const userRoute = Router();

userRoute.get('/', (req, res) => {
    res.send("HI");
})


const storage1 = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = file.fieldname === 'music'
            ? 'music'
            : file.fieldname === 'profilePic'
                ? 'profilePics'
                : 'file';

        cb(null, path.join('uploads', folder));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // 
    },
});

const upload = multer({ storage: storage1, limits: { fileSize: 20 * 1024 * 1024 } });

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

userRoute.post('/profile', authenticate, upload.single('profilePic'), async (req, res) => {
    try {
        console.log(req.user);
        const { profilePic } = req.file;
        const { bio, phonenumber, gender, birthday } = req.body;
        const userId = req.user.id;
        const updatedUser = await user.findByIdAndUpdate(userId,
            { bio, phonenumber, gender, birthday, profilePic },
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

userRoute.get('/getUserdetails', authenticate, async (req, res) => {
    try {
        
        const userDetails = await user.findById(req.user.id);

        if (!userDetails) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ username: userDetails.username, userDetails });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

userRoute.get('/getUsername', authenticate, async (req, res) => {
    const users = await user.findById(req.user.id);
    res.json({ username: users.username });
  });
  

userRoute.get('/getPostdetails', authenticate, async (req, res) => {
    try {
        // Fetch posts associated with the logged-in user's ID
        const postDetails = await Posts.find({ _id: req.user.id });

        console.log(req.user.id);


        if (!postDetails || postDetails.length === 0) {
            return res.status(404).json({ error: 'No posts found for this user' });
        }

        res.status(200).json(postDetails);
    } catch (error) {
        console.error('Error fetching post details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});




userRoute.get('/getProfile/:id', async (req, res) => {
    try {
        const id = req.query.id;
        const isId = await user.findOne({ _id: id });
        if (isId) {
            return res.status(200).json({ message: isId })
        } else {
            return res.status(404).json({ message: "Not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: error })
    }
})


userRoute.post('/uploadPost', authenticate, upload.fields([{ name: 'files' }, { name: 'music' }]), async (req, res) => {
    // console.log('Files received:', req.files);
    const { files, music } = req.files;
    const { description } = req.body;
    const username= req.user.username;
    if (!files) {
        return res.status(400).json({ message: 'Files is missing' });
    }

    const newPost = new Posts({
        files: files ? files[0].path : null,
        music: music ? music[0].path : null,
        description,
        userName:username
    })
    await newPost.save()

    // const username = req.user.username;

    res.json({
        message: 'Post created successfully',
        post: newPost,
        uploadedFile: files ? files[0] : null,
        uploadedMusic: music ? music[0] : null,
        // username
    });
})

userRoute.get('/viewallposts', async (req, res) => {
    try {
        const posts = await Posts.find();
        const getId = await user.find();
        if (posts.length > 0) {
            return res.status(200).json({ message: posts });
        }
        else {
            return res.status(404).json({ message: "No posts" })
        }
    } catch (error) {
        return res.status(500).json({ message: error });
    }
})

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


userRoute.delete('/deletePost/:id', authenticate, async (req, res) => {
    try {
        const username = req.user.username;  // Get the logged-in user's username
        console.log("username:", username);

        const postId = req.params.id;  // The post ID from the request parameter
        console.log("postId:", postId);  // Log the postId to check what is being passed

        // Check if postId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            console.log("invalid objectid", postId);

            return res.status(400).json({ message: "Invalid post ID!" });
        }

        // Find the post by _id and check if it belongs to the logged-in user
        const post = await Posts.findOne({ _id: postId });

        if (!post) {
            console.log("Post not found or user is not authorized to delete it.");
            return res.status(404).json({ message: "Post not found or you are not authorized to delete it!" });
        }

        console.log("Post found:", post);

        // Delete associated files (audio and video) if they exist
        if (post.files) {
            const filePath = path.join(__dirname, '..', post.files); // Get the path of the video
            console.log("Video file path:", filePath);

            try {
                fs.unlinkSync(filePath); // Synchronously delete the video file
                console.log('Deleted video file:', filePath);
            } catch (err) {
                console.error('Error deleting video file:', err);
            }
        }

        if (post.music) {
            const musicPath = path.join(__dirname, '..', post.music); // Get the path of the audio
            console.log("Audio file path:", musicPath);

            try {
                fs.unlinkSync(musicPath); // Synchronously delete the audio file
                console.log('Deleted audio file:', musicPath);
            } catch (err) {
                console.error('Error deleting audio file:', err);
            }
        }

        // Delete the post from the database
        await Posts.deleteOne({ _id: postId });
        console.log("Post deleted from the database.");
        return res.status(200).json({ message: "Successfully deleted post and files!" });

    } catch (error) {
        console.error("Error deleting post and files:", error);
        return res.status(500).json({ message: "Internal server error!", error: error.message });
    }
});


// userRoute.get('/checkusername', authenticate, async (req, res) => {
//     const username = req.user.username;  // Access the username from req.user
//     console.log("username:", username);

//     if (username) {
//       return res.status(200).json({ message: `Username: ${username}` });
//     } else {
//       return res.status(400).json({ message: 'Username not found' });
//     }
//   });

export { userRoute }