import React , {useState, useEffect} from 'react';
import { Image, StyleSheet, Text, View, ActivityIndicator, FlatList,SafeAreaView, StatusBar  } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchableDropdown from 'react-native-searchable-dropdown';

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


        <SafeAreaView style={styles.container}>

          {/* <FlatList
            data={listaPaises}
            keyExtractor={item => item.ISO2}
            renderItem={({ item }) => (
              <Text>{item.Country}, {item.Slug}</Text>
            )}
          /> */}


            <SearchableDropdown
              onTextChange={(text) => console.log(text)}
              //On text change listner on the searchable input
              onItemSelect={(item) => alert(JSON.stringify(item))}
              //onItemSelect called after the selection from the dropdown
              containerStyle={{ padding: 5 }}
              //suggestion container style
              textInputStyle={{
                //inserted text style
                padding: 12,
                borderWidth: 1,
                borderColor: '#ccc',
                backgroundColor: '#FAF7F6',
              }}
              itemStyle={{
                //single dropdown item style
                padding: 10,
                marginTop: 2,
                backgroundColor: '#FAF9F8',
                borderColor: '#bbb',
                borderWidth: 1,
              }}
              itemTextStyle={{
                //text style of a single dropdown item
                color: '#222',
              }}
              itemsContainerStyle={{
                //items container style you can pass maxHeight
                //to restrict the items dropdown hieght
                maxHeight: '60%',
              }}
              items={listaPaises}
              //mapping of item array
              // defaultIndex={2}
              //default selected item index
              placeholder="placeholder"
              //place holder for the search input
              resetValue={false}
              //reset textInput Value with true and false state
              underlineColorAndroid="transparent"
              //To remove the underline from the android input
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