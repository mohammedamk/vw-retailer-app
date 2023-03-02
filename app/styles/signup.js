import {
    StyleSheet
} from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import { scaleVertical } from '../utils/scale';

let styles = StyleSheet.create({

	mainContainer:{
		marginTop: 30,
		width: responsiveWidth(100)
	},
	innerContainer:{
		// height: responsiveHeight(70) ,
		justifyContent: 'center',
		alignItems:'center',
		marginBottom: '5%'
	},
	seperator:{
		marginTop:10
	},
	textinputstyle:{
		width: responsiveWidth(80), 
		fontFamily: 'Barlow-Regular',
		height: responsiveHeight(7), 
		borderRadius: 3, 
		backgroundColor: '#fff',
		opacity:0.8, 
		borderWidth: 0.7, 
		borderColor: '#dcdcdc',
		elevation:5,
		shadowColor: '#e2e2e2'
	},
	btnContainer:{
		justifyContent:'center',
		alignItems:'center',
		width:responsiveWidth(100),
		height:responsiveHeight(25)
	},
	btn:{
		justifyContent:'center',
		alignItems:'center',
		width:responsiveWidth(80),
		height:responsiveHeight(7),
		borderRadius:2
	},
	btn_text:{
		fontSize:responsiveFontSize(2),
		color:'#ffffff',
		fontFamily: "Barlow-Bold"
	}

    
});

export default styles;
