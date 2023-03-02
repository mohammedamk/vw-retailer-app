import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  StatusBar,
  ScrollView,
  TextInput,
  FlatList,
  BackHandler
} from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { Header } from "../../components";
import { api } from "../../controllers/ApiControllers";
import { productPageStyles } from '../../styles';
import { showAlert, showSpinner, hideSpinner, getuserinfo } from "../../utils/helper";
import { messages } from '../../utils/errors'
import { StackNavigator, navigation, DrawerNavigator } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import StatusBarPaddingIOS from 'react-native-ios-status-bar-padding';
import Item from '../../utils/item'
import Toast from 'react-native-easy-toast'
import { _themecolor } from '../../components/colors';

export class Cart extends Component {
  constructor(props) {
    super(props)
    this.state ={
      cart_count:0,
      emptyCart:false,
      cararr:[],
      productArray: '',
      iscartRefreshing:false,
      item: '',
      totalva: '',
    }
  }

  componentDidMount() {
    var flag =  ''
    // console.log(this.props.navigation.state, 'test')
    if(this.props.navigation.state.params) {
      flag = this.props.navigation.state.params.flag
    }
    BackHandler.addEventListener('hardwareBackPress', () => {
      if(flag === 'categorizedproduct') {
        this.props.navigation.navigate(flag, {categoryCode: this.props.navigation.state.params.categoryCode, brandCode: this.props.navigation.state.params.brandCode, categoryName: this.props.navigation.state.params.categoryName, brandname: this.props.navigation.state.params.brandname })
      } else if(flag === 'productpage') {
        this.props.navigation.navigate(flag, {itemcode: this.props.navigation.state.params.itemcode, categoryCode: this.props.navigation.state.params.categoryCode, brandCode: this.props.navigation.state.params.brandCode, brandName: this.props.navigation.state.params.brandName, categoryName: this.props.navigation.state.params.categoryName})
      }else if(flag === 'orderdetail') {
        this.props.navigation.navigate(flag, {order_details: this.props.navigation.state.params.order_details})
      } else {
        this.props.navigation.navigate(flag)
      }
			
			return true;
		})
    this.getCartDetails();
    this.getNumberCart();
  }

