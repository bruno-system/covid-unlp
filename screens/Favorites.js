import React , {useState, useEffect} from 'react';
import { StyleSheet, 
         View, 
         ActivityIndicator, 
         FlatList,
         SafeAreaView,
         Vibration } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {  List,  Button,  Divider   } from 'react-native-paper';

export default function Favorites({ navigation, route }) {
    
    const [isLoading, setLoading] = useState(true);
    const [listaPaises, setListaPaises] = useState([]);

    useEffect(() => {
        //refresca valores cuando vuelve de otra pantalla
        const unsubscribe = navigation.addListener('focus', () => {
          loadCountries();
        });
        return unsubscribe;  
    }, [navigation]);

    const loadCountries = async  () =>  {
      const favListStr = await AsyncStorage.getItem('@favCountriesJSON', () => {});
      const favListJSON = JSON.parse(favListStr);

      let arrayFavCountries=null
      if (favListJSON !== null) {
        arrayFavCountries = favListJSON.name.map(function(country) {
          return { id: country, name: country}
        });
      };
        
      setListaPaises(arrayFavCountries);
      setLoading(false)
    };

    function  onItemSelected (id){
      Vibration.vibrate(30);
      navigation.navigate('CountryDetails' , { id })
      
    }

  return ( 
    <View > 
      {/* List  */}
      {isLoading ? <ActivityIndicator style={styles.loader}  size="large" color="green"/> : (

        
        <SafeAreaView >

           <FlatList
            data={listaPaises}
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
                left={props => <List.Icon {...props} icon="earth" />}
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
  loader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop:'35%'
  }
});