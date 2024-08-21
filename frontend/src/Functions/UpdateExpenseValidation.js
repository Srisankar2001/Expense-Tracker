export const UpdateExpenseValidation = (input) => {
    const error = {
        name: "",
        amount:""
    }
    const name = input.name.trim()
    const amount = input.amount.trim()

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

    return error

}