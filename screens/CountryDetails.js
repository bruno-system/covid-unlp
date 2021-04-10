import React, {useEffect, useState} from "react";
import {View, Dimensions, ScrollView, StyleSheet,SafeAreaView,
        Image,Text, TouchableOpacity, Vibration, ActivityIndicator
        } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar, Card, IconButton, DataTable, Title, Button,Paragraph,Dialog ,Portal  } from 'react-native-paper';

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
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        // Se ejecuta cuando se monta el componente
        mainLoader(route.params.id);
    }, []);

    async function mainLoader(id){

        let dataAPI = await loadOneCountry(id).then((result) => {
            return result
        });

        //si esta offline
        if(dataAPI == null){  
            //buscamos el pais en el storage
            let countryNameId= '@'+id
            let dataStorage = await AsyncStorage.getItem(countryNameId).then((rsp) =>  {
                return JSON.parse(rsp)  
            });
            //si  existe en el storage
            if(dataStorage != null){
                //cargar con datos del storage
                dataAPI = dataStorage
                console.log("utilizando datos guardados")
                setIsOffline(true)
            }else {
                //mostrar mensaje que no tiene datos
                console.log("sin datos")
            }
        }else{
        // si esta online actualizo el storage
            console.log("actualizando storage")
            let countryNameId= '@'+id ; 
            await AsyncStorage.setItem(countryNameId, JSON.stringify(dataAPI));
        }

        if(dataAPI != null){
            await setCountryData(dataAPI.last);  
            await cargaDeArrays(dataAPI.history); // arrays necesario para graficar
        }
        
        setLoading(false);
    }

    const   loadOneCountry = async (id) =>  { 
        let days=7
        let from=moment().subtract(days, 'days').format('YYYY-MM-DD');
        let to=moment().format('YYYY-MM-DD');
        let url ="https://api.covid19api.com/total/country/"+id+"?from="+from+"T00:00:00Z&to="+to+"T00:00:00Z"
        let result = await fetch(url)
        .then((response) => response.json())
        .then(async function (json){
            var dataReturn= null
            if(json.message == null ){ 
                dataReturn = 
                    { "history": json,
                        "last": json.sort(userUtils.sortByPropertyDesc("Date"))[0]
                    }
            }

            return dataReturn;
            
        }) 
        .catch((error) => {console.error(error)
            })
        .finally(() => console.log('busqueda de datos finalizada')
            //setLoading(false)
        );
        
        return result;
    };

     const cargaDeArrays = async (json) =>  {
        json.sort(userUtils.sortByPropertyAsc("Date"));
        let arrayLabelsLocal = [];
        let arrayValueLocal = [];

        for(var i in json) {    
            var item = json[i];   

            arrayLabelsLocal.push(  moment(item.Date).format("DD/MM") );
            arrayValueLocal.push(item.Active);
        }
         setArrayLabels(arrayLabelsLocal);
         setArrayValue(arrayValueLocal);
        
      }

    const onDismissSnackBar = () => setIsOffline(false);

    return (
        <View style={styles.main}>
            
            {isLoading ? <ActivityIndicator size="large" color="green" /> : (
                <SafeAreaView >
                    
                {countryData.Country != '-' ?  
                <ScrollView>

                    <Portal>
                        <Dialog visible={isOffline} onDismiss={onDismissSnackBar}>
                            <Dialog.Title> <Button icon="server-network-off" color={"green"}></Button> Sin Conexión</Dialog.Title>
                            <Dialog.Content>
                                <Paragraph>Utilizando datos de fecha: {moment(countryData.Date).format("DD/MM/YYYY")} </Paragraph>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => onDismissSnackBar() }>Entendido</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>

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
                                    borderRadius: 16,
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
                                borderRadius: 16,
                                
                            }}
                        />

            </ScrollView>
            : ( 
                <Button icon="emoticon-frown-outline" color={"green"}>
                  Sin Datos
                </Button>
              ) }
            </SafeAreaView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        flex: 1
    },
    title: {
        textAlign:"center"
    }
});
