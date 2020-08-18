import React, { useState, useEffect } from 'react';
import Message from './components/message/Messege';
import { Button, FormControl, InputLabel, Input } from '@material-ui/core';
import db from './firebase';
import firebase from 'firebase';
import FlipMove from 'react-flip-move';
import SendIcon from '@material-ui/icons/Send';
import { IconButton } from '@material-ui/core';

import './App.css';

function App() {
  // state = short term memory: keep track of our typing
  // namely, set up the variable in the REACT!!!
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');

  // useEffect allows us to run a piece of code on a condition
  // []: dependencies
  // if it's blank inside []. this code runs ONCE when the app component loads
  // if we have a variable like inp ut, it keeps running

  useEffect(() => {
    db.collection('messages')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            message: doc.data(),
          }))
        );
      });
  }, []);

  useEffect(() => {
    setUsername(prompt('Please enter your name'));
    // run code
  }, []); // condition = dependencies

  const sendMessage = (e) => {
    e.preventDefault();

    db.collection('messages').add({
      message: input,
      username: username,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setInput('');
  };

  return (
    <div className='App'>
      <img
        src='https://facebookbrand.com/wp-content/uploads/2018/09/Header-e1538151782912.png?w=100&h=100'
        alt=''
      />
      <h1>Hello Clever Programmers 🚀! </h1>
      <h2>Welcome {username}</h2>
      <form className='app__form'>
        <FormControl className='app__formControl'>
          <Input
            className='app__input'
            placeholder='Enter a message...'
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <IconButton
            className='app__iconButton'
            variant='contained'
            color='primary'
            type='submit'
            onClick={sendMessage}
            disabled={!input}
          >
            <SendIcon />
          </IconButton>
        </FormControl>
      </form>

      <FlipMove>
        {messages.map(({ id, message }) => (
          <Message key={id} username={username} message={message}></Message>
        ))}
      </FlipMove>
    </div>
  );
}

export default App;
