import React, { useContext, useEffect, useState } from 'react'
import './NewEventPage.css'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../Context/AppContext'
import { EventValidation } from '../../Functions/EventValidation'
import axiosInstance from '../../Config/AxiosConfig'

export const NewEventPage = () => {
    const navigate = useNavigate()
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
        if (!_id) {
            navigate("/")
        }
    }, [_id])
    const handleChange = (e) => {
        setInput(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }
    const handleReset = () => {
        setInput({
            name: "",
            description: ""
        })
        setError({
            name: "",
            description: ""
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        const errors = EventValidation(input)
        setError(errors)
        if (Object.values(errors).every(item => item === "")) {
            try {
                const postData = {
                    _id : _id,
                    name: input.name.trim(),
                    description: input.description.trim()
                }
                const response = await axiosInstance.post("/event/create", postData)
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
        <div className='newEvent'>
            <form onSubmit={handleSubmit} onReset={handleReset}>
                <h1>New Event</h1>
                <div className='newEvent-inputs'>
                    <div className='newEvent-input'>
                        <label>Name</label>
                        <input type='text' name='name' value={input.name} placeholder='Enter Event Name' onChange={handleChange} />
                        {error.name && <h3>{error.name}</h3>}
                    </div>
                    <div className='newEvent-input'>
                        <label>Description</label>
                        <input type='text' name='description' value={input.description} placeholder='Enter Event Description' onChange={handleChange} />
                        {error.description && <h3>{error.description}</h3>}
                    </div>
                </div>
                <div className='newEvent-buttons'>
                    <input type='submit' value='Submit' />
                    <input type='reset' value='Clear' />
                </div>
            </form>
        </div>
    )
}
