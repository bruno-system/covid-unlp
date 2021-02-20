import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from "react";
import { StyleSheet, Text, View, Button, Image, Dimensions } from 'react-native';

export default function App() {

  const [currentImageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    // Se ejecuta cuando se monta el componente
    loadRandomImage();
  }, []);

  const loadRandomImage = () => {
    const width = Math.floor(Dimensions.get('window').width);
    const height = Math.floor(Dimensions.get('window').height);
    fetch('https://picsum.photos/' + width + '/' + height)
    .then(async function (response){
        // guardamos en el state la url de la foto random
        setImageUrl(response.url);

    });
  };

  return (
    <View style={styles.main}>
      <View style={styles.imageHolder}>
          {(currentImageUrl != null) && (     
            //Que valida q se renderisó?         
            <Image style={styles.image} source={{ uri: currentImageUrl }} />
          )
          }                 
      </View>
      <View style={styles.footer}>
          <Button title="Descubrir nueva" onPress={loadRandomImage} />
          <Button title="Mis favoritas" onPress={() => {}} />
      </View>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
      flex: 1,
      flexDirection: 'column',
  },
  touchableOpacity: {
      flex: 1
  },
  imageHolder: {
      flex: 1
  },
  image: {
      flex: 1
  },
  favIconTouchableOpacity: {
      position: 'absolute',
      right: 20,
      top: 40
  },
  footer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 8,
  }
});
