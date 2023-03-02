import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  StatusBar,
  ScrollView,
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
import { profileStyles, loginStyles } from '../../styles';
import { showAlert, showSpinner, hideSpinner, getuserinfo } from "../../utils/helper";
import { messages } from '../../utils/errors'
import { StackNavigator, navigation, DrawerNavigator } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import StatusBarPaddingIOS from 'react-native-ios-status-bar-padding';
import { Avatar } from 'react-native-elements';

export class Profile extends React.Component {
  static navigationOptions = {
    title: 'Profile',
    tabBarLabel: "Profile",
    gestureEnabled: true,
    tabBarIcon: ({ focused, tintColor }) => (
      focused ? <FontAwesome name='user' size={24} color={tintColor} /> : <FontAwesome name='user-o' size={24} color={tintColor} />
    ),
  };
  constructor(props) {
    super(props)
    this.state = {
      currentuser: '',
      user_id: '',
      spinnerVisible: false,
      initial:'',
      profile_pic:'',
    }
  }

  async componentDidMount() {
    this.getNumberCart()
    let user_id = await getuserinfo(this)
    if (user_id) {
      this.setState({
        user_id: user_id
      }, () => {
        this.getUserDetails()
      })

    } else {
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
    showSpinner(this)
    var userParams = {
      "id": this.state.user_id
    }
    let response = await api.callApi(`auth/getCustomerDetails`, 'POST', { requestBody: userParams })
    hideSpinner(this)
    if (response.body.code === 200) {
      let title = response.body.data.PARTYNAME;
      this.setState({
        currentuser: response.body.data,
        profile_pic: response.body.data.PROFILEPIC,
        initial:title.charAt(0)
      })
    } else if (response.body === 'undefined') {
      showAlert(messages.alertHeading, 'User Details Doesnot Exist')
    } else {
      showAlert(messages.alertHeading, messages.networkError)
    }
  }

  goToCart() {
		this.props.navigation.navigate('cart', {
			flag: 'profile'})
	}

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar backgroundColor="#ffc01d" barStyle="dark-content" hidden={false} />
        <StatusBarPaddingIOS style={{ backgroundColor: "#ffc01d" }} />
        <Header title={'Profile'} navigation={this.props.navigation} component={this} count={this.state.cart_count} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={profileStyles.mainContainer}>
            <View style={{ height: responsiveHeight(20),marginBottom:'2%' ,
              flexDirection: 'column', alignItems: 'center',
               justifyContent: 'center' }} >
               {this.state.profile_pic ?
                  <Avatar
                  size={100}
                  rounded
                  source={{
                    uri:this.state.profile_pic,
                  }}
                />
                  :
                 <Avatar
                   size={100}
                   rounded
                   title={this.state.initial}
                   titleStyle={{fontSize:responsiveHeight(3.5),fontFamily:'Barlow-Bold'}}
                   overlayContainerStyle={{backgroundColor: '#926f4f'}}
                   activeOpacity={0.7}
                  />
               }
            </View>
            <View style={profileStyles.detailsMainContainer}>
              <View style={profileStyles.detailsVariableContainer}>
                <Text style={profileStyles.variableText}>NAME</Text>
              </View>
              <View style={profileStyles.detailsValueContainer}>
                <Text style={profileStyles.valueText}>{this.state.currentuser.PARTYNAME}</Text>
              </View>
            </View>
            <View style={profileStyles.detailsMainContainer}>
              <View style={profileStyles.detailsVariableContainer}>
                <Text style={profileStyles.variableText}>ADDRESS1</Text>
              </View>
              <View style={profileStyles.detailsValueContainer}>
                <Text style={profileStyles.valueText}>{this.state.currentuser.ADD1}</Text>
              </View>
            </View>
            <View style={profileStyles.detailsMainContainer}>
              <View style={profileStyles.detailsVariableContainer}>
                <Text style={profileStyles.variableText}>ADDRESS2</Text>
              </View>
              <View style={profileStyles.detailsValueContainer}>
                <Text style={profileStyles.valueText}>{this.state.currentuser.ADD2}</Text>
              </View>
            </View>
            <View style={profileStyles.detailsMainContainer}>
              <View style={profileStyles.detailsVariableContainer}>
                <Text style={profileStyles.variableText}>ADDRESS3</Text>
              </View>
              <View style={profileStyles.detailsValueContainer}>
                <Text style={profileStyles.valueText}>{this.state.currentuser.ADD3}</Text>
              </View>
            </View>
            <View style={profileStyles.detailsMainContainer}>
              <View style={profileStyles.detailsVariableContainer}>
                <Text style={profileStyles.variableText}>CITY</Text>
              </View>
              <View style={profileStyles.detailsValueContainer}>
                <Text style={profileStyles.valueText}>{this.state.currentuser.CITY}</Text>
              </View>
            </View>
            <View style={profileStyles.detailsMainContainer}>
              <View style={profileStyles.detailsVariableContainer}>
                <Text style={profileStyles.variableText}>MOBILE</Text>
              </View>
              <View style={profileStyles.detailsValueContainer}>
                <Text style={profileStyles.valueText}>{this.state.currentuser.MOBILENO}</Text>
              </View>
            </View>
            <View style={profileStyles.detailsMainContainer}>
              <View style={profileStyles.detailsVariableContainer}>
                <Text style={profileStyles.variableText}>WHATSAPP</Text>
              </View>
              <View style={profileStyles.detailsValueContainer}>
                <Text style={profileStyles.valueText}>{this.state.currentuser.WHATSUPNO}</Text>
              </View>
            </View>
            <View style={profileStyles.btnContainer}>
              <TouchableOpacity onPress={() => { BackHandler.removeEventListener('hardwareBackPress', () => { }); this.props.navigation.navigate('editprofile', { userdetails: this.state.currentuser }); }} style={profileStyles.btn}>
                <View style={{}}>
                  <Text style={loginStyles.btn_text}>EDIT</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}
