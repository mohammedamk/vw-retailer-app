import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
    StatusBar,
    ScrollView,
    TextInput,
    BackHandler
} from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { Header } from "../../components";
import { api } from "../../controllers/ApiControllers";
import {editprofileStyles,loginStyles } from '../../styles';
import { showAlert, showSpinner, hideSpinner, getuserinfo } from "../../utils/helper";
import { messages } from '../../utils/errors'
import { StackNavigator, navigation, DrawerNavigator } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import StatusBarPaddingIOS from 'react-native-ios-status-bar-padding';
import { Avatar } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';

export class EditProfile extends React.Component {
constructor(props){
    super(props)
  this.state = {
    currentuser: '',
    user_id:'',
    Name: '',
    Address1: '',
    Address2: '',
    Address3: '',
    City: '',
    Whatsapp: '',
    initial:'',
    profile_pic:'',
    profile_pic_details:''
  }
}

  async componentDidMount() {
    this.getNumberCart()
    BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.navigate('profile')
      return true;
    })
    let user_id = await getuserinfo(this)
    if(user_id){
      this.setState({
        user_id: user_id
      }, () => {
        this.getUserDetails()
      })
      
    }else {
      this.props.navigation.navigate('login')
    }
  }

  getNumberCart() {
    let tmpproduct = {}
    AsyncStorage.getItem('Retailer_cart').then((value) => {
      if (value !== null) {
        tmpproduct = JSON.parse(value)
        console.log(tmpproduct)
        const tmppro = Object.keys(tmpproduct).map((key) => {
          return (tmpproduct[key])
        })
        this.setState({
          cart_count: tmppro.length
        })
      } else {
        this.setState({
          cart_count: 0
        })
      }
    }).done()
  }

  async getUserDetails() {
   
      this.setState({
        currentuser: this.props.navigation.state.params.userdetails
        }, () => {
          let title = this.state.currentuser.PARTYNAME;
          this.setState({
          Name:this.state.currentuser.PARTYNAME,
          Address1:this.state.currentuser.ADD1,
          Address2:this.state.currentuser.ADD2,
          Address3:this.state.currentuser.ADD3,
          City:this.state.currentuser.CITY,
          Whatsapp:this.state.currentuser.WHATSUPNO,
          initial:title.charAt(0)
        })
      })
  }

  async saveprofile() {
    showSpinner(this)
    // let loginFormParams = {
    //   "id": this.state.user_id,
    //   "name":this.state.Name,
    //   "address1":this.state.Address1,
    //   "address2":this.state.Address2,
    //   "address3":this.state.Address3,
    //   "city":this.state.City,
    //   "whatsapp":this.state.Whatsapp
    // }

    const loginFormParams = new FormData();
    loginFormParams.append('name', this.state.Name);
    loginFormParams.append('id', this.state.user_id);
    loginFormParams.append('address1', this.state.Address1);
    loginFormParams.append('address2', this.state.Address2);
    loginFormParams.append('address3', this.state.Address3);
    loginFormParams.append('city', this.state.City);
    loginFormParams.append('whatsapp', this.state.Whatsapp);
    loginFormParams.append('profilepic', this.state.profile_pic_details);

    console.log('profiledetails',loginFormParams);
    let response = await api.callApi(`auth/updateProfile`, 'POST', { requestBody: loginFormParams, image: true })
    hideSpinner(this)
    console.log(response.body)
    if (response.body.code === 200) {
      this.props.navigation.navigate('profile')
    } 
    else if (response.body.code === 201) {
      showAlert(messages.alertHeading, response.body.message)
    } else if (response.body.code === 202) {
      await AsyncStorage.setItem('otp', JSON.stringify(response.body.otp))
      showAlert(messages.alertHeading, messages.userVerify)
      this.props.navigation.navigate('verifyotp')
    } else {
      showAlert(messages.alertHeading, messages.networkError)
    }
  }

  changeImage(){
  
  ImagePicker.showImagePicker((responseImage) => {

      if (responseImage.didCancel) {
          console.log('User cancelled image picker');
      } else if (responseImage.error) {
          console.log('ImagePicker Error: ', responseImage.error);
      } else if (responseImage.customButton) {
          console.log('User tapped custom button: ', response.customButton);
      } else {
        this.setState({
          profile_pic:responseImage.uri,
          profile_pic_details: {
            uri:responseImage.uri, 
            type: responseImage.type, 
            name: responseImage.fileName
          }
        })
      }
    })
}

