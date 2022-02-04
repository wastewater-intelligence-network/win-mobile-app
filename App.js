import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';

import Login from './screens/Login/Login';
import Home from './screens/Home/Home';
import SampleCollector from './screens/SampleCollector/SampleCollector';
import SampleTransporter from './screens/SampleTransporter/SampleTransporter';
import SampleList from './screens/SampleList/SampleList';

import Constants from './screens/constants';


const Stack = createNativeStackNavigator();

export default function App() {
	const [loaded] = useFonts({
		QuicksandLight: require('./assets/fonts/Quicksand-Light.ttf'),
		Quicksand: require('./assets/fonts/Quicksand-Regular.ttf'),
		QuicksandMedium: require('./assets/fonts/Quicksand-Medium.ttf'),
		QuicksandBold: require('./assets/fonts/Quicksand-Bold.ttf'),
		Consolas: require('./assets/fonts/Consolas.ttf'),
	});
	

	if (!loaded) {
		return null;
	}
	
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen
					name="Login"
					component={Login}
					options={{headerShown: false}}
				/>
				<Stack.Screen
					name="Home"
					component={Home}
					options={{headerShown: false}}
				/>
				<Stack.Screen
					name={Constants.screenName.SampleCollector}
					component={SampleCollector}
					options={{headerShown: false}}
				/>
				<Stack.Screen
					name={Constants.screenName.SampleTransporter}
					component={SampleTransporter}
					options={{headerShown: false}}
				/>
				<Stack.Screen
					name={Constants.screenName.SampleAcceptance}
					component={SampleTransporter}
					options={{headerShown: false}}
				/>
				<Stack.Screen
					name={Constants.screenName.SamplesList}
					component={SampleList}
					options={{headerShown: false}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}
