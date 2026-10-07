const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User" // relation between the User and the ConnectionRequest schema
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    status: {
        type: String,
        enum: {
            values: ['ignored', 'interested', 'accepted', 'rejected'],
            message: `{VALUE} is incorrect status type.`
        },
        required: true
    }
}, { timestamps: true });

// Adding compound indexing to fromUserId and touserId.
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

// To not allow user to send a connection request to itslef.
connectionRequestSchema.pre("save", function() {
    const connectionRequest = this;
    // check if fromUserId is same as toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("You cannot send connection request to yourself!");
    }
});

const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = ConnectionRequest;