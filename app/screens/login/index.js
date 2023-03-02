import React, { Component } from 'react';
import {
	View,
	Text,
	Image,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
	KeyboardAvoidingView,
	ScrollView,
	ImageBackground,
	BackHandler
} from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import { api } from "../../controllers/ApiControllers";
import { showAlert, showSpinner, hideSpinner } from "../../utils/helper";
import { messages } from '../../utils/errors'
import { commonStyles, loginStyles } from '../../styles';
import AsyncStorage from '@react-native-community/async-storage';
export class Login extends Component {
	constructor(props) {
		super(props)

		this.state = {
			Mobile: '',
			Password: '',
			spinnerVisible: false
		}
	}

	componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', () => {
			this.props.navigation.navigate('basic')
			return true;
		})
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', () => {})
	}

	async login() {
		showSpinner(this)
		let loginFormParams = {
			"mobile": this.state.Mobile,
			"password": this.state.Password
		}
		let response = await api.callApi(`auth/login`, 'POST', { requestBody: loginFormParams })
		hideSpinner(this)
		console.log(response.body)
		if (response.body.code === 200) {
			this.clearLoginForm()
			await AsyncStorage.setItem('user_id', JSON.stringify(response.body.USERID))
			BackHandler.removeEventListener('hardwareBackPress', () => {})
			this.props.navigation.navigate('home')
		} else if (response.body.code === 201) {
			showAlert(messages.alertHeading, response.body.message)
		} else if (response.body.code === 202) {
			showAlert(messages.alertHeading, response.body.message)
		} else if (response.body.code === 204) {
			showAlert(messages.alertHeading, response.body.message)
		} else if (response.body.code === 203) {
			await AsyncStorage.setItem('otp', JSON.stringify(response.body.otp))
			showAlert(messages.alertHeading, messages.userVerify)
			this.props.navigation.navigate('verifyotp',{userid:JSON.stringify(response.body.USERID)})
		} else {
			showAlert(messages.alertHeading, messages.networkError)
		}
	}

	clearLoginForm() {
		this.setState({
			Mobile: '',
			Password: ''
		})
	}

	render() {
		return (
			<ImageBackground source={require('../../images/Main.png')} style={commonStyles.imagebackgroundstyle}>
				<View style={commonStyles.logo_container}>
					<Image style={commonStyles.logo} source={require('../../images/SR_splash.png')} />
				</View>
				<View style={loginStyles.loginmainContainer}>
					<View style={loginStyles.logininnerContainer}>
						<View style={{}}>
							<TextInput
								underlineColorAndroid="transparent"
								placeholder="Mobile No."
								placeholderTextColor="grey"
								onChangeText={(mob) => this.setState({ Mobile: mob })}
								style={loginStyles.logintextinputstyle}
								keyboardType='numeric'

							/>
						</View>
						<View style={loginStyles.seperator}>
							<TextInput
								underlineColorAndroid="transparent"
								placeholder="Password"
								placeholderTextColor="grey"
								onChangeText={(password) => this.setState({ Password: password })}
								style={loginStyles.logintextinputstyle}
								secureTextEntry={true}
							/>
						</View>
					</View>
				</View>
				<View style={loginStyles.btnContainer}>
					<TouchableOpacity onPress={() => { this.login(); }} style={loginStyles.btn}>
						{
							this.state.spinnerVisible
								? <ActivityIndicator size="small" color="#fff" />
								: <View style={{}}>
									<Text style={loginStyles.btn_text}>Submit  </Text>
								</View>
						}
					</TouchableOpacity>
				</View>
			</ImageBackground>
		)
	}
}
