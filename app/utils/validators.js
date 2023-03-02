export class Validators {

    static isEmailValid(value) {
      return /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(value)
    }
  
    static isPasswordValid(value) {
      return /^(?=.*?[a-z])(?=.*?[#?!@$%^&*-]).{8,70}$/.test(value)
    }
  
    static isFirstNameValid(value) {
      return /^[a-zA-Z ]*$/.test(value)
    }
  
    static isUsernameValid(value) {
      return /^[a-zA-Z][a-zA-Z0-9_]\S*$/.test(value)
    }

    static isMobileValid(value) {
      return /^[0-9]{10}$/.test(value)
    }
  }
  