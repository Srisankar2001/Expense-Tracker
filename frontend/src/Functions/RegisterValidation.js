export const RegisterValidation = (input) => {
    const error = {
        name:"",
        email: "",
        password: "",
        confirmPassword:""
    }
    const name = input.name.trim()
    const email = input.email.trim()
    const password = input.password.trim()
    const confirmPassword = input.confirmPassword.trim()

    if (name === "") {
        error.name = "*name field is empty"
    } else if (/\s/.test(name)) {
        error.name = "*invalid name"
    } else {
        error.name = ""
    }

    if (email === "") {
        error.email = "*email field is empty"
    } else if (!/^[a-zA-Z][a-zA-Z0-9]+@[a-zA-Z]+\.[a-z]{2,}$/.test(email)) {
        error.email = "*invalid email"
    } else {
        error.email = ""
    }

    if (password === "") {
        error.password = "*password field is empty"
    } else if (/\s/.test(password)) {
        error.password = "*invalid password"
    } else {
        error.password = ""
    }

    if (confirmPassword=== "") {
        error.confirmPassword = "*confirm password field is empty"
    } else if (/\s/.test(confirmPassword)) {
        error.confirmPassword = "*invalid password"
    } else if(password !== confirmPassword) {
        error.confirmPassword = "*password and confirm password must be same"
    } else {
        error.confirmPassword = ""
    }

    return error

}
