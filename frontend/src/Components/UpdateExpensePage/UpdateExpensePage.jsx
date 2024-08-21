import React, { useContext, useEffect, useState } from 'react'
import './UpdateExpensePage.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { AppContext } from '../../Context/AppContext'
import axiosInstance from '../../Config/AxiosConfig'
import { ExpenseValidation } from '../../Functions/ExpenseValidation'
import { UpdateExpenseValidation } from '../../Functions/UpdateExpenseValidation'

export const UpdateExpensePage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { _expenseId, _eventId } = location.state || {}
    const _id = useContext(AppContext)
    const [members, setMembers] = useState([])
    const [input, setInput] = useState({
        name: "",
        amount: ""
    })
    const [error, setError] = useState({
        name: "",
        amount: ""
    })
    useEffect(() => {
        if (!_id || !_expenseId || !_eventId) {
            navigate("/")
        }
        const fetchData = async () => {
            try {
                const postData = { _id, _expenseId, _eventId }
                const response = await axiosInstance.post("/expense/getOne", postData)
                if (response.data.success) {
                    setInput({
                        name: response.data.data.name,
                        amount: response.data.data.amount
                    })
                } else {
                    alert(response.data.message)
                }
            } catch (error) {
                alert(error.response?.data?.message || "Internal Server Error")
            }
        }
        fetchData()
    }, [_id, _expenseId, navigate])
    const handleChange = (e) => {
        setInput(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }
    const handleReset = () => {
        // navigate("/editExpense", { state: { _eventId: _eventId, _expenseId: _expenseId} })
        window.location.reload()
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        const errors = UpdateExpenseValidation(input)
        setError(errors)
        if (Object.values(errors).every(item => item === "")) {
            try {
                const postData = {
                    _id,
                    _expenseId,
                    name: input.name.trim(),
                    amount: input.amount.trim()
                }
                const response = await axiosInstance.put("/expense/update", postData)
                if (response.data.success) {
                    alert(response.data.message)
                    navigate("/getEvent", { state: { _eventId: _eventId } })
                } else {
                    alert(response.data.message)
                }
            } catch (error) {
                alert(error.response?.data?.message || "Internal Server Error")
            }
        }
    }
    return (
        <div className='updateExpense'>
            <form onSubmit={handleSubmit} onReset={handleReset}>
                <h1>Update Expense</h1>
                <div className='updateExpense-inputs'>
                    <div className='updateExpense-input'>
                        <label>Name</label>
                        <input type='text' name='name' value={input.name} placeholder='Enter Expense Name' onChange={handleChange} />
                        {error.name && <h3>{error.name}</h3>}
                    </div>
                    <div className='updateExpense-input'>
                        <label>Amount</label>
                        <input type='number' name='amount' value={input.amount} placeholder='Enter Expense Amount' onChange={handleChange} />
                        {error.amount && <h3>{error.amount}</h3>}
                    </div>
                </div>
                <div className='updateExpense-buttons'>
                    <input type='submit' value='Submit' />
                    <input type='reset' value='Clear' />
                </div>
            </form>
        </div>
    )
}
