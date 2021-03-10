import React , {useState, useEffect} from 'react';
import { Image, StyleSheet, Text, View, ActivityIndicator, FlatList,SafeAreaView, StatusBar  } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-paper';

export default function Countries({ navigation }) {
    
    const [isLoading, setLoading] = useState(true);
    const [listaPaises, setListaPaises] = useState([]);
    const [listaFiltrada, setListaFiltrada] = useState([]);

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
    let filterArray = listaPaises
    let searchResult = filterArray.filter( pais => 
      pais.name.toLowerCase().includes(text.toLowerCase())
    )

    setListaFiltrada(searchResult)
  }


  return ( 
    <View style={styles.container}>
      {/* HEADER */}
      <Image source={{ uri: "https://i.imgur.com/TkIrScD.png" }} style={styles.logo} />

      <Text style={styles.instructions} >
        To share a photo from your phone with a friend, just press the button below!
      </Text>

      {/* SHEARCH BAR */}
      <View>
        <TextInput 
          placeholder="Buscar" 
          onChangeText={text => onChangeText(text) }
        />
      </View>

      {/* List  */}
      {isLoading ? <ActivityIndicator/> : (


        <SafeAreaView style={styles.container}>

           <FlatList
            data={listaFiltrada}
            // keyExtractor={item => item.id}
            ListEmptyComponent={() => 
              <View>
                <Text>Sin Datos</Text>
              </View>
            }
            renderItem={({ item }) => (
              <Text>{item.name}, {item.id}</Text>
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