//import React, { useState, useEffect } from "react";
//import "./App.css";
//import "@aws-amplify/ui-react/styles.css";
//import { API } from "aws-amplify";
//import {
//  Button,
//  Flex,
//  Heading,
//  Text,
//  TextField,
//  View,
//  withAuthenticator,
//} from "@aws-amplify/ui-react";
//import { listNotes } from "./graphql/queries";
//import {
//  createNote as createNoteMutation,
//  deleteNote as deleteNoteMutation,
//} from "./graphql/mutations";
//
//const App = ({ signOut }) => {
//  const [notes, setNotes] = useState([]);
//
//  useEffect(() => {
//    fetchNotes();
//  }, []);
//
//  async function fetchNotes() {
//    const apiData = await API.graphql({ query: listNotes });
//    const notesFromAPI = apiData.data.listNotes.items;
//    setNotes(notesFromAPI);
//  }
//
//  async function createNote(event) {
//    event.preventDefault();
//    const form = new FormData(event.target);
//    const data = {
//      name: form.get("name"),
//      description: form.get("description"),
//    };
//    await API.graphql({
//      query: createNoteMutation,
//      variables: { input: data },
//    });
//    fetchNotes();
//    event.target.reset();
//  }
//
//  async function deleteNote({ id }) {
//    const newNotes = notes.filter((note) => note.id !== id);
//    setNotes(newNotes);
//    await API.graphql({
//      query: deleteNoteMutation,
//      variables: { input: { id } },
//    });
//  }
//
//  return (
//    <View className="App">
//      <Heading level={1}>My Notes App</Heading>
//      <View as="form" margin="3rem 0" onSubmit={createNote}>
//        <Flex direction="row" justifyContent="center">
//          <TextField
//            name="name"
//            placeholder="Note Name"
//            label="Note Name"
//            labelHidden
//            variation="quiet"
//            required
//          />
//          <TextField
//            name="description"
//            placeholder="Note Description"
//            label="Note Description"
//            labelHidden
//            variation="quiet"
//            required
//          />
//          <Button type="submit" variation="primary">
//            Create Note
//          </Button>
//        </Flex>
//      </View>
//      <Heading level={2}>Current Notes</Heading>
//      <View margin="3rem 0">
//        {notes.map((note) => (
//          <Flex
//            key={note.id || note.name}
//            direction="row"
//            justifyContent="center"
//            alignItems="center"
//          >
//            <Text as="strong" fontWeight={700}>
//              {note.name}
//            </Text>
//            <Text as="span">{note.description}</Text>
//            <Button variation="link" onClick={() => deleteNote(note)}>
//              Delete note
//            </Button>
//          </Flex>
//        ))}
//      </View>
//      <Button onClick={signOut}>Sign Out</Button>
//    </View>
//  );
//};
//
//export default withAuthenticator(App);

import './App.css';
import { Router, Routes, Route } from 'react-router-dom';
import { Box, Grid, Grommet, ResponsiveContext, Spinner } from 'grommet';
import PollOptions from './components/PollOptions';
import React, { useState, useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import VoteForOption from './components/VoteForOption';
import ViewPolls from './components/ViewPolls';


function App() {
  const theme = {
    global: {
      colors: {
        'faint': 'rgba(200, 200, 200, 1)',
        'light-2': '#f5f5f5',
        'text': {
          'light': 'rgba(0, 0, 0, 0.87)',
          'dark': 'rgba(255, 255, 255, 1)',
        },
        'background': {
          'dark': '#262626',
        }
      },
      //edgeSize: {
      //  small: '14px',
      //},
      //elevation: {
      //  light: {
      //    medium: '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
      //  },
      //},
      //font: {
      //  size: '14px',
      //  height: '20px',
      //},
    },
    button: {
      border: {
        width: '1px',
        radius: '10px',
      },
      padding: {
        vertical: '8px',
        horizontal: '16px',
      },
      //extend: props => `
      //    text-transform: uppercase;
      //    font-size: 0.875rem;
      //    font-weight: 500;
      //    line-height: normal;

      //    ${!props.primary && `
      //    color: ${normalizeColor(props.colorValue, props.theme)};
      //    :hover {
      //        box-shadow: none;
      //    }
      //    `}
      //`,
    },
    carousel: {
      animation: {
        duration: 100
      }
    }
  };
  return (
    <ResponsiveContext.Consumer>
      {
        size => (
          <Grommet
            theme={theme}
            id='grommetContainer'
            style={{
              height: '100vh', // dont remove
              //width: '100vw', // dont remove
              //overflowY: 'hidden',
              //position: (size === 'small' ? 'fixed' : 'relative')
            }}
            themeMode='dark'
          >
            {
              console.log("size", size)
            }
            <Box fill>
              <Routes>
                <Route path='/' element={<PollOptions />} />
                <Route path='/vote' element={<VoteForOption />} />
                <Route path='/polls' element={<ViewPolls />} />
              </Routes>
            </Box>
          </Grommet>
        )
      }
    </ResponsiveContext.Consumer>
  );
}

export default App;