import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import { globalStyle } from '../styles/styles';

export default function SearchBar({findNote}) {
  return (
    <View 
        style={[globalStyle.note,styles.wrap]}>
        <TextInput 
            style={styles.input}
            onChangeText={ (inputText) => {
                findNote(inputText);
            }}/>
        <Feather 
            name="search" 
            size={24} 
            color="black" 
            /> 
    </View>
  );
}

const styles = StyleSheet.create({
    input: {
        width: '90%',
        paddingHorizontal: 5,
        fontSize: 20
    },
    wrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: '#00ff00',
        marginBottom: '15%',
        borderWidth: 5
    }
});