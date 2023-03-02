import {
	StyleSheet
} from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import { scaleVertical } from '../utils/scale';

let styles = StyleSheet.create({

	countContainerView: {
		flexDirection: 'row', borderWidth: 1, height: responsiveHeight(5), width: responsiveWidth(26), alignSelf: 'center', marginHorizontal: responsiveWidth(2)
	},
	countContainerPlus: {
		width: responsiveWidth(10), alignItems: 'center', right: responsiveWidth(2)
	},
	countContainerMinus: {
		width: responsiveWidth(10), alignItems: 'center'
	},
	countTotal: {
		fontFamily: 'OpenSans-Regular', fontSize: 22, color: 'black'
	},
	qtyContainer: {
		width: responsiveWidth(8), alignItems: 'center'
	},
	mainContainer: {
		flex: 1, marginTop: '3%', width: responsiveWidth(90), alignItems: 'center'
	},
	imageContainer: {
		width: responsiveWidth(90), height: responsiveHeight(55), borderWidth: 1, borderRadius: 10, alignItems: 'center', justifyContent: 'center'
	},
	productimage: {
		width: responsiveWidth(85), height: responsiveWidth(75)
	},
	brandImageaddbtnContainer: {
		height: responsiveHeight(10), width: responsiveWidth(90), flexDirection: 'row'
	},
	brandImageContainer: {
		width: responsiveWidth(50), justifyContent: 'flex-start'
	},
	brandImage: {
		width: responsiveWidth(30), height: responsiveWidth(20)
	},
	addbtnContainer: {
		width: responsiveWidth(40), justifyContent: 'flex-end', alignItems: 'flex-end'
	},
	addbtn: {
		height: responsiveHeight(5.5), width: responsiveWidth(30), backgroundColor: '#ffc01d', borderRadius: 5
	},
	btnText: {
		marginTop: '6%', textAlign: 'center', color: '#ffffff', fontSize: 16, fontWeight: 'bold'
	},
	productInfoConatiner: {
		flexDirection: 'column',
		width: responsiveWidth(90)
	},
	productCompanyText: {
		fontSize: responsiveFontSize(1.6),
		fontWeight: 'bold'
	},
	productNameText: {
		fontSize: responsiveFontSize(2.4),
		fontWeight: 'bold'
	},
	amountContainer: {
		marginTop: '3%',
		flexDirection: 'row'
	},
	productPriceText: {
		fontSize: responsiveFontSize(2.5),
		color: 'red'
	},
	originalPriceText: {
		marginLeft: '5%',
		fontSize: responsiveFontSize(2.5),
		color: 'grey',
		textDecorationLine: 'line-through',
		textDecorationStyle: 'solid'
	},
	unitContainer: {
		height: responsiveHeight(15), marginTop: '2%'
	},
	unitHeadingContainer: {
		width: responsiveWidth(90)
	},
	unitHeadingText: {
		fontSize: responsiveFontSize(2.2), fontWeight: '900'
	},
	unitbtnContainer: {
		flexDirection: 'row'
	},
	unitbtn: {
		width: responsiveWidth(30), height: responsiveHeight(8), borderWidth: 0.2, justifyContent: 'center', marginTop: '1%'
	},
	unitbtnTextContainer: {
		justifyContent: 'center', alignItems: 'center'
	},
	unitbtnText: {
		fontSize: responsiveFontSize(1.8)
	},
	descriptionContainer: {
		marginTop: '2%',
		marginBottom: '2%'
	},
	addtocartbtncontainer: {
		height: responsiveHeight(6),
		alignItems: 'center',
	},
	addtocartbtn: {
		height: responsiveHeight(6),
		width: responsiveWidth(49),
		// borderLeftColor: "#fff",
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center',
		borderColor: '#fff',
		backgroundColor: '#ffc01d'
	},
	viewcartbtn: {
		height: responsiveHeight(6),
		width: responsiveWidth(50),
		// borderLeftColor: "#fff",
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center',
		borderColor: '#fff',
		backgroundColor: '#ffc01d'
	},
	addtocartbtn_text: {
		color: '#ffffff',
		fontSize: 16,
		fontWeight: 'bold'
	},
	outofstockbtn: {
		height: responsiveHeight(6),
		width: responsiveWidth(100),
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center',
		borderColor: '#A0A0A0',
		backgroundColor: '#A0A0A0'
	},


});

export default styles;
