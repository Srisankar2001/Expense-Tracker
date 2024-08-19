import React, { useContext, useEffect, useState } from 'react'
import "./HomePage.css"
import { AppContext } from '../../Context/AppContext'
import axiosInstance from '../../Config/AxiosConfig'
import { Link, useNavigate } from 'react-router-dom'
import plus from "../../Assets/plus.png"
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
                console.log(response)
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
                <span>No Events Available</span>
            )
        } else {
            return events.map((item, index) => {
                return (
                        <div key={index} className="home-event"  onClick={() => navigate("/getEvent", { state: { _eventId: item._id } })}>
                            <h3>{item.date}</h3>
                            <h2>{item.name}</h2>
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
                <Link to="/createEvent"><img src={plus} /></Link>
            </div>
        </div >
    )
}
