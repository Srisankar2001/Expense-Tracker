import React, { useContext, useEffect, useState } from 'react'
import './NewExpensePage.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { AppContext } from '../../Context/AppContext'
import axiosInstance from '../../Config/AxiosConfig'
import { ExpenseValidation } from '../../Functions/ExpenseValidation'

export const NewExpensePage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { _eventId } = location.state || {}
    const _id = useContext(AppContext)
    const [members, setMembers] = useState([])
    const [input, setInput] = useState({
        name: "",
        paidBy: "",
        amount: ""
    })
    const [error, setError] = useState({
        name: "",
        paidBy: "",
        amount: ""
    })
    useEffect(() => {
        if (!_id || !_eventId) {
            navigate("/")
        }
        const fetchData = async () => {
            try {
                const postData = { _id, _eventId }
                const response = await axiosInstance.post("/event/getOne", postData)
                if (response.data.success) {
                    setMembers(response.data.data.event.members)
                } else {
                    alert(response.data.message)
                }
            } catch (error) {
                alert(error.response?.data?.message || "Internal Server Error")
            }
        }
        fetchData()
    }, [_id, _eventId])
    const renderMembers = () => {
        return members.map((item, index) => {
            return (
                <option key={index} value={item._id}>
                    {item._id === _id ? "You" : item.name}
                </option>
            );
        });
    }
    const handleChange = (e) => {
        setInput(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }
    const handleReset = () => {
        setInput({
            name: "",
            paidBy: "",
            amount: ""
        })
        setError({
            name: "",
            paidBy: "",
            amount: ""
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        const errors = ExpenseValidation(input)
        setError(errors)
        if (Object.values(errors).every(item => item === "")) {
            try {
                const postData = {
                    _id,
                    _eventId,
                    name: input.name.trim(),
                    _paidById: input.paidBy,
                    amount: input.amount.trim()
                }
                const response = await axiosInstance.post("/expense/add", postData)
                if (response.data.success) {
                    alert(response.data.message)
                    navigate("/getEvent", { state: { _eventId: _eventId} })
                } else {
                    alert(response.data.message)
                }
            } catch (error) {
                alert(error.response?.data?.message || "Internal Server Error")
            }
        }
    }
    return (
        <div className='newExpense'>
            <form onSubmit={handleSubmit} onReset={handleReset}>
                <h1>New Expense</h1>
                <div className='newExpense-inputs'>
                    <div className='newExpense-input'>
                        <label>Name</label>
                        <input type='text' name='name' value={input.name} placeholder='Enter Expense Name' onChange={handleChange} />
                        {error.name && <h3>{error.name}</h3>}
                    </div>
                    <div className='newExpense-input'>
                        <label>Paid By</label>
                        <select name='paidBy' value={input.paidBy} onChange={handleChange}>
                            <option value='' disabled>Select a member</option>
                            {renderMembers()}
                        </select>
                        {error.paidBy && <h3>{error.paidBy}</h3>}
                    </div>
                    <div className='newExpense-input'>
                        <label>Amount</label>
                        <input type='number' name='amount' value={input.amount} placeholder='Enter Expense Amount' onChange={handleChange} />
                        {error.amount && <h3>{error.amount}</h3>}
                    </div>
                </div>
                <div className='newExpense-buttons'>
                    <input type='submit' value='Submit' />
                    <input type='reset' value='Clear' />
                </div>
            </form>
        </div>
    )
}
