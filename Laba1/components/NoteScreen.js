import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import React from 'react';
import { StyleSheet, View,  TextInput, Button, Text } from 'react-native';
import { Formik } from 'formik';
import { globalStyle } from '../styles/styles';

export default function NoteScreen({ route, navigation }) {
  let formHadler;
  const name = route.params.name;
  const note = route.params.note;
  const id = route.params.id;

  if (name == undefined && note == undefined) {
    navigation.setOptions({ title: 'Create new note',  
    headerStyle: { backgroundColor: '#32CD32' },
    headerTitleStyle: { color: 'white' } });
    formHadler = route.params.addNote;
  }
  else {
    navigation.setOptions({ title: 'Edit note',
    headerStyle: { backgroundColor: '#32CD32' },
    headerTitleStyle: { color: 'white' } });
    formHadler = route.params.saveNote;
  }

  return (
      <View style={globalStyle.body}>
          <Formik 
            initialValues={{name, note, id}} 
            onSubmit={( values, action ) => {
               formHadler(values);
               action.resetForm();
            }}>
            {(props) => (
              <View>
                <View style={styles.label}>
                <Text style={[styles.textLabel, globalStyle.font]}>Name of note</Text>
                </View>
                <TextInput 
                    style={[
                      globalStyle.note, 
                      {fontWeight: 'bold'}, 
                      globalStyle.font]} 
                    value={props.values.name}
                    onChangeText={props.handleChange('name')}
                    multiline
                />
                <View style={styles.label}>
                  <Text style={[styles.textLabel, globalStyle.font]}>Text of note</Text>
                </View>
                <TextInput 
                    style={[globalStyle.note, styles.input, globalStyle.font]}
                    value={props.values.note}
                    onChangeText={props.handleChange('note')}
                    multiline
                />
                <View style={styles.button}>
                  <Button 
                    title='Save' 
                    color='#00FF00'
                    onPress={
                      () => {
                        props.handleSubmit();
                        navigation.navigate('Main')
                      }
                    }/>
                </View>
              </View>
            )}
          </Formik>
      </View>
  );
}

const styles = StyleSheet.create({
  label: {
    alignItems:'center',
    fontSize: 5
  },
  input: {
    height: '60%',
    textAlignVertical: 'top'
  },
  textLabel: {
    fontSize: 18,       // задаем размер шрифта
    fontWeight: 'bold'  // задаем жирность шрифта
  },
  button: {
    width: '95%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 15,
    backgroundColor: '#FF0000'
  }
});