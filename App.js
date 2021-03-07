import { StatusBar } from 'expo-status-bar';
import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Discover from "./screens/Discover";
import History from "./screens/History";
import Countries from "./screens/Countries";

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Countries">
                <Stack.Screen name="Countries" component={Countries} options={{ headerShown: false }}/>
                <Stack.Screen name="History" component={History} />
                <Stack.Screen name="Discover" component={Discover} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
