import React, {useEffect, useState} from "react";
import {View, Dimensions, ScrollView, StyleSheet,SafeAreaView, Image,Text, TouchableOpacity, Vibration, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Avatar, Card, IconButton, DataTable  } from 'react-native-paper';

const DEVICE_WIDTH = Dimensions.get('window').width;
const COLUMN_WIDTH = Math.floor(DEVICE_WIDTH / 4);
const IMAGE_WIDTH = COLUMN_WIDTH - 2;

import userUtils from "../utils/sort";

export default function CountryDetails({ navigation, route }) {
    const [favIds, setFavIds] = useState([]);

    const [countryData, setCountryData] = useState({});
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        // Se ejecuta cuando se monta el componente
        loadFavImages().then(()=>{});
        mainLoader(route.params.id);
    }, []);

    async function mainLoader(id){

        await loadOneCountry(id).then((result) => {
            setCountryData(result);
            
           });

           setLoading(false);
    }

    const   loadOneCountry = async (id) =>  { console.log(id)
        let url ="https://api.covid19api.com/total/country/"+id
        let result = await fetch(url)
        .then((response) => response.json())
        .then(async function (json){
          return json.sort(userUtils.sortByPropertyDesc("Date"))[0]
        }) 
        .catch((error) => console.error(error))
        .finally(() => console.log('fin')
            //setLoading(false)
        );
        return result;
    };

    const loadFavImages = async () => {
        const favImagesJSONStr = await AsyncStorage.getItem('@favImagesJSON', () => {});
        const favImagesJSON = JSON.parse(favImagesJSONStr);

        if (favImagesJSON === null) return;

        let imageIds = favImagesJSON.urls.map(function(url) {
            // cada url tiene el formato https://i.picsum.photos/id/870/440/815.jpg?hmac=SJAQU7IJHknkN16N32Em58FCiDpPSkOy1tUx57Zv990
            const urlParts = url.split("/");
            return urlParts[4];
        });

        setFavIds(imageIds);
    }

    const eliminarImagen = async (idRemove) =>{
        const favImagesJSONStr = await AsyncStorage.getItem('@favImagesJSON', () => {});
        const favImagesJSON = JSON.parse(favImagesJSONStr);

        if (favImagesJSON === null) return;

        favImagesJSON.urls.map(async function(url, index ){ 
            const urlParts = url.split("/");
            if(urlParts[4] == idRemove){
                await AsyncStorage.removeItem('@favImagesJSON',index, () => {})
                console.log('eliminada:'+idRemove+' index: '+index)
            }
        });
        
        loadFavImages().then(()=>{});
        
        
    }

    return (
        <View style={styles.main}>
            {isLoading ? <ActivityIndicator size="large" color="green" /> : (
                <SafeAreaView >
                    <Card.Title
                        title={countryData.Country}
                        subtitle={countryData.Date}
                        left={(props) => <Avatar.Icon {...props} icon="map-marker-outline" color={"white"} />}
                        right={(props) => <IconButton  {...props} icon="star-outline" onPress={() => {}} />}
                    />

                        <DataTable>
                            <DataTable.Header>
                            <DataTable.Title>Categoría</DataTable.Title>
                            <DataTable.Title numeric>Valor</DataTable.Title>
                            </DataTable.Header>

                            <DataTable.Row>
                            <DataTable.Cell>Confirmados</DataTable.Cell>
                            <DataTable.Cell numeric>{countryData.Confirmed}</DataTable.Cell>
                            </DataTable.Row>

                            <DataTable.Row>
                            <DataTable.Cell>Recuperados</DataTable.Cell>
                            <DataTable.Cell numeric>{countryData.Recovered}</DataTable.Cell>
                            </DataTable.Row>

                            <DataTable.Row>
                            <DataTable.Cell>Activos</DataTable.Cell>
                            <DataTable.Cell numeric>{countryData.Active}</DataTable.Cell>
                            </DataTable.Row>

                            <DataTable.Row>
                            <DataTable.Cell>Muertos</DataTable.Cell> 
                            <DataTable.Cell numeric>{countryData.Deaths}</DataTable.Cell>
                            </DataTable.Row>

                        </DataTable>
            </SafeAreaView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
    },
    imgGalleryContainer: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        alignContent: "flex-start"
    },
    itemGallery: {
        width: COLUMN_WIDTH,
        height: COLUMN_WIDTH,
        alignContent: 'center',
    },
    imgGallery: {
        width: IMAGE_WIDTH,
        height: IMAGE_WIDTH,
        borderWidth: 1,
        borderColor: "#fff",
        margin: 'auto'
    }
});
