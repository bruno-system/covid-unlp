import React , {useState, useEffect} from 'react';
import { Image, StyleSheet, Text, View, ActivityIndicator, FlatList,SafeAreaView, StatusBar, Vibration  } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {  Card,List,Divider, Searchbar, Badge, Title, Paragraph, Subheading, Button, Snackbar   } from 'react-native-paper';
import userUtils from "../utils/sort";

export default function Countries({ navigation }) {
    
    const [isLoading, setLoading] = useState(true);
    const [listaPaises, setListaPaises] = useState([]);
    const [listaFiltrada, setListaFiltrada] = useState([]);

    const [campoDeBusqueda, setCampoDeBusqueda] = useState('');

    const [visibleOffline, setVisibleOffline] = useState(false);

    useEffect(() => {
        //Se ejecutan cuando se monta el componente
        loadCountries();    
    }, []);

    const   loadCountries =  () =>  {
      let url ="https://api.covid19api.com/countries"
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
        console.log("mode online");
        await AsyncStorage.setItem("@arrayCountries", JSON.stringify(json));
        
      }else{
        //carga datos del store
        console.log("mode offline");
        setVisibleOffline(true)
        let arrayStorage = await AsyncStorage.getItem('@arrayCountries').then((rsp) =>  {
          return JSON.parse(rsp)  
        });
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
    navigation.navigate('CountryDetails' , { id })
    
    
  }

const onDismissSnackBar = () => setVisibleOffline(false);

  return ( 
    <View > 
      {/* HEADER */}
      <Card> 
        <Card.Cover source={require('../assets/header-logo.png')}  />
      </Card>
      
      <Card>
        <Card.Content>
        <Button 
          dark={true} 
          icon="star-box" 
          color="#5f9867" 
          mode="contained" 
          onPress={() => navigation.navigate('Favorites')}>
          Mis Favoritos
        </Button>
        </Card.Content>
      </Card>
      

      {/* SHEARCH BAR */}
      <View>
      
        <Searchbar
          placeholder="Buscar"
          onChangeText={text => onChangeText(text) }
          value={campoDeBusqueda}
        />

        <Snackbar
          visible={visibleOffline}
          onDismiss={onDismissSnackBar}
          action={{
            label: 'Entendido',
            onPress: () => {
              onDismissSnackBar()
            },
          }}>
          Trabajando sin conexión
        </Snackbar>
        

      </View>
      
      {/* List  */}
      {isLoading ? <ActivityIndicator style={styles.loader}  size="large" color="green"/> : (


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
              <View>
              <List.Item
                title={item.name}
                description=""
                onPress={() => onItemSelected(item.name) }
                right={props => <List.Icon {...props} icon="plus-circle-outline" />}
              />
              <Divider />
              </View>
              
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
  loader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop:'35%'
  }
});