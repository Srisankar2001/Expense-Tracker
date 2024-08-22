import React, { useState } from 'react'
import "./LoginPage.css"
import { LoginValidation } from '../../Functions/LoginValidation'
import axiosInstance from '../../Config/AxiosConfig'
import { useNavigate } from 'react-router-dom'

export const LoginPage = () => {
    const navigate = useNavigate()
    const [input, setInput] = useState({
        email: "",
        password: ""
    })
    const [error, setError] = useState({
        email: "",
        password: ""
    })
    const handleChange = (e) => {
        setInput(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }
    const handleReset = () => {
        setInput({
            email: "",
            password: ""
        })
        setError({
            email: "",
            password: ""
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        const errors = LoginValidation(input)
        setError(errors)
        if (Object.values(errors).every(item => item === "")) {
            try{
                const postData = {
                    email: input.email.trim().toLowerCase(),
                    password: input.password.trim()
                }
                const response = await axiosInstance.post("/auth/login", postData)
                if (response.data.success) {
                    alert(response.data.message)
                    // navigate("/")
                    window.location.reload()
                } else {
                    alert(response.data.message)
                }
            }catch(error){
                alert(error.response?.data?.message || "Internal Server Error")
            }
        }
    }
    return (
        <div className='login'>
            <form onSubmit={handleSubmit} onReset={handleReset}>
                <h1>Login</h1>
                <div className='login-inputs'>
                    <div className='login-input'>
                        <label>Email</label>
                        <input type='text' name='email' value={input.email} placeholder='Enter Your Email' onChange={handleChange} />
                        {error.email && <h3>{error.email}</h3>}
                    </div>
                    <div className='login-input'>
                        <label>Password</label>
                        <input type='password' name='password' value={input.password} placeholder='Enter Your Password' onChange={handleChange} />
                        {error.password && <h3>{error.password}</h3>}
                    </div>
                </div>
                <div className='login-buttons'>
                    <input type='submit' value='Submit' />
                    <input type='reset' value='Clear' />
                </div>
            </form>
        </div>
    )
}
