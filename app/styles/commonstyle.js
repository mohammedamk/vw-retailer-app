import {
    StyleSheet
} from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import { scaleVertical } from '../utils/scale';

let styles = StyleSheet.create({

	imagebackgroundstyle:{
		width: '100%',
		height: '100%'
	},
	logo_container:{
		justifyContent:'center',
		alignItems:'center',
		height:responsiveHeight(30)
	},
	logo:{
		height:responsiveHeight(18),
		width:responsiveWidth(45)
	}
    
});

export default styles;
