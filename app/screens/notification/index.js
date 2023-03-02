import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
    StatusBar,
    ScrollView
} from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { Header } from "../../components";
import { api } from "../../controllers/ApiControllers";
import {profileStyles,loginStyles } from '../../styles';
import { showAlert, showSpinner, hideSpinner, getuserinfo } from "../../utils/helper";
import { messages } from '../../utils/errors'
import { StackNavigator, navigation, DrawerNavigator } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import StatusBarPaddingIOS from 'react-native-ios-status-bar-padding';

export class Notification extends React.Component {
  static navigationOptions = {
    title: 'Notify',
    tabBarLabel: "Notify",
    gestureEnabled:true,
    tabBarIcon: ({ focused, tintColor }) => (
        focused ? <FontAwesome name = 'bell' size = {24} color = {tintColor}/> : <FontAwesome name = 'bell-o' size = {24} color = {tintColor}/>
    ),
  };

  render() {
    return (
      <View style = {{flex: 1,justifyContent:'center',alignItems:'center'}}>
        {/* <StatusBar backgroundColor= "#ffc01d" barStyle="dark-content" hidden = {false}/>
        <StatusBarPaddingIOS style={{backgroundColor: "#ffc01d"}}/>
        <Header title = {'Profile'} navigation = {this.props.navigation} component={this} />
        <ScrollView>
          <View style={profileStyles.mainContainer}>
            <View style={profileStyles.detailsMainContainer}>
              <View style={profileStyles.detailsVariableContainer}>
                <Text style={profileStyles.variableText}>NAME</Text>
              </View>
              <View style={profileStyles.detailsValueContainer}>
                <Text style={profileStyles.valueText}>Test User</Text>
              </View>
            </View>
            <View style={profileStyles.detailsMainContainer}>
              <View style={profileStyles.detailsVariableContainer}>
                <Text style={profileStyles.variableText}>ADDRESS1</Text>
              </View>
              <View style={profileStyles.detailsValueContainer}>
                <Text style={profileStyles.valueText}>Nagpur</Text>
              </View>
            </View>
            <View style={profileStyles.detailsMainContainer}>
              <View style={profileStyles.detailsVariableContainer}>
                <Text style={profileStyles.variableText}>ADDRESS2</Text>
              </View>
              <View style={profileStyles.detailsValueContainer}>
                <Text style={profileStyles.valueText}>Nagpur</Text>
              </View>
            </View>
            <View style={profileStyles.detailsMainContainer}>
              <View style={profileStyles.detailsVariableContainer}>
                <Text style={profileStyles.variableText}>ADDRESS3</Text>
              </View>
              <View style={profileStyles.detailsValueContainer}>
                <Text style={profileStyles.valueText}>Nagpur</Text>
              </View>
            </View>
            <View style={profileStyles.detailsMainContainer}>
              <View style={profileStyles.detailsVariableContainer}>
                <Text style={profileStyles.variableText}>CITY</Text>
              </View>
              <View style={profileStyles.detailsValueContainer}>
                <Text style={profileStyles.valueText}>Nagpur</Text>
              </View>
            </View>
            <View style={profileStyles.detailsMainContainer}>
              <View style={profileStyles.detailsVariableContainer}>
                <Text style={profileStyles.variableText}>MOBILE</Text>
              </View>
              <View style={profileStyles.detailsValueContainer}>
                <Text style={profileStyles.valueText}>123456789</Text>
              </View>
            </View>
            <View style={profileStyles.detailsMainContainer}>
              <View style={profileStyles.detailsVariableContainer}>
                <Text style={profileStyles.variableText}>WHATSAPP</Text>
              </View>
              <View style={profileStyles.detailsValueContainer}>
                <Text style={profileStyles.valueText}>123456789</Text>
              </View>
            </View>
            <View style={profileStyles.btnContainer}>
              <TouchableOpacity onPress={() => this.login()} style={profileStyles.btn}>
                    <View style={{}}>
                      <Text style={loginStyles.btn_text}>EDIT</Text>
                    </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView> */}
      </View>
    )
  }
}
