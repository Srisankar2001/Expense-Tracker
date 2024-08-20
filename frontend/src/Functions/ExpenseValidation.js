export const ExpenseValidation = (input) => {
    const error = {
        name: "",
        paidBy:"",
        amount:""
    }
    const name = input.name.trim()
    const amount = input.amount.trim()
    const paidBy = input.paidBy

    if (name === "") {
        error.name = "*name field is empty"
    } else {
        error.name = ""
    }

    if (amount === "") {
        error.amount = "*amount field is empty"
    } else if(isNaN(amount)){
        error.amount = "*invalid amount"
    }else {
        error.amount = ""
    }

    if (paidBy === "") {
        error.paidBy = "*select who is pay the expense"
    } else {
        error.paidBy = ""
    }

    return error

}