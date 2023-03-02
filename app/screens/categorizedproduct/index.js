import React, { Component } from 'react';
import {
	View,
	Text,
	Image,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	FlatList,
	BackHandler,
	ActivityIndicator
} from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Header } from "../../components";
import { api } from "../../controllers/ApiControllers";
import { categorizedProductStyles } from '../../styles';
import { showAlert, showSpinner, hideSpinner, getuserinfo, compareValues } from "../../utils/helper";
import { messages } from '../../utils/errors'
import Item from '../../utils/item'
import Toast from 'react-native-easy-toast'
import AsyncStorage from "@react-native-community/async-storage";
import Modal, { ModalContent, ModalTitle } from 'react-native-modals';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import ModalDropdown from 'react-native-modal-dropdown';
import { _themecolor } from '../../components/colors';

var radio_props = [
	{ label: 'Price Low to High', value: 0 },
	{ label: 'Price High to Low', value: 1 },
	{ label: 'A To Z', value: 2 },
	{ label: 'Z To A', value: 3 }
];

export class CategorizedProduct extends Component {

	constructor(props) {
		super(props)
		this.state = {
			prodList: [],
			catcode: '',
			brandcode: '',
			catname: '',
			brandname: '',
			cart_count: 0,
			isProdRefreshing: false,
			isLoading: true,
			searchVisible: false,
			searchText: '',
			modalVisible: false,
			radioSelected: '',
			// amount:0,
			quantity:1
		}
	}

	componentDidMount() {
		this.getNumberCart()
		console.log('test', this.props.navigation.state.params.categoryName, this.props.navigation.state.params.brandname)
		this.setState({
			catcode: this.props.navigation.state.params.categoryCode,
			brandcode: this.props.navigation.state.params.brandCode,
			catname: this.props.navigation.state.params.categoryName,
			brandname: this.props.navigation.state.params.brandname
		}, () => {
			console.log(this.props.navigation.state.params.categoryCode, this.props.navigation.state.params.brandCode)
			this.getProductData()
		})
		// this.getProductData();
		BackHandler.addEventListener('hardwareBackPress', () => {
			this.props.navigation.navigate('home', { flag: this.props.navigation.state.params.flag,code:this.state.catcode })
			return true;
		})
	}

