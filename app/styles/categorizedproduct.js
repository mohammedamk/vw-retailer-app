import {
    StyleSheet
} from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import { scaleVertical } from '../utils/scale';

let styles = StyleSheet.create({
	mainContainer:{
		flex: 1,
		backgroundColor: '#fafafa'
	},
	settingContainer:{
		flexDirection:'row',
		height:responsiveHeight(4),
		margin:'5%'
	},
	countContainerView:{
		flexDirection:'row',
		borderWidth:2,
		height:responsiveHeight(5),
		width:responsiveWidth(26),
		alignSelf:'center',
		marginHorizontal:responsiveWidth(2)
	},
	countContainerPlus:{
		width:responsiveWidth(10),
		alignItems:'center',
		right:responsiveWidth(2)
	},
	countContainerMinus:{
		width:responsiveWidth(10),
		alignItems:'center'
	},
	countTotal:{
		fontFamily:'OpenSans-Regular',
		fontSize:22,
		color:'black'
	},
	qtyContainer:{
		width:responsiveWidth(8),
		alignItems:'center'
	},
	settingContainerNameContainer:{
		width:responsiveWidth(100),
		flexDirection:'row',
		height:responsiveHeight(4)
	},
	settingproductNameText:{
		fontSize:responsiveFontSize(2.2),
		color:"#af9378"
	},
	settingIconContainer:{
		//alignItems: 'center',
		// alignSelf: 'flex-end',
		right:0,
		width: responsiveWidth(20),
		position: 'absolute'
	},
	productContainer:{
		flexDirection:'row',
		height:responsiveHeight(30),
		marginLeft:'3%',
		marginRight:'3%',
		marginBottom:'3%',
		borderBottomWidth:0.5
	},
	productImageContainer:{
		width:responsiveWidth(35),
		height:responsiveHeight(24),
		borderRadius:5,
		borderWidth:1,
		borderColor:'grey',
		justifyContent:'center',
		alignItems:'center',
		backgroundColor:'transparent'
	},
	productImage:{
		width:responsiveWidth(30),
		minHeight:responsiveHeight(15),
		overflow:"scroll",
		opacity:1,
		maxWidth:'100%',
		maxHeight:'100%',
		padding:0,
		backfaceVisibility:"visible"
	},
	productInfoConatiner:{
		flexDirection:'column',
		padding:'3.5%',
		marginLeft:'2%'
	},
	productCompanyText:{
		fontSize:responsiveFontSize(1.6),
		fontWeight:'bold'
	},
	productNameText:{
		fontSize:responsiveFontSize(2.1),
		fontWeight:'bold'
	},
	amountContainer:{
		marginTop:'3%',
		flexDirection:'row',
		justifyContent:"space-between"
	},
	productPriceText:{
		fontSize:responsiveFontSize(2.5),
		color:'red'
	},
	originalPriceText:{
		marginLeft:'5%',
		fontSize:responsiveFontSize(2.5),
		color:'grey',
		textDecorationLine: 'line-through',
		textDecorationStyle: 'solid'
	},
	addbtncontainer:{
		marginTop:'8%',
		height:responsiveHeight(7)
	},
	addbtn:{
		justifyContent:'center',
		alignItems:'center',
		width:responsiveWidth(35),
		height:responsiveHeight(5.5),
		backgroundColor:'#ffc01d',
		borderRadius:4
	},
	stockbtn:{
		justifyContent:'center',
		alignItems:'center',
		width:responsiveWidth(35),
		height:responsiveHeight(5.5),
		backgroundColor:'#A0A0A0',
		borderRadius:4
	},
	btnText:{
		color:"#ffffff",
		fontSize:responsiveFontSize(1.8),
		fontWeight:'bold'
	}


});

export default styles;
