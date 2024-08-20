import React, { useContext, useEffect, useState } from 'react'
import "./EventPage.css"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AppContext } from '../../Context/AppContext'
import axiosInstance from '../../Config/AxiosConfig'
import plus from "../../Assets/plus.png"
import bin from "../../Assets/delete.png"
import edit from "../../Assets/edit.png"

export const EventPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { _eventId } = location.state || {}
    const _id = useContext(AppContext)
    const [expenses, setExpenses] = useState([])
    const [event, setEvent] = useState({})
    
    useEffect(() => {
        if (!_id || !_eventId) {
            navigate("/")
        }
        const fetchData = async () => {
            try {
                const postData = { _id, _eventId }
                const response = await axiosInstance.post("/event/getOne", postData)
                if (response.data.success) {
                    setExpenses(response.data.data.expenses)
                    setEvent(response.data.data.event)
                } else {
                    alert(response.data.message)
                }
            } catch (error) {
                alert(error.response?.data?.message || "Internal Server Error")
            }
        }
        fetchData()
    }, [_id, _eventId])
    
    const renderExpense = () => {
        if (!expenses || expenses.length === 0) {
            return (
                <span className='event-noExpense'>No Expenses Available</span>
            )
        } else {
            return expenses.map((item, index) => {
                return (
                    <div key={index} className="event-expense">
                        <div className="expense-name-amount">
                            <h1>{item.name}</h1>
                            <h2>{Number(item.amount).toFixed(2)} LKR</h2>
                        </div>
                        <div className="expense-paidby-date">
                            <h3>{item.paidBy.name}</h3>
                            <h4>{item.createdAt.split('T')[0]}</h4>
                        </div>
                        <div className='expense-edit-delete'>
                            <button className='expense-edit'>
                                <img src={edit} alt='Edit'/><span>Edit</span>
                            </button>
                            <button className='expense-delete'>
                                <img src={bin} alt='Delete'/><span>Delete</span>
                            </button>
                        </div>
                    </div>
                )
            })
        }
    }
    
    return (
        <div className='event'>
            <div className='event-expense-div'>
                {renderExpense()}
            </div>
            <div  onClick={() => navigate("/createExpense", { state: { _eventId: _eventId } })}>
                <img src={plus} alt="Add Expense" className="add-expense-btn" />
            </div>
        </div>
    )
}
