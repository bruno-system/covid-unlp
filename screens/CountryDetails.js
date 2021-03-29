import React, {useEffect, useState} from "react";
import {View, Dimensions, ScrollView, StyleSheet,SafeAreaView,
     Image,Text, TouchableOpacity, Vibration, ActivityIndicator
    } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Avatar, Card, IconButton, DataTable, Title  } from 'react-native-paper';

const DEVICE_WIDTH = Dimensions.get('window').width;
const COLUMN_WIDTH = Math.floor(DEVICE_WIDTH / 4);
const IMAGE_WIDTH = COLUMN_WIDTH - 2;

import userUtils from "../utils/sort";
import moment from "moment";
import { LineChart } from "react-native-chart-kit";

export default function CountryDetails({ navigation, route }) {
    const [favIds, setFavIds] = useState([]);

    const [countryData, setCountryData] = useState(
        {"Country": "-",
        "CountryCode": "",
        "Province": "",
        "City": "",
        "CityCode": "",
        "Lat": "0",
        "Lon": "0",
        "Confirmed": 0,
        "Deaths": 0,
        "Recovered": 0,
        "Active": 0,
        "Date": ""});

    const [isLoading, setLoading] = useState(true);

    const [arrayLabels, setArrayLabels] = useState([]);
    const [arrayValue, setArrayValue] = useState([]);

    useEffect(() => {
        // Se ejecuta cuando se monta el componente
        mainLoader(route.params.id);
    }, []);

    async function mainLoader(id){
        await loadOneCountry(id).then((result) => {
            setCountryData(result.last);  
            
            cargaDeArrays(result.history);
            setLoading(false);
        });
        
    }

    const   loadOneCountry = async (id) =>  { 
        let days=7
        let from=moment().subtract(days, 'days').format('YYYY-MM-DD');
        let to=moment().format('YYYY-MM-DD');
        let url ="https://api.covid19api.com/total/country/"+id+"?from="+from+"T00:00:00Z&to="+to+"T00:00:00Z"
        let result = await fetch(url)
        .then((response) => response.json())
        .then(async function (json){

            let dataReturn ={ "history": json,
                              "last": json.sort(userUtils.sortByPropertyDesc("Date"))[0]
                            }

            //return json.sort(userUtils.sortByPropertyDesc("Date"))[0]
            
            return dataReturn;
            
        }) 
        .catch((error) => console.error(error))
        .finally(() => console.log('datos del pais cargados')
            //setLoading(false)
        );
        
        return result;
    };

     const cargaDeArrays = async (json) =>  {
        json.sort(userUtils.sortByPropertyAsc("Date"));
        let arrayLabelsLocal = [];
        let arrayValueLocal = [];
        
        // json.slice(Math.max(json.length - 5, 1))
        //json= json.slice(-5);
         for(var i in json) {    
            var item = json[i];   

            arrayLabelsLocal.push(  moment(item.Date).format("DD/MM") );
            arrayValueLocal.push(item.Active);
        }
         setArrayLabels(arrayLabelsLocal);
         setArrayValue(arrayValueLocal);
        
        //console.log('aca:'+JSON.stringify(arrayDates));
      }


    return (
        <View style={styles.main}>
            {isLoading ? <ActivityIndicator size="large" color="green" /> : (
                <SafeAreaView >
                <ScrollView>
                    <Card.Title
                        title={countryData.Country}
                        subtitle={moment(countryData.Date).format("DD/MM/YYYY")}
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
                        <Title style={styles.title}>Activos</Title>
                        <LineChart
                            data={{
                            labels: arrayLabels,
                            datasets: [
                                {
                                data: arrayValue
                                }
                            ]
                            }}
                            width={Dimensions.get("window").width} // from react-native
                            height={220}
                            yAxisLabel=""
                            yAxisSuffix=""
                            yAxisInterval={1} // optional, defaults to 1
                            chartConfig={{
                                backgroundColor: "#4394DF",
                                backgroundGradientFrom: "#68D161",
                                backgroundGradientTo: "#15760F",
                                decimalPlaces: 0, // optional, defaults to 2dp
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                style: {
                                    borderRadius: 16
                                },
                                propsForDots: {
                                    r: "6",
                                    strokeWidth: "2",
                                    stroke: "#ffa726"
                                }
                            }}
                            bezier
                            style={{
                                marginVertical: 8,
                                borderRadius: 16
                            }}
                        />

            </ScrollView>
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
    },
    title: {
        textAlign:"center"
    }
});
