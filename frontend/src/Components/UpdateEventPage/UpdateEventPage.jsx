import React, { useContext, useEffect, useState } from 'react'
import './UpdateEventPage.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { AppContext } from '../../Context/AppContext'
import { EventValidation } from '../../Functions/EventValidation'
import axiosInstance from '../../Config/AxiosConfig'

export const UpdateEventPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { _eventId } = location.state || {}
    const _id = useContext(AppContext)
    const [input, setInput] = useState({
        name: "",
        description: ""
    })
    const [error, setError] = useState({
        name: "",
        description: ""
    })
    useEffect(() => {
        if (!_id || !_eventId) {
            navigate("/")
        }
        const fetchData = async () => {
            try {
                const postData = { _id,_eventId }
                const response = await axiosInstance.post("/event/getOne", postData)
                console.log(response.data)
                if (response.data.success) {
                    setInput({
                        name: response.data.data.event.name,
                        description: response.data.data.event.description
                    })
                } else {
                    alert(response.data.message)
                }
            } catch (error) {
                alert(error.response?.data?.message || "Internal Server Error")
            }
        }
        fetchData()
    }, [_id,_eventId,navigate])
    const handleChange = (e) => {
        setInput(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }
    const handleReset = () => {
        window.location.reload()
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        const errors = EventValidation(input)
        setError(errors)
        if (Object.values(errors).every(item => item === "")) {
            try {
                const postData = {
                    _id,
                    _eventId,
                    name: input.name.trim(),
                    description: input.description.trim()
                }
                const response = await axiosInstance.put("/event/update", postData)
                if (response.data.success) {
                    alert(response.data.message)
                    navigate("/")
                } else {
                    alert(response.data.message)
                }
            } catch (error) {
                alert(error.response?.data?.message || "Internal Server Error")
            }
        }
    }
    return (
        <div className='updateEvent'>
            <form onSubmit={handleSubmit} onReset={handleReset}>
                <h1>Update Event</h1>
                <div className='updateEvent-inputs'>
                    <div className='updateEvent-input'>
                        <label>Name</label>
                        <input type='text' name='name' value={input.name} placeholder='Enter Event Name' onChange={handleChange} />
                        {error.name && <h3>{error.name}</h3>}
                    </div>
                    <div className='updateEvent-input'>
                        <label>Description</label>
                        <input type='text' name='description' value={input.description} placeholder='Enter Event Description' onChange={handleChange} />
                        {error.description && <h3>{error.description}</h3>}
                    </div>
                </div>
                <div className='updateEvent-buttons'>
                    <input type='submit' value='Submit' />
                    <input type='reset' value='Clear' />
                </div>
            </form>
        </div>
    )
}
