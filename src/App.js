
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
    text: {
      medium: {
        size: '14px'
      }
    },
    global: {
      font: {
        family: 'UbuntuRegular'
      },
      focus: {
        border: {
          color: 'secondary'
        }
      },
      colors: {
        'faint': 'rgba(200, 200, 200, 1)',
        'light-2': '#f5f5f5',
        'secondary': '#C1C1C1',
        'bright': '#CC3F0C',
        'dark': '#152028',
        'light': '#2C4251',
        'text': {
          'light': 'white',
          'dark': 'rgba(255, 255, 255, 1)',
        },
        'background': {
          'dark': 'light',
        }
      },
    },
    input: {
      selected: {
        color: 'secondary'
      }
    },
    button: {
      border: {
        width: '1px',
        radius: '10px',
        color: 'secondary'
      },
      padding: {
        vertical: '8px',
        horizontal: '16px',
      },
      primary: {
        color: 'secondary'
      },
    },
    carousel: {
      animation: {
        duration: 100
      }
    },
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
            <Box overflow='auto' fill>
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