import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';

import Login from './screens/Login/Login';
import Home from './screens/Home/Home';
import QRScanner from './screens/QRScanner/QRScanner';

const Stack = createNativeStackNavigator();

export default function App() {
	const [loaded] = useFonts({
		Quicksand: require('./assets/fonts/Quicksand-Regular.ttf'),
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
					name="QRScanner"
					component={QRScanner}
					options={{headerShown: false}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}
