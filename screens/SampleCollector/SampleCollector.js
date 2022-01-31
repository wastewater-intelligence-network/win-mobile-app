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

export default function SampleCollector() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(true);
	const [locationPermissionVisible, setLocationPermissionVisible] = useState(false);
	const [location, setLocation] = useState(undefined);
	const [sampleDataOverlayVisible, setSampleDataOverlayVisible] = useState(false);
	const [listOverlayVisible, setListOverlayVisible] = useState(false);
	const [qrData, setQrData] = useState(undefined);
	const [collectionPointList, setCollectionPointList] = useState(undefined);

	const [phValue, setPhValue] = useState(undefined)
	const [temperatureValue, setTemparatureValue] = useState(undefined)
	const [inflowValue, setInflowValue] = useState(undefined)

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
			setScanned(false)
			console.log(l)
		})();
	}

	// Request Camera Permission
	useEffect(() => {
		askForCameraPermission();
		getLocation();
	}, []);

	const toggleOverlay = (overlay) => {
		if(overlay === 'locationPermissionOverlay') {
			setLocationPermissionVisible(!locationPermissionVisible)
		} else if(overlay === 'sampleDataOverlay') {
			setSampleDataOverlayVisible(!sampleDataOverlayVisible)
		} else if(overlay === 'listOverlay') {
			setListOverlayVisible(!listOverlayVisible)
		}
	};

	// What happens when we scan the bar code
	const handleBarCodeScanned = ({ type, data }) => {
		setScanned(true)
		setQrData(data)

		toggleOverlay('sampleDataOverlay')

		// Alert.alert(
		// 	"New Sample Collected",
		// 	"Collected sample for container " + data,
		// 	[
		// 		{
		// 			text: "Yes",
		// 			onPress: () => setScanned(false)
		// 		}, {
		// 			text: "No",
		// 			onPress: () => setScanned(false)
		// 		}
		// 	]
		// )
	};

	const validateFloatAndSet = (type, value) => {
		
	}

	const handleSampleDataSubmit = (pointId) => {
		if(sampleDataOverlayVisible) {
			toggleOverlay('sampleDataOverlay')
		}

		let additionalData
		
		if(phValue !== undefined || temperatureValue !== undefined || inflowValue !== undefined) {
			additionalData = {
				'ph': phValue,
				'temperature': temperatureValue,
				'inflow': inflowValue
			}
		}
		
		var s = new SampleTracking()
		s.sampleCollected(location, qrData, pointId, additionalData)
			.then((res) => {
				if(res.status === 501) {
					setCollectionPointList(res.list)
					toggleOverlay('listOverlay')
					return
				} else if(res.status !== 200) {
					Alert.alert("Issue with sample collection", res.message, [
						{
							title: 'Ok',
							onPress: () => { setScanned(false) }
						}
					])
				} else {
					Alert.alert("Successful", res.message, [
						{
							title: 'Ok',
							onPress: () => { setScanned(false) }
						}
					])
				}
			})
			.catch(err => console.log(err))
	}

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

	const renderCollectionPointList = () => {
		if(collectionPointList !== undefined) {
			let list = []
			collectionPointList.forEach((point, idx) => {
				list.push(
					<TouchableHighlight
						key={idx}
						style={styles.pointListItemContainer}
						underlayColor={Constants.colors.primaryDark}
						onPress={() => {
							handleSampleDataSubmit(point.pointId)
							toggleOverlay('listOverlay')
						}}	
					>
						<Text 
							key={idx}
							style={styles.pointListItem}
						>
							{point.name}
						</Text>
					</TouchableHighlight>
				)
			})
			return list
		}
		
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
				<Overlay isVisible={location === undefined}>
					<ActivityIndicator size="large" color="#0000ff" />
					<Text>Getting your location</Text>
				</Overlay>
				<Overlay
				 	style={styles.sampleDataOverlay}
					isVisible={sampleDataOverlayVisible} 
					onBackdropPress={() => {toggleOverlay('sampleDataOverlay'); setScanned(false)}}
				>
					<Text style={styles.sampleDataHeading}>Additional Data</Text>
					<TextInput
						style={styles.sampleDataInput}
						placeholder='pH Value'
						selectionColor="#756BDE"
						autoCapitalize='none'
						keyboardType='decimal-pad'
						onChangeText={setPhValue}
					/>
					<TextInput
						style={styles.sampleDataInput}
						placeholder='Temperature'
						selectionColor="#756BDE"
						autoCapitalize='none'
						keyboardType='decimal-pad'
						onChangeText={setTemparatureValue}
					/>
					<TextInput
						style={styles.sampleDataInput}
						placeholder='Inflow'
						selectionColor="#756BDE"
						autoCapitalize='none'
						keyboardType='decimal-pad'
						onChangeText={setInflowValue}
					/>
					<TouchableHighlight 
						style={styles.button}
						underlayColor={Constants.colors.primaryDark}
						onPress={() => {handleSampleDataSubmit(undefined)}}
					>
						<Text style={styles.buttonText}>Submit</Text>
					</TouchableHighlight>
				</Overlay>

				<Overlay
				 	style={styles.sampleDataOverlay}
					isVisible={listOverlayVisible} 
					onBackdropPress={() => {toggleOverlay('listOverlay'); setScanned(false)}}
				>
					<Text style={styles.pointListHeading}>Multiple collection points nearby. Please pick one</Text>
					{renderCollectionPointList()}
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
	},
	sampleDataOverlay: {
		padding: 20
	},
	sampleDataHeading: {
		fontSize: 20,
		paddingHorizontal: 30
	},
	sampleDataInput: {
		margin: 5,
		padding: 10,
		backgroundColor: '#eee'
	},
	button: {
		marginVertical: 5,
		alignItems: "center",
		backgroundColor: "#756BDE",
		padding: 10
	},
	buttonText: {
		fontSize: 15,
		fontWeight: 'bold',
		color: "#fff",
	},
	pointListHeading: {
		fontSize: 18,
		fontWeight: 'bold',
		marginVertical: 10
	},
	pointListItemContainer: {
		backgroundColor: Constants.colors.primary,
		marginVertical: 10
	},
	pointListItem: {
		fontSize: 14,
		padding: 15,
		color: '#fff'
	}
});