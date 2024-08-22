import React, { useContext, useEffect, useState } from 'react'
import "./HomePage.css"
import { AppContext } from '../../Context/AppContext'
import axiosInstance from '../../Config/AxiosConfig'
import { Link, useNavigate } from 'react-router-dom'
import plus from "../../Assets/plus.png"
import edit from "../../Assets/edit.png"
import bin from "../../Assets/delete.png"
import correct from "../../Assets/correct.png"
import cancel from "../../Assets/cancel.png"
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
                            <button className='home-btn-edit' onClick={(e) => {
                                e.stopPropagation()
                                navigate("/editEvent", { state: { _eventId: item._id } })
                            }}>
                                <img src={edit} alt='Edit' />
                                <span>Edit</span>
                            </button>
                            <button className='home-btn-delete' onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteEvent(item._id)
                            }}>
                                <img src={bin} alt='Delete' />
                                <span>Delete</span>
                            </button>
                            {item.isFinished ?
                                <button className='home-btn-notFinish' onClick={(e) => {
                                    e.stopPropagation()
                                    handleNotFinishEvent(item._id)
                                }}>
                                    <img src={cancel} alt='Not Finish' />
                                    <span>Not Finish</span>
                                </button>
                                :
                                <button className='home-btn-finish' onClick={(e) => {
                                e.stopPropagation()
                                handleFinishEvent(item._id)
                            }}>
                                <img src={correct} alt='Finish' />
                                    <span>Finish</span>
                                </button>
                            }
                        </div>
                    </div>
                )
            })
        }
    }

    const handleDeleteEvent = (_eventId) => {
        const postData = async () => {
            try {
                const postData = { _id,_eventId }
                const response = await axiosInstance.post("/event/delete", postData)
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

    const handleFinishEvent = (_eventId) => {
        const postData = async () => {
            try {
                const postData = { _id,_eventId }
                const response = await axiosInstance.put("/event/finish", postData)
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

    const handleNotFinishEvent = (_eventId) => {
        const postData = async () => {
            try {
                const postData = { _id,_eventId }
                const response = await axiosInstance.put("/event/notFinish", postData)
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
        < div className='home' >
            <div className='home-event-div'>
                {renderEvent()}
            </div>
            <div>
                <Link to="/createEvent"><img src={plus} className='home-addEvent' /></Link>
            </div>
        </div >
    )
}
