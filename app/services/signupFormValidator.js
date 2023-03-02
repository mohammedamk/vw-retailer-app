import { Validators } from "../utils/validators";
import { parseFieldErrors } from "../utils/helper";
import { messages } from "../utils/errors";

export class SignUpFormValidator {

  static showNameError(component, error) {
    component.setState({
      NameError: true,
      NameErrorText: error
    }, () => {
      component.onEnableSignUp()
    })
  }

  static showGstError(component, error) {
    component.setState({
      GstinError: true,
      GstinErrorText: error
    }, () => {
      component.onEnableSignUp()
    })
  }

  static showAddress1Error(component, error) {
    component.setState({
      Address1Error: true,
      Address1ErrorText: error
    }, () => {
      component.onEnableSignUp()
    })
  }

  static showAddress2Error(component, error) {
    component.setState({
      Address2Error: true,
      Address2ErrorText: error
    }, () => {
      component.onEnableSignUp()
    })
  }

  static showAddress3Error(component, error) {
    component.setState({
      Address3Error: true,
      Address3ErrorText: error
    }, () => {
      component.onEnableSignUp()
    })
  }

  static showCityError(component, error) {
    component.setState({
      CityError: true,
      CityErrorText: error
    }, () => {
      component.onEnableSignUp()
    })
  }

  static showEmailError(component, error) {
    component.setState({
      emailError: true,
      emailErrorText: error
    }, () => {
      component.onEnableSignUp()
    })
  }

  static showGumastaError(component, error) {
    component.setState({
      UpldGumastaImgError: true,
      UpldGumastaImgErrorText: error
    }, () => {
      component.onEnableSignUp()
    })
  }

  static showPasswordError(component, error) {
    component.setState({
      PasswordError: true,
      PasswordErrorText: error,
    }, () => {
      component.onEnableSignUp()
    })
  }

  static showCpasswordError(component, error) {
    component.setState({
      CpasswordError: true,
      CpasswordErrorText: error,
    }, () => {
      component.onEnableSignUp()
    })
  }

  static showMobileError(component, error) {
    component.setState({
      MobileError: true,
      MobileErrorText: error,
    }, () => {
      component.onEnableSignUp()
    })
  }

  static showWhatsappError(component, error) {
    component.setState({
      WhatsappError: true,
      WhatsappErrorText: error,
    }, () => {
      component.onEnableSignUp()
    })
  }

  static showGstUploadError(component, error) {
    component.setState({
      UpldGstImgError: true,
      UpldGstImgErrorText: error,
    }, () => {
      component.onEnableSignUp()
    })
  }

  static showShopError(component, error) {
    component.setState({
      UpldShopImgError: true,
      UpldShopImgErrorText: error,
    }, () => {
      component.onEnableSignUp()
    })
  }

  static showStreetError(component, error) {
    component.setState({
      UpldStreetImgError: true,
      UpldStreetImgErrorText: error,
    }, () => {
      component.onEnableSignUp()
    })
  }

  static hideNameError(component) {
    component.setState({
      NameError: false,
      NameErrorText: ''
    }, () => {
      component.onEnableSignUp()
    })
  }

  static hideGstError(component) {
    component.setState({
      GstinError: false,
      GstinErrorText: ''
    }, () => {
      component.onEnableSignUp()
    })
  }

  static hideAddress1Error(component) {
    component.setState({
      Address1Error: false,
      Address1ErrorText: ''
    }, () => {
      component.onEnableSignUp()
    })
  }

  static hideAddress2Error(component) {
    component.setState({
      Address2Error: false,
      Address2ErrorText: ''
    }, () => {
      component.onEnableSignUp()
    })
  }

  static hideAddress3Error(component) {
    component.setState({
      Address3Error: false,
      Address3ErrorText: ''
    }, () => {
      component.onEnableSignUp()
    })
  }

  static hideCityError(component) {
    component.setState({
      CityError: false,
      CityErrorText: ''
    }, () => {
      component.onEnableSignUp()
    })
  }

  static hideEmailError(component) {
    component.setState({
      emailError: false,
      emailErrorText: ''
    }, () => {
      component.onEnableSignUp()
    })
  }

  static hidePasswordError(component) {
    component.setState({
      PasswordError: false,
      PasswordErrorText: '',
    }, () => {
      component.onEnableSignUp()
    })
  }

  static hideCpasswordError(component) {
    component.setState({
      CpasswordError: false,
      CpasswordErrorText: '',
    }, () => {
      component.onEnableSignUp()
    })
  }

  static hideMobileError(component) {
    component.setState({
      MobileError: false,
      MobileErrorText: '',
    }, () => {
      component.onEnableSignUp()
    })
  }

  static hideGumastaError(component) {
    component.setState({
      UpldGumastaImgError: false,
      UpldGumastaImgErrorText: '',
    }, () => {
      component.onEnableSignUp()
    })
  }

  static hideGstUploadError(component) {
    component.setState({
      UpldGstImgError: false,
      UpldGstImgErrorText: '',
    }, () => {
      component.onEnableSignUp()
    })
  }

  static hideShopError(component) {
    component.setState({
      UpldShopImgError: false,
      UpldShopImgErrorText: '',
    }, () => {
      component.onEnableSignUp()
    })
  }

  static hideStreetError(component) {
    component.setState({
      UpldStreetImgError: false,
      UpldStreetImgErrorText: '',
    }, () => {
      component.onEnableSignUp()
    })
  }

