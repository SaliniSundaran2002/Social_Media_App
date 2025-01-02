import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic:{type:String, required:false},
    bio: {type:String, required:false},
    phonenumber :{type:String, required:false, unique: true},
    gender:{type:String, required:false},
    birthday:{type:Date, required:false},
})

const user = mongoose.model("UserDetails", userSchema);

export { user }