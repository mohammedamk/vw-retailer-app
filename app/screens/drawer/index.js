import React, { Component } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert
} from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import { showAlert, showSpinner, hideSpinner, getuserinfo } from "../../utils/helper";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { navigation } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { api } from "../../controllers/ApiControllers";
import { Avatar } from 'react-native-elements';
import { colors } from '../../utils/colors';
import { messages } from '../../utils/errors'
import Config from 'react-native-config'
import { _themecolor } from '../../components/colors';

class Drawer extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      currentuser: '',
      username:'',
      initial:'',
      user_id:'',
      profile_pic: ''
    }
  }

  async componentDidMount() {
    let user_id = await getuserinfo(this)
    if(user_id){
      this.setState({
        user_id: user_id
      }, () => {
        this.getUserDetails()
      })

    }else {
      this.props.navigation.navigate('login')
    }
    console.log(user_id)
  }

  updateName() {
    this.setState({username: this.state.username}, () => {
      let title = this.state.username;
      this.setState({
        initial:title.charAt(0)
      })
    });
  }

  async getUserDetails() {
    var userParams = {
      "id": this.state.user_id
    }
    let response = await api.callApi(`auth/getCustomerDetails`, 'POST', {requestBody: userParams})
    if (response.body.code === 200) {
      this.setState({
        currentuser: response.body.data,
        username: response.body.data.PARTYNAME,
        profile_pic: response.body.data.PROFILEPIC
      }, () => {
        this.updateName()
      })
    } else if (response.body === 'undefined') {
      showAlert(messages.alertHeading, 'User Details Doesnot Exist')
    } else {
      showAlert(messages.alertHeading, messages.networkError)
    }
  }

  async componentWillReceiveProps(props) {
    let user_id = await getuserinfo(this)
    if(user_id){
      this.setState({
        user_id: user_id
      }, () => {
        this.getUserDetails()
      })

    }else {
      this.props.navigation.navigate('login')
    }
  }

  // logOut() {
  //   AsyncStorage.removeItem("user");
  //   this.props.navigation.navigate('login')
  // }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: _themecolor }}>
      <TouchableOpacity onPress={() => this.props.navigation.closeDrawer()}style={{margin:'1%'}}>
        <Feather name="arrow-left" color={colors.drawericon} size={28} style={{ paddingTop: 5, paddingLeft: 3 }} />
      </TouchableOpacity>
        <TouchableOpacity onPress={() => {this.props.navigation.navigate('profile');}}>
          <View style={{ height: responsiveHeight(20), flexDirection: 'column' ,alignItems:'center',justifyContent:'center'}} >
          {this.state.profile_pic ?
                  <Avatar
                  size={100}
                  rounded
                  source={{
                    uri:this.state.profile_pic,
                  }}
                />
                  :
                 <Avatar
                   size={100}
                   rounded
                   title={this.state.initial}
                   titleStyle={{fontSize:responsiveHeight(3.5),fontFamily:'Barlow-Bold'}}
                   overlayContainerStyle={{backgroundColor: '#926f4f'}}
                   activeOpacity={0.7}
                  />
               }
            <View style={{ justifyContent: 'center', alignItems: 'center',marginTop:'2%' }} >
    <Text style={{ color: '#e3892c', fontSize: responsiveFontSize(2), fontFamily: 'Barlow-Bold' }} >{this.state.username}</Text>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ color: '#e3892c', fontSize: responsiveFontSize(1.7), fontFamily: 'Barlow-Regular' }} >{this.state.currentuser.MOBILENO}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={{ flexDirection: 'column'}}>
          <TouchableOpacity onPress={() => {this.props.navigation.closeDrawer();this.props.navigation.navigate('home');}} style={{  height: responsiveHeight(8), justifyContent: 'center', borderBottomWidth: 1, borderBottomColor:'#e3892c', }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ paddingLeft: 20 }} >
                <Feather name="home" color={colors.drawericon} size={22} style={{ paddingTop: 3, paddingLeft: 3 }} />
              </View>
              <View style={{ marginLeft: 15 }} >
                <Text style={{ color: "#e3892c", fontSize: responsiveFontSize(1.8), fontFamily: 'Barlow-Bold', paddingTop: 3, }} >HOME</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {this.props.navigation.closeDrawer();this.props.navigation.navigate('profile');}} style={{height: responsiveHeight(8), justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#e3892c', }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ paddingLeft: 20 }} >
                <Feather name="user" color={colors.drawericon} size={22} style={{ paddingTop: 3, paddingLeft: 3 }} />
              </View>
              <View style={{ marginLeft: 15 }} >
                <Text style={{ color: "#e3892c", fontSize: responsiveFontSize(1.8), fontFamily: 'Barlow-Bold', paddingTop: 3, }} >PROFILE</Text>
              </View>
            </View>
          </TouchableOpacity>
           <TouchableOpacity onPress={() => {this.props.navigation.closeDrawer();this.props.navigation.navigate('notification');}} style={{height: responsiveHeight(8), justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#e3892c', }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ paddingLeft: 20 }} >
                <Feather name="bell" color={colors.drawericon} size={22} style={{ paddingTop: 3, paddingLeft: 3 }} />
              </View>
              <View style={{ marginLeft: 15 }} >
                <Text style={{ color: "#e3892c", fontSize: responsiveFontSize(1.8), fontFamily: 'Barlow-Bold', paddingTop: 3, }} >NOTIFICATION</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {this.props.navigation.closeDrawer();this.props.navigation.navigate('order');}} style={{height: responsiveHeight(8), justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#e3892c', }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ paddingLeft: 20 }} >
                <MaterialIcons name="bookmark-border" color={colors.drawericon} size={22} style={{ paddingTop: 3, paddingLeft: 3 }} />
              </View>
              <View style={{ marginLeft: 15 }} >
                <Text style={{ color: "#e3892c", fontSize: responsiveFontSize(1.8), fontFamily: 'Barlow-Bold', paddingTop: 3, }} >MY ORDERS</Text>
              </View>
            </View>
          </TouchableOpacity>
           <TouchableOpacity onPress={() => {this.props.navigation.closeDrawer();this.props.navigation.navigate('setting');}} style={{height: responsiveHeight(8), justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#e3892c', }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ paddingLeft: 20 }} >
                <Feather name="settings" color={colors.drawericon} size={22} style={{ paddingTop: 3, paddingLeft: 3 }} />
              </View>
              <View style={{ marginLeft: 15 }} >
                <Text style={{ color: "#e3892c", fontSize: responsiveFontSize(1.8), fontFamily: 'Barlow-Bold', paddingTop: 3, }} >SETTING</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => api.logout()} style={{height: responsiveHeight(8), justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#e3892c', }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ paddingLeft: 20 }} >
                <MaterialCommunityIcons name="logout" color={colors.drawericon} size={22} style={{ paddingTop: 3, paddingLeft: 3 }} />
              </View>
              <View style={{ marginLeft: 15 }} >
                <Text style={{ color: "#e3892c", fontSize: responsiveFontSize(1.8), fontFamily: 'Barlow-Bold', paddingTop: 3, }} >LOGOUT</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1,justifyContent: 'flex-end',alignItems:'center'}}>
              <Text style={{color: '#e3892c', fontSize: responsiveFontSize(1.8), fontFamily: "Barlow-Regular"}}>V 0.0.11</Text>
        </View>
      </View>
    );
  }
}

export default Drawer;
