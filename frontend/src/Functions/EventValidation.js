export const EventValidation = (input) => {
    const error = {
        name: "",
        description: ""
    }
    const name = input.name.trim()
    const description = input.description.trim()

    if (name === "") {
        error.name = "*name field is empty"
    } else {
        error.name = ""
    }

    return error

}