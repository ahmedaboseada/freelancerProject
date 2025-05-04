const mongoose = require("mongoose");

const {Schema} = mongoose;

const messageSchema = new Schema({
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        attachments: {
            type: [String],
            maxLength: [3, "You can only upload up to 3 attachments"],
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    })

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;