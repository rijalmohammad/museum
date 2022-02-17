import React, { useCallback, useState } from 'react';

import {
    View,
    Dimensions,
    StyleSheet,
    Image,
    Modal,
    Alert
} from 'react-native';
import { BookingItem, PaymentMethod } from '../typings';
import { Button, Text } from './Themed';

import Colors from '../constants/Colors';
import apis from '../utils/apis';
import showToastMessage from '../utils/showToastMessage';
import useColorScheme from '../hooks/useColorScheme';
const { height, width } = Dimensions.get('screen');

interface BookingCardProps {
    bookingDetail: BookingItem;
    paymentMethods: PaymentMethod[] | undefined;
    updateBookingStatus: React.Dispatch<React.SetStateAction<BookingItem[] | undefined>>
    bookedTickets: BookingItem[] | undefined;
}
const BookingCard = (props: BookingCardProps) => {
    const [paymentOnProgress, setPaymentOnProgress] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod['_id']>();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme];
    const {
        bookingDetail,
        paymentMethods,
        updateBookingStatus,
        bookedTickets,
    } = props;

    const {
        id,
        totalPrice,
        description,
        bookingDate,
        bookingTime,
        status,
        quantity,
        name,
    } = bookingDetail;

    const onCloseModal = useCallback(() => {
        setPaymentOnProgress(false);
        setSelectedPaymentMethod(undefined);
    }, []);

    const onUpdatePayment = useCallback(() => {
        if(!bookedTickets) {
            return;
        }
        const tempBookedTickets = [...bookedTickets];
        const tickedIndex = tempBookedTickets.findIndex(ticket => ticket.id === id);
        tempBookedTickets[tickedIndex].status = 'PAID';
        updateBookingStatus(tempBookedTickets);

    },[bookedTickets, id])

    const onCancelPayment = useCallback(() => {
        onCloseModal();
        showToastMessage('Payment cancelled (dummy action)')
    },[]);
    const onConfirmPayment = useCallback(
        async () => {
            try {
                const response = await apis.post(
                    'payment',
                    {
                        bookingId: id,
                        amount: totalPrice,
                    },
                );
                if (response.status === 200) {
                    showToastMessage('Payment Success. Thank you, have a nice visit');
                    onUpdatePayment();
                    onCloseModal();
                }
            } catch (error) {
                console.warn({ error });
                showToastMessage('Payment unsuccessful. Please retry.');
            }
        },
        [id, totalPrice, onCloseModal],
    );

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '80%' }}>
                        <Text
                            style={{
                                color: Colors.black,
                                fontWeight: 'bold',
                                fontSize: 18,
                            }}>
                            {name}
                        </Text>
                        <Text
                            style={{
                                color: Colors.primary,
                                fontSize: 16,
                            }}>
                            Tickets Count {quantity}
                        </Text>
                    </View>
                    <Image
                        style={{ width: '20%' }}
                        source={{
                            uri: 'https://se4gd.lutsoftware.com/wp-content/uploads/2020/10/cropped-logo.png',
                        }}
                    />
                </View>
            </View>
            <Text
                style={{
                    color: Colors.primary,
                    fontWeight: 'bold',
                    fontSize: 16,
                }}>
                Total Price EUR {totalPrice}
            </Text>
            <Text
                style={{
                    fontSize: 16,
                }}>
                Booked for {bookingDate} from {bookingTime}
            </Text>
            <Text
                style={{
                    fontSize: 16,
                }}>
                {description}
            </Text>
            <View>
                {status === 'NOT PAID' && (
                    <View style={styles.buttonContainer}>
                        <Button
                            onPress={
                                () => showToastMessage('Booking cancelled. (Dummy action)')
                            }
                            style={[styles.button, styles.cancelButton]}
                        >
                            <Text style={{
                                color: Colors.white,
                                textAlign: 'center',
                                margin: width * 0.01,
                            }}
                            >
                                Cancel Booking
                            </Text>
                        </Button>
                        <Button
                            onPress={() => setPaymentOnProgress(true)}
                            style={styles.button}
                        >
                            <Text style={{
                                color: Colors.white,
                                textAlign: 'center',
                                padding: width * 0.01,
                            }}
                            >
                                Make Payment
                            </Text>
                        </Button>
                    </View>
                )}
                {(status === 'PAID' || status === 'EXPIRED') && (
                    <Text
                        style={[
                            {
                                color: status === 'PAID' ? colors.background : colors.text,
                                backgroundColor: status === 'PAID' ? colors.primary : colors.background,
                                textAlign: 'center',
                            },
                            styles.statusMessage,
                        ]}
                    >
                        {status}
                    </Text>
                )}
            </View>
            {paymentOnProgress && (
                <Modal
                    animationType="slide"
                    transparent
                    visible={paymentOnProgress}
                    onRequestClose={() => {
                        Alert.alert('Payment has been discontinued.');
                        setPaymentOnProgress(false);
                    }}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalView}>
                            <Text style={styles.title}>Make Payment</Text>
                            <Image
                                style={{ width: width * 0.2, height: width * 0.2, }}
                                source={{
                                    uri: 'https://se4gd.lutsoftware.com/wp-content/uploads/2020/10/cropped-logo.png',
                                }}
                            />
                            <Text
                                style={{
                                    fontSize: 18,
                                    width: '100%',
                                }}
                            >
                                You are paying for
                                <Text style={{ fontWeight: 'bold' }}> {quantity} tickets </Text>
                                , a total amount
                                <Text style={{ fontWeight: 'bold' }}> EUR {totalPrice} </Text>.
                                Your visit destination is <Text style={{ fontWeight: 'bold' }}> {name} </Text>
                                on
                                <Text style={{ fontWeight: 'bold' }}> {bookingDate}, {bookingTime} </Text> onwards.
                                Please select a payment option below to confirm your booking.
                            </Text>
                            <View style={{ flexDirection: 'row', width: '100%' }}>
                                {paymentMethods && paymentMethods.map(method => (
                                    <Button
                                        key={method._id}
                                        onPress={() => setSelectedPaymentMethod(method._id)}
                                        transparent={selectedPaymentMethod !== method._id}
                                        style={styles.paymentMethod}
                                    >
                                        <Text
                                            style={{
                                                color: method._id == selectedPaymentMethod ? Colors.white : Colors.black,
                                                fontSize: 20,
                                                alignSelf: 'center',
                                            }}
                                        >
                                            {method.name}
                                        </Text>
                                    </Button>
                                ))}
                            </View>
                            <Button
                                style={[
                                    styles.submitButton,
                                    !selectedPaymentMethod && {
                                        backgroundColor: '#dedede',
                                    },
                                ]}
                                onPress={onConfirmPayment}
                                disabled={!selectedPaymentMethod}
                            >
                                <Text
                                    style={{
                                        color: Colors.white,
                                        fontSize: 16,
                                        textAlign: 'center',
                                        fontWeight: '600',
                                    }}>
                                    Confirm Payment
                                </Text>
                            </Button>
                            <Button
                                style={[styles.submitButton, styles.cancelButton]}
                                onPress={onCancelPayment}
                            >
                                <Text
                                    style={{
                                        color: '#fff',
                                        fontSize: 16,
                                        textAlign: 'center',
                                        fontWeight: '600',
                                    }}>
                                    Cancel
                                </Text>
                            </Button>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    )
};


export default BookingCard;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        borderRadius: 8,
        marginVertical: height * 0.01,
        borderColor: Colors.primary,
        borderWidth: 2,
        width: width * 0.95,
        padding: width * 0.01,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: width * 0.01,
        justifyContent: 'space-between',
    },
    button: {
        width: '45%',
        borderRadius: width * 0.02,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    cancelButton: {
        backgroundColor: Colors.danger,
    },

    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: width * 0.94,
        height: height * 0.8,
        justifyContent: 'space-around',
    },

    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },

    paymentMethod: {
        borderColor: Colors.primary,
        borderWidth: 2,
        height: height * 0.15,
        justifyContent: 'center',
        width: '50%',
    },

    submitButton: {
        width: '100%',
        marginVertical: height * 0.01,
        padding: 8,
        borderRadius: width * 0.02,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },

    closeButtonText: {
        color: Colors.white,
        fontSize: 20,
        textAlign: 'center',
        fontWeight: '600',
    },

    statusMessage: {
        paddingVertical: width * 0.01,
        paddingHorizontal: width * 0.03,
        borderRadius: width * 0.02,
        alignSelf: 'flex-end',
    }
});
