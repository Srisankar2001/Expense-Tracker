import React, { useContext, useEffect, useState } from 'react'
import "./BudgetPage.css"
import { AppContext } from '../../Context/AppContext'
import axiosInstance from '../../Config/AxiosConfig'
import { useLocation, useNavigate } from 'react-router-dom'

export const BudgetPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { _eventId } = location.state || {}
    const _id = useContext(AppContext)
    const [budget, setBudget] = useState([])
    useEffect(() => {
        if (!_id || !_eventId) {
            navigate("/")
        }
        const fetchData = async () => {
            try {
                const postData = { _id, _eventId }
                const response = await axiosInstance.post("/event/budget", postData)
                if (response.data.success) {
                    setBudget(response.data.data)
                } else {
                    alert(response.data.message)
                }
            } catch (error) {
                alert(error.response?.data?.message || "Internal Server Error")
            }
        }
        fetchData()
    }, [_id, _eventId, navigate])
    const renderBudget = () => {
        if (!budget || Object.values(budget).length === 0) {
            return (
                <span className='budget-nobudget'>No Budget Available</span>
            )
        } else {
            return Object.values(budget).map((item, index) => {
                return (
                    <div key={index} className="budget-budget">
                            <h2>{item.name}</h2>
                            <h3 className={Number(item.share) >= 0 ? 'budget-positive' : 'budget-negative'}>{Number(item.share).toFixed(2)} LKR</h3>
                    </div>
                )
            })
        }
    }

    return (
        < div className='budget' >
            <div className='budget-budget-div'>
                {renderBudget()}
            </div>
        </div >
    )
}
