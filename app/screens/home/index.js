import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  StatusBar,
  ScrollView,
  BackHandler,
  FlatList,
  ActivityIndicator,
  TextInput,
  ToastAndroid
} from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { Header, Search } from "../../components";
import { api } from "../../controllers/ApiControllers";
// import {categorizedProductStyles } from '../../styles';
import { showAlert, showSpinner, hideSpinner, getuserinfo } from "../../utils/helper";
import { messages } from '../../utils/errors'
import { StackNavigator, navigation, DrawerNavigator } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import StatusBarPaddingIOS from 'react-native-ios-status-bar-padding';
import { Avatar } from 'react-native-elements';
import Item from '../../utils/item'
import { _themecolor } from '../../components/colors';

export class Home extends React.Component {
  static navigationOptions = {
    title: 'Home',
    tabBarLabel: "Home",
    gestureEnabled: true,
    tabBarIcon: ({ focused, tintColor }) => (
      focused ? <MaterialCommunityIcons name='home' size={28} color={tintColor} /> : <MaterialCommunityIcons name='home-outline' size={28} color={tintColor} />
    ),
  };

  constructor(props) {
    super(props)

    this.state = {
      brand: false,
      category: false,
      brandButtonDisabled: true,
      categoryList: [],
      brandList: [],
      isCatRefreshing: false,
      isBrandRefreshing: false,
      isCatLoading: true,
      isBrandLoading: true,
      selectedCategory: '',
      searchVisible: false,
      searchText: '',
      brandstate : '',
      backPressed:0,

    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', () => { })
  }

  componentDidMount() {
    var flag =  ''
    // console.log(this.props.navigation.state, 'test')
    if(this.props.navigation.state.params) {
      flag = this.props.navigation.state.params.flag
    }


    this.getNumberCart()
    BackHandler.addEventListener('hardwareBackPress', () => {
      if(this.state.brand){
        this.getcategory();
        return true;
      }else{
        if(this.state.backPressed > 0){
               BackHandler.exitApp();
               this.state.backPressed = 0;
       }else {
           this.state.backPressed++;
           ToastAndroid.show("Press Again To Exit", ToastAndroid.SHORT);
           setTimeout( () => { this.state.backPressed = 0}, 2000);
           return true;
       }
      // BackHandler.exitApp()
      // return true;
    }
    })
    this.setState({
      category: true,
      brand: false
    })
    this.getcategoryData()
    if(flag == 'from_brands') {
      console.log("in mount back",this.props.navigation.state.params.code)
      // this.setState({
      //   brand :true
      // });
      if(this.props.navigation.state.params.code) {
        var cat = {
          CATEGORYCODE: this.props.navigation.state.params.code
        }
        this.getbrand(cat)
        
      } else {
        this.getbrand('')
        
      }
      
    }
    // this.getBrandData()
  }

  componentWillReceiveProps(props) {
    console.log('sa', props.navigation.state)
    if(props.navigation.state.params.flag === 'from_brands') {
      console.log("in recieve back")
      this.getbrand(props.navigation.state.params.code)
    }
    this.getcategoryData()
    // this.getBrandData()
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

  async getcategoryData() {
    let response = await api.callApi('home/category', "GET", {});
    if (response.body.code === 200) {
      this.setState({
        categoryList: response.body.categories,
        isCatLoading: false
      })
    } else if (response.body.code === 100) {
      this.setState({
        isCatLoading: false,
        categoryList: response.body.categories,

      })
    }
    console.log(response)
  }

  async getBrandData(cat) {
    let brandsParams = {
      "categorycode": cat.CATEGORYCODE
    }
    let response = await api.callApi('home/getBrandsByCategory', "POST", { requestBody: brandsParams });
    if (response.body.code === 200) {

      this.setState({
        isBrandLoading: false,
        brandList: response.body.brands,
        selectedCategory: {
          name: cat.CATEGORYNAME,
          code: cat.CATEGORYCODE
        },

      })
    } else if (response.body.code === 100) {
      this.setState({
        isBrandLoading: false,
        brandList: response.body.brands,
        selectedCategory: {
          name: cat.CATEGORYNAME,
          code: cat.CATEGORYCODE
        }
      })
    }
    console.log(response)
  }

  getcategory() {
    this.setState({
      category: true,
      brand: false,
      brandList: [],
      isBrandLoading: true
    })
  }

  getbrand(cat) {
    if (cat) {
      this.setState({
        category: false,
        brand: true
      }, () => {
        this.getBrandData(cat)
      })
    }
    else {
      // alert("Poop")
      this.setState({
        category: false,
        brand: true
      }, () =>
      fetch('http://139.59.56.122/poc/home/brand', {
        method: "GET",
      }).then((response) => response.json()).then((reponseJson) =>{
      console.log(reponseJson)
      this.setState({
        isBrandLoading: false,
      brandList: reponseJson.brands,
      selectedCategory: {
          name: '',
          code: ''
        },
    })}
      ))
    }
  }

  _keyExtractorCat(item, index) {
    return index
  }

  _keyExtractorBrand(item, index) {
    return index
  }

  renderCatList(item) {
    // console.log(item)
    return (
      <View style={{ flexDirection: 'column', height: responsiveHeight(24), marginRight: '5%' }}>
        <TouchableOpacity onPress={() => { BackHandler.removeEventListener('hardwareBackPress', () => { }); this.props.navigation.navigate('categorizedproduct', { categoryCode: item.item.CATEGORYCODE, brandCode: '', brandName: '', categoryName: item.item.CATEGORYNAME, flag: "from_category" }) }}>
          <Avatar
            size={115}
            rounded
            source={{ uri: item.item.URL }}
            avatarStyle={{}}
            containerStyle={{ borderWidth: 0.3 }}
            imageProps={{}}
          // titleStyle={{fontSize:responsiveHeight(3.5),fontFamily:'Barlow-Bold'}}
          // overlayContainerStyle={{backgroundColor: '#926f4f'}}
          // activeOpacity={0.7}
          />
          <View style={{ width: responsiveWidth(28), height: responsiveHeight(7), justifyContent: 'center', alignItems: 'center', justifyContent: 'center', alignItems: 'center' }}>
            {item.item.CATEGORYNAME &&
              <Text style={{ fontFamily: 'Barlow-Regular', fontSize: responsiveFontSize(1.8), color: '#94704f' }}>
                {(item.item.CATEGORYNAME).charAt(0) + ((item.item.CATEGORYNAME).toLowerCase()).slice(1)}
              </Text>
            }
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  renderBrandList(item) {
    return (
      // <TouchableOpacity onPress={() => this.props.navigation.navigate('categorizedproduct')} style={{ height: responsiveHeight(18), width: responsiveWidth(32), justifyContent: 'center', alignItems: 'center' }}>
      //   <Image source={{uri: item.item.URL}} style={{ width: responsiveWidth(28), height: responsiveHeight(18) }} resizeMode='contain' />
      // </TouchableOpacity>
      <View style={{ flexDirection: 'column', height: responsiveHeight(24), marginRight: '5%' }}>
        <TouchableOpacity onPress={() => { BackHandler.removeEventListener('hardwareBackPress', () => { }); this.props.navigation.navigate('categorizedproduct', { categoryCode: this.state.selectedCategory.code, brandCode: item.item.BRANDCODE, brandName: item.item.BRANDNAME, categoryName: this.state.selectedCategory.name, flag: "from_brands" }) }}>
          <Avatar
            size={115}
            rounded
            source={{ uri: item.item.URL }}
            avatarStyle={{}}
            containerStyle={{ borderWidth: 0.3 }}
            imageProps={{}}
          // titleStyle={{fontSize:responsiveHeight(3.5),fontFamily:'Barlow-Bold'}}
          // overlayContainerStyle={{backgroundColor: '#926f4f'}}
          // activeOpacity={0.7}
          />
          <View style={{ width: responsiveWidth(28), height: responsiveHeight(7), justifyContent: 'center', alignItems: 'center', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontFamily: 'Barlow-Regular', fontSize: responsiveFontSize(1.8), color: '#94704f' }}>{(item.item.BRANDNAME).charAt(0) + ((item.item.BRANDNAME).toLowerCase()).slice(1)}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  separator = () => (
    <View
      style={{
        backgroundColor: '#000000',
        // marginTop: '1%',
        // marginBottom: '0.8%',
        // paddingBottom: '0.2%',
        paddingLeft: '5%',
        borderBottomWidth: 0.2,
        width: responsiveWidth(88),
        alignSelf: 'center'
        //margin: '0.1%',
      }}
    />
  );

  onCatRefresh() {
    this.setState({ isCatRefreshing: true, categoryList: [] }, async () => {
      await this.getcategoryData()
      this.setState({ isCatRefreshing: false })
    })
  }

  onBrandRefresh() {
    this.setState({ isBrandRefreshing: true, brandList: [] }, async () => {
      this.getBrandData()
      this.setState({ isBrandRefreshing: false })
    })
  }

  renderEmptyListText(item) {
    return (
      <View style={{ flex: 1, alignItems: 'center', marginTop: '50%', backgroundColor: '#fff' }}>
        <Text style={{}}>No Records</Text>
      </View>
    )
  }

  change(text) {
    this.setState({
      searchText: text
    })

    this.search(text)
  }

  search(key) {
    var arr;
    if (this.state.category) {
      arr = this.state.categoryList
    } else if (this.state.brand) {
      arr = this.state.brandList
    }
    if (key === '') {
      if (this.state.category) {
        this.getcategoryData()
      } else if (this.state.brand) {
        var t = {
          CATEGORYCODE: this.state.selectedCategory.code,
          CATEGORYNAME: this.state.selectedCategory.name
        }
        this.getBrandData(t)
      }
    }
    var searchprod = this.searchStringInArray(key, arr);
    if (this.state.category) {
      this.setState({
        categoryList: searchprod
      })
    } else if (this.state.brand) {
      this.setState({
        brandList: searchprod
      })
    }
  }

  searchStringInArray(str, strArray) {
    const regex = new RegExp(`${str.trim()}`, 'i');
    var result = strArray.filter(product => {
      var name;
      if (this.state.category) {
        name = product.CATEGORYNAME
      } else if (this.state.brand) {
        name = product.BRANDNAME
      }
      return name.search(regex) >= 0
    });
    return result;
  }

  renderSearch() {
    return (
      <View style={{ height: responsiveHeight(8), marginTop: 0, marginBottom: '2%', backgroundColor: _themecolor, flexDirection: 'row', borderTopWidth: 1, borderColor: '#fff', alignItems: 'center' }}>
        <TextInput
          //value= {this.state.s}
          style={{ color: '#000', marginLeft: 10, height: responsiveHeight(5.5), width: responsiveWidth(88), backgroundColor: 'white', borderRadius: 3, paddingLeft: 15, fontSize: responsiveFontSize(2), fontFamily: 'Montserrat-Regular', borderWidth: 1, borderColor: '#7A7A7A' }}
          placeholder="Search"
          placeholderTextColor="#000"
          placeholderTextStyle={{ paddingTop: '10%' }}
          underlineColorAndroid='transparent'
          onChangeText={(search) => this.change(search)}
          editable={true}
          secureTextEntry={false}
          onSubmitEditing={() => this.search(this.state.searchText)}
          onEndEditing={() => this.search(this.state.searchText)}
        />
        <TouchableOpacity onPress={() => { this.setState({ searchVisible: !this.state.searchVisible }); this.getcategoryData() }} style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 9 }} >
          <MaterialCommunityIcons name="close-circle-outline" size={20} color="#af9378" />
        </TouchableOpacity>
      </View>
    );
  }

  goToCart() {
    this.props.navigation.navigate('cart', {flag: 'home'})
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor="#ffc01d" barStyle="dark-content" hidden={false} />
        <StatusBarPaddingIOS style={{ backgroundColor: "#ffc01d" }} />
        <Header title={'Home'} navigation={this.props.navigation} component={this} count={this.state.cart_count} search={true} />
        {this.state.searchVisible && this.renderSearch()}
        <View style={{ flexDirection: 'row', height: responsiveHeight(7), backgroundColor: _themecolor, justifyContent: 'center', alignItems: 'center' }}>
          {this.state.category ?
            <TouchableOpacity onPress={() => this.getcategory()} style={{ width: responsiveWidth(50), justifyContent: 'center', alignItems: 'center', borderRadius: 5, backgroundColor: '#fff', height: responsiveHeight(10) }}>
              <Text style={{ fontSize: responsiveFontSize(2.5), color: '#94704f', fontWeight: '400', fontFamily: 'Barlow-Regular' }}>CATEGORY</Text>
            </TouchableOpacity> :
            <TouchableOpacity onPress={() => this.getcategory()} style={{ width: responsiveWidth(50), justifyContent: 'center', alignItems: 'center', borderRadius: 5, height: responsiveHeight(10) }}>
              <Text style={{ fontSize: responsiveFontSize(2.5), color: '#94704f', fontWeight: '400', fontFamily: 'Barlow-Regular' }}>CATEGORY</Text>
            </TouchableOpacity>
          }
          {this.state.brand ?
            <TouchableOpacity onPress={() => this.getbrand()} style={{ width: responsiveWidth(50), justifyContent: 'center', alignItems: 'center', borderRadius: 5, backgroundColor: '#fff', height: responsiveHeight(10) }}>
              <Text style={{ fontSize: responsiveFontSize(2.5), color: '#94704f', fontWeight: '400', fontFamily: 'Barlow-Regular' }}>BRANDS</Text>
            </TouchableOpacity> :
            <TouchableOpacity onPress={() => this.getbrand()} style={{ width: responsiveWidth(50), justifyContent: 'center', alignItems: 'center', borderRadius: 5, height: responsiveHeight(10) }}>
              <Text style={{ fontSize: responsiveFontSize(2.5), color: '#94704f', fontWeight: '400', fontFamily: 'Barlow-Regular' }}>BRANDS</Text>
            </TouchableOpacity>
          }
        </View>
        {this.state.category ?
          <ScrollView>
            {this.state.isCatLoading ? <View style={{ flex: 1, alignItems: 'center', marginTop: '50%', backgroundColor: '#fff' }}><ActivityIndicator color="#ffc01d" size={35}></ActivityIndicator></View> : <FlatList data={this.state.categoryList}
              shouldItemUpdate={(props, nextProps) => {
                return props.item !== nextProps.item
              }}
              extraData={this.props}
              renderItem={item => this.renderCatList(item)}
              keyExtractor={this._keyExtractorCat}
              numColumns={3}
              columnWrapperStyle={{ paddingLeft: '3%', marginTop: '2%' }}
              style={{ marginTop: '5%' }}
              ItemSeparatorComponent={() => this.separator()}
              ListEmptyComponent={this.renderEmptyListText(this)}
              onRefresh={() => this.onCatRefresh()}
              refreshing={this.state.isCatRefreshing}
            />}
          </ScrollView> :
          <ScrollView>
            {this.state.isBrandLoading ? <View style={{ flex: 1, alignItems: 'center', marginTop: '50%', backgroundColor: '#fff' }}><ActivityIndicator color="#ffc01d" size={35}></ActivityIndicator></View> : <FlatList data={this.state.brandList}
              shouldItemUpdate={(props, nextProps) => {
                return props.item !== nextProps.item
              }}
              extraData={this.props}
              renderItem={item => this.renderBrandList(item)}
              keyExtractor={this._keyExtractorBrand}
              numColumns={3}
              columnWrapperStyle={{ paddingLeft: '3%', marginTop: '2%' }}
              style={{ marginTop: '5%' }}
              ItemSeparatorComponent={() => this.separator()}
              ListEmptyComponent={this.renderEmptyListText(this)}
              // ListFooterComponent={renderPaginationFooter(this)}
              // onEndReached={(info: { distanceFromEnd: number }) => this.prepareForPagination()}
              // onEndReachedThreshold={0.1}
              onRefresh={() => this.onBrandRefresh()}
              refreshing={this.state.isBrandRefreshing}
            />}
          </ScrollView>
        }
      </View>
    )
  }
}
