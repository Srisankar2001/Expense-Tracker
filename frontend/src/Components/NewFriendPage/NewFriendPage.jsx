import React, { useContext, useEffect, useState } from 'react'
import "./NewFriendPage.css"
import { AppContext } from '../../Context/AppContext'
import axiosInstance from '../../Config/AxiosConfig'
import { Link, useNavigate } from 'react-router-dom'

import remove from "../../Assets/remove.png"
import add from "../../Assets/add.png"

export const NewFriendPage = () => {
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
                const response = await axiosInstance.post("/user/all", postData)
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
                <span className='newFriend-noNewFriend'>No Friends Available</span>
            )
        } else {
            return friends.map((item, index) => {
                return (
                    <div key={index} className="newFriend-newFriend">
                        <div>
                            <h2>{item.name}</h2>
                            <h3>{item.email}</h3>
                        </div>
                        {item.isFriend ?
                            <button className='newFriend-remove'><img src={remove} /><span>UnFriend</span></button>
                            :
                            <button className='newFriend-add'><img src={add} /><span>AddFriend</span></button>}
                    </div>
                )
            })
        }
    }
    return (
        < div className='newFriend' >
            <div className='newFriend-newFriend-div'>
                {renderFriend()}
            </div>
        </div >
    )
}
