import { Ionicons } from '@expo/vector-icons';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Dimensions, TextInput, RefreshControl, TouchableWithoutFeedback, Keyboard } from 'react-native';
import DatePicker from '../components/DatePicker';

import { Text, View, Button } from '../components/Themed';
import TicketCard from '../components/TicketCard';
import Colors from '../constants/Colors';
import AuthContext from '../contexts/AuthContext';
import { AvailableTicket } from '../typings';
import apis from '../utils/apis';
import showToastMessage from '../utils/showToastMessage';

type TimeSlot = '09:00' | '11:00' | '13:00' | '15:00';

const availabeTimeSlots: TimeSlot[] = ['09:00', '11:00', '13:00', '15:00'];

const { width, height } = Dimensions.get('window');
export default function TabBookTicketsScreen() {
    const { userData } = useContext(AuthContext);
    const [availableTickets, setAvailableTickets] = useState<AvailableTicket[]>();
    const [bookableTicketId, setBookableTicketId] = useState<string>();
    const [selectedDate, setSelectedDate] = useState<string>();
    const [selectedTime, setSelectedTime] = useState<string>();
    const [ticketCount, setTicketCount] = useState<string>();
    const [refreshing, setRefreshing] = useState(false);

    const onCloseModal = useCallback(() => {
        setBookableTicketId(undefined);
        setSelectedDate(undefined);
        setSelectedTime(undefined);
        setTicketCount(undefined);
    }, []);

    const ticketBookable = selectedDate && selectedTime && ticketCount;
    const getAvailableTickets = async () => {
        try {
            setRefreshing(true);
            const response = await apis.get('/booking/available-tickets');
            if (!response) {
                return;
            }
            setAvailableTickets(response.data);
            setRefreshing(false);
        }
        catch (error) {
            console.warn({ error });
        }
    };
    useEffect(() => {
        getAvailableTickets();
    }, []);

    const formattedSelectedDate = selectedDate ? new Date(selectedDate).toDateString() : '';
    const modalVisible = !!bookableTicketId;

    const onBookTicket = useCallback(
        async () => {
            try {
                if (!userData?.userId) {
                    return;
                }
                const response = await apis.post(
                    '/booking',
                    {
                        quantity: ticketCount,
                        date: selectedDate,
                        time: selectedTime,
                        userId: userData?.userId,
                        ticketId: bookableTicketId,
                    },
                );
                if (response.status === 200) {
                    showToastMessage('Ticket successfully booked. Check your tickets to make payments');
                    onCloseModal();
                }
            } catch (error) {
                console.warn({ error });
                showToastMessage('Booking Failed. Try again');
            }
        },
        [
            ticketCount,
            selectedDate,
            selectedTime,
            userData?.userId,
            bookableTicketId,
            onCloseModal,
        ]
    );

    const onCancelBooking = useCallback(() => {
        onCloseModal();
        showToastMessage('Booking cancelled)')
    }, []);

    if (!userData?.userId) {
        return null;
    }
    return (
        <View style={styles.container}>
            <Button
                style={styles.refreshButton}
                onPress={getAvailableTickets}
                transparent
            >
                <Ionicons name="refresh" size={20} color={Colors.primary} />
                <Text
                    style={{
                        color: Colors.primary,
                        fontSize: 16,
                        textAlign: 'center',
                        fontWeight: '600',
                    }}>
                    Refresh your data
                </Text>
            </Button>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
            <FlatList
                data={availableTickets}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TicketCard
                        ticketDetail={item}
                        userId={userData.userId}
                        setBookableTicketId={setBookableTicketId}
                    />
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={getAvailableTickets}
                    />
                }
                ListEmptyComponent={<Text>No tickets available</Text>}
            // navigation={navigation}
            />
            <View style={styles.container}>
                <Modal
                    animationType="slide"
                    transparent
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Booking has been discontinued.');
                        setBookableTicketId(undefined);
                    }}
                >
                    {/* <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}> */}
                        <View style={styles.container}>
                            <View style={styles.modalView}>
                                <Text style={styles.title}>Booking Ticket!</Text>
                                <View>
                                    <DatePicker setSelectedDate={setSelectedDate} />
                                    <Text style={styles.dateText}>{formattedSelectedDate}</Text>
                                </View>
                                <Text style={styles.title}>
                                    Available Time Slots
                                </Text>
                                <View style={styles.timeSlotsContainer}>
                                    {availabeTimeSlots.map(time => (
                                        <Button
                                            key={time}
                                            onPress={() => setSelectedTime(time)}
                                            transparent={time !== selectedTime}
                                            style={styles.timeSlot}
                                        >
                                            <Text
                                                style={{
                                                    color: time == selectedTime ? Colors.white : Colors.black,
                                                }}
                                            >
                                                {time}
                                            </Text>
                                        </Button>
                                    ))}
                                </View>
                                <View style={styles.ticketCountContainer}>
                                    <Text style={[styles.title, { alignSelf: 'center' }]}>
                                        Ticket Count
                                    </Text>
                                    <TextInput
                                        placeholder="Enter number of Tickets"
                                        onChangeText={(value) => setTicketCount(value)}
                                        value={ticketCount}
                                        selectionColor="#6373db"
                                        clearTextOnFocus={true}
                                        keyboardType='numeric'
                                        style={styles.ticketInput}
                                    />
                                </View>
                                <View style={{ display: 'flex', width: '100%' }}>
                                    <Button
                                        style={[
                                            styles.submitButton,
                                            !ticketBookable && {
                                                backgroundColor: '#dedede',
                                            }
                                        ]}
                                        onPress={onBookTicket}
                                        disabled={!ticketBookable}
                                    >
                                        <Text
                                            style={{
                                                color: ticketBookable ? Colors.white : Colors.black,
                                                fontSize: 16,
                                                textAlign: 'center',
                                                fontWeight: '600',
                                            }}>
                                            Book
                                        </Text>
                                    </Button>
                                    <Button
                                        style={[styles.submitButton, styles.cancelButton]}
                                        onPress={onCancelBooking}
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
                        </View>
                    {/* </TouchableWithoutFeedback> */}
                </Modal>
            </View>
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
        marginTop: 10,
    },
    separator: {
        marginVertical: 10,
        height: 1,
        width: '80%',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: width * 0.9,
        height: height * 0.7,
        justifyContent: 'space-around',
    },

    dateText: {
        marginVertical: 15,
        textAlign: 'center',
        fontSize: 16,
    },

    timeSlotsContainer: {
        flexDirection: 'row',
        width: '80%',
        justifyContent: 'space-between',
    },

    timeSlot: {
        borderColor: Colors.lightPrimary,
        borderWidth: 1,
        paddingHorizontal: 8,
    },

    ticketCountContainer: {
        width: '80%',
        justifyContent: 'center'
    },

    ticketInput: {
        color: Colors.secondaryTextColor,
        fontSize: 16,
        borderBottomWidth: 0.25,
        borderBottomColor: '#3C4858',
        marginVertical: 10,
    },

    submitButton: {
        width: '40%',
        marginVertical: width * 0.02,
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

    refreshButton: {
        width: '45%',
        marginVertical: height * 0.01,
        borderRadius: width * 0.02,
        borderColor: Colors.primary,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        alignSelf: 'center',
        flexDirection: 'row',
    },
    cancelButton: {
        backgroundColor: Colors.danger,
    },
});
