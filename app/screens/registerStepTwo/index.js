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
import { showAlert, showSpinner, hideSpinner,showGumastaSpinner,hideGumastaSpinner,showshopSpinner,hideshopSpinner,showstreetSpinner,hidestreetSpinner,showgstSpinner,hidegstSpinner, getuserinfo } from "../../utils/helper";
import { messages } from '../../utils/errors'
import { SignUpFormValidator } from '../../services/signupFormValidator';
import ImagePicker from 'react-native-image-picker';
import { Avatar } from 'react-native-elements';

export class RegisterStepTwo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      UpldGumastaImgError: false,
      UpldGstImgError: false,
      UpldShopImgError: false,
      UpldStreetImgError: false,
      isUpldGumastaImg: false,
      isUpldGstImg: false,
      isUpldShopImg: false,
      isUpldStreetImg: false,
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
      streetimagedetails: '',
      gumastaUrl:'',
      gstUrl:'',
      shopUrl:'',
      streetUrl: '',
      gumastaBtnDisable:false,
      gstBtnDisable:true,
      shopBtnDisable:true,
      streetBtnDisable: true
    }

  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.navigate('signup')
      return true;
    })
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', () => { })
  }

  async signUp() {
      showSpinner(this)
      //let userId = await getuserinfo(this)
      let userId = JSON.parse(this.props.navigation.state.params.userid)
      console.log("asda",JSON.parse(this.props.navigation.state.params.userid), this.state.gumastaUrl, this.state.gstUrl, this.state.shopUrl, this.state.streetUrl)
      const signUpParams = new FormData();
      signUpParams.append('id', userId);
      signUpParams.append('gumasta', this.state.gumastaUrl);
      signUpParams.append('gst_certificates', this.state.gstUrl);
      signUpParams.append('shop', this.state.shopUrl);
      signUpParams.append('street', this.state.streetUrl);

      let response = await api.callApi('auth/updateProfile', 'POST', { requestBody: signUpParams, image: true });
      hideSpinner(this)
      console.log("Complete Signup", response)
      if (response.body.code === 200) {
        this.clearSignUpForm()
        await AsyncStorage.setItem('otp', response.body.otp)
        // await AsyncStorage.setItem('user_id', JSON.stringify(response.body.USERID))
        showAlert(messages.alertHeading, messages.registrationMsg)
        this.props.navigation.navigate('verifyotp',{userid:userId});
      } else if (response.body.code === 201) {
        showAlert(messages.alertHeading, response.body.message)
      } else {
        alert(messages.alertHeading, response.body.message)
      }

  }

  clearSignUpForm() {
    this.setState({

    })
  }

  onEnableSignUp() {
    // this.setState({
    //         buttonDisable: false
    //       })
    if (this.state.UpldGumastaImgSuccText && this.state.UpldGstImgSuccText && this.state.UpldShopImgSuccText && this.state.UpldStreetImgSuccText) {
      if (!this.state.UpldGumastaImgError && !this.state.UpldGstImgError && !this.state.UpldShopImgError && !this.state.UpldStreetImgError) {
        this.setState({
          buttonDisable: false
        })
      } else {
        this.setState({
          buttonDisable: true
        })
      }
    }
  }

  async uploadImageData(key){
    const imageParams = new FormData();
    imageParams.append('keys', key);
      if(key === 'gumasta'){
        showGumastaSpinner(this)
        imageParams.append('gumasta', this.state.gumastaimagedetails);
      } else if(key === 'gst_certificates'){
        showgstSpinner(this);
        imageParams.append('gst_certificates', this.state.gstimagedetails);
      } else if(key === 'shop'){
        showshopSpinner(this);
        imageParams.append('shop', this.state.shopimagedetails);
      } else if(key === 'street'){
        showstreetSpinner(this);
        imageParams.append('street', this.state.streetimagedetails);
      }
      console.log('RequestBody',imageParams)
      let response = await api.callApi('auth/uploadImage', 'POST', { requestBody: imageParams, image: true });
      console.log("Image Upload",response)
      if (response.body.code === 200) {
        if(key === 'gumasta'){
            hideGumastaSpinner(this)
            this.setState({ gumastaUrl: response.body.url, isUpldGumastaImg: true,
              gumastabtn: '#ffc01d',gstBtnDisable:false})
          } else if(key === 'gst_certificates'){
            hidegstSpinner(this)
            this.setState({ gstUrl: response.body.url, isUpldGstImg: true,
              gstbtn: '#ffc01d',shopBtnDisable:false})
          } else if(key === 'shop'){
            hideshopSpinner(this);
            this.setState({ shopUrl: response.body.url, isUpldShopImg: true,
              shopbtn: '#ffc01d',streetBtnDisable:false})
          } else if(key === 'street'){
            hidestreetSpinner(this);
            this.setState({ streetUrl: response.body.url, isUpldStreetImg: true,
              streetbtn: '#ffc01d'})
          }
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

            gumastaimagedetails: {
              uri: responseImage.uri,
              type: responseImage.type,
              name: responseImage.fileName
            }

          }, () => {
            this.setState({
              UpldGumastaImgSuccText: responseImage.fileName,
            }, async () => {
                await this.uploadImageData('gumasta')
                SignUpFormValidator.validate('gumasta', this)
            })
          })

        } else if (type == 'gst') {
          this.setState({

            gstimagedetails: {
              uri: responseImage.uri,
              type: responseImage.type,
              name: responseImage.fileName
            }

          }, () => {
            this.setState({
              UpldGstImgSuccText: responseImage.fileName
            }, async () => {
                await this.uploadImageData('gst_certificates')
                SignUpFormValidator.validate('gstUpload', this)
            })
          })

        } else if (type == 'shop') {
          this.setState({

            shopimagedetails: {
              uri: responseImage.uri,
              type: responseImage.type,
              name: responseImage.fileName
            }

          }, () => {
            this.setState({
              UpldShopImgSuccText: responseImage.fileName
            }, async () => {
               await this.uploadImageData('shop')
               SignUpFormValidator.validate('shop', this)
            })
          })

        } else if (type == 'street') {
          this.setState({

            streetimagedetails: {
              uri: responseImage.uri,
              type: responseImage.type,
              name: responseImage.fileName
            }

          }, () => {
            this.setState({
              UpldStreetImgSuccText: responseImage.fileName
            }, async () => {
                await this.uploadImageData('street')
                SignUpFormValidator.validate('street', this)
            })
          })

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
              <View style={signupStyles.seperator}>
                <TouchableOpacity style={[signupStyles.btn, { backgroundColor: this.state.gumastabtn }]} onPress={() => { this.uploadImage('gumasta'); }}>
                {
                  this.state.GumspinnerVisible
                    ? <ActivityIndicator size="small" color="#fff" />
                    :<View style={{}}>
                      <Text style={signupStyles.btn_text}>Upload Gumasta</Text>
                     </View>
                }
                </TouchableOpacity>
                {this.state.isUpldGumastaImg === true && <Text numberOfLines={1} style={{ paddingLeft: '1%', paddingTop: '1%', color: 'green' }}>{this.state.UpldGumastaImgSuccText}</Text>}
                {this.state.UpldGumastaImgError === true && <Text numberOfLines={1} style={{ paddingLeft: '1%', paddingTop: '1%', color: 'red' }}>{this.state.UpldGumastaImgErrorText}</Text>}
              </View>
              <View style={signupStyles.seperator}>
                <TouchableOpacity disabled={this.state.gstBtnDisable} style={[signupStyles.btn, { backgroundColor: this.state.gstbtn }]} onPress={() => this.uploadImage('gst')}>
                {
                  this.state.GstspinnerVisible
                    ? <ActivityIndicator size="small" color="#fff" />
                    :<View style={{}}>
                      <Text style={signupStyles.btn_text}>Upload Gst Certificate</Text>
                    </View>
                }
                </TouchableOpacity>
                {this.state.isUpldGstImg === true && <Text numberOfLines={1} style={{ paddingLeft: '1%', paddingTop: '1%', color: 'green' }}>{this.state.UpldGstImgSuccText}</Text>}
                {this.state.UpldGstImgError === true && <Text numberOfLines={1} style={{ paddingLeft: '1%', paddingTop: '1%', color: 'red' }}>{this.state.UpldGstImgErrorText}</Text>}
              </View>
              <View style={signupStyles.seperator}>
                <TouchableOpacity disabled={this.state.shopBtnDisable} style={[signupStyles.btn, { backgroundColor: this.state.shopbtn }]} onPress={() => this.uploadImage('shop')}>
                {
                  this.state.ShopspinnerVisible
                    ? <ActivityIndicator size="small" color="#fff" />
                    :<View style={{}}>
                      <Text style={signupStyles.btn_text}>Upload Shop Image</Text>
                    </View>
                }
                </TouchableOpacity>
                {this.state.isUpldShopImg === true && <Text numberOfLines={1} style={{ paddingLeft: '1%', paddingTop: '1%', color: 'green' }}>{this.state.UpldShopImgSuccText}</Text>}
                {this.state.UpldShopImgError === true && <Text numberOfLines={1} style={{ paddingLeft: '1%', paddingTop: '1%', color: 'red' }}>{this.state.UpldShopImgErrorText}</Text>}
              </View>
              <View style={signupStyles.seperator}>
                <TouchableOpacity disabled={this.state.streetBtnDisable} style={[signupStyles.btn, { backgroundColor: this.state.streetbtn }]} onPress={() => this.uploadImage('street')}>
                {
                  this.state.StreetspinnerVisible
                    ? <ActivityIndicator size="small" color="#fff" />
                    :<View style={{}}>
                      <Text style={signupStyles.btn_text}>Upload Street Image</Text>
                    </View>
                }
                </TouchableOpacity>
                {this.state.isUpldStreetImg === true && <Text numberOfLines={1} style={{ paddingLeft: '1%', paddingTop: '1%', color: 'green' }}>{this.state.UpldStreetImgSuccText}</Text>}
                {this.state.UpldStreetImgError === true && <Text numberOfLines={1} style={{ paddingLeft: '1%', paddingTop: '1%', color: 'red' }}>{this.state.UpldStreetImgErrorText}</Text>}
              </View>
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
                        <Text style={signupStyles.btn_text}>Submit</Text>
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
                        <Text style={signupStyles.btn_text}>Submit</Text>
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
