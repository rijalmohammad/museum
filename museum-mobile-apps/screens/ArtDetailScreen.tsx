import { useState } from "react";
import { useEffect } from "react";
import { StyleSheet, Image } from "react-native";

import { Text, View } from "../components/Themed";
import { ArtworkDetail } from "../typings";
import apis from "../utils/apis";

export default function ArtDetailScreen({ route }: any) {
  const [artworkDetail, setArtworkDetail] = useState<ArtworkDetail>();

  const { artworkId } = route.params;

  const getArtworkDetail = async () => {
    try {
      const response = await apis.get(`/content/${artworkId}`, {
        headers: {
          "Access-Control-Allow-Origin": true,
        },
      });
      if (!response) {
        return;
      }

      setArtworkDetail(response.data);
    } catch (error) {
      console.warn({ error });
    }
  };

  useEffect(() => {
    getArtworkDetail();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ padding: 16, flexDirection: "column" }}>
        <Image
          style={{ height: "100%", maxHeight: 200, resizeMode: "contain", marginBottom: 16 }}
          source={{ uri: artworkDetail?.image }}
        />
        <View style={{flexDirection: "column", alignItems: "center"}}>
          <Text style={styles.title}>{artworkDetail?.name}</Text>
          <Text>{artworkDetail?.artist}</Text>
          <Text>{artworkDetail?.date}</Text>
          <Text>{artworkDetail?.site}</Text>
          <Text style={{marginBottom: 16}}>{artworkDetail?.size}</Text>
          <Text style={{textAlign: "center"}}>{artworkDetail?.description}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  desc: {
    fontSize: 12,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
