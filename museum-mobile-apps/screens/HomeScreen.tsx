import { Dimensions, StyleSheet } from 'react-native';

const { height } = Dimensions.get('window');
import { MaterialIcons as Icon } from '@expo/vector-icons';

import { Button, Text, View } from '../components/Themed';
import Colors from '../constants/Colors';

export default function HomeScreen(props: any) {
    const {
        navigation,
    } = props;
    return (
        <View style={styles.container}>
            <View style={{ alignItems: 'center', width: '100%' }}>
                <Icon
                    name="museum"
                    size={100}
                    style={styles.icon}
                />
                <Text style={styles.title}>Welcome</Text>
                <Text style={{ width: '75%', textAlign: 'center', fontSize: 16 }}>Book your tickets with us and improve your museum experience. </Text>
            </View>
            <View style={{ width: '100%' }}>
                <Button
                    onPress={() =>
                        navigation.navigate({ name: 'Login' })
                    }
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>
                        Log In
                    </Text>
                </Button>
                <Button
                    onPress={() =>
                        navigation.navigate({ name: 'Register' })
                    }
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>
                        Register
                    </Text>
                </Button>
                <Button
                    onPress={() => navigation.navigate({ name: 'Scan' })}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>
                        Artworks
                    </Text>
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    icon: {
        paddingHorizontal: '3%',
        color: Colors.primary,
        marginVertical: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    button: {
        width: '75%',
        marginVertical: height * 0.01,
        padding: 4,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    buttonText: {
        color: Colors.white,
        marginVertical: height * 0.01,
        fontSize: 16,
    },
});