  static hideWhatsappError(component) {
    component.setState({
      WhatsappError: false,
      WhatsappErrorText: '',
    }, () => {
      component.onEnableSignUp()
    })
  }

  static showBackendErrors(key, error, component) {
    if (key === 'firstName') {
      this.showNameError(component, error)
    } else if (key === 'lastName') {
      this.showGstError(component, error)
    } else if (key === 'email') {
      this.showEmailError(component, error)
    } else if (key === 'password') {
      this.showPasswordError(component, error)
    }
  }

  static async mapFieldErrors(err, key, component) {
    if (key === 'first_name') {
      let errorsText = await parseFieldErrors(err)
      this.showBackendErrors('firstName', errorsText, component)
    } else if (key === 'last_name') {
      let errorsText = await parseFieldErrors(err)
      this.showBackendErrors('lastName', errorsText, component)
    } else if (key === 'email') {
      let errorsText = await parseFieldErrors(err)
      this.showBackendErrors('email', errorsText, component)
    } else if (key === 'password') {
      let errorsText = await parseFieldErrors(err)
      this.showBackendErrors('password', errorsText, component)
    }
  }

  static updateNameError(component) {
    if (component.state.Name) {
      this.hideNameError(component)
    } else {
      let error = messages.NameEmpty
      this.showNameError(component, error)
    }
  }

  static updateGstError(component) {
    if (component.state.Gstin) {
      this.hideGstError(component)
    } else {
      let error = messages.GstEmpty
      this.showGstError(component, error)
    }
  }

  static updateAddress1Error(component) {
    if (component.state.Address1) {
      this.hideAddress1Error(component)
    } else {
      let error = messages.Address1Empty
      this.showAddress1Error(component, error)
    }
  }

  static updateAddress2Error(component) {
    if (component.state.Address2) {
      this.hideAddress2Error(component)
    } else {
      let error = messages.Address2Empty
      this.showAddress2Error(component, error)
    }
  }

  static updateAddress3Error(component) {
    if (component.state.Address3) {
      this.hideAddress3Error(component)
    } else {
      let error = messages.Address3Empty
      this.showAddress3Error(component, error)
    }
  }

  static updateGumastaError(component) {
    if (component.state.UpldGumastaImgSuccText) {
      this.hideGumastaError(component)
    } else {
      let error = messages.GumastaEmpty
      this.showGumastaError(component, error)
    }
  }

  static updateGstUploadError(component) {
    if (component.state.UpldGstImgSuccText) {
      this.hideGstUploadError(component)
    } else {
      let error = messages.GstUploadEmpty
      this.showGstUploadError(component, error)
    }
  }

  static updateShopError(component) {
    if (component.state.UpldShopImgSuccText) {
      this.hideShopError(component)
    } else {
      let error = messages.ShopEmpty
      this.showShopError(component, error)
    }
  }

  static updateStreetError(component) {
    if (component.state.UpldStreetImgSuccText) {
      this.hideStreetError(component)
    } else {
      let error = messages.StreetEmpty
      this.showStreetError(component, error)
    }
  }

  static updateCityError(component) {
    if (component.state.City) {
      this.hideCityError(component)
    } else {
      let error = messages.CityEmpty
      this.showCityError(component, error)
    }
  }

  static validate(type, component) {
    if (type === 'name') {
      this.updateNameError(component)
    } else if (type === 'gst') {
      this.updateGstError(component)
    } else if (type === 'add1') {
      this.updateAddress1Error(component)
    } else if (type === 'add2') {
      this.updateAddress2Error(component)
    } else if (type === 'add3') {
      this.updateAddress3Error(component)
    } else if (type === 'city') {
      this.updateCityError(component)
    } else if (type === 'mobile') {
      if (component.state.Mobile) {
        if (Validators.isMobileValid(component.state.Mobile) === true) {
          this.hideMobileError(component)
        } else {
          let error = messages.MobileValidation
          this.showMobileError(component, error)
        }
      } else {
        let error = messages.MobileEmpty
        this.showMobileError(component, error)
      }
    } else if (type === 'wmobile') {
      if (component.state.Whatsapp) {
        if (Validators.isMobileValid(component.state.Whatsapp) === true) {
          this.hideWhatsappError(component)
        } else {
          let error = messages.WhatsappValidation
          this.showWhatsappError(component, error)
        }
      } else {
        let error = messages.MobileEmpty
        this.showWhatsappError(component, error)
      }
    } else if (type === 'password') {
      if (component.state.Password) {
        this.hidePasswordError(component)
      } else {
        let error = messages.PasswordEmpty
        this.showPasswordError(component, error)
      }
    } else if (type === 'cpassword') {
      if (component.state.Cpassword) {
        if (component.state.Password === component.state.Cpassword) {
          this.hideCpasswordError(component)
        } else {
          let error = messages.CpasswordValidation
          this.showCpasswordError(component, error)
        }
      } else {
        let error = messages.CpasswordEmpty
        this.showCpasswordError(component, error)
      }
    } else if (type === 'gumasta') {
      this.updateGumastaError(component)
    } else if (type === 'gstUpload') {
      this.updateGstUploadError(component)
    } else if (type === 'shop') {
      this.updateShopError(component)
    } else if (type === 'street') {
      this.updateStreetError(component)
    }
  }

  static validateEmail(component) {
    if (component.state.email) {
      if (Validators.isEmailValid(component.state.email)) {
        this.hideEmailError(component)
      } else {
        let error = messages.emailValidation
        this.showEmailError(component, error)
      }
    } else {
      let error = messages.emailEmpty
      this.showEmailError(component, error)
    }
  }
}
