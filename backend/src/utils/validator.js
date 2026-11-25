class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.{8,}$)((?=.*\d)|(?=.*\W))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;


function validateEmail(email) {

    if (email === undefined || email === null || typeof email !== 'string') {
        throw new ValidationError('L\'email è obbligatoria');
    }

    const newEmail = email.trim().toLowerCase();

    if (newEmail.length === 0) {
        throw new ValidationError('L\'email non può essere vuota');
    }

    if (!EMAIL_REGEX.test(newEmail)) {
        throw new ValidationError('Email non valida');
    }

    if (newEmail.length > 100) {
        throw new ValidationError(
            'L\'email non può superare i 100 caratteri'
        );
    }

    return newEmail;
}


function validatePassword(password) {
    if (password === undefined || password === null) {
        throw new ValidationError('La password è obbligatoria');
    }

    if (typeof password !== 'string') {
        throw new ValidationError('La password non è valida');
    }

    if (password.length === 0) {
        throw new ValidationError('La password è obbligatoria');
    }

    if (password.length < 8) {
        throw new ValidationError(
            'La password deve avere almeno 8 caratteri'
        );
    }

    if (password.length > 100) {
        throw new ValidationError(
            'La password non può superare i 100 caratteri'
        );
    }

    if (password.includes(' ')) {
        throw new ValidationError(
            'La password non può contenere spazi'
        );
    }

    if (!PASSWORD_REGEX.test(password)) {
        throw new ValidationError(
            'La password deve contenere almeno una lettera maiuscola, una minuscola e un numero o un carattere speciale'
        );
    }

    return password;
}

function sanitizeInput(input, type) {
    if (typeof input !== 'string') {
        throw new ValidationError(
            type + ': non valido'
        );
    }

    const sanitized = input.trim();

    if (input.length === 0) {
        throw new ValidationError(
            type + ': vuoto'
        );
    }

    return sanitized;
}

module.exports = {
    ValidationError,
    validateEmail,
    validatePassword,
    sanitizeInput
};