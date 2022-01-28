import React, { useState, useEffect } from 'react';
import {
	Text, 
	View, 
	StyleSheet, 
	Button, 
	Dimensions,
	Alert
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Location from 'expo-location';
import { Overlay } from 'react-native-elements';
// import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';

import SampleTracking from '../../controllers/sample_tracking';

export default function QRScanner() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
	const [visible, setVisible] = useState(false);
	const [location, setLocation] = useState(undefined);
    const [text, setText] = useState('Not yet scanned')

	var screenWidth = Dimensions.get('window').width; //full width
	var screenHeight = Dimensions.get('window').height; //full height
    const askForCameraPermission = () => {
        (async () => {
          const { status } = await BarCodeScanner.requestPermissionsAsync();
          setHasPermission(status === 'granted');
        })()
    }

	const getLocation = () => {
		(async () => {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				setErrorMsg('Permission to access location was denied');
				return;
			}
	  
			let l = await Location.getCurrentPositionAsync({});
			setLocation(l)
			console.log(l)
		})();
	}

	// Request Camera Permission
	useEffect(() => {
		askForCameraPermission();
		getLocation();
	}, []);

	const toggleOverlay = () => {
		setVisible(!visible);
	};

	// What happens when we scan the bar code
	const handleBarCodeScanned = ({ type, data }) => {
		setScanned(true);
		setText(data)
		console.log('Type: ' + type + '\nData: ' + data)
		// toggleOverlay()
		
		var s = new SampleTracking()
		s.sampleCollected(location, data)
			.then(res => {
				if(res.status !== 200) {
					alert(res.message)
				} else {
					
				}
			})
			.catch(err => console.log(err))

		Alert.alert(
			"New Sample Collected",
			"Collected sample for container " + data,
			[
				{
					text: "Yes",
					onPress: () => setScanned(false)
				}, {
					text: "No",
					onPress: () => setScanned(false)
				}
			]
		)
	};

	// Check permissions and return the screens
	if (hasPermission === null) {
		return (
			<View style={styles.container}>
				<Text>Requesting for camera permission</Text>
			</View>
		)
	}
	if (hasPermission === false) {
		return (
			<View style={styles.container}>
				<Text style={{ margin: 10 }}>No access to camera</Text>
				<Button title={'Allow Camera'} onPress={() => askForCameraPermission()} />
			</View>
		)
	}

	// Return the View
	return (
			<View style={styles.container}>
				<View style={styles.barcodebox}>
					<BarCodeScanner
						onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
						style={{ height: "100%", width: Dimensions.get('window').width}} 
					/>
					<BarcodeMask
						width={300} height={300} showAnimatedLine={false} outerMaskOpacity={0.9}
					/>
				</View>
				<Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
					<Text style={styles.textPrimary}>
						Sample Collected
					</Text>
					<Text style={styles.textSecondary}>
						Welcome to React Native Elements
					</Text>
				</Overlay>
				{/* <View style={styles.result}>
					<Text style={styles.maintext}>{text}</Text>
					{scanned && <Button style={styles.againbutton} title={'Scan again?'} onPress={() => setScanned(false)} color='tomato' />}
				</View> */}
			</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	maintext: {
		fontSize: 16,
		margin: 20,
		zIndex: 4,
	},
	barcodebox: {
		alignItems: 'center',
		justifyContent: 'center',
		// height: screenWidth,
		// width: screenWidth,
		overflow: 'hidden',
		// borderRadius: 30,
		// backgroundColor: 'tomato',
	},
	againbutton: {
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 3,
		marginTop: -300,
		paddingBottom: 0
	},
	result: {
		paddingHorizontal: 50,
		paddingVertical: 20   
	}
});