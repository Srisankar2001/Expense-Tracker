import React, { useContext, useEffect, useState } from 'react'
import './NewMemberPage.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { AppContext } from '../../Context/AppContext'
import axiosInstance from '../../Config/AxiosConfig'
import add from '../../Assets/add.png'
import remove from '../../Assets/remove.png'
export const NewMemberPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { _eventId } = location.state || {}
    const _id = useContext(AppContext)
    const [members, setMembers] = useState([])
    const [friends, setFriends] = useState([])
    useEffect(() => {
        if (!_id || !_eventId) {
            navigate("/")
        }
        const fetchEvent = async () => {
            try {
                const postData = { _id, _eventId }
                const response = await axiosInstance.post("/event/getOne", postData)
                if (response.data.success) {
                    setMembers(response.data.data.event.members)
                } else {
                    alert(response.data.message)
                }
            } catch (error) {
                alert(error.response?.data?.message || "Internal Server Error")
            }
        }
        const fetchFriends = async () => {
            try {
                const postData = { _id }
                const response = await axiosInstance.post("/user/allFriend", postData)
                if (response.data.success) {
                    setFriends(response.data.data)
                } else {
                    alert(response.data.message)
                }
            } catch (error) {
                alert(error.response?.data?.message || "Internal Server Error")
            }
        }
        fetchEvent()
        fetchFriends()
    }, [_id, _eventId, navigate])

    const renderMembers = () => {
        return friends.map((item, index) => {
            if (!friends || friends.length === 0) {
                return (
                    <span className='newMember-noFriend'>No Friend Available</span>
                )
            } else {
                return (
                    <div key={index} className='newMember-friend'>
                        <div className='newMember-friend-details'>
                            <h1>{item.name}</h1>
                            <h2>{item.email}</h2>
                        </div>
                        <div className='newMember-friend-btn'>
                            {members.some(memberItem => memberItem._id === item._id) ?
                                <button className='newMember-friend-btn-remove' onClick={()=>handleRemoveFriend(item._id)}>
                                    <img src={remove} alt='Remove Member' />
                                    <span>Remove Member</span>
                                </button>
                                :
                                <button className='newMember-friend-btn-add' onClick={()=>handleAddFriend(item._id)}>
                                    <img src={add} alt='Add Member' />
                                    <span>Add Member</span>
                                </button>
                            }
                        </div>
                    </div>
                );
            }
        })
    }

    const handleAddFriend = (_friendId) => {
        const postData = async () => {
            try {
                const postData = { _id,_friendId,_eventId }
                const response = await axiosInstance.put("/event/addFriend", postData)
                if (response.data.success) {
                    alert(response.data.message)
                    window.location.reload()
                } else {
                    alert(response.data.message)
                }
            } catch (error) {
                alert(error.response?.data?.message || "Internal Server Error")
            }
        }
        postData()
    }

    const handleRemoveFriend = (_friendId) => {
        const postData = async () => {
            try {
                const postData = { _id,_friendId,_eventId }
                const response = await axiosInstance.put("/event/removeFriend", postData)
                if (response.data.success) {
                    alert(response.data.message)
                    window.location.reload()
                } else {
                    alert(response.data.message)
                }
            } catch (error) {
                alert(error.response?.data?.message || "Internal Server Error")
            }
        }
        postData()
    }

    return (
        <div className='newMember'>
            <div className='newMember-friend-div'>
                {renderMembers()}
            </div>
        </div>
    )
}
