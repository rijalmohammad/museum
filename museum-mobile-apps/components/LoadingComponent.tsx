import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import colors from '../constants/Colors';

const LoadingComponent = () => (
    <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color={colors.primary} />
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center"
    },
    horizontal: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10
    }
});

export default LoadingComponent;
