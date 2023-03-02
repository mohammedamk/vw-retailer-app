import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
    StatusBar,
    ScrollView
} from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Header } from "../../components";
import { api } from "../../controllers/ApiControllers";
import {checkoutPageStyles } from '../../styles';
import { showAlert, showSpinner, hideSpinner, getuserinfo } from "../../utils/helper";
import { messages } from '../../utils/errors'
import { StackNavigator, navigation, DrawerNavigator } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import StatusBarPaddingIOS from 'react-native-ios-status-bar-padding';

export class OrderConfirm extends React.Component {

  constructor(props) {
    super(props)
    this.state={
      cart_count:0,
      currentuser: '',
      user_id:'',
    }

  }

  async componentDidMount() {
    this.getNumberCart()
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
    showSpinner(this)
    var userParams = {
      "id": this.state.user_id
    }
    let response = await api.callApi(`auth/getCustomerDetails`, 'POST', {requestBody: userParams})
    hideSpinner(this)
    if (response.body.code === 200) {
      this.setState({
        currentuser: response.body.data,
        // username: response.body.data.PARTYNAME
      })
    } else if (response.body === 'undefined') {
      showAlert(messages.alertHeading, 'User Details Doesnot Exist')
    } else {
      showAlert(messages.alertHeading, messages.networkError)
    }
  }

  render() {
    return (
      <View style = {{flex:1,alignItems:'center'}}>
        <StatusBar backgroundColor= "#ffc01d" barStyle="dark-content" hidden = {false}/>
        <StatusBarPaddingIOS style={{backgroundColor: "#ffc01d"}}/>
        <Header title = {'OrderConfirm'} navigation = {this.props.navigation} component={this} count={this.state.cart_count} />
        <View style = {{flex:1,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
          <View style ={{backgroundColor:'#51C079',height:responsiveHeight(10), width:responsiveWidth(16.5),borderRadius:40,justifyContent:'center', alignItems:'center'}}>
            <Image source ={require('../../images/checked-symbol.png')} style = {{width:responsiveWidth(9.5), height: responsiveHeight(5)}}/>
          </View>
          <View style ={{marginTop:10, flexDirection:'column'}}>
            <Text style ={{fontSize:18, color:'#212121', fontFamily:'Montserrat-Bold',textAlign:'center'}}>Your Order Is Confirmed</Text>
            <Text style = {{fontSize:12,textAlign:'center'}}>Thank you for shopping with Smart Retailer!</Text>
            <Text style = {{fontSize:12,textAlign:'center'}}>We have recevied your order and are processing it.</Text>
            <View style ={{flexDirection:'row',justifyContent:'center'}}>
              <Text style = {{fontSize:15,textAlign:'center', color:"#212121"}}>Order ID: </Text>
              <Text style = {{fontSize:15,textAlign:'center', color:'#3d9857'}}>{this.props.navigation.state.params.orderDetails.orderid}</Text>
            </View>
            <View style ={{marginTop:10,alignItems:'center'}}>
              <TouchableOpacity onPress = {() => this.props.navigation.navigate('home')}>
                <View style ={{height:responsiveHeight(5.2),width:responsiveWidth(40),borderWidth:1,justifyContent:'center',alignItems:'center'}}>
                  <Text style ={{fontSize:12,color:'#212121'}}>CONTINUE SHOPPING</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
