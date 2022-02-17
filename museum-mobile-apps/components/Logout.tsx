import { FontAwesome } from '@expo/vector-icons';
import { useCallback, useContext } from 'react';
import { Pressable } from 'react-native';
import Colors from '../constants/Colors';
import AuthContext from '../contexts/AuthContext';
import useColorScheme from '../hooks/useColorScheme';

export function Logout() {
    const colorScheme = useColorScheme();
    const {
        setUserData,
        setAuthenticated,
    } = useContext(AuthContext);

    const onLogout = useCallback(
        () => {
            setUserData(undefined);
            setAuthenticated(false);
        },
        [setUserData, setAuthenticated],
    );

    return (
        <Pressable
            onPress={onLogout}
            style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
            })}>
            <FontAwesome
                name="sign-out"
                size={25}
                color={Colors[colorScheme].button}
                style={{ marginRight: 15 }}
            />
        </Pressable>
    )
}