  componentWillMount() {

  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', () => { })
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
          cart_count: tmppro.length,
          productArray: tmppro
        })
      } else {
        this.setState({
          cart_count: 0
        })
      }
    }).done()
  }

   getCartDetails() {
    var tmpprod = {}
    AsyncStorage.getItem('Retailer_cart').then((value) => {
      if (value == null) {
        tmpprod = null
        this.setState({
          emptyCart: true
        })
      } else {
        tmpprod = JSON.parse(value)
        var pro = Object.keys(tmpprod).map((key) => {
          return (tmpprod[key])
        })
        if (pro.length === 0) {
          this.setState({
            emptyCart: true
          })
        } else {
          this.setState({
            emptyCart: false,
            cararr: pro
          })
        }
        this.rendertotal(pro)
      }
    }).done()
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor="#ffc01d" barStyle="dark-content" hidden={false} />
        <StatusBarPaddingIOS style={{ backgroundColor: "#ffc01d" }} />
        <Toast ref="toast" />
        <Header title={'CartPage'} navigation={this.props.navigation} component={this} count={this.state.cart_count} />
        <View style={{height: responsiveHeight(75)}}>
            {!this.state.emptyCart ? <FlatList data={this.state.cararr}
              shouldItemUpdate={(props, nextProps) => {
                return props.item !== nextProps.item
              }}
              extraData={this.props}
              keyExtractor={this._keyExtractor}
              renderItem={item => this.rendercartitems(item)}
              ListEmptyComponent={this.renderEmptyListText(this)}
              onRefresh={() => this.oncartRefresh()}
              refreshing={this.state.iscartRefreshing}
              />:
              <View style={{ alignItems: 'center', justifyContent: 'center', height: responsiveHeight(75) }}>
              <Text style={{ fontFamily: 'Barlow-Regular', fontSize: responsiveFontSize(2), color: 'black' }}>Your cart is empty!</Text>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('home')} style={{ height: responsiveHeight(6), marginTop: 10, width: responsiveWidth(40), backgroundColor: '#ffc01d', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                <Text style={{ fontFamily: 'Barlow-Regular', fontSize: responsiveFontSize(2), color: '#ffffff' }}>Continue Shopping</Text>
              </TouchableOpacity>
            </View>
          }
          
        </View>
       {this.state.emptyCart===false && <View style={{ height: responsiveHeight(10), backgroundColor: _themecolor, flexDirection: 'row' }}>
                 <View style={{ width: responsiveWidth(60), flexDirection: 'column' }} >
                   <View style={{ height: responsiveHeight(5), justifyContent: 'flex-end' }}>
                     <Text style={{ fontSize: responsiveFontSize(3), color: '#926f4f', fontFamily: 'Barlow-Bold', paddingLeft: 10 }}>Total Rs {Math.round(this.state.totalva)}</Text>
                   </View>
                   <View style={{ height: responsiveHeight(5), justifyContent: 'center' }}>
                     <Text style={{ fontSize: responsiveFontSize(2.2), color: '#926f4f', fontFamily: 'Barlow-Light', paddingLeft: 10 }}>({this.state.item} items)</Text>
                   </View>
                 </View>
                 <View style={{ height: responsiveHeight(10), width: responsiveWidth(40), alignItems: 'center', justifyContent: 'center' }}>
                   <TouchableOpacity onPress={() => this.createLineItem()} style={{ height: responsiveHeight(5), width: responsiveWidth(30), backgroundColor: '#ffc01d', alignItems: 'center', justifyContent: 'center',borderRadius: 5 }}>
                     <Text style={{ fontSize: responsiveFontSize(2.2), color: '#ffffff', fontFamily: 'Barlow-Regular' }} >Continue</Text>
                   </TouchableOpacity>
                 </View>
               </View>}
      </View>
    )
  }

  rendercartitems(product) {
    const prod = product.item.node
    const amount = parseInt(product.item.node.MRP);
    console.log(amount,product)
    return(
          <View style={{ flexDirection: 'column' }} >
            <View style={{ height: responsiveHeight(34), flexDirection: 'row', backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#e2e2e2', marginTop: 10 }}>
              <View style={{ height: responsiveHeight(34), width: responsiveWidth(38), alignItems: 'center', justifyContent: 'center', marginLeft: 10 }}>
                <Image source={{uri:product.item.node.URL}} style={{ height: responsiveHeight(30), width: responsiveWidth(37), alignSelf: 'center' }} resizeMode="contain" />
              </View>
              <View style={{ flexDirection: 'column', width: responsiveWidth(60) }}>
                <View style={{ height: responsiveHeight(5), marginLeft: 10, marginTop: 10 }}>
                  <Text numberOfLines={1} style={{ fontSize: responsiveFontSize(2), color: 'black', fontFamily: 'Barlow-Regular' }}>{prod.ITEMNAME}</Text>
                </View>
                <View style={{ height: responsiveHeight(5), marginLeft: 10 }}>
                  <Text numberOfLines={1} style={{ fontFamily: 'Barlow-Regular', fontSize: responsiveFontSize(1.8), color: 'black' }}>{prod.BRANDNAME}</Text>
                </View>
                <View style={{ height: responsiveHeight(5), flexDirection: 'row', marginLeft: 8 }}>
                  <Entypo name='check' color='green' size={20} />
                  <Text style={{ fontFamily: 'Barlow-Regular', fontSize: responsiveFontSize(1.8), color: 'green', paddingLeft: 5 }} >In Stock {prod.STOCK} Units Left</Text>
                </View>
                <View style={{ height: responsiveHeight(5), flexDirection: 'row', marginLeft: 8 }}>
                  <TouchableOpacity onPress={() => this.deleteItem(product.item)} style={{ flexDirection: 'row' }}>
                    <MaterialIcons name='delete' color='grey' size={20} />
                    <Text style={{ fontFamily: 'Barlow-Regular', fontSize: responsiveFontSize(1.8), color: 'grey', paddingLeft: 5 }} >Remove</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ alignItems: 'flex-start', justifyContent: 'center', marginLeft: 10 }}>
                    <Text style={{ fontFamily: 'Barlow-Bold', fontSize: responsiveFontSize(2), color: '#b12704', }}>Rs {Math.round(((amount) * product.item.quantity).toFixed(2))}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <View style={{ flexDirection: 'row', backgroundColor: '#e2e2e2', borderRadius: 5, height: responsiveHeight(5), width: responsiveWidth(30), alignSelf: 'flex-start', marginLeft: 10 }}>
                    <TouchableOpacity onPress={() => { this.minusValue(product.item) }}>
                      <View style={{ width: responsiveWidth(10), alignItems: 'center', paddingTop: 3, }}>
                        <Entypo name='minus' size={23} color='black' style={{ paddingTop: 0 }} />
                      </View>
                    </TouchableOpacity>
                    <View style={{ width: responsiveWidth(8), alignItems: 'center', paddingTop: 3, }}>
                      <Text style={{ fontFamily: 'Barlow-Regular', fontSize: responsiveFontSize(2.5), color: 'black', }}>{product.item.quantity}</Text>
                    </View>
                    <TouchableOpacity onPress={() => { this.addValue(product.item) }}>
                      <View style={{ width: responsiveWidth(10), alignItems: 'center', paddingTop: 3, }}>
                        <Ionicons name='md-add' size={23} color='black' style={{ paddingTop: 0 }} />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
      )
  }

  createLineItem(){
			// this.popupDialog.show();
		var lineItems = new Array();
		var product = this.state.productArray;
		//alert(JSON.stringify(product));
		Object.keys(product).map(function(key) {
			var pro = {
				"product_id" : product[key].variant_id,
        "quantity" : product[key].quantity,
        "price" : product[key].node.MRP,
        "product_name" : product[key].node.ITEMNAME
			}
			lineItems.push(pro);
    })
    console.log(lineItems)
		this.props.navigation.navigate('checkoutform', {line_items: lineItems, totalAmt: Math.round(this.state.totalva)});
	}

  _keyExtractor(item, index) {
    return index
    }

  oncartRefresh() {
      this.setState({ iscartRefreshing: true, cararr: [] }, async () => {
        await this.getCartDetails()
        this.setState({ iscartRefreshing: false })
      })
  }

  renderEmptyListText(item){
      return(
       <View style={{flex:1,alignItems:'center',marginTop:'50%', backgroundColor: 'transparent'}}>
           <Text style={{}}>No Records</Text>
       </View>
       )
  }

  deleteItem(product){
    this.refs.toast.show('Removed from cart', 500)
    var tmppro = {};
    AsyncStorage.getItem("Retailer_cart").then((value) => {
      if(value != null)
      {
      tmppro = JSON.parse(value);
      console.log(tmppro)
      }
      if(tmppro!=null && tmppro[product.variant_id]){
        delete tmppro[product.variant_id];
         AsyncStorage.removeItem("Retailer_cart");
         AsyncStorage.setItem("Retailer_cart", JSON.stringify(tmppro));
      }
    }).done(() => {AsyncStorage.getItem("Retailer_cart").then((value) => {
        if(value == ''){
          var tmppro1 = JSON.parse(value);
          this.setState({
            cararr:[] ,
          });
          //this.rendertotal(value);
          //this.renderNot();
        }else{
          var tmpproduct = JSON.parse(value);
          var tmppro = Object.keys(tmpproduct).map(function(key) {
            return(tmpproduct[key])
          });
          this.setState({
            cararr: tmppro,
          });
          this.rendertotal(tmppro);
        }
      }).done(() => {this.getNumberCart(); this.getCartDetails()})});
  }

  addValue(product){
    var tmppro = {};
    AsyncStorage.getItem("Retailer_cart").then((value) => {
      if(value != null)
      {
      tmppro = JSON.parse(value);
      }
      if(tmppro!=null && tmppro[product.variant_id]){
        var tmpdic = tmppro[product.variant_id];
        if(tmpdic.quantity === parseInt(product.node.STOCK)){
          tmpdic.quantity = tmpdic.quantity;
        }
        else{
          tmpdic.quantity = tmpdic.quantity + 1;
        }
        tmppro[product.variant_id] = tmpdic;
        AsyncStorage.mergeItem("Retailer_cart", JSON.stringify(tmppro));
      }
    }).done(()=> {AsyncStorage.getItem("Retailer_cart").then((value) => {
      var tmpproduct = JSON.parse(value);
      var tmppro = Object.keys(tmpproduct).map(function(key) {
        return(tmpproduct[key])
      });
      this.setState({
        cararr: tmppro,
      });
      this.rendertotal(tmppro);
      this.getNumberCart();
    }).done()});
  }

  minusValue(product){
    var tmppro = {};
    AsyncStorage.getItem("Retailer_cart").then((value) => {
      if(value != null)
      {
      tmppro = JSON.parse(value);
      }
      if(tmppro != null && tmppro[product.variant_id]){
        var tmpdic = tmppro[product.variant_id];
        if(tmpdic.quantity === 1){
          tmpdic.quantity = 1;
        }else{
          tmpdic.quantity = tmpdic.quantity - 1;
        }
        tmppro[product.variant_id] = tmpdic;
        AsyncStorage.mergeItem("Retailer_cart", JSON.stringify(tmppro));
      }
    }).done(()=> {AsyncStorage.getItem("Retailer_cart").then((value) => {
      var tmpproduct = JSON.parse(value);
      var tmppro = Object.keys(tmpproduct).map(function(key) {
        return(tmpproduct[key])
      });
      this.setState({
        cararr: tmppro,
      });
       this.rendertotal(tmppro);

      this.getNumberCart();
    }).done()});
  }

  rendertotal(product){
  
    if(product == ''){
      this.setState({
        item: 0,
        totalva: 0,
      })
    }
    if(product == null){
      this.setState({
        item: 0,
        totalva: 0,
      })
    }else{
        var add=0,total = 0;
        for(var i = 0; i< product.length; i++){
          var quantity = product[i].quantity;

          var price = product[i].node.MRP;
          total = quantity*price;
          add=add+total;
          this.setState({
            totalva: (add).toFixed(2)
          });
        }
        this.setState({
          item: product.length,
        })
        //alert("totalamount:- "+JSON.stringify(this.state.totalva))
      }
  }
}
