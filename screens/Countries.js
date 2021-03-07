import React , {useState, useEffect} from 'react';
import { Image, StyleSheet, Text, View, ActivityIndicator, FlatList, } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Countries({ navigation }) {
    
    const [isLoading, setLoading] = useState(true);
    const [listaPaises, setListaPaises] = useState([]);

    useEffect(() => {
        // Se ejecuta cuando se monta el componente
        loadCountries();
    }, []);

    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        mode: 'cors'
      };

       const   loadCountries =  () =>  {
        fetch('https://api.covid19api.com/countries', requestOptions)
        .then((response) => response.json())
        .then((json) => setListaPaises(json))
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));

        // .then(async function (response){
        //     // guardamos en el state la url de la foto random
        //     setImageUrl(response.url);

        //     // Hay que determinar si la imagen ya es favorita
        //     const favImagesJSONStr = await AsyncStorage.getItem('@favImagesJSON', ()=>{});
        //     const favImagesJSON = JSON.parse(favImagesJSONStr);
        //     const randomImageFavStatus = favImagesJSON !== null && favImagesJSON.urls.includes(response.url);
        //     if (randomImageFavStatus !== currentImageFavStatus) {
        //         setImageFavStatus(randomImageFavStatus);
        //     }

        // });


    };




  return (
    <View style={styles.container}>
      <Image source={{ uri: "https://i.imgur.com/TkIrScD.png" }} style={styles.logo} />

      <Text style={styles.instructions} >
        To share a photo from your phone with a friend, just press the button below!
      </Text>


      {isLoading ? <ActivityIndicator/> : (

        <FlatList
          data={listaPaises}
          keyExtractor={item => item.ISO2}
          renderItem={({ item }) => (
            <Text>{item.Country}, {item.Slug}</Text>
          )}
        />

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