const validator = require('validator')

const validateParams = (req) => {
    const { firstName, email, password, interests } = req.body

    if (!firstName || !email || !password) {
        return 'firstName, email, and password are required';
    }
    else if (typeof firstName !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
        return 'Name, email, and password must be strings';
    }
    else if (!validator.isEmail(email)) {
        return 'Invalid email';
    }
    else if (!validator.isStrongPassword(password)) {
        return 'Password must be strong';
    }
    else if (interests && interests.length > 10) {
        return 'You can only have up to 10 interests';
    }

    return null; // No validation errors

}

module.exports = validateParams