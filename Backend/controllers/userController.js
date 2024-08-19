const mongoose = require('mongoose')
const userModel = require('../models/userModel')

const addFriend = async (req, res) => {
    const { _id, email } = req.body

    if (!_id || !email) {
        return res.status(400).json({ success: false, message: "Input nessary data" })
    }

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    try {
        const user = await userModel.findById(_id)
        const friend = await userModel.findOne({ email })

        if (!user) {
            return res.status(400).json({ success: false, message: "User Not Found" })
        }

        if (!friend) {
            return res.status(400).json({ success: false, message: "No user avalible" })
        }

        const isAlreadyFriend = user.friends.includes(friend._id)

        if (isAlreadyFriend) {
            return res.status(400).json({ success: false, message: "He is already in your friend" })
        }

        user.friends.push(friend._id);
        friend.friends.push(user._id)

        const updatedUser = await user.save();
        const updatedFriend = await friend.save();

        if (!updatedUser || !updatedFriend) {
            return res.status(500).json({ success: false, message: "Can't process your request at the moment" })
        }

        return res.status(200).json({ success: true, message: "Friend added successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

const getAllFriends = async (req, res) => {
    const { _id } = req.body

    if (!_id) {
        return res.status(400).json({ success: false, message: "Input nessary data" })
    }

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    try {
        const user = await userModel.findById(_id).populate("friends", "_id name email")

        if (!user) {
            return res.status(400).json({ success: false, message: "User Not Found" })
        }

        return res.status(200).json({ success: true, data: user.friends })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

const removeFriend = async (req, res) => {
    const { _id, _friendId } = req.body

    if (!_id || !_friendId) {
        return res.status(400).json({ success: false, message: "Input nessary data" })
    }

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(_friendId)) {
        return res.status(400).json({ success: false, message: "Invalid friend ID" });
    }

    try {
        const user = await userModel.findById(_id)
        const friend = await userModel.findById(_friendId)

        if (!user) {
            return res.status(400).json({ success: false, message: "User Not Found" })
        }

        if (!friend) {
            return res.status(400).json({ success: false, message: "No user avalible" })
        }

        const isAlreadyFriend = user.friends.includes(friend._id)

        if (!isAlreadyFriend) {
            return res.status(400).json({ success: false, message: "He is not in your friends list" })
        }

        // user.friends = user.friends.filter(item => item != friend._id)
        // friend.friends = friend.friends.filter(item => item != user._id)

        user.friends = user.friends.filter(item => item.toString() !== friend._id.toString());
        friend.friends = friend.friends.filter(item => item.toString() !== user._id.toString());


        const updatedUser = await user.save()
        const updatedFriend = await friend.save()

        if (!updatedUser || !updatedFriend) {
            return res.status(500).json({ success: false, message: "Can't process your request at the moment" })
        }

        return res.status(200).json({ success: true, message: "Friend removed successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

const userController = {
    addFriend,
    removeFriend,
    getAllFriends
}

module.exports = userController