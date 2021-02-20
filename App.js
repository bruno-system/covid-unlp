import { StatusBar } from 'expo-status-bar';
import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Discover from "./screens/Discover";
import History from "./screens/History";

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Discover">
                <Stack.Screen name="Discover" component={Discover} options={{ headerShown: false }}/>
                <Stack.Screen name="History" component={History} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
