import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
    StatusBar,
    ScrollView,
    ActivityIndicator,
    BackHandler
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

export class Checkout extends React.Component {

  constructor(props) {
    super(props)
    this.state={
      cart_count:0,
      currentuser: '',
      user_id:'',
      spinnerVisible: false
    }

  }

  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.navigate('cart')
      return true;
    })
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
    // showSpinner(this)
    var userParams = {
      "id": this.state.user_id
    }
    let response = await api.callApi(`auth/getCustomerDetails`, 'POST', {requestBody: userParams})
    // hideSpinner(this)
    if (response.body.code === 200) {
      this.setState({
        currentuser: response.body.data,
        // username: response.body.data.PARTYNAME
      },() => {
        console.log(this.state.currentuser)
      })

    } else if (response.body === 'undefined') {
      showAlert(messages.alertHeading, 'User Details Doesnot Exist')
    } else {
      showAlert(messages.alertHeading, messages.networkError)
    }
  }

  async createOrder() {
    showSpinner(this)
    let orderParams = {
      "userid": this.state.currentuser.PARTYCODE,
      "cart_items": this.props.navigation.state.params.line_items
    }
    let response = await api.callApi(`home/createOrder`, 'POST', {requestBody: orderParams})
    hideSpinner(this)
    if(response.body.code === 200) {
      AsyncStorage.removeItem('Retailer_cart')
      this.props.navigation.navigate('orderconfirm', {orderDetails: response.body})
    } else {
      
    }
  }

  render() {
    return (
      <View style = {checkoutPageStyles.mainContainer}>
        <StatusBar backgroundColor= "#ffc01d" barStyle="dark-content" hidden = {false}/>
        <StatusBarPaddingIOS style={{backgroundColor: "#ffc01d"}}/>
        <Header title = {'Checkout'} navigation = {this.props.navigation} component={this} count={this.state.cart_count} />
        <View style={checkoutPageStyles.headingContainer}>
          <View style={checkoutPageStyles.locationicon}>
            <EvilIcons name="location" size={30} color="#af9378" />
          </View>
          <View style={checkoutPageStyles.addressTextContainer}>
           <Text style={{fontSize:responsiveFontSize(2),fontFamily:'Barlow-Bold',color:'#af9378'}}>Delivery Address</Text>
          </View>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('editprofile', {userdetails: this.state.currentuser})} style={{width:responsiveWidth(40),alignItems:'flex-end'}}>
            <Feather name="edit" size={25} color="#af9378" />
          </TouchableOpacity>
        </View>
        <View style={checkoutPageStyles.addressContainer}>
          <View style={{padding:'5%',height:responsiveHeight(5)}}>
            <Text numberOfLines={3} style={{fontSize:responsiveFontSize(2),fontFamily:'Barlow-Regular'}}>{this.state.currentuser.ADD1}, {this.state.currentuser.ADD2}, {this.state.currentuser.ADD3}</Text>
          </View>
          <View style={{padding:'5%',marginTop:'1%'}}>
            <Text style={{fontSize:responsiveFontSize(2),fontFamily:'Barlow-Regular'}}>{this.state.currentuser.PARTYNAME}</Text>
            <Text style={{fontSize:responsiveFontSize(2),fontFamily:'Barlow-Regular'}}>{this.state.currentuser.MOBILENO}</Text>
          </View>
        </View>
        <View style={checkoutPageStyles.headingContainer}>
          <View style={{width:responsiveWidth(10)}}>
            <MaterialIcons name="payment" size={25} color="#af9378" />
          </View>
          <View style={{width:responsiveWidth(80),alignItems:'flex-start'}}>
           <Text style={{fontSize:responsiveFontSize(2),fontFamily:'Barlow-Bold',color:'#af9378'}}>Payment Method</Text>
          </View>
        </View>
        <View style={checkoutPageStyles.paymentContainer}>
          <View style={{padding:'5%'}}>
            <Text style={{fontSize:responsiveFontSize(2),fontFamily:'Barlow-Bold'}}>Cash On Delivery</Text>
          </View>
          <View style={{paddingLeft:'5%',marginTop:'2%'}}>
            <Text style={{fontSize:responsiveFontSize(1.6),fontFamily:'Barlow-Regular'}}>Please keep the exact amount.</Text>
          </View>
        </View>
        <View style={checkoutPageStyles.amountContainer}>
           <View style={{ width: responsiveWidth(60), flexDirection: 'column' }} >
             <View style={{ padding:'1%', justifyContent: 'flex-end' }}>
               <Text style={{ fontSize: responsiveFontSize(2.2), color: '#926f4f', fontFamily: 'Barlow-Regular', paddingLeft: 10 }}>Amount Payable</Text>
             </View>
             <View style={{ padding:'1%', justifyContent: 'center' }}>
               <Text style={{ fontSize: responsiveFontSize(2.6), color: '#926f4f', fontFamily: 'Barlow-Bold', paddingLeft: 10 }}>Rs: {Math.round(this.props.navigation.state.params.totalAmt)}</Text>
             </View>
           </View>
           <View style={{ height: responsiveHeight(10), width: responsiveWidth(40), alignItems: 'center', justifyContent: 'center' }}>
             <TouchableOpacity onPress={() => this.createOrder()} style={{ height: responsiveHeight(5), width: responsiveWidth(30), backgroundColor: '#ffc01d', alignItems: 'center', justifyContent: 'center',borderRadius: 5 }}>
             {
							this.state.spinnerVisible
								? <ActivityIndicator size="small" color="#fff" />
								: <View style={{}}>
									<Text style={{ fontSize: responsiveFontSize(2.2), color: '#ffffff', fontFamily: 'Nunito-Regular' }} >Place Order</Text>
								</View>
						}
               
             </TouchableOpacity>
           </View>
        </View>
      </View>
    )
  }
}
