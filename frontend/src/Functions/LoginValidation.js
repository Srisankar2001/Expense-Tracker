export const LoginValidation = (input) => {
    const error = {
        email: "",
        password: ""
    }
    const email = input.email.trim()
    const password = input.password.trim()

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

    return error

}
