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

export class Order extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      cart_count: 0,
      orderList: [],
      isLoading: true,
      isRefreshing: false,
      endOfResults: false,
      emptyList: false,
      startNum: 0,
    }

  }

  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
			this.props.navigation.goBack()
			return true;
		})
    this.getNumberCart()
    this.getOrders()
  }

  componentWillUnmount(){
		BackHandler.removeEventListener('hardwareBackPress', () => { })
  }
  
  goToCart() {
    this.props.navigation.navigate('cart', {
      flag: 'order'
    })
  }

  async getOrders() {
    let user_id = await getuserinfo(this)
    let orderParams = {
      "userid": user_id,
      "start": this.state.startNum,
      "length": 10
    }
    let response = await api.callApi('home/getOrderHistory', "POST", { requestBody: orderParams });
    if (response.body.code === 200) {
      this.setState({
        orderList: this.state.orderList.concat(response.body.orders),
        isLoading: false
      })
      if(response.body.orders.length === 0) {
        this.setState({
          endOfResults: true
        })
      }
    } else if (response.body.code === 100) {
      this.setState({
        orderList: response.body.orders,
        isLoading: false,

      })
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

  _keyExtractor(item, index) {
    return index
  }

  onProdRefresh() {
    this.setState({ isRefreshing: true, endOfResults: false, startNum:0, orderList: [], isLoading: true }, async () => {
      await this.getOrders()
      this.setState({ isRefreshing: false })
    })
  }

  prepareForPagination() {
    this.setState({
      startNum: this.state.startNum + 10
    }, () => {
      if (this.state.endOfResults === false) {
        this.getOrders()
      }
    })
  }

  renderEmptyListText(item) {
    return (
      <View style={{ alignItems: 'center', marginTop: responsiveHeight(40), backgroundColor: '#e2e2e2' }}>
        <Text style={{}}>No Records</Text>
      </View>
    )
  }

  separator = () => (
    <View
      style={{
        backgroundColor: '#000000',
        marginTop: '2%',
        // marginBottom: '0.8%',
        // paddingBottom: '0.2%',
        // paddingLeft: '5%',
        // borderBottomWidth: 0.2,
        // width: responsiveWidth(88),
        // alignSelf: 'center'
        //margin: '0.1%',
      }}
    />
  );

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#e2e2e2' }}>
        <StatusBar backgroundColor="#ffc01d" barStyle="dark-content" hidden={false} />
        <StatusBarPaddingIOS style={{ backgroundColor: "#ffc01d" }} />
        <Header title={'OrderConfirm'} navigation={this.props.navigation} component={this} count={this.state.cart_count} />
        {this.state.isLoading ? <View style={{ flex: 1, alignItems: 'center', marginTop: '50%', backgroundColor: '#e2e2e2' }}><ActivityIndicator color="#ffc01d" size={35}></ActivityIndicator></View> : <FlatList data={this.state.orderList}
          shouldItemUpdate={(props, nextProps) => {
            return props.item !== nextProps.item
          }}
          extraData={this.props}
          keyExtractor={this._keyExtractor}
          renderItem={item => this.renderproducts(item)}
          ListEmptyComponent={this.renderEmptyListText(this)}
          onRefresh={() => this.onProdRefresh()}
          refreshing={this.state.isRefreshing}
          ItemSeparatorComponent={() => this.separator()}
          ListFooterComponent={renderPaginationFooter(this)}
          onEndReached={(info: { distanceFromEnd: number }) => this.prepareForPagination()}
          onEndReachedThreshold={0.1}
        />}
      </View>
    )
  }

  renderproducts(product) {
    var status;
    if (product.item.ORDERSTATUS === "0") {
      status = 'Pending'
    } else if (product.item.ORDERSTATUS === "1") {
      status = 'Cancelled'
    } else if (product.item.ORDERSTATUS === "2") {
      status = 'Rejected'
    } else if (product.item.ORDERSTATUS === "3") {
      status = 'Completed'
    }
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('orderdetail',{order_details:product.item})} style={{ marginTop: '2%', padding: '3%', width: responsiveWidth(90), height: responsiveHeight(20), borderRadius: 5, backgroundColor: '#fff' }}>
        <View style={{ width: responsiveWidth(80), borderBottomWidth: 0.4, height: responsiveHeight(5) }}>
          <Text style={{ fontSize: responsiveFontSize(1.8), fontFamily: 'Barlow-Bold' }}>{product.item.ORDERDATE}</Text>
        </View>
        <View style={{ width: responsiveWidth(80), flexDirection: 'row', marginTop: '2%' }}>
          <View style={{ width: responsiveWidth(30) }}>
            <Text style={{ fontSize: responsiveFontSize(2.3), fontFamily: 'Barlow-Bold' }}>Order #{product.item.ORDERID}</Text>
          </View>
          <View style={{ width: responsiveWidth(50), alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row' }}>
            <MaterialCommunityIcons name="truck-delivery" size={25} color="black" />
            <Text style={{ fontSize: responsiveFontSize(1.8), fontFamily: 'Barlow-Bold', marginLeft: '5%' }}>{status}</Text>
          </View>
        </View>
        <View style={{ width: responsiveWidth(80), marginTop: '5%', flexDirection: 'row' }}>
          <View style={{ width: responsiveWidth(50) }}>
            <Text style={{ fontSize: responsiveFontSize(1.8), fontFamily: 'Barlow-Bold' }}> Items (x)  {product.item.ORDER_ITEM_DETAILS.length}</Text>
          </View>
          <View style={{ width: responsiveWidth(30), alignItems: 'flex-end' }}>
            <Text style={{ fontSize: responsiveFontSize(1.8), fontFamily: 'Barlow-Bold' }}> Total  Rs:{product.item.ORDERTOTAL}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}
