import { useState, useEffect } from "react";

import { Button, Dimensions, StyleSheet } from "react-native";

const { height } = Dimensions.get("window");

import { Text, View } from "../components/Themed";

import { BarCodeScanner } from "expo-barcode-scanner";

export default function TabScanArtScreen(props: any) {
  const { navigation } = props;

  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ _, data }: any) => {
    setScanned(true);

    navigation.navigate('Artwork', {
        artworkId: data,
    })
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.scanner}
      />
      {scanned && (
        <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  scanner: {
    width: "100%",
    height: height / 1.7,
  },
});
