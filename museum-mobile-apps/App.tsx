import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { useMemo, useState } from 'react';
import AuthContext from './contexts/AuthContext';
import { UserResponse as User } from './typings';

export default function App() {
    const isLoadingComplete = useCachedResources();
    const colorScheme = useColorScheme();
    const [userData, setUserData] = useState<User | undefined>();
    const [authenticated, setAuthenticated] = useState(false);

    const authContextValue: AuthContext = useMemo(
        () => ({
            userData,
            setUserData,
            authenticated,
            setAuthenticated,
        }),
        [userData, authenticated],
    );

    if (!isLoadingComplete) {
        return null;
    } else {
        return (
            <SafeAreaProvider>
                <AuthContext.Provider value={authContextValue}>
                    <Navigation colorScheme={colorScheme} />
                    <StatusBar />
                </AuthContext.Provider>
            </SafeAreaProvider>
        );
    }
}
