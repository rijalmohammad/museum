import { useCallback, useContext, useEffect, useState } from 'react';
import { Dimensions, FlatList, RefreshControl, StyleSheet } from 'react-native';

import { Text, View, Button } from '../components/Themed';
import BookingCard from '../components/BookingCard';
import { BookingItem, PaymentMethod } from '../typings';
import apis from '../utils/apis';
import AuthContext from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

const { width, height } = Dimensions.get('window');

export default function TabYourTicketsScreen() {
    const [bookedTickets, setBookedTickets] = useState<BookingItem[]>();
    const { userData } = useContext(AuthContext);
    const [refreshing, setRefreshing] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>();

    const getBookedTickets = useCallback(async () => {
        try {
            if (!userData?.userId) {
                return;
            }
            setRefreshing(true);
            const response = await apis.get(`/booking/${userData.userId}`);
            if (!response) {
                return;
            }
            setBookedTickets(response.data);
            setRefreshing(false);
        }
        catch (error) {
            console.warn({ error });
        }
    }, [userData?.userId]);

    const getPaymentMethods = useCallback(async () => {
        try {
            const response = await apis.get('/payment/method');
            if (!response) {
                return;
            }
            setPaymentMethods(response.data);
        }
        catch (error) {
            console.warn({ error });
        }
    }, []);

    useEffect(() => {
        getBookedTickets();
        getPaymentMethods();
    }, []);

    return (
        <View style={styles.container}>
            <Button
                style={styles.refreshButton}
                onPress={getBookedTickets}
                transparent
            >
                <Ionicons name="refresh" size={20} color={Colors.primary}/>
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
                data={bookedTickets}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <BookingCard
                        bookingDetail={item}
                        paymentMethods={paymentMethods}
                        updateBookingStatus={setBookedTickets}
                        bookedTickets={bookedTickets}
                    />
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={getBookedTickets}
                    />
                }
                ListEmptyComponent={<Text>No booking made yet</Text>}
            />
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
        width: '100%',
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
});
