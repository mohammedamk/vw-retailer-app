import NetInfo from "@react-native-community/netinfo";
import Config from 'react-native-config'
import { messages } from '../utils/errors'
import {log,showSomethingWentWrong} from '../utils/helper'
import AsyncStorage from "@react-native-community/async-storage";
import RNRestart from 'react-native-restart';
const _headers = {

}


class ApiController {

	callApi(url, method, options) {
		return new Promise((resolve, reject) => {
			NetInfo.fetch().then(netState => {
				console.log(netState.isConnected)
		 	 	if (netState.isConnected) {
		 	 		this.performApiCall(url, method, resolve, options.requestBody,options.image)
		 	 	}else{
		 	 		const noNetworkResponse = {
		            	'status': 502,
		            	'body': {'error': messages.networkError}
		          	}
		          	resolve(noNetworkResponse)
		 	 	}
		 	})
		})
	}


	performApiCall(url, method, resolve, requestBody,image=false) {
		let body, responseStatus
	    const request = {
	      method: method,
	    }
		// console.log("Api Perform", requestBody)
		// alert("http://139.59.56.122/poc/" + url)
	    if (method === 'POST') {
	    	_headers['Content-Type']= 'multipart/form-data'
	    	if(image){
				console.log(JSON.stringify(requestBody), requestBody)
	    		request['body'] = requestBody
	    	}else{
	    		request['body'] = JSON.stringify(requestBody)
	    	}
	    	
	    }else{
	    	_headers['Content-Type']= 'application/json'
	    	request['body'] = JSON.stringify(requestBody)
		}
		
		// var u = "http://139.59.56.122/poc/" +url
	    log(`Making ${method} api call having images ${image} to endpoint: ${Config.BASE_URL + url} and headers: ${JSON.stringify(_headers)} with params: ${request['body']}`)
	    fetch("http://139.59.56.122/poc/" + url , request).then((response) => {
			log(`GOT RESPONSE: ${JSON.stringify(response)}`)
	    	responseStatus = response.status
      		return response.json()
	    }).then((responseBody) => {
			console.log(responseBody)
	    	log(`Got api response with status: ${responseStatus}, body: ${JSON.stringify(responseBody)}
      		from ${Config.BASE_URL + url} called with request params: ${request['body']}`)
      		body = responseBody
	    }).catch((error) => {
	    	showSomethingWentWrong()
	    }).done(() => {
	    	const _response = {
	        body: body,
	        status: responseStatus
	      }
      		resolve(_response)
	    })
	}

	logout(component) {
		AsyncStorage.removeItem('user_id');
		AsyncStorage.removeItem('otp')
		RNRestart.Restart();
	}
}

export const api = new ApiController()
