import {
    StyleSheet
} from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import { scaleVertical } from '../utils/scale';

let styles = StyleSheet.create({

	basic_logo_container:{
		justifyContent:'center',
		alignItems:'center',
		height:responsiveHeight(40)
	},
	basic_logo:{
		height:responsiveHeight(25),
		width:responsiveWidth(65)
	},
	mainTitleContainer:{
		justifyContent:'center',
		// height:responsiveHeight(12),
		alignItems:'center',
		width:responsiveWidth(100)
	},
	mainTitleText:{
		fontSize:responsiveFontSize(4),
		color:'#94704f',
		fontFamily: 'Barlow-Bold'
	},
	subtitleContainer:{
		justifyContent:'center',
		alignItems:'center',
		width:responsiveWidth(100)
	},
	subtitleinnerContainer:{
		width:responsiveWidth(70)
	},
	subtitle_text:{
		fontSize:responsiveFontSize(1.9),
		color:'#94704f',
		textAlign:'center',
		// lineHeight:30,
		fontFamily: 'Barlow-Regular'
	},
	btnConatiner:{
		justifyContent:'center'
		,alignItems:'center',
		width:responsiveWidth(100),
		height:responsiveHeight(35)
	},
	signupbtn:{
		justifyContent:'center',
		alignItems:'center',
		width:responsiveWidth(88),
		height:responsiveHeight(7),
		backgroundColor:'#ffc01d',
		borderRadius:2
	},
	signup_btntext:{
		fontSize:responsiveFontSize(2.1),
		color:'#fff',
		fontFamily: 'Barlow-Bold'
	}
    
});

export default styles;
