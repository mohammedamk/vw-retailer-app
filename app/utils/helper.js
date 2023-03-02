import React from 'react'
import { View, BackHandler, Alert, Text } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import { messages } from "./errors";
import { Spinner } from '../components';

export function log(input) {
  if (__DEV__) {
    console.log(input)
  }
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function showSpinner(component) {
  component.setState({ spinnerVisible: true })
}

export function hideSpinner(component) {
  component.setState({ spinnerVisible: false })
}

export function showGumastaSpinner(component) {
  component.setState({ GumspinnerVisible: true })
}

export function hideGumastaSpinner(component) {
  component.setState({ GumspinnerVisible: false })
}

export function showshopSpinner(component) {
  component.setState({ ShopspinnerVisible: true })
}

export function hideshopSpinner(component) {
  component.setState({ ShopspinnerVisible: false })
}

export function showstreetSpinner(component) {
  component.setState({ StreetspinnerVisible: true })
}

export function hidestreetSpinner(component) {
  component.setState({ StreetspinnerVisible: false })
}

export function showgstSpinner(component) {
  component.setState({ GstspinnerVisible: true })
}

export function hidegstSpinner(component) {
  component.setState({ GstspinnerVisible: false })
}

export function showAlert(heading, content) {
  Alert.alert(
    heading,
    content,
    [
      { text: 'OK', onPress: () => { } }
    ],
    { cancelable: false }
  )
}

export function showSomethingWentWrong() {
  showAlert(messages.alertHeading, messages.unknownError)
}

export function parseFieldErrors(errors) {
  let errorMessages = []
  for (let i = 0; i < errors.length; i++) {
    errorMessages.push(errors[i])
  }
  return errorMessages.join(', ')
}

export function getuserinfo(component) {
  return AsyncStorage.getItem('user_id').then((currentUser) => {
    let user = JSON.parse(currentUser)
    if (user) {
      return user
    } else {
      return user
    }
  })
}

export function findWithAttr(array, attr, value) {
  for (var i = 0; i < array.length; i += 1) {
    if (array[i][attr] === value) {
      return i;
    }
  }
  return -1;
}

export function compareValues(key, order = 'asc') {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }

    const varA = (typeof a[key] === 'string')
      ? a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === 'string')
      ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (
      (order === 'desc') ? (comparison * -1) : comparison
    );
  };
}

const renderPaginationFooter = (component) => {
  if (component.state.emptyList === false) {
    if (component.state.isRefreshing === false) {
      if (component.state.endOfResults === false) {
        return (
          <Spinner paginationSpinner={true} />
        )
      } else {
        return (
          <View style={{ alignItems: 'center', paddingVertical: 15 }}>
            <Text style={{}}>{messages.paginationEndOfResults}</Text>
          </View>
        )
      }
    }
  }
}

export { renderPaginationFooter }
