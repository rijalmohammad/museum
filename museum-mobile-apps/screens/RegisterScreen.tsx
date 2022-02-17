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

import { Ionicons as Icon } from '@expo/vector-icons';

import colors from '../constants/Colors';

// import { AppContext } from '../../../contexts/AppContext';
// import LoadingComponent from '../components/LoadingComponent';

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

    const [focusedField, setFocusedField] = useState('');
    const [firstName, setFirstName] = useState<string>();
    const [surName, setSurName] = useState<string>();
    const [phoneNumber, setPhoneNumber] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [confirmPassword, setConfirmPassword] = useState<string>();

    const [firstNameError, setFirstNameError] = useState('');
    const [surNameError, setSurNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneNumberError, setphoneNumberError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const onValidateForm = useCallback(
        (formKey, formValue) => {
            setFocusedField('');
            if (formKey === 'firstName') {
                if (formValue.length < 2) {
                    const nameErrorValue = 'First name is too short.';
                    setFirstNameError(nameErrorValue);
                    //   showToastMessage(nameErrorValue);
                } else {
                    setFirstNameError('');
                }
                return;
            }
            if (formKey === 'secondName') {
                if (formValue.length < 2) {
                    const nameErrorValue = 'Short name is too short.';
                    setSurNameError(nameErrorValue);
                    //   showToastMessage(nameErrorValue);
                } else {
                    setSurNameError('');
                }
                return;
            }
            if (formKey === 'email') {
                const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                if (!emailReg.test(formValue)) {
                    setEmailError('Email is invalid.');
                    //   showToastMessage('Please enter the valid email.');
                } else {
                    setEmailError('');
                }
            }
            if (formKey === 'phoneNumber') {
                if (formValue.length !== 10) {
                    setphoneNumberError('Phone number is invalid.');
                    //   showToastMessage('Please enter the valid phone number.');
                } else {
                    setphoneNumberError('');
                }
            }
            if (formKey === 'password') {
                if (formValue.length < 4) {
                    setPasswordError('Password is too short.');
                    //   showToastMessage('Password should be atleast 8 characters long.');
                } else {
                    setPasswordError('');
                }
            }

        }, [showToastMessage]);

    const onValidateConfirmPassword = useCallback((passwordValue, confirmPasswordValue) => {
        setFocusedField('');
        if (passwordValue !== confirmPasswordValue) {
            setConfirmPasswordError('Passwords Mismatch');
            showToastMessage('Please make sure your passwords match.');
        } else {
            setConfirmPasswordError('');
        }
    }, [showToastMessage, setFocusedField, setConfirmPasswordError]);

    const onClearData = useCallback(() => {
        setFirstName(undefined);
        setSurName(undefined);
        setPhoneNumber(undefined);
        setEmail(undefined);
        setPassword(undefined);
        setConfirmPassword(undefined);
    }, []);

    const onRegisterUser = useCallback(
        async () => {
            try {
                // setAppLoading(true);
                const response = await apis.post(
                    '/user',
                    {
                        password,
                        firstName,
                        surName,
                        email,
                        phoneNumber,
                    }
                );
                if (response.data === "Created") {
                    showToastMessage('Successfully Registered. Please login');
                    navigation.navigate('Login');
                    onClearData();
                }

                // setAppLoading(false);

            } catch (error) {
                console.warn({ error });
                showToastMessage('Registration failed. Please try again.');
            }
        },
        [
            password,
            firstName,
            surName,
            email,
            phoneNumber,
            onClearData,
        ],
    );

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const toggleIsPasswordVisible = useCallback(() => {
        setIsPasswordVisible(!isPasswordVisible);
    }, [isPasswordVisible, setIsPasswordVisible]);

    const toggleConfirmPasswordVisible = useCallback(() => {
        setConfirmPasswordVisible(!isConfirmPasswordVisible);
    }, [isConfirmPasswordVisible]);
    return (
        <ImageBackground
            source={require('../assets/images/icon.png')}
            style={{
                width: width,
                height: height,
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
                                    Register Yourself
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
                                        focusedField === 'firstName' ? { color: colors.primary } : {}
                                    ]}
                                >
                                    First Name *
                                </Text>
                                <TextInput
                                    placeholder="Enter First Name"
                                    onFocus={() => setFocusedField('firstName')}
                                    onChangeText={(firstNameValue) => setFirstName(firstNameValue)}
                                    value={firstName}
                                    selectionColor="#6373db"
                                    clearTextOnFocus={true}
                                    onEndEditing={(event) => onValidateForm('firstName', event.nativeEvent.text)}
                                    style={styles.formContent}
                                />
                                {
                                    !!firstNameError && <Text
                                        style={styles.errorText}
                                    >
                                        {firstNameError}
                                    </Text>
                                }
                            </View>
                            <View style={styles.formField}>
                                <Text
                                    style={[
                                        styles.formTitle,
                                        focusedField === 'surName' ? { color: colors.primary } : {}
                                    ]}
                                >
                                    Second Name *
                                </Text>
                                <TextInput
                                    placeholder="Enter Sur Name"
                                    onFocus={() => setFocusedField('surName')}
                                    onChangeText={(surNameValue) => setSurName(surNameValue)}
                                    value={surName}
                                    selectionColor="#6373db"
                                    clearTextOnFocus={true}
                                    onEndEditing={(event) => onValidateForm('surName', event.nativeEvent.text)}
                                    style={styles.formContent}
                                />
                                {
                                    !!surNameError && <Text
                                        style={styles.errorText}
                                    >
                                        {surNameError}
                                    </Text>
                                }
                            </View>
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
                                    placeholder="Enter Email"
                                    onFocus={() => setFocusedField('email')}
                                    onChangeText={(emailValue) => setEmail(emailValue)}
                                    value={email}
                                    selectionColor="#6373db"
                                    clearTextOnFocus={true}
                                    onEndEditing={(event) => onValidateForm('email', event.nativeEvent.text)}
                                    style={styles.formContent}
                                />
                                {
                                    !!emailError && <Text
                                        style={styles.errorText}
                                    >
                                        {emailError}
                                    </Text>
                                }
                            </View>
                            <View style={styles.formField}>
                                <Text
                                    style={[
                                        styles.formTitle,
                                        focusedField === 'phoneNumber' ? { color: colors.primary } : {}
                                    ]}
                                >
                                    Phone Number *
                                </Text>
                                <TextInput
                                    placeholder="Enter Phone Number"
                                    onFocus={() => setFocusedField('phoneNumber')}
                                    onChangeText={(phoneNumberValue) => setPhoneNumber(phoneNumberValue)}
                                    value={phoneNumber}
                                    selectionColor="#6373db"
                                    clearTextOnFocus={true}
                                    onEndEditing={(event) => onValidateForm('phoneNumber', event.nativeEvent.text)}
                                    style={styles.formContent}
                                    keyboardType="phone-pad"
                                />
                                {
                                    !!phoneNumberError && <Text
                                        style={styles.errorText}
                                    >
                                        {phoneNumberError}
                                    </Text>
                                }
                            </View>
                            <View style={styles.formField}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.formTitle,
                                            focusedField === 'password' ? { color: colors.primary } : {}
                                        ]}
                                    >
                                        Password *
                                    </Text>
                                    {!!password && (
                                        <TouchableOpacity
                                            onPress={() => toggleIsPasswordVisible()}
                                        >
                                            <Icon
                                                name={isPasswordVisible ? "eye" : "eye-off"}
                                                size={14}
                                                style={{ paddingHorizontal: '3%', color: colors.primary }}
                                            />
                                        </TouchableOpacity>
                                    )}
                                </View>
                                <TextInput
                                    placeholder="Enter Password"
                                    onFocus={() => setFocusedField('password')}
                                    onChangeText={(passwordValue) => setPassword(passwordValue)}
                                    value={password}
                                    selectionColor="#6373db"
                                    clearTextOnFocus={true}
                                    onEndEditing={(event) => onValidateForm('password', event.nativeEvent.text)}
                                    style={styles.formContent}
                                    secureTextEntry={!isPasswordVisible}
                                />
                                {
                                    !!passwordError && <Text
                                        style={styles.errorText}
                                    >
                                        {passwordError}
                                    </Text>
                                }
                            </View>
                            {!!password && !passwordError && (
                                <View style={styles.formField}>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.formTitle,
                                                focusedField === 'confirmPassword' ? { color: colors.primary } : {}
                                            ]}
                                        >
                                            Confirm Password *
                                        </Text>
                                        {!!confirmPassword && <TouchableOpacity
                                            onPress={() => toggleConfirmPasswordVisible()}
                                        >
                                            <Icon
                                                name={isConfirmPasswordVisible ? "eye" : "eye-off"}
                                                size={14}
                                                style={{ paddingHorizontal: '3%', color: colors.primary }}
                                            />
                                        </TouchableOpacity>}
                                    </View>
                                    <TextInput
                                        placeholder="Confirm Password"
                                        onFocus={() => setFocusedField('confirmPassword')}
                                        onChangeText={(confirmPasswordValue) => setConfirmPassword(confirmPasswordValue)}
                                        value={confirmPassword}
                                        selectionColor="#6373db"
                                        clearTextOnFocus={true}
                                        onEndEditing={(event) => onValidateConfirmPassword(password, event.nativeEvent.text)}
                                        style={styles.formContent}
                                        secureTextEntry={!isConfirmPasswordVisible}
                                    />
                                    {
                                        !!confirmPasswordError && <Text
                                            style={styles.errorText}
                                        >
                                            {confirmPasswordError}
                                        </Text>
                                    }
                                </View>
                            )}
                            <View>
                                {/* {
                                    appLoading && <LoadingComponent />
                                } */}
                                <Button
                                    onPress={() => console.warn('forgot password pressed')}
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
                                onPress={onRegisterUser}
                            >
                                <Text
                                    style={{
                                        color: '#fff',
                                        fontSize: 16,
                                        textAlign: 'center',
                                        fontWeight: '600',
                                    }}>
                                    Register
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
                                <Text>Already have an account?</Text>
                                <Button
                                    style={[
                                        styles.registerButton,
                                        { marginTop: height * 0.02, marginBottom: 0 },
                                    ]}
                                    onPress={() =>
                                        navigation.navigate('Login')
                                    }>
                                    <Text
                                        style={{
                                            color: '#fff',
                                            fontSize: 16,
                                            textAlign: 'center',
                                        }}>
                                        Log in
                                    </Text>
                                </Button>
                                <Button
                                    onPress={() =>
                                        navigation.navigate({ name: "Home" })
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
        marginBottom: 2,
        fontWeight: '600',
    },
    formContent: {
        color: colors.secondaryTextColor,
        fontSize: 16,
        borderBottomWidth: 0.25,
        borderBottomColor: '#3C4858',
    },
    formField: {
        marginVertical: width * 0.02,
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
