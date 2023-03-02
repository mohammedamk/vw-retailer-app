import {
    StyleSheet
} from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import { scaleVertical } from '../utils/scale';

let styles = StyleSheet.create({

	loginmainContainer:{
		marginTop: 30,
		width: responsiveWidth(100)
	},
	logininnerContainer:{
		height: responsiveHeight(20) ,
		justifyContent: 'center',
		alignItems:'center'
	},
	seperator:{
		marginTop:10
	},
	logintextinputstyle:{
		width: responsiveWidth(80), 
		fontFamily: 'Nunito-Regular',
		 height: responsiveHeight(7), 
		 borderRadius: 3, 
		 backgroundColor: '#fff',
		 opacity:0.8, 
		 borderWidth: 0.7, 
		 borderColor: '#dcdcdc',
		 elevation:5,
		shadowColor: '#000'
	},
	btnContainer:{
		justifyContent:'center',
		alignItems:'center',
		width:responsiveWidth(100),
		height:responsiveHeight(15)
	},
	btn:{
		justifyContent:'center',
		alignItems:'center',
		width:responsiveWidth(80),
		height:responsiveHeight(7),
		backgroundColor:'#ffc01d'
		,borderRadius:2
	},
	btn_text:{
		fontSize:responsiveFontSize(2),
		fontWeight:'bold',
		color:'#ffffff'
	}

    
});

export default styles;
