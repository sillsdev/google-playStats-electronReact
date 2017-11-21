// @flow
import React, { Component } from 'react';
import electron from 'electron';
import appStorage from 'electron-json-storage';
// using an ES6 transpiler, like babel
// import Img from 'react-image';
// import logo from './logo.svg';
//  import { Link } from 'react-router-dom';
// import styles from './Home.css';

import jestpadded from './jest-padded-90.png';
import SelectWbtStatement from '../components/SelectWbtStatement';

const app = electron.remote;
const dialog = app.dialog;

function persistData(storageKey, jsonData) {
  console.log('inside persitComponent() and storage_key is ' + storageKey + ', and jsonData is, ' + jsonData);
  // Write
  // const appStorage = require('electron-json-storage');
  appStorage.set(storageKey, jsonData, (error) => { if (error) throw error; });
}

export default class Home extends Component {
  state: {
    someStateVariable: string,
  }
  constructor() {
    super();
    this.state = {
      someStateVariable: 'just a place holder for demo of structure',
    };
  }
  handleTryText(inputText) {
    const tryText = inputText;
    console.log('in handleTryText we have inputText as=>' + inputText);
    this.setState({ inputText: tryText });
  }
  handleTransactionDate(inputText) {
    // const tryTransactionDate = inputText;
    console.log('in handleTryText we have inputText as=>' + inputText);
    // this.setState({ inputText: tryText });
  }
  mainOnChangeTextToHome = (event) => {
    const target = event.target;
    console.log(target.name);
    console.log(target.value);
    if (target.name === 'textToHome') {
      this.setState({ textInHome: target.value });
    }
  }

  render() {
    return (
      <div>
        <div className="container">
          <div className="App-header">
            <h2>Welcome to React</h2>
            <img src={jestpadded} className="img-thumbnail" alt="logo" />
          </div>
          <h1>Hi there we have a very simple React in Electron App</h1>
          <SelectWbtStatement
            onTransactionDate={(transactionDate) => this.handleTransactionDate(transactionDate)}
          />
        </div>
      </div>
    );
  }
}
