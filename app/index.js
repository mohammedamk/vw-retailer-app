// import { createStackNavigator, createDrawerNavigator } from 'react-navigation';
// import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from "react-navigation-drawer";
import * as Screens from './screens';
import Drawer from './screens/drawer';

const tab = createMaterialTopTabNavigator({
	home: {
		screen: Screens.Home
	},
	profile: {
		screen: Screens.Profile
	},
	notification: {
		screen: Screens.Notification
	},
	setting: {
		screen: Screens.Setting
	}
},
	{
		tabBarPosition: 'bottom',
		unmountInactiveRoutes: true,
		lazy: true,
		tabBarOptions:
		{
			tabStyle: {
				backgroundColor: "#fff"	
			},
			style: {
				borderTopWidth: 0.4,
				elevation: 6,
				borderColor: 'grey',
				backgroundColor: "#fff",
			},

			activeTintColor: "#e3892c",
			inactiveTintColor: "grey",
			indicatorStyle: {
				borderBottomColor: "#ffc01d",
				borderBottomWidth: 1
			},
			showIcon: true,
			showLabel: true,

		},
	});

const RootDrawer = createDrawerNavigator({
	tab: {screen: tab},
	categorizedproduct: {
		screen: Screens.CategorizedProduct
	},
	editprofile: {
		screen: Screens.EditProfile
	},
	productpage: {
		screen: Screens.ProductPage
	},
	cart: {
		screen: Screens.Cart
	},
	checkoutform: {
		screen: Screens.Checkout
	},
	orderconfirm: {
		screen: Screens.OrderConfirm
	},
	order: {
		screen: Screens.Order
	},
	orderdetail: {
		screen: Screens.OrderDetail
	},
}, {
	contentComponent: Drawer,
	drawerPosition: 'right',
	drawerType: 'slide',
	unmountInactiveRoutes: true
});

const RootNavigator = createStackNavigator({
	auth: {
		screen: Screens.Auth,
	},
	basic: {
		screen: Screens.Basic,
	},
	login: {
		screen: Screens.Login,
	},
	signup: {
		screen: Screens.SignUp
	},
	registersteptwo: {
		screen: Screens.RegisterStepTwo
	},
	verifyotp: {
		screen: Screens.VerifyOtp
	},
	drawerstack: {
		screen: RootDrawer
	}
}, {
	headerMode: 'none',
	unmountInactiveRoutes: true,
	defaultNavigationOptions: {
		gesturesEnabled: true,
	}
})

// export default class App extends React.Component {
// 	render() {
// 	  return (
// 		<View style={{flex: 1}}>
// 		  <RootNavigator/>
// 		</View>
// 	  );
// 	}
//   }

export default createAppContainer(RootNavigator);
