const mongoose = require('mongoose')
const userModel = require('../models/userModel')
const eventModel = require('../models/eventModel')
const expenseModel = require('../models/expenseModel')

const createEvent = async (req, res) => {
    const { _id, name, description } = req.body

    if (!_id || !name) {
        return res.status(400).json({ success: false, message: "Input all nessary data" })
    }

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    try {
        const user = await userModel.findById(_id)

        if (!user) {
            return res.status(400).json({ success: false, message: "User Not Found" })
        }

        const event = new eventModel({
            name,
            description,
            members: [user._id],
            createdBy: user._id
        })

        const savedEvent = await event.save()

        user.events.push(savedEvent._id)
        const savedUser = await user.save()

        if (!savedEvent || !savedUser) {
            return res.status(500).json({ success: false, message: "Can't create the event at the moment" })
        }

        return res.status(200).json({ success: true, message: "Event created successfully" })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const getAllEvent = async (req, res) => {
    const { _id } = req.body

    if (!_id) {
        return res.status(400).json({ success: false, message: "Input all nessary data" })
    }

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    try {
        const user = await userModel.findById(_id).populate('events')

        if (!user) {
            return res.status(400).json({ success: false, message: "User Not Found" })
        }

        return res.status(200).json({ success: true, data: user.events })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

const getOneEvent = async (req, res) => {
    const { _id, _eventId } = req.body

    if (!_id || !_eventId) {
        return res.status(400).json({ success: false, message: "Input all nessary data" })
    }

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(_eventId)) {
        return res.status(400).json({ success: false, message: "Invalid event ID" });
    }

    try {
        const user = await userModel.findById(_id)
        const event = await eventModel.findById(_eventId).populate('members','_id name email')

        if (!user) {
            return res.status(400).json({ success: false, message: "User Not Found" })
        }

        if (!event) {
            return res.status(400).json({ success: false, message: "Event Not Found" })
        }

        const isMember = event.members.some(member => member._id.toString() === user._id.toString());
        if (!isMember) {
            return res.status(400).json({ success: false, message: "Unauthorized Request" });
        }


        const expenses = await expenseModel.find({ event: _eventId }).populate('paidBy','_id name email')

        return res.status(200).json({ success: true, data: { event, expenses } })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

const updateEvent = async (req, res) => {
    const { _id, _eventId, name, description } = req.body

    if (!_id || !_eventId || !name) {
        return res.status(400).json({ success: false, message: "Input all nessary data" })
    }

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(_eventId)) {
        return res.status(400).json({ success: false, message: "Invalid event ID" });
    }

    try {
        const user = await userModel.findById(_id)
        const event = await eventModel.findById(_eventId)

        if (!user) {
            return res.status(400).json({ success: false, message: "User Not Found" })
        }

        if (!event) {
            return res.status(400).json({ success: false, message: "Event Not Found" })
        }

        if (!event.members.includes(_id)) {
            return res.status(400).json({ success: false, message: "Unauthorized Request" })
        }

        if (name !== event.name) {
            event.name = name
        }

        if (description !== event.description) {
            event.description = description
        }

        const updatedEvent = await event.save()

        if (!updatedEvent) {
            return res.status(500).json({ success: false, message: "Can't updated the event at the moment" })
        }

        return res.status(200).json({ success: true, message: "Event updated successfully" })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

const finishEvent = async (req, res) => {
    const { _id, _eventId } = req.body

    if (!_id || !_eventId) {
        return res.status(400).json({ success: false, message: "Input all nessary data" })
    }

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(_eventId)) {
        return res.status(400).json({ success: false, message: "Invalid event ID" });
    }

    try {
        const user = await userModel.findById(_id)
        const event = await eventModel.findById(_eventId)

        if (!user) {
            return res.status(400).json({ success: false, message: "User Not Found" })
        }

        if (!event) {
            return res.status(400).json({ success: false, message: "Event Not Found" })
        }

        if (!event.members.includes(_id)) {
            return res.status(400).json({ success: false, message: "Unauthorized Request" })
        }

        if (event.isFinished) {
            return res.status(400).json({ success: false, message: "Event is already finished" })
        }

        event.isFinished = true
        const updatedEvent = await event.save()

        if (!updatedEvent) {
            return res.status(500).json({ success: false, message: "Can't process your request at the moment" })
        }

        return res.status(200).json({ success: true, message: "Event is set to finished" })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

const notFinishEvent = async (req, res) => {
    const { _id, _eventId } = req.body

    if (!_id || !_eventId) {
        return res.status(400).json({ success: false, message: "Input all nessary data" })
    }

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(_eventId)) {
        return res.status(400).json({ success: false, message: "Invalid event ID" });
    }

    try {
        const user = await userModel.findById(_id)
        const event = await eventModel.findById(_eventId)

        if (!user) {
            return res.status(400).json({ success: false, message: "User Not Found" })
        }

        if (!event) {
            return res.status(400).json({ success: false, message: "Event Not Found" })
        }

        if (!event.members.includes(_id)) {
            return res.status(400).json({ success: false, message: "Unauthorized Request" })
        }

        if (!event.isFinished) {
            return res.status(400).json({ success: false, message: "Event is already not finished" })
        }

        event.isFinished = false
        const updatedEvent = await event.save()

        if (!updatedEvent) {
            return res.status(500).json({ success: false, message: "Can't process your request at the moment" })
        }

        return res.status(200).json({ success: true, message: "Event is set to not finished" })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

const addFriend = async (req, res) => {
    const { _id, _friendId, _eventId } = req.body

    if (!_id || !_friendId || !_eventId) {
        return res.status(400).json({ success: false, message: "Input nessary data" })
    }

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(_friendId)) {
        return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(_eventId)) {
        return res.status(400).json({ success: false, message: "Invalid event ID" });
    }

    try {
        const user = await userModel.findById(_id)
        const friend = await userModel.findById(_friendId)
        const event = await eventModel.findById(_eventId)

        if (!user) {
            return res.status(400).json({ success: false, message: "User Not Found" })
        }

        if (!friend) {
            return res.status(400).json({ success: false, message: "No user avalible" })
        }

        if (!event) {
            return res.status(400).json({ success: false, message: "No event avalible" })
        }

        if (event.isFinished) {
            return res.status(400).json({ success: false, message: "Event is finished" })
        }

        const isUserMember = event.members.includes(user._id)

        if (!isUserMember) {
            return res.status(400).json({ success: false, message: "Unauthorized access" })
        }

        const isFriend = user.friends.includes(friend._id)
        if (!isFriend) {
            return res.status(400).json({ success: false, message: "He is not in the friend list" })
        }

        const isFriendMember = event.members.includes(friend._id)

        if (isFriendMember) {
            return res.status(400).json({ success: false, message: "Friend is already added in the event" })
        }

        event.members.push(friend._id)
        friend.events.push(event._id)

        const updatedEvent = await event.save()
        const updatedFriend = await friend.save()

        if (!updatedEvent || !updatedFriend) {
            return res.status(500).json({ success: false, message: "Can't process your request at the moment" })
        }

        return res.status(200).json({ success: true, message: "Friend added to the event successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

const removeFriend = async (req, res) => {
    const { _id, _friendId, _eventId } = req.body

    if (!_id || !_friendId || !_eventId) {
        return res.status(400).json({ success: false, message: "Input nessary data" })
    }

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(_friendId)) {
        return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(_eventId)) {
        return res.status(400).json({ success: false, message: "Invalid event ID" });
    }

    try {
        const user = await userModel.findById(_id)
        const friend = await userModel.findById(_friendId)
        const event = await eventModel.findById(_eventId)

        if (!user) {
            return res.status(400).json({ success: false, message: "User Not Found" })
        }

        if (!friend) {
            return res.status(400).json({ success: false, message: "No user avalible" })
        }

        if (!event) {
            return res.status(400).json({ success: false, message: "No event avalible" })
        }

        if (event.isFinished) {
            return res.status(400).json({ success: false, message: "Event is finished" })
        }

        const isUserMember = event.members.includes(user._id)

        if (!isUserMember) {
            return res.status(400).json({ success: false, message: "Unauthorized access" })
        }

        const isFriend = user.friends.includes(friend._id)
        if (!isFriend) {
            return res.status(400).json({ success: false, message: "He is not in the friend list" })
        }

        const isFriendMember = event.members.includes(friend._id)

        if (!isFriendMember) {
            return res.status(400).json({ success: false, message: "Friend is already not in the event" })
        }

        event.members = event.members.filter(item => item.toString() !== friend._id.toString())
        friend.events = friend.events.filter(item => item.toString() !== event._id.toString())
        
        const updatedEvent = await event.save()
        const updatedFriend = await friend.save()

        if (!updatedEvent || !updatedFriend) {
            return res.status(500).json({ success: false, message: "Can't process your request at the moment" })
        }

        return res.status(200).json({ success: true, message: "Friend removed from the event successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

const deleteEvent = async (req, res) => {
    const { _id, _eventId } = req.body

    if (!_id || !_eventId) {
        return res.status(400).json({ success: false, message: "Input all nessary data" })
    }

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(_eventId)) {
        return res.status(400).json({ success: false, message: "Invalid event ID" });
    }

    try {
        const user = await userModel.findById(_id)
        const event = await eventModel.findById(_eventId).populate('members')

        if (!user) {
            return res.status(400).json({ success: false, message: "User Not Found" })
        }

        if (!event) {
            return res.status(400).json({ success: false, message: "Event Not Found" })
        }

        if (event.createdBy.toString() !== user._id.toString()) {
            return res.status(403).json({ success: false, message: "You are not authorized to delete this event" });
        }

        const updateMemberPromises = event.members.map(async (member) => {
            member.events = member.events.filter(eventItem => eventItem.toString() !== _eventId.toString());
            await member.save();
        });

        await Promise.all(updateMemberPromises);

        await expenseModel.deleteMany({ event: _eventId })

        const deletedEvent = await eventModel.findByIdAndDelete(_eventId)


        if (!deletedEvent) {
            return res.status(500).json({ success: false, message: "Can't delete the event at the moment" })
        }

        return res.status(200).json({ success: true, message: "Event deleted successfully" })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

const budget = async (req, res) => {
    const { _id, _eventId } = req.body

    if (!_id || !_eventId) {
        return res.status(400).json({ success: false, message: "Input all nessary data" })
    }

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(_eventId)) {
        return res.status(400).json({ success: false, message: "Invalid event ID" });
    }

    try {
        const user = await userModel.findById(_id)
        const event = await eventModel.findById(_eventId).populate('members')
        const expenses = await expenseModel.find({ event: _eventId })

        if (!user) {
            return res.status(400).json({ success: false, message: "User Not Found" })
        }

        if (!event) {
            return res.status(400).json({ success: false, message: "Event Not Found" })
        }

        const isUserMember = event.members.some(member => member._id.toString() === user._id.toString());
        if (!isUserMember) {
            return res.status(400).json({ success: false, message: "Unauthorized Request" });
        }

        let total = 0
        const userObj = {}

        expenses.forEach((expense) => {
            total += expense.amount;
            if (userObj[expense.paidBy]) {
                userObj[expense.paidBy] += expense.amount;
            } else {
                userObj[expense.paidBy] = expense.amount;
            }
        });

        const share = total / Object.keys(userObj).length;

        Object.keys(userObj).forEach((key) => {
            userObj[key] -= share;
        });

        const obj = {}
        // Object.keys(userObj).forEach(async (key) => {
        //     let fullUser = await userModel.findById(key)
        //     obj[key] = { name: fullUser.name, share: userObj[key] }
        // });
        await Promise.all(Object.keys(userObj).map(async (key) => {
            let fullUser = await userModel.findById(key);
            obj[key] = { name: fullUser.name, share: userObj[key] };
        }));


        return res.status(200).json({ success: true, data: obj })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}


const eventController = {
    createEvent,
    deleteEvent,
    finishEvent,
    notFinishEvent,
    addFriend,
    removeFriend,
    updateEvent,
    getOneEvent,
    getAllEvent,
    budget
}

module.exports = eventController