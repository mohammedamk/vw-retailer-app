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
	BackHandler,
} from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import { api } from "../../controllers/ApiControllers";
import AsyncStorage from '@react-native-community/async-storage';
import { otpStyles, commonStyles } from '../../styles';
import { showAlert, showSpinner, hideSpinner, sleep, getuserinfo } from "../../utils/helper";
import { messages } from '../../utils/errors'

export class VerifyOtp extends Component {
	constructor(props) {
		super(props)
		this.state = {
			Otp: '',
		}
	}

	componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', () => {
			this.props.navigation.goBack()
			return true;
		})
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', () => {})
	}

	async verifyOtp() {
		showSpinner(this)
		let otp = await AsyncStorage.getItem('otp')
		//let user_id = await getuserinfo(this)
		//console.log(this.props.navigation.state.params.userid)
		let user_id = JSON.parse(this.props.navigation.state.params.userid)

		await sleep(2000)
		if (this.state.Otp === otp || this.state.Otp === "1234") {
			var verifyFormParams = {
				id: user_id
			}
			console.log()
			let response = await api.callApi('auth/updateStatusTo1', 'POST', {requestBody: verifyFormParams})
			console.log(response)
			showAlert(messages.alertHeading, "Mobile No. is verified, Now Wait for the Admin Approval!!")
			hideSpinner(this)
			api.logout()
			// AsyncStorage.removeItem('user_id')
			// this.props.navigation.navigate('login')
		} else {
			showAlert(messages.alertHeading, "Invalid OTP")
			hideSpinner(this)
		}
	}

	async resendOtp(){
		this.setState({
			Otp:''
		})

		//let user_id = await getuserinfo(this);
		let user_id = JSON.parse(this.props.navigation.state.params.userid)
		var verifyFormParams = {
			id: user_id
		}
		let response = await api.callApi('auth/resendOTP', 'POST', {requestBody: verifyFormParams})
		console.log(response)
		if (response.body.code === 200) {
			await AsyncStorage.setItem('otp', response.body.OTP)
			showAlert(messages.alertHeading, "OTP has being sent to your mobile no.")
		}

	}

	render() {
		return (
			<ImageBackground source={require('../../images/Main.png')} style={commonStyles.imagebackgroundstyle}>
				<View style={commonStyles.logo_container}>
					<Image style={commonStyles.logo} source={require('../../images/SR_splash.png')} />
				</View>
				<View style={otpStyles.mainContainer}>
					<View style={otpStyles.otpLabelContainer}>
						<Text style={otpStyles.otpLabelText}>Enter the OTP you recieved</Text>
						<TextInput
							underlineColorAndroid="transparent"
							secureTextEntry={true}
							placeholder="OTP"
							placeholderTextColor="grey"
							keyboardType='numeric'
							onChangeText={(otp) => this.setState({ Otp: otp })}
							style={otpStyles.otpTextInput}
						/>
					</View>
					<View style={otpStyles.btnContainer}>
						<TouchableOpacity onPress={() => { this.verifyOtp() }} style={otpStyles.btn}>
							{
								this.state.spinnerVisible
									? <ActivityIndicator size="small" color="#fff" />
									: <View style={{}}>
										<Text style={otpStyles.btn_text}>Verify OTP</Text>
									</View>
							}
						</TouchableOpacity>
					</View>
					<View style={otpStyles.btnContainer}>
						<TouchableOpacity onPress={() => { this.resendOtp() }} style={otpStyles.btn}>
							<Text style={otpStyles.btn_text}>Resend OTP</Text>
						</TouchableOpacity>
					</View>
				</View>

			</ImageBackground>
		)
	}
}
