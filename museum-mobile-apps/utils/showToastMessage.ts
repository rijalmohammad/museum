import {
    Platform,
    ToastAndroid,
} from 'react-native';

export default function showToastMessage(message: string) {
     if (message) {
        if (Platform.OS === 'web') {
            console.warn({ message });
            return;
        }
        ToastAndroid.showWithGravityAndOffset(
            message,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
        );
        return null;
    }
    return null;
}