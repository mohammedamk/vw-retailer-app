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
  FlatList,
  BackHandler
} from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Header } from "../../components";
import { api } from "../../controllers/ApiControllers";
import { checkoutPageStyles } from '../../styles';
import { showAlert, showSpinner, hideSpinner, getuserinfo, renderPaginationFooter } from "../../utils/helper";
import { messages } from '../../utils/errors'
import { StackNavigator, navigation, DrawerNavigator } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import StatusBarPaddingIOS from 'react-native-ios-status-bar-padding';

export class OrderDetail extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      cart_count: 0,
      orderList: [],
      orderdata:'',
      isLoading: true,
      isProdRefreshing: false,
      endOfResults: false,
      emptyList: false,
      startNum: 0,
    }

  }

  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
			this.props.navigation.navigate('order')
			return true;
		})
    this.getNumberCart()
    this.setState({
      orderdata:this.props.navigation.state.params.order_details,
      orderList: this.props.navigation.state.params.order_details.ORDER_ITEM_DETAILS
    }, () => {console.log('From Order Details',this.state.orderdata)})
  }

  componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', () => { })
  }
  
  goToCart() {
		this.props.navigation.navigate('cart', {
			flag: 'orderdetail',
			order_details: this.props.navigation.state.params.order_details
		})
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


  render() {
    var status;
    if (this.state.orderdata.ORDERSTATUS === "0") {
      status = 'Pending'
    } else if (this.state.orderdata.ORDERSTATUS === "1") {
      status = 'Cancelled'
    } else if (this.state.orderdata.ORDERSTATUS === "2") {
      status = 'Rejected'
    } else if (this.state.orderdata.ORDERSTATUS === "3") {
      status = 'Completed'
    }
    return (
      <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#e2e2e2' }}>
        <StatusBar backgroundColor="#ffc01d" barStyle="dark-content" hidden={false} />
        <StatusBarPaddingIOS style={{ backgroundColor: "#ffc01d" }} />
        <Header title={'OrderDetails'} navigation={this.props.navigation} component={this} count={this.state.cart_count} />
        <View style={{ flex: 1, width:responsiveWidth(90),justifyContent:'center',alignItems:'center'}}>
          <View style={{width:responsiveWidth(90),height:responsiveHeight(18),borderRadius:5,backgroundColor:'grey',marginTop:'5%'}}>
            <View style={{width:responsiveWidth(88),height:responsiveHeight(5),alignItems:'flex-end',marginTop:'3%'}}>
              <View style={{height:responsiveHeight(5),width:responsiveWidth(30),backgroundColor:'orange',borderRadius:8,justifyContent:'center',alignItems:'center'}}>
                <Text style={{fontSize:responsiveFontSize(1.9),fontFamily:'Barlow-Bold',color:'#fff'}}>{status}</Text>
              </View>
            </View>
            <View style={{flexDirection:'row',width:responsiveWidth(85),marginLeft:'3%',marginTop:'2%',alignItems:'center'}}>
              <View style={{width:responsiveWidth(45)}}>
                <Text style={{fontSize:responsiveFontSize(2.3),fontWeight:'bold',color:'#fff',fontFamily:'Barlow-Bold'}}>#{this.state.orderdata.ORDERID}</Text>
                <Text style={{fontSize:responsiveFontSize(2),fontWeight:'400',color:'#fff',fontFamily:'Barlow-Regular',marginTop:'1%'}}>{this.state.orderdata.ORDERDATE}</Text>
              </View>
              <View style={{width:responsiveWidth(35),alignItems:'flex-end'}}>
                <Text style={{fontSize:responsiveFontSize(2.3),fontWeight:'bold',color:'#fff',fontFamily:'Barlow-Bold'}}>Rs {this.state.orderdata.ORDERTOTAL}</Text>
                <Text style={{fontSize:responsiveFontSize(2),fontWeight:'400',color:'#fff',fontFamily:'Barlow-Regular',marginTop:'1%'}}>Total Amount</Text>
              </View>
            </View>
          </View>
          <FlatList data={this.state.orderList}
              shouldItemUpdate={(props, nextProps) => {
                return props.item !== nextProps.item
              }}
              extraData={this.props}
              keyExtractor={this._keyExtractor}
              renderItem={item => this.renderorderdetails(item)}
              ItemSeparatorComponent={() => this.separator()}
          />
          
        </View>
      </View>
    )
  }

   _keyExtractor(item, index) {
    return index
  }

   separator = () => (
    <View
      style={{
        backgroundColor: '#000000',
        //marginTop: '2%',
      }}
    />
  );


  renderorderdetails(product) {
    return (
          <View style={{marginTop:'5%',width:responsiveWidth(90),height:responsiveHeight(25),borderRadius:5,backgroundColor:'#fff',marginBottom:'2%'}}>
            <View style={{width:responsiveWidth(80),margin:'3%',borderBottomWidth:0.6}}>
              <Text style={{fontSize:responsiveFontSize(1.9),fontFamily:'Barlow-Bold'}}>{product.item.ITEMNAME}</Text>
            </View>
            <View style={{flexDirection:'row',width:responsiveWidth(90),margin:'3%'}}>
              <View style={{width:responsiveWidth(40)}}>
                <Text style={{fontSize:responsiveFontSize(2),fontFamily:'Barlow-Regular'}}>Quantity</Text>
              </View>
               <View style={{width:responsiveWidth(40),alignItems:'flex-end'}}>
                <Text style={{fontSize:responsiveFontSize(1.8),fontFamily:'Barlow-Regular'}}>{product.item.ORDERITEMQUANTITY}</Text>
              </View>
            </View>
            <View style={{flexDirection:'row',width:responsiveWidth(90),margin:'3%'}}>
              <View style={{width:responsiveWidth(40)}}>
                <Text style={{fontSize:responsiveFontSize(2),fontFamily:'Barlow-Regular'}}>Rate</Text>
              </View>
               <View style={{width:responsiveWidth(40),alignItems:'flex-end'}}>
                <Text style={{fontSize:responsiveFontSize(1.8),fontFamily:'Barlow-Regular'}}>{product.item.ORDERITEMPRICE}</Text>
              </View>
            </View>
            <View style={{flexDirection:'row',width:responsiveWidth(90),margin:'3%'}}>
              <View style={{width:responsiveWidth(40)}}>
                <Text style={{fontSize:responsiveFontSize(2),fontFamily:'Barlow-Regular'}}>Total</Text>
              </View>
               <View style={{width:responsiveWidth(40),alignItems:'flex-end'}}>
                <Text style={{fontSize:responsiveFontSize(1.8),fontFamily:'Barlow-Regular'}}>{product.item.ORDERITEMTOTALPRICE}</Text>
              </View>
            </View>
          </View>
    )
  }
}