	goToCart() {
		this.props.navigation.navigate('cart', {flag: 'categorizedproduct', categoryCode: this.state.catcode, brandCode: this.state.brandcode, categoryName: this.state.catcode, brandname: this.state.brandname })
	  }

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', () => { })
	}

	// componentWillReceiveProps(props) {
	//    	this.setState({
	//       catcode: this.props.navigation.state.params.categoryCode,
	//       brandcode: this.props.navigation.state.params.brandCode
	//     }, () => {
	//       this.getProductData()
	//     })
	//  }

	async getProductData() {
		// console.log("Props", this.props)
		let brandsParams = {
			"categorycode": this.state.catcode,
			"brandcode": this.state.brandcode
		}
		let response = await api.callApi('home/getFilteredProducts', "POST", { requestBody: brandsParams });
		if (response.body.code === 200) {
			this.setState({
				// prodList: response.body.products,
				isLoading: false
			})
		}
		var arr = []
		response.body.products.map(function (data) {
			var tdata = data
			tdata.selectedQty = 1
			arr.push(tdata)
		})
		this.setState({
			prodList: arr
		})
		await AsyncStorage.setItem('product_data', JSON.stringify(arr))
		console.log(response)
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

	callFilter(val) {
		this.setState({
			modalVisible: false
		})
		if (val === 0) {
			this.state.prodList.sort(compareValues('MRP'))
		} else if (val === 1) {
			this.state.prodList.sort(compareValues('MRP', 'desc'))
		} else if (val === 2) {
			this.state.prodList.sort(compareValues('ITEMNAME'))
		} else if (val === 3) {
			this.state.prodList.sort(compareValues('ITEMNAME', 'desc'))
		}
	}

	change(text) {
		this.setState({
			searchText: text
		})

		this.search(text)
	}

	search(key) {
		if (key === '') {
			this.getProductData()
		}
		var searchprod = this.searchStringInArray(key, this.state.prodList);
		this.setState({
			prodList: searchprod
		})
	}

	searchStringInArray(str, strArray) {
		const regex = new RegExp(`${str.trim()}`, 'i');
		var result = strArray.filter(product => product.ITEMNAME.search(regex) >= 0);
		return result;
	}

	addValue(product) {
		var tempro;
		AsyncStorage.getItem("product_data").then(async (value) => {
			if(value != null)
			{
				tempro = JSON.parse(value);
			}
			if(tempro!=null){
				var tempdic = tempro.filter(o=>o.ITEMCODE === product.ITEMCODE)
				console.log(tempdic[0].selectedQty, product.STOCK)
				if(tempdic[0].selectedQty === parseInt(product.STOCK)) {
					tempdic[0].selectedQty = tempdic[0].selectedQty
				} else {
					tempdic[0].selectedQty = tempdic[0].selectedQty + 1
				}
				var objIndex = tempro.findIndex((obj => obj.ITEMCODE == product.ITEMCODE));
				console.log(objIndex);
				tempro[objIndex] = tempdic[0]
				console.log(tempro);
				await AsyncStorage.setItem('product_data', JSON.stringify(tempro))
				this.setState({
					prodList: tempro
				})
			}
		})
		// this.setState({
		// 	quantity: this.state.quantity + 1,
		// }, function () {
		// 	// this.multiplyValue();
		// 	console.log("Multiply Product Value")
		// });

	}

	multiplyValue() {
		var amount = this.props.navigation.state.params.userData.product.price;
		this.setState({
			amountChange: this.state.quantity * amount,
		});
	}

	minusValue(product) {
		var tempro;
		AsyncStorage.getItem("product_data").then(async (value) => {
			if(value != null)
			{
				tempro = JSON.parse(value);
			}
			if(tempro!=null){
				var tempdic = tempro.filter(o=>o.ITEMCODE === product.ITEMCODE)
				console.log(tempdic[0].selectedQty)
				if(tempdic[0].selectedQty === 1) {
					tempdic[0].selectedQty = 1
				} else {
					tempdic[0].selectedQty = tempdic[0].selectedQty - 1
				}
				var objIndex = tempro.findIndex((obj => obj.ITEMCODE == product.ITEMCODE));
				console.log(objIndex);
				tempro[objIndex] = tempdic[0]
				console.log(tempro);
				await AsyncStorage.setItem('product_data', JSON.stringify(tempro))
				this.setState({
					prodList: tempro
				})
			}
		})
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
				<TouchableOpacity onPress={() => { this.setState({ searchVisible: !this.state.searchVisible }); this.getProductData() }} style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 9 }} >
					<MaterialCommunityIcons name="close-circle-outline" size={20} color="#af9378" />
				</TouchableOpacity>
			</View>
		);

	}

	render() {
		return (
			<View style={categorizedProductStyles.mainContainer}>
				<Header navigation={this.props.navigation} count={this.state.cart_count} component={this} search={true} />
				{this.state.searchVisible && this.renderSearch()}
				<View style={categorizedProductStyles.settingContainer}>
					<View style={categorizedProductStyles.settingContainerNameContainer}>
						<Text style={categorizedProductStyles.settingproductNameText}>{this.props.navigation.state.params.categoryName}</Text>
						<Feather name="chevrons-right" size={20} color="#af9378" style={{ margin: '1%', paddingLeft: '1%' }} />
						<Text style={categorizedProductStyles.settingproductNameText}>{this.props.navigation.state.params.brandName}</Text>
						<View style={categorizedProductStyles.settingIconContainer}>
							<TouchableOpacity onPress={() => this.setState({ modalVisible: !this.state.modalVisible })}>
								<FontAwesome name="sliders" size={25} color="#af9378" />
							</TouchableOpacity>
						</View>
					</View>

				</View>
				{this.state.isLoading ? <View style={{ flex: 1, alignItems: 'center', marginTop: '50%', backgroundColor: '#fafafa' }}><ActivityIndicator color="#ffc01d" size={35}></ActivityIndicator></View> : <FlatList data={this.state.prodList}
					shouldItemUpdate={(props, nextProps) => {
						return props.item !== nextProps.item
					}}
					extraData={this.props}
					keyExtractor={this._keyExtractor}
					renderItem={item => this.renderproducts(item)}
					ListEmptyComponent={this.renderEmptyListText(this)}
					onRefresh={() => this.onProdRefresh()}
					refreshing={this.state.isProdRefreshing}
				/>}
				<Toast ref="toast" />
				<Modal.BottomModal
					visible={this.state.modalVisible}
					onTouchOutside={() => this.setState({ modalVisible: false })}
					height={0.3}
					width={1}
					onSwipeOut={() => this.setState({ modalVisible: false })}
					modalTitle={
						<ModalTitle
							title="Filter"
							hasTitleBar
						/>
					}
				>
					<ModalContent
						style={{
							flex: 1,
							backgroundColor: 'fff',
						}} TouchableOpacity
					>
						<RadioForm
							radio_props={radio_props}
							initial={-1}
							buttonColor={'#ffc01d'}
							isSelected={false}
							selectedButtonColor={'#af9378'}
							onPress={(value) => {
								this.callFilter(value)
								this.setState({ radioSelected: value })
							}}
						/>
					</ModalContent>
				</Modal.BottomModal>
			</View >
		)
	}

	_keyExtractor(item, index) {
		return index
	}


	renderproducts(products) {
		var quantity = 1;
		// this.setState({quantity: quantity})
		return (
			<View style={categorizedProductStyles.productContainer}>
				<TouchableOpacity onPress={() => this.props.navigation.navigate('productpage', { itemcode: products.item.ITEMCODE, brandCode: this.state.brandcode, categoryCode: this.state.catcode, brandName: this.state.brandname, categoryName: this.state.catname })} style={categorizedProductStyles.productImageContainer}>
					<Image style={categorizedProductStyles.productImage} resizeMode="contain" source={{ uri: products.item.image }} />
				</TouchableOpacity>
				<View style={categorizedProductStyles.productInfoConatiner}>
					<TouchableOpacity onPress={() => this.props.navigation.navigate('productpage', { itemcode: products.item.ITEMCODE, brandCode: this.state.brandcode, categoryCode: this.state.catcode, brandName: this.state.brandname, categoryName: this.state.catname })} style={{}}>
						<Text style={categorizedProductStyles.productCompanyText}>{products.item.BRANDNAME}</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => this.props.navigation.navigate('productpage', { itemcode: products.item.ITEMCODE, brandCode: this.state.brandcode, categoryCode: this.state.catcode, brandName: this.state.brandname, categoryName: this.state.catname })} style={{ width: responsiveWidth(45) }}>
						<Text numberOfLines={2} style={categorizedProductStyles.productNameText}>{products.item.ITEMNAME}</Text>
					</TouchableOpacity>
					{products.item.STOCK > 0 ? <View style={{flexDirection: 'row' }}>
						<Entypo name='check' color='green' size={20} />
						<Text style={{ fontFamily: 'Barlow-Regular', fontSize: responsiveFontSize(1.8), color: 'green', paddingLeft: 5 }} >In Stock {products.item.STOCK} Units Left</Text>
					</View>:<View style={{flexDirection: 'row' }}>
						<Entypo name='check' color='red' size={20} />
						<Text style={{ fontFamily: 'Barlow-Regular', fontSize: responsiveFontSize(1.8), color: 'red', paddingLeft: 5 }} >In Stock {products.item.STOCK} Units Left</Text>
					</View>}
					<View style={categorizedProductStyles.amountContainer}>
						<Text style={categorizedProductStyles.productPriceText}>Rs. {products.item.MRP}</Text>
					{products.item.STOCK > 0 &&	<View style={categorizedProductStyles.countContainerView}>
							<TouchableOpacity onPress={() => this.minusValue(products.item)}>
								<View style={categorizedProductStyles.countContainerMinus}>
									<Entypo name='minus' size={25} color='black' style={{ paddingTop: 2 }} />
								</View>
							</TouchableOpacity>
							<View style={categorizedProductStyles.qtyContainer}>
								<Text style={categorizedProductStyles.countTotal}>
									{products.item.selectedQty}
								</Text>
							</View>
							<TouchableOpacity onPress={() => this.addValue(products.item)}>
								<View style={categorizedProductStyles.countContainerPlus}>
									<Ionicons name='md-add' size={25} color='black' style={{ paddingTop: 2 }} />
								</View>
							</TouchableOpacity>
						</View>}
						{/* <Text style={categorizedProductStyles.originalPriceText}>Rs. 119.99</Text> */}
					</View>
					<View style={categorizedProductStyles.addbtncontainer}>
						{products.item.STOCK > 0 ? <TouchableOpacity onPress={() => this.addToCart(products.item)} style={categorizedProductStyles.addbtn}>
							<Text style={categorizedProductStyles.btnText}>ADD</Text>
						</TouchableOpacity> : <TouchableOpacity disabled={true} style={categorizedProductStyles.stockbtn}>
								<Text style={categorizedProductStyles.btnText}>Out of Stock</Text>
							</TouchableOpacity>}
					</View>
				</View>
			</View>

		)
	}

	onProdRefresh() {
		this.setState({ isProdRefreshing: true, prodList: [], isLoading: true }, async () => {
			await this.getProductData()
			this.setState({ isProdRefreshing: false })
		})
	}

	renderEmptyListText(item) {
		return (
			<View style={{ flex: 1, alignItems: 'center', marginTop: '50%', backgroundColor: 'transparent' }}>
				<Text style={{}}>No Records</Text>
			</View>
		)
	}


	addToCart(products) {
		//console.log(products);
		this.refs.toast.show('Added to cart', 500)
		var product = new Item()
		product.node = products
		product.variant_id = products.ITEMCODE

		var tmpCartDictionary = {}


		AsyncStorage.getItem('Retailer_cart').then((value) => {
			if (value != null) {
				tmpCartDictionary = JSON.parse(value)
			}
			if (tmpCartDictionary != null && tmpCartDictionary[product.variant_id]) {

				var tmpQuantity = (tmpCartDictionary[product.variant_id]).quantity
				console.log((tmpCartDictionary[product.variant_id]));

				if (tmpQuantity === parseInt(products.STOCK)) {
					product.quantity = tmpQuantity
				} else {
					product.quantity = tmpQuantity + products.selectedQty
				}
				tmpCartDictionary[product.variant_id] = product
				AsyncStorage.mergeItem('Retailer_cart', JSON.stringify(tmpCartDictionary))
			} else {
				if (tmpCartDictionary == null) {
					tmpCartDictionary = {}
				}

				console.log("temp dict didn't had data")
				product.quantity = products.selectedQty
				tmpCartDictionary[product.variant_id] = product
				AsyncStorage.setItem('Retailer_cart', JSON.stringify(tmpCartDictionary))
			}
		}).done(() => { this.getNumberCart() })
		console.log('After set item to cart:- ' + JSON.stringify(tmpCartDictionary))
		// console.log('After set item to cart:- ' + JSON.stringify(tmpCartDictionary))
	}

}
