import React , {useState, useEffect} from 'react';
import { Image, StyleSheet, Text, View, ActivityIndicator, FlatList,SafeAreaView, StatusBar  } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {  Card,List, Searchbar  } from 'react-native-paper';
import  CountrieDetails  from "./CountrieDeails";


export default function Countries({ navigation }) {
    
    const [isLoading, setLoading] = useState(true);
    const [listaPaises, setListaPaises] = useState([]);
    const [listaFiltrada, setListaFiltrada] = useState([]);
    const [campoDeBusqueda, setCampoDeBusqueda] = useState('');

    useEffect(() => {
        // Se ejecuta cuando se monta el componente
        loadCountries(); 
    }, []);

    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        mode: 'cors'
      };
    const   arrayParaListar = (json) =>  {
      json.sort(sortByProperty("Country"));

      var arrayCountries = [];
    
      for(var i in json) {    
          var item = json[i];   
      
          arrayCountries.push({ 
              "id"    : item.ISO2,
              "name"  : item.Country,
              "slug"  : item.Slug 
          });
      }
      
      //console.log('aca:'+JSON.stringify(arrayCountries));
       setListaPaises(arrayCountries)
       setListaFiltrada(arrayCountries)
    }

    //funcion que ordena un array por alguna columna
    function sortByProperty(property){  
      return function(a,b){  
         if(a[property] > b[property])  
            return 1;  
         else if(a[property] < b[property])  
            return -1;  
     
         return 0;  
      }  
   }

    const   loadCountries =  () =>  {
        let url ="https://api.covid19api.com/countries"
        fetch(url, requestOptions)
        .then((response) => response.json())
        .then((json) => {
          //ordenar array json
          arrayParaListar(json);
          //setearlo
          
        })
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    };

  function onChangeText(text){
    console.log('textCHanged ',text);
    setCampoDeBusqueda(text)
    let filterArray = listaPaises
    let searchResult = filterArray.filter( pais => 
      pais.name.toLowerCase().includes(text.toLowerCase())
    )

    setListaFiltrada(searchResult)
  }

  function itemSelected (id){
    console.log(id);
  }


  return (
    <View > 
      {/* HEADER */}
      <Card> 
        <Card.Cover source={{ uri: "https://i.imgur.com/TkIrScD.png" }} />
      </Card>
      <CountrieDetails id="Papá" />
      <Text style={styles.instructions} >
        To share a photo from your phone with a friend, just press the button below!
      </Text>

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
                <Text>Sin Datos</Text>
              </View>
            }
            renderItem={({ item }) => (
              
              <List.Item
                title={item.name}
                description=""
                onPress={() => itemSelected(item.id) }
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