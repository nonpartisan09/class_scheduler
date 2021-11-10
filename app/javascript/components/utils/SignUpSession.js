
const FIRST_NAME = 'newSignUpFirstName';
const EMAIL = 'newSignUpEmail';
const LOCALE = 'newSignUpLocale';

class SignUpSession {
    static saveSession(firstName, email, locale) {
        sessionStorage.setItem(FIRST_NAME,firstName);
        sessionStorage.setItem(EMAIL, email);
        sessionStorage.setItem(LOCALE, locale);   
    }
    static sessionExists() {
        if (FIRST_NAME in sessionStorage)
            return true;
        else if (EMAIL in sessionStorage)
            return true;
        else if (LOCALE in sessionStorage)
            return true;
        else
            return false;
    }
    static getSession() {
        let sessionObj = {};

        sessionObj.firstName = (FIRST_NAME in sessionStorage) ? sessionStorage.getItem(FIRST_NAME) : '';
        sessionObj.email = (EMAIL in sessionStorage) ? sessionStorage.getItem(EMAIL) : '';
        sessionObj.locale = (LOCALE in sessionStorage) ? sessionStorage.getItem(LOCALE) : '';

        return sessionObj;
    }    
    static clearSession() {
        sessionStorage.removeItem(FIRST_NAME);
        sessionStorage.removeItem(EMAIL);
        sessionStorage.removeItem(LOCALE);   
    }
    
}

export default SignUpSession;