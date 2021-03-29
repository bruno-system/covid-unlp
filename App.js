import { StatusBar } from 'expo-status-bar';
import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Discover from "./screens/Discover";
import History from "./screens/History";
import Countries from "./screens/Countries";
import CountryDetails from "./screens/CountryDetails";
import { DefaultTheme,DarkTheme, Provider as PaperProvider } from 'react-native-paper';

const Stack = createStackNavigator();

const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: '#3498db',
      accent: '#f1c40f',
    },
  };

export default function App() {
    return (
        <PaperProvider theme={theme}>
            <NavigationContainer>
                <Stack.Navigator 
                    initialRouteName="Countries"
                    screenOptions={{
                        headerStyle: {
                          backgroundColor: '#75BB4B',
                        },
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                          fontWeight: 'bold',
                        },
                      }}
                    >
                    <Stack.Screen name="Countries" component={Countries} options={{ headerShown: false }}/>
                    <Stack.Screen name="CountryDetails" component={CountryDetails} options={{ title: 'Información del Pais' }} />
                    <Stack.Screen name="History" component={History} />
                    <Stack.Screen name="Discover" component={Discover} />
                </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
}