goToCart() {
  this.props.navigation.navigate('cart', {flag: 'profile'})
}

  render() {
    return (
      <View style = {{flex: 1,justifyContent:'center',alignItems:'center'}}>
        <StatusBar backgroundColor= "#ffc01d" barStyle="dark-content" hidden = {false}/>
        <StatusBarPaddingIOS style={{backgroundColor: "#ffc01d"}}/>
        <Header title = {'Profile'} navigation = {this.props.navigation} component={this} count={this.state.cart_count} />
        <ScrollView>
          <View style={editprofileStyles.mainContainer}>
            <View style={{height:responsiveHeight(20),justifyContent:'center',alignItems:'center',width:responsiveWidth(90)}}>
            {this.state.profile_pic ?
                <Avatar
                  size={100}
                  onPress={() => this.changeImage()}
                  rounded
                  source={{
                    uri:this.state.profile_pic,
                  }}
                  showEditButton
                />
                :
                <Avatar
                   size={100}
                   rounded
                   onPress={() => this.changeImage()}
                   title={this.state.initial}
                   titleStyle={{fontSize:responsiveHeight(3.5),fontFamily:'Barlow-Bold'}}
                   overlayContainerStyle={{backgroundColor: '#926f4f'}}
                   activeOpacity={0.7}
                   showEditButton
                  />
            }     
            </View>
            <View style={editprofileStyles.detailsMainContainer}>
                <View style={editprofileStyles.detailsVariableContainer}>
                  <Text style={editprofileStyles.variableText}>NAME</Text>
                </View>
                <View style={editprofileStyles.detailsValueContainer}>
                  <TextInput
                  defaultValue={this.state.Name}
                  underlineColorAndroid="transparent"
                  placeholder="Name."
                  placeholderTextColor="grey"
                  onChangeText={(name) => this.setState({ Name: name })}
                  style={editprofileStyles.edittextinputstyle}

                />
               </View>
            </View>
            <View style={editprofileStyles.detailsMainContainer}>
              <View style={editprofileStyles.detailsVariableContainer}>
                <Text style={editprofileStyles.variableText}>ADDRESS1</Text>
              </View>
              <View style={editprofileStyles.detailsValueContainer}>
                <TextInput
                  defaultValue={this.state.Address1}
                  underlineColorAndroid="transparent"
                  placeholder="Address 1."
                  placeholderTextColor="grey"
                  onChangeText={(add1) => this.setState({ Address1: add1 })}
                  style={editprofileStyles.edittextinputstyle}

                />
              </View>
            </View>
            <View style={editprofileStyles.detailsMainContainer}>
              <View style={editprofileStyles.detailsVariableContainer}>
                <Text style={editprofileStyles.variableText}>ADDRESS2</Text>
              </View>
              <View style={editprofileStyles.detailsValueContainer}>
                <TextInput
                  defaultValue={this.state.Address2}
                  underlineColorAndroid="transparent"
                  placeholder="Address 2."
                  placeholderTextColor="grey"
                  onChangeText={(add2) => this.setState({ Address2: add2 })}
                  style={editprofileStyles.edittextinputstyle}

                />
              </View>
            </View>
            <View style={editprofileStyles.detailsMainContainer}>
              <View style={editprofileStyles.detailsVariableContainer}>
                <Text style={editprofileStyles.variableText}>ADDRESS3</Text>
              </View>
              <View style={editprofileStyles.detailsValueContainer}>
                <TextInput
                  defaultValue={this.state.Address3}
                  underlineColorAndroid="transparent"
                  placeholder="Address 3."
                  placeholderTextColor="grey"
                  onChangeText={(add3) => this.setState({ Address3: add3 })}
                  style={editprofileStyles.edittextinputstyle}

                />
              </View>
            </View>
            <View style={editprofileStyles.detailsMainContainer}>
              <View style={editprofileStyles.detailsVariableContainer}>
                <Text style={editprofileStyles.variableText}>CITY</Text>
              </View>
              <View style={editprofileStyles.detailsValueContainer}>
                <TextInput
                  defaultValue={this.state.City}
                  underlineColorAndroid="transparent"
                  placeholder="City."
                  placeholderTextColor="grey"
                  onChangeText={(city) => this.setState({ City: city })}
                  style={editprofileStyles.edittextinputstyle}

                />
              </View>
            </View>
            <View style={editprofileStyles.detailsMainContainer}>
              <View style={editprofileStyles.detailsVariableContainer}>
                <Text style={editprofileStyles.variableText}>WHATSAPP</Text>
              </View>
              <View style={editprofileStyles.detailsValueContainer}>
                <TextInput
                  defaultValue={this.state.Whatsapp}
                  underlineColorAndroid="transparent"
                  placeholder="Whatsapp NO."
                  placeholderTextColor="grey"
                  onChangeText={(whatsapp) => this.setState({ Whatsapp: whatsapp })}
                  style={editprofileStyles.edittextinputstyle}

                />
              </View>
            </View>
            <View style={editprofileStyles.btnContainer}>
              <TouchableOpacity onPress={() => this.saveprofile()} style={editprofileStyles.btn}>
                    <View style={{}}>
                      <Text style={loginStyles.btn_text}>Save</Text>
                    </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}
