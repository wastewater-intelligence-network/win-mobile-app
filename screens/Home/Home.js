import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { 
	StyleSheet, 
	Text, 
	View,
	TextInput,
	Image,
	TouchableHighlight,
	ToastAndroid
} from 'react-native';
import Constants from '../constants';

import SampleCollectionIcon from '../../assets/safety-suit.png';
import TransporterIcon from '../../assets/delivery-man.png';
import LabAcceptanceIcon from '../../assets/parcel.png';
import LabTestIcon from '../../assets/medical-lab.png';
import ListIcon from '../../assets/task-list.png';

export default function Home({navigation}) {

	const styles = StyleSheet.create({
		container: {
			flex: 1,
			padding: 27,
			backgroundColor: '#fff',
			alignItems: 'center',
			justifyContent: 'center',
            fontFamily: "Quicksand"
		},
        listTaskMessage: {
            fontSize: 25,
            textAlign: "center",
            color: Constants.colors.primary
        },
        taskBoxContainer: {
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 30,
            flexWrap: "wrap"
        },
        taskBox: {
            width: "45%",
            height: 140,
            backgroundColor: "#eee",
            margin: 5,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 3
        },
        taskImage: {
            width: 50,
            height: 50
        },
        taskText: {
            fontSize: 14,
            paddingTop: 5,
            textAlign: "center",
            fontWeight: "bold"
        },
        signout: {
            marginTop: 60,
            fontSize: 15,
        }
	});

    const roles = {
        "collector": [
            {
                "text": "Sample\nCollection",
                "icon": SampleCollectionIcon,
                "navigate": Constants.screenName.SampleCollector
            }
        ],
        "transporter": [
            {
                "text": "Sample\nTransportation",
                "icon": TransporterIcon,
                "navigate": Constants.screenName.SampleTransporter
            }
        ],
        "technician": [
            {
                "text": "Accept\nSample",
                "icon": LabAcceptanceIcon,
                "navigate": Constants.screenName.SampleAcceptance
            },
            {
                "text": "Samples\nList",
                "icon": ListIcon,
                "navigate": Constants.screenName.SamplesList
            },
            // {
            //     "text": "Finish\nTest",
            //     "icon": LabTestIcon,
            //     "navigate": undefined
            // }
        ]
    }

    const renderTaskBoxes = () => {
        var view = []
        Object.keys(roles).forEach((role, idx) => {
            roles[role].forEach((r, rIdx) => {
                view.push(
                    <TouchableHighlight 
                        key={10*idx + rIdx}
                        style={styles.taskBox}
                        underlayColor="#ddd"
                        onPress={() => {navigation.navigate(r.navigate)}}
                    >
                        <>
                            <Image
                                source={r.icon}
                                style={styles.taskImage}
                            />
                            <Text 
                                style={styles.taskText}
                                textBreakStrategy="balanced"
                            >{r.text}</Text>
                        </>
                    </TouchableHighlight>
                )
            })
        })
        return view
    }
	
	return (
		<View style={styles.container}>
			<Text style={styles.listTaskMessage}>HERE IS A LIST OF TASKS YOU CAN DO ON THE APP</Text>
            <View style={styles.taskBoxContainer}>
                {renderTaskBoxes()}
            </View>
            <Text style={styles.signout}>Sign Out</Text>
		</View>
	);
}
