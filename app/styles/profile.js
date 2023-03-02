import {
    StyleSheet
} from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import { scaleVertical } from '../utils/scale';

let styles = StyleSheet.create({

	mainContainer:{
		width:responsiveWidth(80),marginTop:'10%'
	},
	detailsMainContainer:{
		flexDirection:'row',justifyContent:'center', alignItems:'center',marginBottom:'10%'
	},
	detailsVariableContainer:{
		width:responsiveWidth(30)
	},
	detailsValueContainer:{
		width:responsiveWidth(40),
	},
	variableText:{
		fontSize:responsiveFontSize(2),color:'#94704f',fontFamily:'Barlow-Regular'
	},
	valueText:{
		fontSize:responsiveFontSize(2),color:'#e0892b',textAlign:'right',fontFamily:'Barlow-Regular'
	},
	btnContainer:{
		justifyContent:'center',alignItems:'center',width:responsiveWidth(80),height:responsiveHeight(10)
	},
	btn:{
		justifyContent:'center',alignItems:'center',width:responsiveWidth(60),height:responsiveHeight(7),backgroundColor:'#ffc01d',borderRadius:2
	},
	btn_text:{
		fontSize:responsiveFontSize(1.9),
		fontFamily:'Barlow-Bold',
		fontWeight:'bold',
		color:'#ffffff'
	}
    
});

export default styles;
