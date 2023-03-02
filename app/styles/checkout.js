import {
    StyleSheet
} from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import { scaleVertical } from '../utils/scale';
import { _themecolor } from '../components/colors';

let styles = StyleSheet.create({

	mainContainer:{
		flex: 1,alignItems:'center',backgroundColor:'#eee'
	},
	headingContainer:{
		flexDirection:'row',marginTop:'2%',width:responsiveWidth(90),height:responsiveHeight(7),justifyContent:'center',alignItems:'center'
	},
	locationicon:{
		width:responsiveWidth(10)
	},
	addressTextContainer:{
		width:responsiveWidth(40),alignItems:'flex-start'
	},
	addressContainer:{
		width:responsiveWidth(90),height:responsiveHeight(18),backgroundColor:'white',borderRadius:5
	},
	paymentContainer:{
		width:responsiveWidth(90),height:responsiveHeight(15),backgroundColor:'white',borderRadius:5,borderColor:'#e3892c',borderWidth:1
	},
	amountContainer:{
		position:'absolute',bottom:'0.1%', height: responsiveHeight(10), backgroundColor: _themecolor, flexDirection: 'row'
	 }
});

export default styles;
