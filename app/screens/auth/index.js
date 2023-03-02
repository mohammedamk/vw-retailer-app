import React, { Component } from 'react';
import {
	View,
	Text,
	Dimensions,
	  StatusBar,
	  Image,
		BackHandler,
		Linking,
		Alert
} from 'react-native';
import { getuserinfo } from "../../utils/helper";
import { scale } from '../../utils/scale';
import { splashStyles } from '../../styles';
import StatusBarPaddingIOS from 'react-native-ios-status-bar-padding';
import { ProgressBar } from '../../components';
import AsyncStorage from '@react-native-community/async-storage';
import { getAppstoreAppMetadata } from "react-native-appstore-version-checker";
let timeFrame = 500;

export class Auth extends Component {

	 constructor(props) {
        super(props);
		this.state = {
			progress: 0
		};
	}

	exitapp(){
		BackHandler.exitApp();
	}

	updateApp(){
		var url='https://play.google.com/store/apps/details?id=com.smartretailer';
		Linking.openURL(url);
	}

	async componentWillMount() {
		let tmp = await getuserinfo(this)
		getAppstoreAppMetadata("com.smartretailer") //put any apps packageId here
  .then(metadata => {
		//alert(JSON.stringify(metadata))
		if(metadata.version == '0.0.11' ){

			if(tmp){
			this.loadSplash('home')
			}else{
				this.loadSplash('basic')
			}
		}else{
			Alert.alert(
			  'Update Smart Retailer',
			  'New version is released',
			  [
			    {
			      text: 'Cancel',
			      onPress: () => this.exitapp(),
			      style: 'cancel',
			    },
			    {text: 'Update', onPress: () => this.updateApp()},
			  ],
			  {cancelable: false},
			);
		}
  })
  .catch(err => {
    console.log("error occurred", err);
  });

	}

	loadSplash(nav) {
		StatusBar.setHidden(true, 'none');

		this.timer = setInterval(() => {
			if (this.state.progress === 1) {
				clearInterval(this.timer);
				setTimeout(() => {
					StatusBar.setHidden(false, 'slide');
					this.props.navigation.navigate(nav)
				}, timeFrame);
			} else {
				let random = Math.random() * 0.5;
				let progress = this.state.progress + random;
				if (progress > 1) {
					progress = 1;
				}
				this.setState({ progress });
			}
		}, timeFrame)

	}

	render() {
		let width = Dimensions.get('window').width;
		return (
			<View style={splashStyles.container}>
				<StatusBarPaddingIOS />
				<View>
					<Image style={[splashStyles.image, {width: width}]} source={require('../../images/SR_splash.png')}/>
					{/*<View style={splashStyles.text}>
											<Text style={splashStyles.appName}>Smart Retailer</Text>
											<Text style={splashStyles.hero}></Text>
										</View>*/}
				</View>
				<ProgressBar
					color="#ffc01d"
					style={splashStyles.progress}
					progress={this.state.progress} width={scale(320)} />
			</View>
		)
	}
}
