import * as SecureStore from 'expo-secure-store';
import base64 from 'react-native-base64';

import Fetch from './fetch';

export default class Authentication {
    login(username, password) {
        let headers = {
            'Authorization': 'Basic ' + base64.encode(username + ':' + password)
        }
		
        return new Promise((resolve, reject) => {
            Fetch(
                '/login',
                {
                    method: 'GET',
                    headers: headers
                }
            )
                .then(res => res.json())
                .then(res => {
                    if(res.token) {
                        SecureStore.setItemAsync('token', res.token)
                        resolve(true)
                        // ToastAndroid.showWithGravity("Login Successful", ToastAndroid.SHORT, ToastAndroid.BOTTOM)
                        // navigation.navigate('Home')
                    } else {
                        resolve(false)
                        // ToastAndroid.show("Could not login. Please check your username and password", ToastAndroid.LONG)
                    }
                })
                .catch(reject)
        })
    }

    isSessionActive() {
        return new Promise((resolve, reject) => { 
            SecureStore.getItemAsync('token')
                .then(token => {
                    if(token) {
                        resolve(true)
                    }
                    resolve(false)
                })
                .catch(reject)
        })
    }

    getSessionToken() {
        return new Promise((resolve, reject) => { 
            SecureStore.getItemAsync('token')
                .then(token => {
                    if(token) {
                        resolve(token)
                    }
                    resolve(undefined)
                })
                .catch(reject)
        })
    }
}