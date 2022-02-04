import React, { useState, useEffect } from 'react';
import {
	Text, 
	View, 
	StyleSheet, 
	Button, 
	Dimensions,
	Alert,
	ActivityIndicator,
	TextInput,
	TouchableHighlight
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Location from 'expo-location';
import { Overlay } from 'react-native-elements';
// import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';

import Constants from '../constants';
import SampleTracking from '../../controllers/sample_tracking';

export default function SampleCollector({ route }) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
	const [qrData, setQrData] = useState(undefined);

    const askForCameraPermission = () => {
        (async () => {
          const { status } = await BarCodeScanner.requestPermissionsAsync();
          setHasPermission(status === 'granted');
        })()
    }

	// Request Camera Permission
	useEffect(() => {
		askForCameraPermission();
	}, []);

	const alertUser = (title, message) => {
		Alert.alert(
			title,
			message,
			[
				{
					text: "Ok",
					onPress: () => setScanned(false)
				}
			]
		)
	}

	const updateStatusToInTransit = (sampleTracking, containerId) => {
		sampleTracking.sampleInTransit(containerId)
			.then((res) => {
				if(res.status === 200) {
					alertUser(
						"In Transit",
						"Sample in container ID " + containerId + " marked in-transit"
					)
				} else {
					alertUser(
						"Issue with adding the sample",
						res.message
					)
				}
			})
	}

	const updateStatusToAccepted = (sampleTracking, containerId) => {
		sampleTracking.sampleAcceptedInLab(containerId)
			.then((res) => {
				if(res.status === 200) {
					alertUser(
						"Accepted in the lab",
						"Sample in container ID " + containerId + " received in the lab"
					)
				} else {
					alertUser(
						"Issue with adding the sample",
						res.message
					)
				}
			})
			.catch(console.log)
	}

	// What happens when we scan the bar code
	const handleBarCodeScanned = ({ type, data }) => {
		setScanned(true)
		setQrData(data)

		console.log(data)
		console.log(route.name)

		let sampleTracking = new SampleTracking()

		if(route.name === Constants.screenName.SampleTransporter) {
			updateStatusToInTransit(sampleTracking, data)
		} else if(route.name === Constants.screenName.SampleAcceptance) {
			updateStatusToAccepted(sampleTracking, data)
		}

		
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
		overflow: 'hidden',
	},
	againbutton: {
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 3,
		marginTop: -300,
		paddingBottom: 0
	}
});