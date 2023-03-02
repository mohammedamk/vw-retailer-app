import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-community/async-storage';
import {Badge} from 'react-native-elements'
import { _themecolor } from './colors';
export class Header extends React.Component {
    constructor(props) {
        super(props);

    }

    state = {
        displaySearch: this.props.search || false
    }

    openSearch() {
        this.props.component.setState({
            searchVisible: !this.props.component.searchVisible
        })
    }

    render() {
        return (
            <View style={{ height: responsiveHeight(12), marginTop: 0, backgroundColor: _themecolor, flexDirection: 'row' }}>
                {/**/}
                <View style={{ alignItems: "center", width: responsiveWidth(65), justifyContent: 'center',alignItems:'baseline',marginLeft:'5%' }}>
                    <Image source={require('../images/headerlogo.png')} style={{ width: responsiveWidth(45), height: responsiveHeight(10) }} resizeMode='contain' />
                </View>
                
                {this.state.displaySearch ? <View style={{ alignItems: 'center', justifyContent: 'center', width: responsiveWidth(10) }}>
                    <TouchableOpacity onPress={() => this.openSearch()}>
                        <MaterialIcons name="search" size={25} color="#af9378" />
                    </TouchableOpacity>
                </View> : <View style={{ alignItems: 'center', justifyContent: 'center', width: responsiveWidth(10) }}></View>}
                <View style={{ alignItems: 'center', justifyContent: 'center', width: responsiveWidth(10) }}>
                    <TouchableOpacity onPress={() => this.props.component.goToCart()}>
                        <MaterialCommunityIcons name="cart-outline" size={25} color="#af9378" />
                        <Badge
                        value={this.props.count}
                        status="success"
                        containerStyle={{position:'absolute',top:-12,right:-5}}
                      />
                    </TouchableOpacity>
                </View>
                <View style={{ width: responsiveWidth(10), alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
                        <MaterialCommunityIcons name="menu" size={25} color="#af9378" />
                    </TouchableOpacity>
                </View>
                
            </View>
        )
    }
}