import { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import ArtworkCard from '../components/ArtworkCard';
import { ArtworkDetail } from '../typings';
import apis from '../utils/apis';

export default function TabArtListScreen() {
    const [artworks, setArtworks] = useState<ArtworkDetail[]>();

    const getArtworkList = async () => {
        try {
            const response = await apis.get('/content', {
                headers: {
                    "Access-Control-Allow-Origin": true,
                }
            });
            if (!response) {
                return;
            }

            setArtworks(response.data);
        }
        catch (error) {
            console.warn({ error });
        }
    };

    useEffect(() => {
        getArtworkList();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
            <FlatList
                data={artworks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ArtworkCard
                        artworkDetail={item}
                    />
                )}
                ListEmptyComponent={<Text>No Artwork Available</Text>}
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
        width: '80%',
    },
});
