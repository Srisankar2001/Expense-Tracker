import React, { useContext, useEffect, useState } from 'react'
import "./HomePage.css"
import { AppContext } from '../../Context/AppContext'
import axiosInstance from '../../Config/AxiosConfig'
import { Link, useNavigate } from 'react-router-dom'
import plus from "../../Assets/plus.png"

import edit from "../../Assets/edit.png"
import bin from "../../Assets/delete.png"

export const HomePage = () => {
    const navigate = useNavigate()
    const _id = useContext(AppContext)
    const [events, setEvents] = useState([])
    useEffect(() => {
        if (!_id) {
            navigate("/")
        }
        const fetchData = async () => {
            try {
                const postData = { _id }
                const response = await axiosInstance.post("/event/getAll", postData)
                if (response.data.success) {
                    setEvents(response.data.data)
                } else {
                    alert(response.data.message)
                }
            } catch (error) {
                alert(error.response?.data?.message || "Internal Server Error")
            }
        }
        fetchData()
    }, [_id])
    const renderEvent = () => {
        if (!events || events.length === 0) {
            return (
                <span className='home-noEvent'>No Events Available</span>
            )
        } else {
            return events.map((item, index) => {
                return (
                    <div key={index} className={item.isFinished ? 'home-event-finished' : 'home-event'} onClick={() => navigate("/getEvent", { state: { _eventId: item._id } })}>
                        <div className='home-event-detail'>
                            <h3>{item.createdAt.split('T')[0]}</h3>
                            <h2>{item.name}</h2>
                        </div>
                        <div className='home-event-btn'>
                            <button className='home-btn-edit'><img src={edit} alt='Edit' /><span>Edit</span></button>
                            <button className='home-btn-delete'><img src={bin} alt='Delete' /><span>Delete</span></button>
                            {item.isFinished ?
                                <button className='home-btn-notFinish'><span>Not Finish</span></button>
                                :
                                <button className='home-btn-finish'><span>Finished</span></button>
                            }
                        </div>
                    </div>
                )
            })
        }
    }
    return (
        < div className='home' >
            <div className='home-event-div'>
                {renderEvent()}
            </div>
            <div>
                <Link to="/createEvent"><img src={plus} className='home-addEvent'/></Link>
            </div>
        </div >
    )
}
