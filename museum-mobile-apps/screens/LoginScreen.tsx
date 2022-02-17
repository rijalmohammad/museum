import React, { useState, useCallback, useContext } from 'react';

import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    ImageBackground,
    Platform
} from 'react-native';

import colors from '../constants/Colors';

import { Ionicons as Icon } from '@expo/vector-icons';
// import { AppContext } from '../../../contexts/AppContext';
// import LoadingComponent from '../components/LoadingComponent';
import AuthContext from '../contexts/AuthContext';
import showToastMessage from '../utils/showToastMessage';
import { Button } from '../components/Themed';

import apis from '../utils/apis';

const { width, height } = Dimensions.get('window');

export default function UserLogInScreen(props: any) {
    const {
        navigation,
    } = props;

    // const {
    //     appLoading,
    //     setAppLoading
    // } = useContext(AppContext);

    const {
        setUserData,
        setAuthenticated,
    } = useContext(AuthContext);

    const [focusedField, setFocusedField] = useState('');
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [formValidationErrors, setFormValidationErrors] = useState({
        emailError: '',
        passwordError: ''
    });

    const onValidateEmail = useCallback(
        (emailValue) => {
            setFocusedField('');
            const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

            if (!reg.test(emailValue)) {
                showToastMessage('Please enter the valid email.');

                setFormValidationErrors({
                    ...formValidationErrors,
                    emailError: 'Invalid Email'
                });
            } else {
                setEmail(emailValue);
                setFormValidationErrors({
                    ...formValidationErrors,
                    emailError: ''
                });
            }
        }, [showToastMessage, setFormValidationErrors, setEmail]
    );

    const onValidatePassword = useCallback(
        (passwordValue) => {
            setFocusedField('');
            if (passwordValue.length < 7) {
                showToastMessage('Password should be atleast 7 characters long.');
                setFormValidationErrors({
                    ...formValidationErrors,
                    passwordError: 'Short Password (should be atleast 7 characters long)'
                });
            } else {
                setPassword(passwordValue);
                setFormValidationErrors({
                    ...formValidationErrors,
                    passwordError: ''
                });
            }
        }, [setFormValidationErrors, setEmail, setPassword]
    );

    const onClearData = useCallback(() => {
        setEmail(undefined);
        setPassword(undefined);
    }, []);

    const onLogInUser = useCallback(
        async () => {
            try {
                // setAppLoading(true);
                if (!email) {
                    onValidateEmail('');
                    return;
                }
                if (!password) {
                    onValidatePassword('');
                    return;
                }
                const response = await apis.post(
                    'user/login',
                    {
                        email,
                        password,
                    },
                );


                if (response.status === 200) {
                    setUserData(response.data);
                    setAuthenticated(true);
                    showToastMessage('Successfully logged in');
                    navigation.navigate('Root', {
                        screen: 'TabBookTickets',
                    });
                    onClearData();
                }

                // setAppLoading(false);

            } catch (error) {
                console.warn({ error });
                showToastMessage('Email or Password is incorrect.');
            }
        }, [setUserData, email, password, navigation, onClearData]);

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const toggleIsPasswordVisible = useCallback(() => {
        setIsPasswordVisible(!isPasswordVisible);
    }, [isPasswordVisible, setIsPasswordVisible]);

    return (
        <ImageBackground
            source={require('../assets/images/icon.png')}
            style={{
                width: width,
                height: height,
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <ScrollView
                contentContainerStyle={{
                    justifyContent: 'center',
                    flex: 1,
                }}
            >
                <View style={{
                    backgroundColor: colors.white,
                    marginHorizontal: width * 0.06,
                    borderRadius: width * 0.02,
                }}>
                    <View style={styles.page}>
                        <View
                            style={{
                                backgroundColor: colors.primary,
                                borderTopEndRadius: width * 0.02,
                                borderTopStartRadius: width * 0.02,
                            }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    height: Platform.OS === 'android' ? 70 : 80,
                                    justifyContent: 'center',
                                }}>
                                <Text
                                    style={{
                                        fontSize: 20,
                                        color: 'white',
                                    }}
                                >
                                    Log In Yourself
                                </Text>
                            </View>
                        </View>

                        <View
                            style={{
                                paddingVertical: height * 0.015,
                                paddingHorizontal: width * 0.06,
                            }}>
                            <View style={styles.formField}>
                                <Text
                                    style={[
                                        styles.formTitle,
                                        focusedField === 'email' ? { color: colors.primary } : {}
                                    ]}
                                >
                                    Email *
                                </Text>
                                <TextInput
                                    // name="email"
                                    placeholder="Enter Email"
                                    onFocus={() => setFocusedField('email')}
                                    onChangeText={(emailValue) => setEmail(emailValue)}
                                    value={email}
                                    selectionColor="#6373db"
                                    clearTextOnFocus={true}
                                    onEndEditing={(event) => onValidateEmail(event.nativeEvent.text)}
                                    style={[
                                        styles.formContent,
                                        focusedField === 'email' ? { color: 'black' } : {},
                                    ]}
                                />
                                {!!formValidationErrors.emailError && <Text
                                    style={styles.errorText}
                                >
                                    {formValidationErrors.emailError}
                                </Text>}
                            </View>

                            <View style={styles.formField}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <Text style={[
                                        styles.formTitle,
                                        focusedField === 'password' ? { color: colors.primary } : {}
                                    ]}>Password * </Text>
                                    {!!password && <TouchableOpacity
                                        onPress={() => toggleIsPasswordVisible()}
                                    >
                                        <Icon
                                            name={isPasswordVisible ? "eye" : "eye-off"}
                                            size={14}
                                            style={{ paddingHorizontal: '3%', color: colors.primary }}
                                        />
                                    </TouchableOpacity>}
                                </View>
                                <TextInput
                                    placeholder="Enter Password"
                                    onFocus={() => setFocusedField('password')}
                                    onChangeText={(passwordValue) => setPassword(passwordValue)}
                                    value={password}
                                    selectionColor="#6373db"
                                    clearTextOnFocus={true}
                                    onEndEditing={(event) => onValidatePassword(event.nativeEvent.text)}
                                    style={[
                                        styles.formContent,
                                        focusedField === 'password' ? { color: 'black' } : {},
                                    ]}
                                    secureTextEntry={!isPasswordVisible}
                                />

                                {!!formValidationErrors.passwordError && <Text
                                    style={styles.errorText}
                                >
                                    {formValidationErrors.passwordError}
                                </Text>}
                            </View>
                            <View>
                                {/* {
                                    appLoading && <LoadingComponent />
                                } */}
                                <Button
                                    onPress={() => console.warn('forgot password pressed (dummy action)')}
                                    transparent
                                >
                                    <Text style={{
                                        color: colors.primary,
                                        textAlign: 'center',
                                        marginVertical: height * 0.01,
                                    }}
                                    >
                                        Forgot password?
                                    </Text>
                                </Button>
                            </View>
                            <Button
                                style={styles.registerButton}
                                onPress={onLogInUser}
                            >
                                <Text
                                    style={{
                                        color: '#fff',
                                        fontSize: 16,
                                        textAlign: 'center',
                                        fontWeight: '600',
                                    }}>
                                    Login
                                </Text>
                            </Button>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-around',
                                    marginVertical: width * 0.04,
                                }}>
                                <View style={styles.line} />
                            </View>
                            <View
                                style={{
                                    alignItems: 'center',
                                    marginVertical: height * 0.01,
                                }}>
                                <Text>Don't have an account?</Text>
                                <Button
                                    style={[
                                        styles.registerButton,
                                        { marginTop: height * 0.02, marginBottom: 0 },
                                    ]}
                                    onPress={() =>
                                        navigation.navigate('Register')
                                    }>
                                    <Text
                                        style={{
                                            color: '#fff',
                                            fontSize: 16,
                                            textAlign: 'center',
                                        }}>
                                        Register
                                    </Text>
                                </Button>
                                <Button
                                    onPress={() =>
                                        navigation.navigate({ name: 'Home' })
                                    }
                                    transparent
                                >
                                    <Text style={{
                                        color: colors.primary,
                                        textAlign: 'center',
                                        marginVertical: height * 0.01,
                                    }}
                                    >
                                        Return to home page
                                    </Text>
                                </Button>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    page: {
        backgroundColor: 'white',
        borderRadius: width * 0.02,
    },
    formTitle: {
        fontSize: 12,
        color: '#3C4858',
        marginBottom: 4,
        fontWeight: '600',
    },
    formContent: {
        color: colors.secondaryTextColor,
        fontSize: 16,
        borderBottomWidth: 0.25,
        borderBottomColor: '#3C4858',
    },
    formField: {
        marginVertical: height * 0.02,
    },
    registerButton: {
        width: '40%',
        marginVertical: height * 0.01,
        padding: 8,
        borderRadius: width * 0.02,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },

    line: {
        borderBottomColor: colors.primary,
        borderBottomWidth: 2,
        width: width * 0.2,
    },
    orText: {
        color: colors.primary,
        width: width * 0.4,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginVertical: 2,
    }
});
