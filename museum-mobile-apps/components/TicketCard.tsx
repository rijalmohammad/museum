import React, { useCallback } from 'react';

import {
    View,
    Dimensions,
    StyleSheet
} from 'react-native';
import { AvailableTicket } from '../typings';
import { Button, Text } from './Themed';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import apis from '../utils/apis';
import showToastMessage from '../utils/showToastMessage';
const { height, width } = Dimensions.get('screen');

interface TicketCardProps {
    ticketDetail: AvailableTicket;
    userId: number | undefined;
    setBookableTicketId: React.Dispatch<React.SetStateAction<string | undefined>>
}
const TicketCard = (props: TicketCardProps) => {
    const {
        ticketDetail,
        userId,
        setBookableTicketId,
    } = props;

    const onSetBookableTicketId = useCallback(() => {
        setBookableTicketId(ticketDetail.id);
    }, []);

    const onBookTicket = useCallback(
        async () => {
            try {
                if (!userId) {
                    return;
                }
                // setAppLoading(true);
                const response = await apis.post(
                    '/booking',
                    {
                        date: "15-02-2022",
                        time: "18.00",
                        ticketId: ticketDetail.id,
                        quantity: 1,
                        userId: userId,
                    }
                );

                // setAppLoading(false);
                showToastMessage('User successfully logged in.');
            } catch (error) {
                console.warn({ error });
                // showToastMessage(JSON.stringify(error));
            }
        }, []);

    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme];
    return (
        <View
            style={[
                styles.container,
                {
                    borderColor: colors.primary,
                }
            ]}
        >
            <View>
                <Text
                    style={{
                        fontWeight: '600',
                        fontSize: 18,
                        margin: 3,
                    }}>
                    {ticketDetail.name}
                </Text>
                <Text
                    style={{
                        fontWeight: 'bold',
                        fontSize: 18,
                        margin: 3,
                    }}>
                    EUR {ticketDetail.price}
                </Text>
                <Text>
                    {ticketDetail.description}
                </Text>
            </View>
            <Button
                onPress={onSetBookableTicketId}
                style={styles.button}
            >
                <Text style={{
                    color: colors.background,
                    textAlign: 'center',
                    margin: width * 0.01,
                }}>
                    Book Now
                </Text>
            </Button>
        </View>
    )
};


export default TicketCard;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        borderRadius: 8,
        padding: width * 0.01,
        marginVertical: height * 0.01,
        borderWidth: 2,
        width: width * 0.95,
        flexDirection: 'row',
    },
    button: {
        borderRadius: width * 0.01,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    }
});
