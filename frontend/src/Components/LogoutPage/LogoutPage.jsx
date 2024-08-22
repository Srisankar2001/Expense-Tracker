import React, { useContext, useEffect, useState } from 'react'
import "./LogoutPage.css"
import { AppContext } from '../../Context/AppContext'
import axiosInstance from '../../Config/AxiosConfig'
import { useNavigate } from 'react-router-dom'
export const LogoutPage = () => {
    const navigate = useNavigate()
    const _id = useContext(AppContext)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        if (!_id) {
            navigate("/")
        }
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get("/auth/logout")
                if (response.data.success) {
                    alert(response.data.message)
                    setLoading(false)
                    navigate("/")
                } else {
                    navigate("/")
                }
            } catch (error) {
                alert(error.response?.data?.message || "Internal Server Error")
                navigate("/")
            }
        }
        fetchData()
    }, [_id])

    return (
        <div className='logout'>
            {loading ? <div className="loader"></div> : <h2>Logging you out...</h2>}
        </div>
    )
}
