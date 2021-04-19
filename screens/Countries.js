import React , {useState, useEffect} from 'react';
import {  StyleSheet, View, ActivityIndicator, FlatList,SafeAreaView, Vibration  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {  Card,List,Divider, Searchbar,Colors,Avatar,
          Button, Snackbar, IconButton, Portal, Dialog , Paragraph, Caption   } from 'react-native-paper';
import userUtils from "../utils/sort";
import NetInfo from '@react-native-community/netinfo';
import {TextAnimationFadeIn, TextAnimationZoom, TextAnimationRain, 
        TextAnimationSlideDown, TextAnimationSlideUp, TextAnimationSlideLeft, 
        TextAnimationSlideRight, TextAnimationShake, TextAnimationReverse, TextAnimationDeZoom} from 'react-native-text-effects';

export default function Countries({ navigation }) {
    
    const [isLoading, setLoading] = useState(true);
    const [listaPaises, setListaPaises] = useState([]);
    const [listaFiltrada, setListaFiltrada] = useState([]);
    const [campoDeBusqueda, setCampoDeBusqueda] = useState('');
    const [visibleOffline, setVisibleOffline] = useState(false);
    const [isConnected, setIsConnected] = useState(true);
    const [profileVisible, setProfileVisible] = React.useState(true);

    useEffect(() => {
      //escucho si esta con inet
      const unsubscribe = NetInfo.addEventListener(state => {
        console.log("Connection type", state.type);
        console.log("Is connected?", state.isConnected);
        setIsConnected(state.isConnected)
      });
      loadCountries();
      
      return () => {
        // Unsubscribe to network state updates
        unsubscribe();
      };
    
    }, []);

    const loadCountries =  () =>  {
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
      //json.length > 1  -> hay datos;   = 1  -> elemento con mensaje que no pudo resolver caso error 503
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

      var arrayCountries = []; //Array para FlatList con una estructura requerida
    
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
  const hideDialog = () => setProfileVisible(false);
  const showDialog = () => setProfileVisible(true);

  return ( 
    <View> 
      {/* HEADER */}
      {/* Icono OFFLINE/ONLINE */}
      <Card style={styles.icon} elevation={1}>
        {!isConnected ? 
        <IconButton
          icon="wifi-off"
          color={Colors.orange500}
          size={20}
          onPress={() => (console.log('Pressed'))}
        />
        : (
          <>
            <IconButton
              icon="wifi"
              color={Colors.green500}
              size={20}
              onPress={() => console.log('Pressed')}
            />

            <Button icon="reload" compact={true} dark={true} color={Colors.green400} mode="text" onPress={() => loadCountries() }>  </Button>
          </>
        )}
      </Card>
      {/* FIN Icono OFFLINE/ONLINE */}

      <Portal>
        <Dialog visible={profileVisible} onDismiss={hideDialog} style={styles.profile}>
          <Dialog.Content>
            <Avatar.Image size={156} source={require('../assets/images/profile-pixel.png')} />
            
            
            <Caption>Enfoques de desarrollo movil</Caption>
            <TextAnimationFadeIn value={"Bruno Arnaldo Alvarado"} style={styles.profileText} delay={100} duration={100}  />
          </Dialog.Content>
        </Dialog>
      </Portal>

      <Card onPress={() => showDialog()}> 
        <Card.Cover source={require('../assets/header-logo.png')}   />
        
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
      
      {/* LOADER -> LIST  */}
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
  loader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop:'35%'
  },
  icon: {
    position:'absolute',
    zIndex:6000,
    marginTop:15,
    shadowColor:0,
  },
  profile: {
    alignItems:'center',
    backgroundColor:'#F3F6DD',
    textAlign:"center"
  },
  profileText:{
    fontSize:14,
    color:'black'
  }
});