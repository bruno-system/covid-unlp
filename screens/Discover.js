import React, {useState, useEffect} from "react";
import {StyleSheet, View, Button, Image, Dimensions, TouchableOpacity, AsyncStorage, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import GestureRecognizer from 'react-native-swipe-gestures';

export default function Discover({ navigation }) {
    const [currentImageUrl, setImageUrl] = useState(null);
    const [currentImageFavStatus, setImageFavStatus] = useState(false);
    const [gestureName,setGestureName] = useState('none');

    const DOUBLE_PRESS_DELAY = 300;
    let lastTimeImagePress = null;

    useEffect(() => {
        // Se ejecuta cuando se monta el componente
        loadRandomImage();
    }, []);

    /**
     * Se ejecuta cuando se presiona el botón "Descubrir nueva" y cuando se abre la app por primera vez
     */
    const loadRandomImage = () => {
        const width = Math.floor(Dimensions.get('window').width);
        const height = Math.floor(Dimensions.get('window').height);
        fetch('https://picsum.photos/' + width + '/' + height)
        .then(async function (response){
            // guardamos en el state la url de la foto random
            setImageUrl(response.url);

            // Hay que determinar si la imagen ya es favorita
            // const favImagesJSONStr = await AsyncStorage.getItem('@favImagesJSON', ()=>{});
            // const favImagesJSON = JSON.parse(favImagesJSONStr);
            // const randomImageFavStatus = favImagesJSON !== null && favImagesJSON.urls.includes(response.url);
            // if (randomImageFavStatus !== currentImageFavStatus) {
            //     setImageFavStatus(randomImageFavStatus);
            // }

        });
    };

    const imageTap = () => {
        const now = new Date().getTime();

        if (lastTimeImagePress !== null && (now - lastTimeImagePress) < DOUBLE_PRESS_DELAY) {
            lastTimeImagePress = null;
            toggleImageFavStatus().then(() => {});
        } else {
            lastTimeImagePress = now;
        }
    }

    const toggleImageFavStatus = async () => {
        // const newFavStatus = !currentImageFavStatus;

        // const favImagesJSONStr = await AsyncStorage.getItem('@favImagesJSON', ()=>{});
        // let favImagesJSON = JSON.parse(favImagesJSONStr);
        // if (favImagesJSON === null) {
        //     favImagesJSON = {
        //         urls: []
        //     };
        // }

        // if (newFavStatus) {
        //     // Agregar img al storage
        //     favImagesJSON.urls.push(currentImageUrl);
        // } else {
        //     // Eliminar img del storage
        //     favImagesJSON.urls = favImagesJSON.urls.filter((value) => { return value !== currentImageUrl});
        // }

        // await AsyncStorage.setItem('@favImagesJSON', JSON.stringify(favImagesJSON), ()=>{});
        // setImageFavStatus(newFavStatus);
    }

    const config = {
        velocityThreshold: 0.4,
        directionalOffsetThreshold: 80
      };

    /**
     * El arbol de componentes que se devuelva, será renderizado cuando se invoque al componente
     */
    return (
        <View style={styles.main}>
            <GestureRecognizer
                onSwipeLeft={loadRandomImage}
                config={config}
                style={{
                flex: 1,
                backgroundColor: '#FFF'
                }}
            >
                <TouchableOpacity onPress={imageTap} style={styles.touchableOpacity}>
                { (currentImageUrl != null) && (
                    <View style={styles.imageHolder}>
                        

                        <Image style={styles.image} source={{ uri: currentImageUrl }} />
                        <TouchableOpacity onPress={toggleImageFavStatus} style={styles.favIconTouchableOpacity}>
                            <Icon
                                name={ currentImageFavStatus === false ? "heart-o" : "heart" }
                                size={30}
                                color={ currentImageFavStatus === false ? "#000" : "#F00" }
                            />
                        </TouchableOpacity>


                        
                    </View>
                )}
                </TouchableOpacity>
            </GestureRecognizer>

            
            <View style={styles.footer}>
                <Button title="Descubrir nueva" onPress={loadRandomImage} />
                <Button title="Mis favoritas" onPress={() => navigation.navigate('History')} />
            </View>
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
