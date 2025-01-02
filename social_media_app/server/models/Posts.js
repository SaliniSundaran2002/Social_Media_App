import mongoose from "mongoose";

const postsSchema = new mongoose.Schema({
    files:{type:String, required:true},
    music:{type:String, required:false},
    description:{type:String},
    postedDate:{type:Date, default:Date.now},
    likes:{type:String, required:false},
    comments:{type:String, required:false},
    userId:{type:mongoose.Schema.Types.ObjectId, ref:'user'}
})

const Posts = mongoose.model("PostDetails",postsSchema);

export {Posts}