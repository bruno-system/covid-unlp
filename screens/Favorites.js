import React , {useState, useEffect} from 'react';
import { Image, 
         StyleSheet, 
         Text, 
         View, 
         ActivityIndicator, 
         FlatList,
         SafeAreaView, 
         StatusBar, 
         Vibration 
           } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {  Card,
          List, 
          Badge, 
          Title, 
          Paragraph, 
          Subheading, 
          Button, 
          Snackbar,
          Divider   } from 'react-native-paper';
import userUtils from "../utils/sort";

export default function Favorites({ navigation, route }) {
    
    const [isLoading, setLoading] = useState(true);
    const [listaPaises, setListaPaises] = useState([]);

    const [visibleOffline, setVisibleOffline] = useState(false);

    useEffect(() => {
        //Se ejecutan cuando se monta el componente
        loadCountries();  
        const unsubscribe = navigation.addListener('focus', () => {
          loadCountries();
        });
        return unsubscribe;  
    }, [navigation]);

     const loadCountries = async  () =>  {
      const favListStr = await AsyncStorage.getItem('@favCountriesJSON', () => {});
      const favListJSON = JSON.parse(favListStr);

      if (favListJSON === null) return;
        
      let arrayFavCountries = favListJSON.name.map(function(country) {
            return { id: country, name: country}
        });

      setListaPaises(arrayFavCountries);
      setLoading(false)
    };

   function  onItemSelected (id){
    Vibration.vibrate(30);
    navigation.navigate('CountryDetails' , { id })
    
    
  }

const onDismissSnackBar = () => setVisibleOffline(false);

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
  },
  instructions: {
    //marginHorizontal: 15,
    marginTop: 2,
    position:'absolute'
  }, 
});