import React from "react";
import MainScreen from './components/MainScreen';
import NoteScreen from './components/NoteScreen';

import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createStackNavigator();

export default function Navigate() {
    return <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen 
                name="Main"
                component={MainScreen}
                options={
                    {
                        title:'Notes',
                        headerStyle: 
                        { 
                            backgroundColor: '#32CD32'
                        }                        
                    }
                }
            />
            <Stack.Screen 
                name="Note"
                component={NoteScreen}
                options={
                    {
                        headerStyle: { backgroundColor: '#32CD32' },
                        headerTitleStyle: { fontWeight: '100'}
                    }
                } 
            />            
        </Stack.Navigator>
    </NavigationContainer>;
}