import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, View, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import SearchBar from './SearchBar';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; 
import { globalStyle } from '../styles/styles';
import { DB } from '../db/db';

export default function App({ navigation }) {
    const [notes, setNotes] = useState ([]);
    const [searchNotes, setSearchNotes] = useState ([]);
    const [isSearch, setIsSearch] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null); 
    const [lastDeletedNote, setLastDeletedNote] = useState(null);

    useEffect (() => {
        DB.getAll().then((notes) => {
            setNotes(notes)
        })
    }, [])

    const addNote = async (note) => {
        if (note.note === undefined) 
            note.note = ''
        if (note.name === undefined) 
            note.name = ''
        const id = await DB.add(note);        
        const newNote = await DB.get(id);
        setNotes([newNote,...notes]);
    }

    const saveNote = async (note) => {
        if (note.note === undefined) 
            note.note = ''
        if (note.name === undefined) 
            note.name = ''
        await DB.update(note);
        const newNote = await DB.get(note.id);
        const newList = [...notes];
        for (let i = 0; i < newList.length; i++) {
            if(newList[i].id === newNote.id) {
                newList[i] = newNote;
                break;
            }
        }
        setNotes(newList);
    }


    const findNote = (inputText) => {
        setSearchNotes((list) => {
            if (inputText.length == 0) {
                setIsSearch(false);
                return []
            }
            list = notes.filter(item => (
                item.name.toLowerCase().includes(inputText.toLowerCase())|| 
                item.note.toLowerCase().includes(inputText.toLowerCase())
            ));   
            setIsSearch(true);
          return [...list]
        })
    }

    const showModal = (id) => {
        setIdToDelete(id);
        setIsModalVisible(true);
      }

      const deleteNote = async (id) => {
        showModal(id);
    }

      const deleteNoteConfirmed = async (id) => {
        const noteToDelete = notes.find((note) => note.id === id);
        await DB.delete(id);
        setNotes(notes.filter(note => note.id !== id));
        setLastDeletedNote(noteToDelete);
        setIsModalVisible(false);
    }

    const restoreNote = () => {
        if (lastDeletedNote) {
            addNote(lastDeletedNote);
            setLastDeletedNote(null);
        }
    };

    return (    
        <View style={globalStyle.body}>

<Modal visible={isModalVisible} animationType='slide'>
  <View style={styles.modalContainer}>
    <Text style={styles.modalText}>Вы действительно хотите удалить заметку?</Text>
    <View style={styles.modalButtons}>
      <TouchableOpacity style={[styles.modalButton, styles.modalButtonCancel]} onPress={() => setIsModalVisible(false)}>
        <Text style={styles.modalButtonText}>Отмена</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.modalButton, styles.modalButtonDelete]} onPress={() => deleteNoteConfirmed(idToDelete)}>
        <Text style={styles.modalButtonText}>Удалить</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

            <SearchBar findNote={findNote}/>
            <FlatList 
                data={isSearch ? searchNotes : notes} 
                renderItem={({ item }) => (
                <TouchableOpacity 
                    style={[globalStyle.note, styles.note]}
                    onPress={() => 
                        navigation.navigate(
                        'Note', 
                        {...item, saveNote}
                        )
                    }>
                    <View>
                        <Text numberOfLines={1} style={styles.name}>{ item.name }</Text>
                        <Text numberOfLines={3} style={styles.text}>{ item.note }</Text>
                    </View>
                    <MaterialIcons 
                        name="delete" 
                        style={styles.delete} 
                        size={24} 
                        color="black"
                        onPress={() => showModal(item.id)} /> 
                </TouchableOpacity>
                
            )} />            
            <View style={styles.bottomBar}>
      <Ionicons
        name="create"
        style={styles.add}
        size={40}
        color="black"
        onPress={() => navigation.navigate('Note', { addNote })}
      />
      <TouchableOpacity
        style={styles.restoreButton}
        onPress={() => restoreNote()}
      >
        <Text style={styles.restoreButtonText}>Восстановить</Text>
      </TouchableOpacity>
    </View>
        </View>
  );
}

const styles = StyleSheet.create({
    note: {
        display: 'flex',
        flexDirection: 'row',
        alignItems:'center',
        justifyContent: 'space-between'
    },
    name: {
        fontWeight: 'bold',
        fontSize: 20
    },
    text: {
        fontSize: 16,
        marginTop: 5
    },
    add: {
        textAlign: "right",
        marginRight: 20,
        marginBottom: 20
    },
    delete: {
        marginRight: 20
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalText: {
        fontSize: 20,
        marginBottom: 20,
      },
      modalButtons: {
        flexDirection: 'row',
      },
      modalButton: {
        padding: 10,
        borderRadius: 5,
        marginLeft: 10,
        marginRight: 10,
      },
      modalButtonCancel: {
        backgroundColor: '#ccc',
      },
      modalButtonDelete: {
        backgroundColor: 'red',
      },
      modalButtonText: {
        color: 'white',
        fontSize: 16,
      },
});