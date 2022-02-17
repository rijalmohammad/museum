import React from "react";

import {
  View,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { ArtworkDetail } from "../typings";
import { Text } from "./Themed";
import { useNavigation } from "@react-navigation/native";

import Colors from "../constants/Colors";
const { height, width } = Dimensions.get("screen");

interface ArtworkProps {
  artworkDetail: ArtworkDetail;
}
const ArtworkCard = (props: ArtworkProps) => {
  const navigation = useNavigation();

  const { artworkDetail } = props;

  const { id, name, artist, site, image } = artworkDetail;

  const handleClick = () => {
    navigation.navigate("Artwork", {
        artworkId: id
    })
  }

  return (
    <View
      style={{
        justifyContent: "space-around",
        borderRadius: 8,
        // marginHorizontal: width * 0.1,
        marginVertical: height * 0.01,
        borderColor: Colors.primary,
        borderWidth: 2,
        width: width * 0.9,
        flexDirection: "row",
      }}
    >
      <TouchableOpacity
        onPress={handleClick}
      >
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "40%" }}>
            <Image
              style={{ width: "100%", height: 100 }}
              source={{ uri: image }}
            />
          </View>
          <View style={{ width: "60%", flexDirection: "column", padding: 16 }}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 18,
                marginBottom: 4,
              }}
            >
              {name}
            </Text>
            <Text
              style={{
                fontWeight: "600",
                fontSize: 14,
                marginBottom: 4,
              }}
            >
              {artist}
            </Text>
            <Text
              style={{
                fontWeight: "600",
                fontSize: 12,
              }}
            >
              {site}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ArtworkCard;

const styles = StyleSheet.create({
  chefAddress: {
    fontSize: 28,
    letterSpacing: 0.25,
  },
  chefPhoto: {
    height: width * 0.3,
    width: width * 0.4,
    borderRadius: 6,
    marginTop: 3,
  },
  myStarStyle: {
    color: Colors.primary,
    textShadowColor: "black",
  },
  myEmptyStarStyle: {
    color: "white",
  },
});
