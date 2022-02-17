/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { useContext, useCallback } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable } from 'react-native';

import Colors from '../constants/Colors';
import AuthContext from '../contexts/AuthContext';
import useColorScheme from '../hooks/useColorScheme';
import MyProfileScreen from '../screens/MyProfileScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import TabYourTicketsScreen from '../screens/TabYourTicketsScreen';
import TabBookTicketsScreen from '../screens/TabBookTicketsScreen';
import LogInScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import TabScanArtScreen from '../screens/TabScanArtScreen';
import TabArtListScreen from '../screens/TabArtListScreen';
import ArtDetailScreen from '../screens/ArtDetailScreen';

import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import { View } from '../components/Themed';
import { Logout } from '../components/Logout';
import LoadingComponent from '../components/LoadingComponent';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
    return (
        <NavigationContainer
            linking={LinkingConfiguration}
            theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <RootNavigator />
        </NavigationContainer>
    );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
    const {
        authenticated,
        setAuthenticated,
        userData,
    } = useContext(AuthContext);

    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LogInScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Root" component={authenticated ? BottomTabNavigator : HomeScreen} options={{ headerShown: false }} />
            {/* <Stack.Screen name="Scan" component={ScanScreen} options={{ headerShown: false }} /> */}
            <Stack.Screen name="Scan" component={ArtBottomTabNavigator} options={{ title: 'Artworks' }} />
            <Stack.Screen name="Artwork" component={ArtDetailScreen} options={{ title: 'Artwork Detail' }} />
            <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
            {/* <Stack.Screen name="Modal" component={MyProfileScreen} /> */}
            <Stack.Screen name="Logout" component={Logout} />
        </Stack.Navigator>
    );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
    const colorScheme = useColorScheme();
    const {
        authenticated
    } = useContext(AuthContext);

    if (!authenticated) {
        return null;
    }

    return (
        <BottomTab.Navigator
            initialRouteName="TabBookTickets"
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme].tint,
            }}>
            <BottomTab.Screen
                name="TabYourTickets"
                component={TabYourTicketsScreen}
                options={({ navigation }: RootTabScreenProps<'TabYourTickets'>) => ({
                    title: 'Your Tickets',
                    tabBarIcon: ({ color }) => <TabBarIcon name="ticket" color={color} />,
                    headerRight: () => <Logout />,
                })}
            />
            <BottomTab.Screen
                name="TabBookTickets"
                component={TabBookTicketsScreen}
                options={({ navigation }: RootTabScreenProps<'TabBookTickets'>) => ({
                    title: 'Search Tickets',
                    tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
                    headerRight: () => <Logout />,
                })}
            />
            <BottomTab.Screen
                name="MyProfile"
                component={MyProfileScreen}
                options={{
                    title: 'My Profile',
                    headerTitleStyle: {marginTop: 10},
                    tabBarIcon: ({ color }) => <TabBarIcon name="file-photo-o" color={color} />,
                    headerRight: () => <Logout />,
                }}
            />
        </BottomTab.Navigator>
    );
}


const ArtBottomTab = createBottomTabNavigator<RootTabParamList>();

function ArtBottomTabNavigator() {
    const colorScheme = useColorScheme();

    return (
        <ArtBottomTab.Navigator
            initialRouteName="TabScanArtScreen"
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme].tint,
            }}>
            <ArtBottomTab.Screen
                name="TabScanArtScreen"
                component={TabScanArtScreen}
                options={({ navigation }: RootTabScreenProps<'TabScanArtScreen'>) => ({
                    headerShown: false,
                    tabBarIcon: ({ color }) => <TabBarIcon name='qrcode' color={color} />,
                })}
            />
            <ArtBottomTab.Screen
                name="TabArtListScreen"
                component={TabArtListScreen}
                options={({ navigation }: RootTabScreenProps<'TabArtListScreen'>) => ({
                    headerShown: false,
                    tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
                })}
            />
        </ArtBottomTab.Navigator>
    );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}) {
    return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
