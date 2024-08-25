import React, { useState } from 'react'
import "./RegisterPage.css"
import { RegisterValidation } from '../../Functions/RegisterValidation'
import axiosInstance from '../../Config/AxiosConfig'
import { Link, useNavigate } from 'react-router-dom'

export const RegisterPage = () => {
    const navigate = useNavigate()
    const [input, setInput] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [error, setError] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const handleChange = (e) => {
        setInput(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }
    const handleReset = () => {
        setInput({
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        })
        setError({
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        const errors = RegisterValidation(input)
        setError(errors)
        if (Object.values(errors).every(item => item === "")) {
            try {
                const postData = {
                    name: input.name.trim().charAt(0).toUpperCase() + input.name.trim().slice(1).toLowerCase(),
                    email: input.email.trim().toLowerCase(),
                    password: input.password.trim()
                }
                const response = await axiosInstance.post("/auth/register", postData)
                if (response.data.success) {
                    alert(response.data.message)
                    navigate("/")
                } else {
                    alert(response.data.message)
                }
            } catch (error) {
                console.log(error)
                alert(error.response?.data?.message || "Internal Server Error")
            }
        }
    }
    return (
        <div className='Register'>
            <form onSubmit={handleSubmit} onReset={handleReset}>
                <h1>Register</h1>
                <div className='Register-inputs'>
                    <div className='Register-input'>
                        <label>Name</label>
                        <input type='text' name='name' value={input.name} placeholder='Enter Your Name' onChange={handleChange} />
                        {error.name && <h3>{error.name}</h3>}
                    </div>
                    <div className='Register-input'>
                        <label>Email</label>
                        <input type='text' name='email' value={input.email} placeholder='Enter Your Email' onChange={handleChange} />
                        {error.email && <h3>{error.email}</h3>}
                    </div>
                    <div className='Register-input'>
                        <label>Password</label>
                        <input type='password' name='password' value={input.password} placeholder='Enter Your Password' onChange={handleChange} />
                        {error.password && <h3>{error.password}</h3>}
                    </div>
                    <div className='Register-input'>
                        <label>Confirm Password</label>
                        <input type='password' name='confirmPassword' value={input.confirmPassword} placeholder='Re-Enter Your Password' onChange={handleChange} />
                        {error.confirmPassword && <h3>{error.confirmPassword}</h3>}
                    </div>
                </div>
                <div className='Register-buttons'>
                    <input type='submit' value='Submit' />
                    <input type='reset' value='Clear' />
                </div>
                <div className='Register-link'>
                    <Link to="/">Already have an account. Click Here to login</Link>
                </div>
            </form>
        </div>
    )
}
