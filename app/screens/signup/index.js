import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
  BackHandler
} from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import { api } from "../../controllers/ApiControllers";
import { commonStyles, signupStyles } from '../../styles';
import AsyncStorage from '@react-native-community/async-storage';
import { showAlert, showSpinner, hideSpinner } from "../../utils/helper";
import { messages } from '../../utils/errors'
import { SignUpFormValidator } from '../../services/signupFormValidator';
import ImagePicker from 'react-native-image-picker';
import { Avatar } from 'react-native-elements';

export class SignUp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      Name: '',
      Gstin: '',
      Address1: '',
      Address2: '',
      Address3: '',
      City: '',
      Mobile: '',
      Whatsapp: '',
      Password: '',
      Cpassword: '',
      NameError: false,
      GstinError: false,
      Address1Error: false,
      Address2Error: false,
      Address3Error: false,
      CityError: false,
      MobileError: false,
      WhatsappError: false,
      PasswordError: false,
      CpasswordError: false,
      UpldGumastaImgError: false,
      UpldGstImgError: false,
      UpldShopImgError: false,
      UpldStreetImgError: false,
      isUpldGumastaImg: false,
      isUpldGstImg: false,
      isUpldShopImg: false,
      isUpldStreetImg: false,
      NameErrorText: '',
      GstinErrorText: '',
      Address1ErrorText: '',
      Address2ErrorText: '',
      Address3ErrorText: '',
      CityErrorText: '',
      MobileErrorText: '',
      WhatsappErrorText: '',
      PasswordErrorText: '',
      CpasswordErrorText: '',
      UpldGumastaImgErrorText: '',
      UpldGstImgErrorText: '',
      UpldShopImgErrorText: '',
      UpldStreetImgErrorText: '',
      UpldGumastaImgSuccText: '',
      UpldGstImgSuccText: '',
      UpldShopImgSuccText: '',
      UpldStreetImgSuccText: '',
      gumastabtn: '#c2c2c2',
      gstbtn: '#c2c2c2',
      shopbtn: '#c2c2c2',
      streetbtn: '#c2c2c2',
      buttonDisable: true,
      gumastaimagedetails: '',
      gstimagedetails: '',
      shopimagedetails: '',
      streetimagedetails: ''
    }

  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.navigate('basic')
      return true;
    })
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', () => { })
  }

  async signUp() {
    if (this.state.profile_pic) {

      showSpinner(this)

      const signUpParams = new FormData();
      signUpParams.append('name', this.state.Name);
      signUpParams.append('gstin', this.state.Gstin);
      signUpParams.append('address1', this.state.Address1);
      signUpParams.append('address2', this.state.Address2);
      signUpParams.append('address3', this.state.Address3);
      signUpParams.append('city', this.state.City);
      signUpParams.append('mobile', this.state.Mobile);
      signUpParams.append('whatsapp', this.state.Whatsapp);
      signUpParams.append('password', this.state.Password);
      // signUpParams.append('gumasta', this.state.gumastaimagedetails);
      // signUpParams.append('gst_certificates', this.state.gstimagedetails);
      // signUpParams.append('shop', this.state.shopimagedetails);
      // signUpParams.append('street', this.state.streetimagedetails);
      signUpParams.append('profilepic', this.state.profile_pic_details);

      let response = await api.callApi('auth/register', 'POST', { requestBody: signUpParams, image: true });
      hideSpinner(this)
      console.log("signup Response", response)
      if (response.body.code === 200) {
        console.log("signup Response", response)
        this.clearSignUpForm()
        // await AsyncStorage.setItem('otp', response.body.otp)
      //  await AsyncStorage.setItem('user_id', JSON.stringify(response.body.USERID))
        // showAlert(messages.alertHeading, messages.registrationMsg)
        this.props.navigation.navigate('registersteptwo',{userid:JSON.stringify(response.body.USERID)});
      } else if (response.body.code === 201) {
        showAlert(messages.alertHeading, response.body.message)
      } else {
        alert(messages.alertHeading, response.body.message)
      }
    } else {
      showAlert(messages.alertHeading, "Please Select Profile Image!!")
    }

  }

  clearSignUpForm() {
    this.setState({
      Name: '',
      Gstin: '',
      Address1: '',
      Address2: '',
      Address3: '',
      City: '',
      Mobile: '',
      Whatsapp: '',
      Password: '',
      Cpassword: '',
      profile_pic: ''
    })
  }

  onEnableSignUp() {
    console.log(this.state.Name)
    if (this.state.Name && this.state.Gstin && this.state.Address1 && this.state.Address2 && this.state.Address3 && this.state.City && this.state.Mobile && this.state.Whatsapp && this.state.Password && this.state.Cpassword) {
      if (!this.state.NameError && !this.state.GstinError && !this.state.Address1Error && !this.state.Address2Error && !this.state.Address3Error && !this.state.CityError && !this.state.MobileError && !this.state.WhatsappError && !this.state.PasswordError && !this.state.CpasswordError) {
        this.setState({
          buttonDisable: false
        })
      } else {
        this.setState({
          buttonDisable: true
        })
      }
    }else {
      this.setState({
        buttonDisable: true
      })
    }
  }

  uploadImage(type) {
    console.log(type)

    ImagePicker.showImagePicker((responseImage) => {

      if (responseImage.didCancel) {
        if (type == 'gumasta') {
          SignUpFormValidator.validate('gumasta', this)
        } else if (type == 'gst') {
          SignUpFormValidator.validate('gstUpload', this)
        } else if (type == 'shop') {
          SignUpFormValidator.validate('shop', this)
        } else if (type == 'street') {
          SignUpFormValidator.validate('street', this)
        }
        console.log('User cancelled image picker');
      } else if (responseImage.error) {
        console.log('ImagePicker Error: ', responseImage.error);
      } else if (responseImage.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        if (type == 'gumasta') {
          this.setState({
            isUpldGumastaImg: true,
            gumastabtn: '#ffc01d',
            gumastaimagedetails: {
              uri: responseImage.uri,
              type: responseImage.type,
              name: responseImage.fileName
            }

          }, () => {
            this.setState({
              UpldGumastaImgSuccText: responseImage.fileName,
            })
          })
          SignUpFormValidator.validate('gumasta', this)
        } else if (type == 'gst') {
          this.setState({
            isUpldGstImg: true,
            gstbtn: '#ffc01d',
            gstimagedetails: {
              uri: responseImage.uri,
              type: responseImage.type,
              name: responseImage.fileName
            }

          }, () => {
            this.setState({
              UpldGstImgSuccText: responseImage.fileName
            })
          })
          SignUpFormValidator.validate('gstUpload', this)
        } else if (type == 'shop') {
          this.setState({
            isUpldShopImg: true,
            shopbtn: '#ffc01d',
            shopimagedetails: {
              uri: responseImage.uri,
              type: responseImage.type,
              name: responseImage.fileName
            }

          }, () => {
            this.setState({
              UpldShopImgSuccText: responseImage.fileName
            })
          })
          SignUpFormValidator.validate('shop', this)
        } else if (type == 'street') {
          this.setState({
            isUpldStreetImg: true,
            streetbtn: '#ffc01d',
            streetimagedetails: {
              uri: responseImage.uri,
              type: responseImage.type,
              name: responseImage.fileName
            }

          }, () => {
            this.setState({
              UpldStreetImgSuccText: responseImage.fileName
            })
          })
          SignUpFormValidator.validate('street', this)
        }
      }
    })
  }

  changeImage() {

    ImagePicker.showImagePicker((responseImage) => {

      if (responseImage.didCancel) {
        console.log('User cancelled image picker');
      } else if (responseImage.error) {
        console.log('ImagePicker Error: ', responseImage.error);
      } else if (responseImage.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        this.setState({
          profile_pic: responseImage.uri,
          profile_pic_details: {
            uri: responseImage.uri,
            type: responseImage.type,
            name: responseImage.fileName
          }
        })
      }
    })
  }


  render() {
    return (
      <ImageBackground source={require('../../images/Main.png')} style={commonStyles.imagebackgroundstyle}>
        <ScrollView>
          <View style={commonStyles.logo_container}>
            <Image style={commonStyles.logo} source={require('../../images/SR_splash.png')} />
          </View>
          <View style={signupStyles.mainContainer}>
            <View style={signupStyles.innerContainer}>
              <View style={{ marginBottom: '10%' }}>
                <Avatar
                  size={120}
                  onPress={() => this.changeImage()}
                  rounded
                  source={{
                    uri: this.state.profile_pic
                  }}
                  showEditButton
                />
              </View>
              <View style={{}}>
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholder="Name"
                  placeholderTextColor="grey"
                  onChangeText={(name) => this.setState({ Name: name })}
                  onEndEditing={() => { SignUpFormValidator.validate('name', this) }}
                  onSubmitEditing={() => SignUpFormValidator.validate('name', this)}
                  style={signupStyles.textinputstyle}
                />
                {this.state.NameError === true && <Text style={{ paddingLeft: '1%', paddingTop: '1%', color: 'red' }}>{this.state.NameErrorText}</Text>}
              </View>
              <View style={signupStyles.seperator}>
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholder="GSTIN"
                  placeholderTextColor="grey"
                  onEndEditing={() => { SignUpFormValidator.validate('gst', this) }}
                  onSubmitEditing={() => SignUpFormValidator.validate('gst', this)}
                  onChangeText={(gstin) => this.setState({ Gstin: gstin })}
                  style={signupStyles.textinputstyle}
                />
                {this.state.GstinError === true && <Text style={{ paddingLeft: '1%', paddingTop: '1%', color: 'red' }}>{this.state.GstinErrorText}</Text>}
              </View>
              <View style={signupStyles.seperator}>
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholder="Address 1"
                  placeholderTextColor="grey"
                  onEndEditing={() => { SignUpFormValidator.validate('add1', this) }}
                  onSubmitEditing={() => SignUpFormValidator.validate('add1', this)}
                  onChangeText={(addr1) => this.setState({ Address1: addr1 })}
                  style={signupStyles.textinputstyle}
                />
                {this.state.Address1Error === true && <Text style={{ paddingLeft: '1%', paddingTop: '1%', color: 'red' }}>{this.state.Address1ErrorText}</Text>}
              </View>
              <View style={signupStyles.seperator}>
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholder="Address 2"
                  placeholderTextColor="grey"
                  onEndEditing={() => { SignUpFormValidator.validate('add2', this) }}
                  onSubmitEditing={() => SignUpFormValidator.validate('add2', this)}
                  onChangeText={(addr2) => this.setState({ Address2: addr2 })}
                  style={signupStyles.textinputstyle}
                />
                {this.state.Address2Error === true && <Text style={{ paddingLeft: '1%', paddingTop: '1%', color: 'red' }}>{this.state.Address2ErrorText}</Text>}
              </View>
              <View style={signupStyles.seperator}>
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholder="Address 3"
                  placeholderTextColor="grey"
                  onEndEditing={() => { SignUpFormValidator.validate('add3', this) }}
                  onSubmitEditing={() => SignUpFormValidator.validate('add3', this)}
                  onChangeText={(addr3) => this.setState({ Address3: addr3 })}
                  style={signupStyles.textinputstyle}
                />
                {this.state.Address3Error === true && <Text style={{ paddingLeft: '1%', paddingTop: '1%', color: 'red' }}>{this.state.Address3ErrorText}</Text>}
              </View>
              <View style={signupStyles.seperator}>
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholder="City"
                  placeholderTextColor="grey"
                  onEndEditing={() => { SignUpFormValidator.validate('city', this) }}
                  onSubmitEditing={() => SignUpFormValidator.validate('city', this)}
                  onChangeText={(city) => this.setState({ City: city })}
                  style={signupStyles.textinputstyle}
                />
                {this.state.CityError === true && <Text style={{ paddingLeft: '1%', paddingTop: '1%', color: 'red' }}>{this.state.CityErrorText}</Text>}
              </View>
              <View style={signupStyles.seperator}>
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholder="Mobile"
                  placeholderTextColor="grey"
                  onEndEditing={() => { SignUpFormValidator.validate('mobile', this) }}
                  onSubmitEditing={() => SignUpFormValidator.validate('mobile', this)}
                  onChangeText={(mobile) => this.setState({ Mobile: mobile })}
                  keyboardType='numeric'
                  style={signupStyles.textinputstyle}
                />
                {this.state.MobileError === true && <Text style={{ paddingLeft: '1%', paddingTop: '1%', color: 'red' }}>{this.state.MobileErrorText}</Text>}
              </View>
              <View style={signupStyles.seperator}>
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholder="Whatsapp"
                  placeholderTextColor="grey"
                  onEndEditing={() => { SignUpFormValidator.validate('wmobile', this) }}
                  onSubmitEditing={() => SignUpFormValidator.validate('wmobile', this)}
                  onChangeText={(whatsapp) => this.setState({ Whatsapp: whatsapp })}
                  keyboardType='numeric'
                  style={signupStyles.textinputstyle}
                />
                {this.state.WhatsappError === true && <Text style={{ paddingLeft: '1%', paddingTop: '1%', color: 'red' }}>{this.state.WhatsappErrorText}</Text>}
              </View>
              <View style={signupStyles.seperator}>
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholder="Password"
                  secureTextEntry={true}
                  placeholderTextColor="grey"
                  onEndEditing={() => { SignUpFormValidator.validate('password', this),SignUpFormValidator.validate('cpassword', this) }}
                  onSubmitEditing={() => SignUpFormValidator.validate('password', this)}
                  onChangeText={(password) => this.setState({ Password: password })}
                  style={signupStyles.textinputstyle}
                />
                {this.state.PasswordError === true && <Text style={{ paddingLeft: '1%', paddingTop: '1%', color: 'red' }}>{this.state.PasswordErrorText}</Text>}
              </View>
              <View style={signupStyles.seperator}>
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholder="Confirm Password"
                  placeholderTextColor="grey"
                  onEndEditing={() => { SignUpFormValidator.validate('cpassword', this) }}
                  onSubmitEditing={() => SignUpFormValidator.validate('cpassword', this)}
                  secureTextEntry={true}
                  onChangeText={(cnfpassword) => this.setState({ Cpassword: cnfpassword })}
                  style={signupStyles.textinputstyle}
                />
                {this.state.CpasswordError === true && <Text style={{ paddingLeft: '1%', paddingTop: '1%', color: 'red' }}>{this.state.CpasswordErrorText}</Text>}
              </View>
              {/* <View style={signupStyles.seperator}>
                <TouchableOpacity style={[signupStyles.btn, { backgroundColor: this.state.gumastabtn }]} onPress={() => { this.uploadImage('gumasta'); }}>
                  <Text style={signupStyles.btn_text}>Upload Gumasta</Text>
                </TouchableOpacity>
                {this.state.isUpldGumastaImg === true && <Text style={{ paddingLeft: '1%', paddingTop: '1%', color: 'green' }}>{this.state.UpldGumastaImgSuccText}</Text>}
                {this.state.UpldGumastaImgError === true && <Text style={{ paddingLeft: '1%', paddingTop: '1%', color: 'red' }}>{this.state.UpldGumastaImgErrorText}</Text>}
              </View>
              <View style={signupStyles.seperator}>
                <TouchableOpacity style={[signupStyles.btn, { backgroundColor: this.state.gstbtn }]} onPress={() => this.uploadImage('gst')}>
                  <Text style={signupStyles.btn_text}>Upload Gst Certificate</Text>
                </TouchableOpacity>
                {this.state.isUpldGstImg === true && <Text style={{ paddingLeft: '1%', paddingTop: '1%', color: 'green' }}>{this.state.UpldGstImgSuccText}</Text>}
                {this.state.UpldGstImgError === true && <Text style={{ paddingLeft: '1%', paddingTop: '1%', color: 'red' }}>{this.state.UpldGstImgErrorText}</Text>}
              </View>
              <View style={signupStyles.seperator}>
                <TouchableOpacity style={[signupStyles.btn, { backgroundColor: this.state.shopbtn }]} onPress={() => this.uploadImage('shop')}>
                  <Text style={signupStyles.btn_text}>Upload Shop Image</Text>
                </TouchableOpacity>
                {this.state.isUpldShopImg === true && <Text style={{ paddingLeft: '1%', paddingTop: '1%', color: 'green' }}>{this.state.UpldShopImgSuccText}</Text>}
                {this.state.UpldShopImgError === true && <Text style={{ paddingLeft: '1%', paddingTop: '1%', color: 'red' }}>{this.state.UpldShopImgErrorText}</Text>}
              </View>
              <View style={signupStyles.seperator}>
                <TouchableOpacity style={[signupStyles.btn, { backgroundColor: this.state.streetbtn }]} onPress={() => this.uploadImage('street')}>
                  <Text style={signupStyles.btn_text}>Upload Street Image</Text>
                </TouchableOpacity>
                {this.state.isUpldStreetImg === true && <Text style={{ paddingLeft: '1%', paddingTop: '1%', color: 'green' }}>{this.state.UpldStreetImgSuccText}</Text>}
                {this.state.UpldStreetImgError === true && <Text style={{ paddingLeft: '1%', paddingTop: '1%', color: 'red' }}>{this.state.UpldStreetImgErrorText}</Text>}
              </View> */}
              <View style={signupStyles.seperator}>
                <Text style={{ paddingLeft: '1%', width: responsiveWidth(80), paddingTop: '1%', color: 'black', fontSize: responsiveFontSize(1.8), textAlign: 'left', fontFamily: 'Barlow-Bold' }}>* All fields are mandatory</Text>
              </View>
              <View style={signupStyles.seperator}>
                {!this.state.buttonDisable && <TouchableOpacity disabled={this.state.buttonDisable} onPress={() => { this.signUp() }} style={[signupStyles.btn, {
                  backgroundColor: '#ffc01d'
                }]}>
                  {
                    this.state.spinnerVisible
                      ? <ActivityIndicator size="small" color="#fff" />
                      : <View style={{}}>
                        <Text style={signupStyles.btn_text}>Next</Text>
                      </View>
                  }

                </TouchableOpacity>}
                {this.state.buttonDisable && <TouchableOpacity disabled={this.state.buttonDisable} onPress={() => { this.signUp() }} style={[signupStyles.btn, {
                  backgroundColor: '#c2c2c2'
                }]}>
                  {
                    this.state.spinnerVisible
                      ? <ActivityIndicator size="small" color="#fff" />
                      : <View style={{}}>
                        <Text style={signupStyles.btn_text}>Next</Text>
                      </View>
                  }

                </TouchableOpacity>}
              </View>
            </View>
          </View>
          {/* <View style={signupStyles.btnContainer}>

          </View> */}
        </ScrollView>
      </ImageBackground>
    )
  }
}
