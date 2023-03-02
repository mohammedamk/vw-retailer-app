import {
    StyleSheet
} from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import { scaleVertical } from '../utils/scale';

let styles = StyleSheet.create({

	mainContainer:{
		width:responsiveWidth(90),marginTop:'10%'
	},
	detailsMainContainer:{
		marginBottom:'5%',
		alignItems:'center',
		justifyContent:'center'
		//backgroundColor:'green'
	},
	detailsVariableContainer:{
		width:responsiveWidth(80),
	},
	detailsValueContainer:{
		width:responsiveWidth(80),
		marginTop:'3%',
		//backgroundColor:'blue'
	},
	edittextinputstyle:{
		width: responsiveWidth(80), 
		fontFamily: 'Barlow-Regular',
		color:'#e0892b',
		height: responsiveHeight(7), 
		fontSize:responsiveFontSize(2),
		borderRadius: 3, 
		backgroundColor: 'transparent',
		borderWidth: 0.7, 
		borderColor: '#e0892b',
	},
	variableText:{
		fontSize:responsiveFontSize(2),color:'#94704f',fontFamily:'Barlow-Regular'
	},
	// valueText:{
	// 	fontSize:responsiveFontSize(2),color:'#e0892b',fontFamily:'Barlow-Regular'
	// },
	btnContainer:{
		justifyContent:'center',alignItems:'center',width:responsiveWidth(90),height:responsiveHeight(10)
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
