import React from 'react';
import {
    ActivityIndicator,
    View,
    TouchableOpacity,
    TextInput
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export class Search extends React.Component {


    change(text) {
        this.props.component.setState({
            searchText: text
        })

        this.search(text)
    }

    search(key){
        var searchprod = this.searchStringInArray(key, this.props.list);
        this.props.component.setState({
          categoryList: searchprod
        })
      }
   
      searchStringInArray (str, strArray) {
        const regex = new RegExp(`${str.trim()}`, 'i');
        var result = strArray.filter(product => product.CATEGORYNAME.search(regex) >= 0);
        return result;
      }

    render() {
        return (
            <View style={{ height: responsiveHeight(8), marginTop: 0, marginBottom: '2%', backgroundColor: '#EE0F0F', flexDirection: 'row', borderTopWidth: 1, borderColor: '#fff', alignItems: 'center' }}>
                <TextInput
                    //value= {this.state.s}
                    style={{ color: '#000', marginLeft: 10, height: responsiveHeight(5.5), width: responsiveWidth(88), backgroundColor: 'white', borderRadius: 3, paddingLeft: 15, fontSize: responsiveFontSize(2), fontFamily: 'Montserrat-Regular', borderWidth: 1, borderColor: '#7A7A7A' }}
                    placeholder="Search"
                    placeholderTextColor="#000"
                    placeholderTextStyle={{ paddingTop: '10%' }}
                    underlineColorAndroid='transparent'
                    onChangeText={(search) => this.change(search)}
                    editable={true}
                    secureTextEntry={false}
                    onSubmitEditing={() => this.search(this.props.component.state.searchText)}
                    onEndEditing={() => this.search(this.props.component.state.searchText)}
                />
                <TouchableOpacity onPress={() => { this.props.component.setState({ searchVisible: !this.props.component.state.searchVisible }); }} style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 9 }} >
                    <MaterialCommunityIcons name="close-circle-outline" size={20} color="white" />
                </TouchableOpacity>
            </View>
        );
    }
}