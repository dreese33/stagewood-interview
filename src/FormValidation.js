

export function checkEmptyFields(fields) {
    for (let i = 0; i < fields.length; i++) {
        if (fields[i] === '') {
            return true;
        }
    }
    return false;
}


//Ensures email also has a period in it
export function validateEmail(email) {
    if (email.includes('.')) {
        return true;
    }
    return false;
}