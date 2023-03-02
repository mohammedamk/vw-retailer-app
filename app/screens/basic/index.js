import React, { Component } from 'react';
import {
	View,
	Text,
	Image,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
	ScrollView,
	ImageBackground,
	BackHandler
} from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import {api} from "../../controllers/ApiControllers";
import {showAlert, showSpinner, hideSpinner} from "../../utils/helper";
import {commonStyles,basicStyles } from '../../styles';
import { messages } from '../../utils/errors'

export class Basic extends Component{
	constructor(props){
		super(props)

	}

	componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', () => {
			BackHandler.exitApp()
			return true;
		})
	}

	componentWillMount() {
		BackHandler.addEventListener('hardwareBackPress', () => {
			BackHandler.exitApp()
			return true;
		})
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', () => {})
	}
	
	render(){
		return(
			<ImageBackground source={require('../../images/Main.png')} style={commonStyles.imagebackgroundstyle}>
			    <View style={basicStyles.basic_logo_container}>
			    	<Image style={basicStyles.basic_logo} source={require('../../images/SR_splash.png')}/>
			    </View>
		    	{/* <View style={basicStyles.mainTitleContainer}>
		    		<Text style={basicStyles.mainTitleText}></Text>
		    	</View>
		    	<View style={basicStyles.subtitleContainer}>
		    		<View style={basicStyles.subtitleinnerContainer}>
		    		<Text numberOfLines={2} style={basicStyles.subtitle_text}></Text>
		    		</View>
		    	</View> */}
		    	<View style={basicStyles.btnConatiner}>
				   <TouchableOpacity onPress={() => {this.props.navigation.navigate('signup');}} style={basicStyles.signupbtn}>
				   		<View style={{}}>
				   			<Text style={basicStyles.signup_btntext}>Sign Up</Text>
				   		</View>
				   </TouchableOpacity>
				    <TouchableOpacity onPress={() => {this.props.navigation.navigate('login');}} style={[basicStyles.signupbtn,{marginTop:'4%'}]}>
				   		<View style={{}}>
				   			<Text style={basicStyles.signup_btntext}>Sign In</Text>
				   		</View>
				   </TouchableOpacity>
			   </View>
			</ImageBackground>
		)
	}
}
