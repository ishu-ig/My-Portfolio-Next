export default function formValidator(e) {
    let { name, value } = e.target
    switch (name) {
        case "name":
        case "jobTitle":
        case "username":
        case "color":
        case "subject":
            if (!value || value.length === 0)
                return name + " Field is Mendatory"
            else if (value.length < 3 || value.length > 50)
                return name + " Field Length Must Be 3-50 Characters"
            else
                return ""

        case "email":
            if (!value || value.length === 0)
                return name + " Field is Mendatory"
            else if (value.length < 13 || value.length > 50)
                return name + " Field Length Must Be 13-50 Characters"
            else
                return ""

        case "phone":
            if (!value || value.length === 0)
                return name + " Field is Mendatory"
            else if (value.length < 10 || value.length > 10)
                return name + " Field Length Must Be 10 Characters"
            else if (!(value.startsWith("6") || value.startsWith("7") || value.startsWith("8") || value.startsWith("9")))
                return "Invalid Phone Number, It Must Start With 6,7,8 or 9"
            else
                return ""

        case "size":
            if (!value || value.length === 0)
                return name + " Field is Mendatory"
            else if (value.length > 10)
                return name + " Field Length Must Upto 10 Characters"
            else
                return ""

        case "basePrice":
            if (!value || value.length === 0)
                return name + " Field is Mendatory"
            else if (value < 1)
                return "Base Price Must Be More Than 0"
            else
                return ""


        case "discount":
            if (!value || value.length === 0)
                return name + " Field is Mendatory"
            else if (value < 0 || value > 100)
                return "Discount Must Be 0-100"
            else
                return ""

        case "stockQuantity":
            if (!value || value.length === 0)
                return name + " Field is Mendatory"
            else if (value < 0)
                return "Stock Quantity Must Not Be Nagative"
            else
                return ""

        case "message":
            if (!value || value.length === 0)
                return name + " Field is Mendatory"
            else
                return ""

        case "description":
            if (!value || value.length === 0)
                return name + " Description is Mendatory"
            else if (value.length < 30)
                return name + " Field Length Must Be More Than 50 Characters"
            else
                return ""

        case "shortDescription":
            if (!value || value.length === 0)
                return name + " Description is Mendatory"
            else if (value.length < 30)
                return name + " Field Length Must Be More Than 50 Characters"
            else
                return ""

        case "longDescription":
            if (!value || value.length === 0)
                return name + " Description is Mendatory"
            else if (value.length < 50)
                return name + " Field Length Must Be More Than 20 Characters"
            else
                return ""

        case "level":
            if (!value || value.length === 0)
                return name + "Level is Mendatory"
            else if (value > 100)
                return name + " Field Length Must Be Not More Than 100"
            else
                return ""

        default:
            return ""
    }
}
