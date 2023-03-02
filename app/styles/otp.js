import {
    StyleSheet
} from 'react-native';
import { scaleVertical } from '../utils/scale';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

let styles = StyleSheet.create({

    mainContainer:{
        height:responsiveHeight(40),
        justifyContent:'center',
        alignItems:'center'
    },
    otpLabelContainer:{
        width:responsiveWidth(88)
    },
    otpLabelText:{
        fontFamily: "Barlow-Bold",
        fontSize:responsiveFontSize(2)
    },
    otpTextInput:{
        width: responsiveWidth(88),
        fontFamily: 'Barlow-Regular',
        height: responsiveHeight(7),
        borderRadius: 3, 
        backgroundColor: '#fff',
        opacity:0.8, 
        borderWidth: 0.7, 
        borderColor: '#dcdcdc',
        elevation:5,
        shadowColor: '#e2e2e2',
        marginTop:10
    },
    btnContainer:{
        justifyContent:'center',
        alignItems:'center',
        width:responsiveWidth(100),
        height:responsiveHeight(10)
    },
    btn:{
        justifyContent:'center',
        alignItems:'center',
        width:responsiveWidth(88),
        height:responsiveHeight(7),
        backgroundColor:'#ffc01d',
        borderRadius:2

    },
    btn_text:{
        fontSize:responsiveFontSize(1.9),
        fontWeight:"900",
        color:'#fff',
        fontFamily: 'Barlow-Bold'
    }
    
});

export default styles;
