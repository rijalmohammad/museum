import { Ionicons as Icon } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useContext } from 'react';
import { Platform, StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import Colors from '../constants/Colors';
import AuthContext from '../contexts/AuthContext';
import useColorScheme from '../hooks/useColorScheme';

export default function MyProfileScreen() {
    const {
        userData,
    } = useContext(AuthContext);
    
    if (!userData){
        return null;
    }

    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme];
    return (
        <View style={styles.container}>
            <Icon
                name="person"
                size={100}
                style={{ paddingHorizontal: '3%', color: colors.primary }}
            />
            <Text style={styles.title}>{userData.firstName} {userData.surName}</Text>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
            <Text style={styles.detail}>
                <Icon
                    name="call"
                    size={14}
                />
                {' '}{userData.phonenumber}
            </Text>
            <Text style={styles.detail}>
                <Icon
                    name="mail"
                    size={14}
                />
                {' '}{userData.email}
            </Text>
            {/* Use a light status bar on iOS to account for the black space above the modal */}
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    detail: {
        fontSize: 16,
        fontWeight: '600',
        marginVertical: 10,
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
