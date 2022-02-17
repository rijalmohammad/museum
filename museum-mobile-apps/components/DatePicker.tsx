import React, { useCallback, useState } from 'react';
import { View, Platform, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

interface CustomDatePicker {
    buttonTitle?: string;
    setSelectedDate: any;
}
export default function CustomDatePicker(props: CustomDatePicker) {
    const {
        buttonTitle = 'Select date',
        setSelectedDate,
    } = props;
    const [date, setDate] = useState<string>();
    const [show, setShow] = useState(false);
    const onOpenPicker = useCallback(() => {
        setShow(true);
    }, []);

    const onChange = useCallback((event: any, selectedDate: Date | undefined) => {
        const currentDate = date ? new Date() : selectedDate;
        if (!currentDate) {
            return;
        }
        const formattedDate = currentDate.toISOString().split('T')[0];

        setShow(Platform.OS === 'ios');
        setDate(formattedDate);
        if (setSelectedDate) {
            setSelectedDate(formattedDate);
        }
    }, [setSelectedDate, date]);

    const colorScheme = useColorScheme();
    const buttonColor = Colors[colorScheme].primary;
    return (
        <View>
            <Button onPress={onOpenPicker} title={buttonTitle} color={buttonColor} />
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date ? new Date(date) : new Date()}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                    minimumDate={new Date()}
                    minuteInterval={60}
                />
            )}
        </View>
    );
};