import mongoose from "mongoose";

const creatorSchema = new mongoose.Schema(
    {
        name : {
            type: String,
            required: true
        },
        email :{
            type: String,
            required: true,
            unique: true
        },
        avatar: {
            type: String,
            default: "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg",
        },
        role: {
            type: String,
            default: "creator",
            required: true,
        },
        youtubeChannelId: {
            type: String,
        },
        videos: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "videoModel"
            }
        ],
        preferredEditors: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "editorModel"
            }
        ],

    }, {timestamps : true})

export default mongoose.model("Creator", creatorSchema);