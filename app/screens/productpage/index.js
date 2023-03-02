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
	BackHandler
} from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import { Header } from "../../components";
import { api } from "../../controllers/ApiControllers";
import { productPageStyles } from '../../styles';
import { showAlert, showSpinner, hideSpinner, getuserinfo, findWithAttr } from "../../utils/helper";
import { messages } from '../../utils/errors'
import { StackNavigator, navigation, DrawerNavigator } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import StatusBarPaddingIOS from 'react-native-ios-status-bar-padding';
import ModalDropdown from 'react-native-modal-dropdown';
import Toast from 'react-native-easy-toast'
import Item from '../../utils/item'
import { categorizedProductStyles } from '../../styles';


export class ProductPage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			product: '',
			variants: [],
			qntyOption: '',
			oldProps: '',
			selectqty: 1,
			price: 0,
			cart_count: 0,
			stocklimit: '',
			currentQty: 1,
			finalprice: 0
		}
	}

	componentDidMount() {
		console.log('tes', this.props.navigation.state.params.categoryCode, this.props.navigation.state.params.brandCode)
		BackHandler.addEventListener('hardwareBackPress', () => {
			this.props.navigation.navigate('categorizedproduct', { categoryCode: this.props.navigation.state.params.categoryCode, brandCode: this.props.navigation.state.params.brandCode, brandName: this.props.navigation.state.params.brandName, categoryName: this.props.navigation.state.params.categoryName })
			return true;
		})
		this.getNumberCart();
		this.getProduct(this.props.navigation.state.params.itemcode)
	}

	goToCart() {
		this.props.navigation.navigate('cart', {
			flag: 'productpage',
			itemcode: this.props.navigation.state.params.itemcode,
			categoryCode: this.props.navigation.state.params.categoryCode, brandCode: this.props.navigation.state.params.brandCode, brandName: this.props.navigation.state.params.brandName, categoryName: this.props.navigation.state.params.categoryName
		})
	}

	async componentWillReceiveProps(props) {
		console.log(props.navigation.state.params.itemcode)
		this.setState({
			product: '',
			variants: [],
			qntyOption: '',
			selectqty: 1,
			price: 0,
		})
		this.getNumberCart();
		await this.getProduct(props.navigation.state.params.itemcode)
		// if ()
		this.refs.qtydropdown.select(-1);
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', () => { })
	}

	async getProduct(id) {
		this.setState({
			oldProps: this.props.navigation.state.params.itemcode
		})
		let productParams = {
			"itemcode": id
		}
		let response = await api.callApi('home/getSingleProductDetails', "POST", { requestBody: productParams });
		console.log(response)
		if (response.body.code === 200) {
			const qty = parseInt(response.body.product.STOCK);
			// if(qty > 0){
			// 	this.refs.qtydropdown.select(-1);
			// }
			var mrp =0;
			if(response.body.product.MRP != null){
				mrp = response.body.product.MRP
			}
			this.setState({
				product: response.body.product,
				variants: response.body.varients,
				price: parseFloat(mrp).toFixed(2),
				stocklimit: parseInt(response.body.product.STOCK)

			}, () => {
				console.log('price',this.state.price)
				var qnty = [];
				for (var i = 1; i <= qty; i++) {
					qnty.push(i);
				}
				this.setState({
					qntyOption: qnty
				})
				var name = this.state.product.ITEMNAME;
				var variant = this.state.variants.filter(function (item) {
					return item.ITEMNAME === name;
				});
				var variantPosition = findWithAttr(this.state.variants, 'ITEMNAME', this.state.product.ITEMNAME);
				this.state.variants.splice(variantPosition, 1)
				this.state.variants.splice(0, 0, variant[0])
				this.setState({
					variants: this.state.variants
				})
			})
		}
	}

	componentWillUnmount() {

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

	on_select_quanty(idx, value) {
		this.setState({
			selectqty: value
		}, function () {
			this.multiplyvalue()
		})

	}

	addValue() {
		if (this.state.product.STOCK == this.state.currentQty) {
			this.setState({
				currentQty: this.state.currentQty,
			}, function () {
				this.multiplyValue();
				console.log("Multiply Product Value")
			});
		} else {
			this.setState({
				currentQty: this.state.currentQty + 1,
			}, function () {
				this.multiplyValue();
				console.log("Multiply Product Value")
			});
		}


	}

	multiplyValue() {
		var amount = this.state.price;
		this.setState({
			finalprice: this.state.currentQty * amount,
		});
	}

	minusValue() {
		this.setState({
			currentQty: this.state.currentQty - 1,
		}, function () {
			console.log("Divide Product Value")
			this.multiplyValue();
		});
		if (this.state.currentQty === 1) {
			this.setState({
				currentQty: 1,
			});
		}
	}

	multiplyvalue() {
		var price = ((this.state.product.MRP) * this.state.selectqty).toFixed(2);
		console.log('Price',price,this.state.product.MRP,this.state.selectqty)
		this.setState({
			price: parseFloat(price)
		})
	}




	render() {
		var navProp = this.props
		return (
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				<StatusBar backgroundColor="#ffc01d" barStyle="dark-content" hidden={false} />
				<StatusBarPaddingIOS style={{ backgroundColor: "#ffc01d" }} />
				<Header title={'ProductPage'} navigation={this.props.navigation} component={this} count={this.state.cart_count} />
				<ScrollView showsVerticalScrollIndicator={false}>
					<View style={productPageStyles.mainContainer}>
						<View style={productPageStyles.imageContainer}>
							<Image style={productPageStyles.productimage} resizeMode="contain" source={{ uri: this.state.product.URL }} />
						</View>
						<View style={productPageStyles.brandImageaddbtnContainer}>
							<View style={productPageStyles.brandImageContainer}>
								<Image style={productPageStyles.brandImage} resizeMode="contain" source={{ uri: this.state.product.BRAND_URL }} />
							</View>
						</View>
						<View style={productPageStyles.productInfoConatiner}>
							<View style={{}}>
								<Text style={productPageStyles.productCompanyText}>{this.state.product.BRANDNAME}</Text>
							</View>
							<View style={{}}>
								<Text style={productPageStyles.productNameText}>{this.state.product.ITEMNAME}</Text>
							</View>
							<View style={productPageStyles.amountContainer}>
								<Text style={productPageStyles.productPriceText}>Rs. {this.state.price}</Text>
								{/* <Text style={productPageStyles.originalPriceText}>Rs. 43</Text> */}
							</View>
						</View>
						{this.state.stocklimit > 0 ? <View style={{ height: responsiveHeight(5), flexDirection: 'row', marginTop: '2%', left: 0, alignItems: 'flex-start', width: responsiveWidth(90) }}>
							<Entypo name='check' color='green' size={20} />
							<Text style={{ fontFamily: 'Barlow-Regular', fontSize: responsiveFontSize(1.8), color: 'green', paddingLeft: 5 }} >In Stock {this.state.product.STOCK} Units Left</Text>
						</View>:<View style={{ height: responsiveHeight(5), flexDirection: 'row', marginTop: '2%', left: 0, alignItems: 'flex-start', width: responsiveWidth(90) }}>
							<Entypo name='check' color='red' size={20} />
							<Text style={{ fontFamily: 'Barlow-Regular', fontSize: responsiveFontSize(1.8), color: 'red', paddingLeft: 5 }} >In Stock {this.state.product.STOCK} Units Left</Text>
						</View>}
						<View style={productPageStyles.unitContainer}>
							<View style={productPageStyles.unitHeadingContainer}>
								<Text style={productPageStyles.unitHeadingText}>Unit</Text>
							</View>
							<ScrollView horizontal={true} style={productPageStyles.unitbtnContainer}>
								{this.state.variants.map(function (variant, index) {
									var color = ''
									var textColor = ''
									if (index === 0) {
										color = '#ffc01d'
										textColor = '#fff'
									}
									return (
										<TouchableOpacity onPress={() => navProp.navigation.navigate('productpage', { itemcode: variant.ITEMCODE })} style={[productPageStyles.unitbtn, { backgroundColor: color }]}>
											<View style={productPageStyles.unitbtnTextContainer}>
												<Text style={[productPageStyles.unitbtnText, { color: textColor }]}>{variant.PACKING}</Text>
												<Text style={[productPageStyles.unitbtnText, { color: textColor }]}>Rs.{variant.MRP}</Text>
											</View>
										</TouchableOpacity>
									)
								})}

								{/* <TouchableOpacity style={productPageStyles.unitbtn}>
									<View style={productPageStyles.unitbtnTextContainer}>
										<Text style={productPageStyles.unitbtnText}>5kg</Text>
										<Text style={productPageStyles.unitbtnText}>Rs.176</Text>
									</View>
								</TouchableOpacity> */}
							</ScrollView>
						</View>
						{this.state.stocklimit > 1 && <View style={[productPageStyles.unitContainer, { backgroundColor: 'transparent' }]}>
							<View style={[productPageStyles.unitHeadingContainer, { flexDirection: "row", alignItems: "center" }]}>
								<Text style={productPageStyles.unitHeadingText}>QTY</Text>
								<View style={[productPageStyles.amountContainer, { right: 0, position: "absolute" }]}>
									<Text style={productPageStyles.productPriceText}>Total. {this.state.finalprice}</Text>
								</View>
								<View style={productPageStyles.countContainerView}>
									<TouchableOpacity onPress={() => this.minusValue()}>
										<View style={productPageStyles.countContainerMinus}>
											<AntDesign name='minus' size={25} color='black' style={{ paddingTop: 2 }} />
										</View>
									</TouchableOpacity>
									<View style={productPageStyles.qtyContainer}>
										<Text style={productPageStyles.countTotal}>
											{this.state.currentQty}
										</Text>
									</View>
									<TouchableOpacity onPress={() => this.addValue()}>
										<View style={productPageStyles.countContainerPlus}>
											<Ionicons name='md-add' size={25} color='black' style={{ paddingTop: 2 }} />
										</View>
									</TouchableOpacity>
								</View>
							</View>
							<View style={productPageStyles.unitbtnContainer}>
								<ModalDropdown
									ref={'qtydropdown'}
									style={{
										width: responsiveWidth(30),
										display: "none",
										backgroundColor: 'white', height: responsiveHeight(6), borderRadius: 3, margin: '5%', borderWidth: 0.6
									}}
									textStyle={{ fontFamily: 'Barlow-Regular', fontSize: responsiveFontSize(1.7), color: '#000', paddingTop: 8.5, paddingLeft: 5 }}
									defaultValue={this.state.qntyOption[0]}
									dropdownStyle={{ width: responsiveWidth(30), marginTop: 10, backgroundColor: '#e2e2e2' }}
									dropdownTextStyle={{ color: '#000', fontSize: responsiveFontSize(1.7), fontFamily: 'Barlow-Regular', paddingLeft: 10, backgroundColor: '#fff' }}
									options={this.state.qntyOption}
									onSelect={(idx, value) => this.on_select_quanty(idx, value)}
								/>
							</View>
						</View>}
						<View style={productPageStyles.descriptionContainer}>
							<View style={productPageStyles.unitHeadingContainer}>
								<Text style={[productPageStyles.unitHeadingText, { borderBottomWidth: 0.6 }]}>Description</Text>
							</View>
							<View style={{ width: responsiveWidth(80), marginTop: '2%' }}>
								<Text style={{ fontSize: responsiveFontSize(1.8), lineHeight: 20, textAlign: 'justify' }}>{this.state.product.DESCRIPTION !== ' ' ? this.state.product.DESCRIPTION : 'No description'}
								</Text>
							</View>
						</View>
					</View>
				</ScrollView>
				<Toast ref="toast" />
				<View style={productPageStyles.addtocartbtncontainer}>
					{this.state.stocklimit != 0 && <View style={{flexDirection: 'row'}}><TouchableOpacity onPress={() => this.addToCart(this.state.product)} style={productPageStyles.addtocartbtn} >
						<Text style={productPageStyles.addtocartbtn_text} >Add to Cart</Text>
					</TouchableOpacity><TouchableOpacity onPress={() => this.goToCart()} style={productPageStyles.viewcartbtn} >
						<Text style={productPageStyles.addtocartbtn_text} >View Cart</Text>
					</TouchableOpacity></View>
					}
					{this.state.stocklimit == 0 && <TouchableOpacity disabled={true} style={productPageStyles.outofstockbtn} >
						<Text style={productPageStyles.addtocartbtn_text} >Out Of Stock</Text>
					</TouchableOpacity>
					}
				</View>
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

				if (tmpQuantity === parseInt(products.STOCK)) {
					product.quantity = tmpQuantity
				} else {
					if ((tmpQuantity + this.state.currentQty) > parseInt(products.STOCK)) {
						product.quantity = products.STOCK
					} else {
						product.quantity = tmpQuantity + this.state.currentQty
					}
				}
				tmpCartDictionary[product.variant_id] = product
				AsyncStorage.mergeItem('Retailer_cart', JSON.stringify(tmpCartDictionary))
			} else {
				if (tmpCartDictionary == null) {
					tmpCartDictionary = {}
				}

				console.log("temp dict didn't had data")
				product.quantity = this.state.currentQty
				tmpCartDictionary[product.variant_id] = product
				AsyncStorage.setItem('Retailer_cart', JSON.stringify(tmpCartDictionary))
			}
		}).done(() => { this.getNumberCart() })
		console.log('After set item to cart:- ' + JSON.stringify(tmpCartDictionary))
		// console.log('After set item to cart:- ' + JSON.stringify(tmpCartDictionary))
	}
}
