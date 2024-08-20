import React, { useContext, useEffect, useState } from 'react'
import "./FriendPage.css"
import { AppContext } from '../../Context/AppContext'
import axiosInstance from '../../Config/AxiosConfig'
import { Link, useNavigate } from 'react-router-dom'
import plus from "../../Assets/plus.png"
import remove from "../../Assets/remove.png"
export const FriendPage = () => {
    const navigate = useNavigate()
    const _id = useContext(AppContext)
    const [friends, setFriends] = useState([])
    useEffect(() => {
        if (!_id) {
            navigate("/")
        }
        const fetchData = async () => {
            try {
                const postData = { _id }
                const response = await axiosInstance.post("/user/allFriend", postData)
                console.log(response)
                if (response.data.success) {
                    setFriends(response.data.data)
                } else {
                    alert(response.data.message)
                }
            } catch (error) {
                alert(error.response?.data?.message || "Internal Server Error")
            }
        }
        fetchData()
    }, [_id])
    const renderFriend = () => {
        if (!friends || friends.length === 0) {
            return (
                <span className='friend-nofriend'>No Friends Available</span>
            )
        } else {
            return friends.map((item, index) => {
                return (
                    <div key={index} className="friend-friend">
                        <div>
                            <h2>{item.name}</h2>
                            <h3>{item.email}</h3>
                        </div>
                        <button><img src={remove} /><span>Unfriend</span></button>
                    </div>
                )
            })
        }
    }
    return (
        < div className='friend' >
            <div className='friend-friend-div'>
                {renderFriend()}
            </div>
            <div>
                <Link to="/addFriend">
                    <img src={plus} alt="Add Friend" className="add-friend-btn" />
                </Link>
            </div>
        </div >
    )
}
