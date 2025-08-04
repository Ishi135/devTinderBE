const mongoose = require('mongoose')
const validator = require('validator')

const userScheme = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: false,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email', value)
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error('Password must be strong')
            }
        }
    },
    age: {
        type: Number,
        required: false,
        min: 18
    },
    gender: {
        type: String,
        required: false,
        validate(value) {
            if (![male, female, other].includes(value)) {
                throw new Error('Invalid gender')
            }
        }

    },
    photoUrl: {
        type: String,
        required: false
    },
    bio: {
        type: String,
        required: false,
        default: "Hello, I am using DevTinder!",
        maxlength: 200
    },
    interests: {
        type: [String],
        required: false,
        validate(value) {
            if (value.length > 10) {
                throw new Error('You can only have up to 10 interests')
            }
        }
    }
},
    { timestamps: true } // This will add createdAt and updatedAt fields
)

const User = mongoose.model("User", userScheme)
module.exports = User