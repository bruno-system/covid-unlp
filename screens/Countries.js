import React , {useState, useEffect} from 'react';
import { Image, StyleSheet, Text, View, ActivityIndicator, FlatList,SafeAreaView, StatusBar, Vibration  } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {  Card,List, Searchbar, Badge, Title, Paragraph, Subheading, Button   } from 'react-native-paper';
import userUtils from "../utils/sort";

export default function Countries({ navigation }) {
    
    const [isLoading, setLoading] = useState(true);
    const [listaPaises, setListaPaises] = useState([]);
    const [listaFiltrada, setListaFiltrada] = useState([]);

    const [campoDeBusqueda, setCampoDeBusqueda] = useState('');

    const [countrySelected, setCountrySelected] = useState();
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        //Se ejecutan cuando se monta el componente
        loadCountries();    
    }, []);

    const   loadCountries =  () =>  {
      let url ="https://api.covid19api.com/countries3"
      fetch(url)
      .then((response) => response.json())
      .then(async (json) => {
        //ordenar array json
        arrayParaListar(json);
      })
      .catch((error) => {
          console.error(error); 
        })
      .finally(() => setLoading(false));
    };

    const arrayParaListar = async (json) =>  {

      //Verifico estado del JSON----------------
      if(json.length > 1 ){
        //actualiza store
        console.log("online");
        await AsyncStorage.setItem("@arrayCountries", JSON.stringify(json));
        
      }else{
        //carga datos del store
        console.log("offline");
        let arrayStorage = await AsyncStorage.getItem('@arrayCountries3').then((rsp) =>  {
          return JSON.parse(rsp)  
        });
        console.log(arrayStorage)
        //si existe inicializado en el storage
        if(arrayStorage != null){
          json=arrayStorage
        }else {
          json = []
        }
      }
      //----------------------------------------

      json.sort(userUtils.sortByPropertyAsc("Country"));

      var arrayCountries = [];
    
      for(var i in json) {    
          var item = json[i];   
      
          arrayCountries.push({ 
              "id"    : item.ISO2,
              "name"  : item.Country,
              "slug"  : item.Slug 
          });
      }
      
       setListaPaises(arrayCountries)
       setListaFiltrada(arrayCountries)
    }

  function onChangeText(text){
    setCampoDeBusqueda(text)
    let filterArray = listaPaises
    let searchResult = filterArray.filter( pais => 
      pais.name.toLowerCase().includes(text.toLowerCase())
    )

    setListaFiltrada(searchResult)
  }

   function  onItemSelected (id){
    Vibration.vibrate(30);
     loadOneCountry(id).then((result) => {
      setCountrySelected(result);
      setModalVisible(true);
      
     });

     navigation.navigate('CountryDetails' , { id })
    
    
  }

  const   loadOneCountry = async (id) =>  {
    let url ="https://api.covid19api.com/total/country/"+id
    let result = await fetch(url)
    .then((response) => response.json())
    .then(async function (json){
      return json.sort(userUtils.sortByPropertyDesc("Date"))[0]
    }) 
    .catch((error) => console.error(error))
    .finally(() => setLoading(false));

    return result;
};


  return ( 
    <View > 
      {/* HEADER */}
      <Card> 
        <Card.Cover source={require('../assets/header-logo.png')}  />
      </Card>
      
      <Card>
        <Card.Content>
          <Paragraph>Enfoques de desarrollo de aplicaciones moviles</Paragraph>
        </Card.Content>
      </Card>
      

      {/* SHEARCH BAR */}
      <View>

        <Searchbar
          placeholder="Buscar"
          onChangeText={text => onChangeText(text) }
          value={campoDeBusqueda}
        />

      </View>
      
      {/* List  */}
      {isLoading ? <ActivityIndicator/> : (


        <SafeAreaView >

           <FlatList
            data={listaFiltrada}
            // keyExtractor={item => item.id}
            ListEmptyComponent={() => 
              <View>
                
                <Button icon="emoticon-frown-outline" color={"green"}>
                  Sin Datos
                </Button>
              </View>
            }
            renderItem={({ item }) => (
              
              <List.Item
                title={item.name}
                description=""
                onPress={() => onItemSelected(item.id) }
                right={props => <List.Icon {...props} icon="plus-circle-outline" />}
              />
              
            )}
          /> 

        </SafeAreaView>


      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: StatusBar.currentHeight || 0,
    height: 100
  },
  logo: {
    width: 305,
    height: 159,
    marginBottom: 10,
  },
  instructions: {
    color: '#888',
    fontSize: 18,
    marginHorizontal: 15,
  }, 
});