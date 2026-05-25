import passwordValidator from "password-validator"

var schema = new passwordValidator();

// Add properties to it
schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase(1)                              // Must have uppercase letters
    .has().lowercase(1)                              // Must have lowercase letters
    .has().digits(1)                                // Must have at least 1 digits
    .has().symbols(1)                                // Must have at least 1 symbol
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

export default function formValidator(e) {
    let { name, value } = e.target
    switch (name) {
        case 'name':
        case 'username':
        case 'profession':
            if (!value || value.length === 0)
                return name + " Feild is Mendatory"
            else if (value.length < 3 || value.length > 50)
                return name + " Feild Length Must be Between 3-50"
            else
                return ""

        case 'phone':
            if (!value || value.length === 0)
                return "Contact Feild is Mendatory"
            else if (value.length < 10 || value.length > 10)
                return "Contact Feild Length Must be of 10 digit"
            else if (!(value.startsWith("6") || value.startsWith("7") || value.startsWith("8") || value.startsWith("9")))
                return "Invalid Phone Number.It Must Start With 6,7,8 or 9"
            else
                return ""

        case 'email':
            if (!value || value.length === 0)
                return name + "Feild is Mendatory"
            else if (value.length < 13 || value.length > 50)
                return name + " Feild Length Must be Between 13-50"
            else
                return ""

        case 'password':
            if (!value || value.length === 0)
                return name + "Feild is Mendatory"
            else if (!schema.validate(value)) {
                return "Invalid Password,It must contain 8-100 character,At Least 1 Uppercaser Character, 1 LowerCase Character,1 Digit,1 symbol and Doesn't Include Any Space"
            }
            else 
                return ""

        // case 'address':
        //     if (!value || value.length === 0)
        //         return name + "Feild is Mendatory"
        //     else if (value.length < 20 || value.length > 100)
        //         return name + " Feild Length Must be Between 20-100"
        //     else
        //         return ""

        case 'basePrice':
            if (!value || value.length === 0)
                return name + "Feild is Mendatory"
            else if (value < 1)
                return "Base Price Must Be Greater Than Zero"
            else
                return ""
        case 'discount':
            if (!value || value.length === 0)
                return name + "Feild is Mendatory"
            else if (value < 0 || value > 100)
                return "Discount Must Be Between 0-100"
            else
                return ""
        case 'seatAvailable':
            if (!value || value.length === 0)
                return "Seats Availability Feild is Mendatory"
            else if (value < 0)
                return "Discount Must Be Greater than 0"
            else
                return ""

        case 'reservationCharge':
            if (!value || value.length === 0)
                return "Reservation Charge Feild is Mendatory"
            else if (value < 1)
                return "Base Price Must Be Greater Than Zero"
            else
                return ""

        case 'description':
            if (!value || value.length === 0)
                return name + "Feild is Mendatory"
            else if (value.length < 50)
                return "Description Must be Greater Than 50"
            else
                return ""
        case 'rating':
            if (!value || value.length === 0)
                return name + "Feild is Mendatory"
            else if (value < 1 || value > 5)
                return "Rating Should be betweem 1-5"
            else
                return ""
        case 'message':
            if (!value || value.length === 0)
                return name + " Feild is Mendatory"
            else if (value.length < 50)
                return name + " Feild Length Must be Greater Than 50"
            else
                return ""
        default:
            break;
    }
}
