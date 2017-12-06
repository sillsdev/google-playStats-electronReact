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
import UpdateStateInHome from '../components/UpdateStateInHome';
import ImportCsvFileWithPapaParse from '../components/ImportCsvFileWithPapaParse';
import GooglePlayScraper from '../components/GooglePlayScraper';

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
    googlePlayScaperProp: string
  }
  constructor() {
    super();
    this.state = {
      inputTextDelay1Char: 'this is something',
      textStateInHomeNoDelay: 'text In Home',
      someStateVariable: 'just a place holder for demo of structure',
      transactionDateInHome: 'Jan 4 1927',
      googlePlayScaperProp: 'connect scraper with Home.js'
    };
  }
  handleTryText(inputText) {
    const tryText = inputText;
    console.log('in handleTryText we have inputText as=>' + inputText);
    this.setState({ inputTextDelay1Char: tryText });
  }
  handleTransactionDate(inputText) {
    const tryTransactionDate = inputText;
    console.log('in handleTransactionDate we have inputText as=>' + inputText);
    this.setState({ transactionDateInHome: tryTransactionDate });
  }
  mainOnChangeTextToHomeNoDelay = (event) => {
    const target = event.target;
    console.log(target.name);
    console.log(target.value);
    if (target.name === 'textToHome') {
      this.setState({ textStateInHomeNoDelay: target.value });
    }
  }
  mainonChangepropInHome = (event) => {
    //could do something
    console.log('entering mainonChangepropInHome');
    const target = event.target;
    console.log(target.name);
    console.log(target.name);
    console.log('leaving mainonChangepropInHome');
  }

  render() {
    return (
      <div>
        <div className="container">
          <div className="App-header">
            <h2>Welcome to WBT's Scripture Apps Install Stats Viewer</h2>
            <img src={jestpadded} className="img-thumbnail" alt="logo" />
            <h3>Change to an appropriate Logo....</h3>
          </div>
          <h2>Hi let's get the SAB Apps' Install Stats</h2>
          <ImportCsvFileWithPapaParse />
          <GooglePlayScraper
            propInHome={this.state.googlePlayScaperProp}
            onChangepropInHome={this.mainonChangepropInHome}
          />
          <UpdateStateInHome
            onTryText={(tryText) => this.handleTryText(tryText)}
            textToHome={this.state.textStateInHomeNoDelay}
            onChangeTextToHomeNoDelay={this.mainOnChangeTextToHomeNoDelay}
          />
        </div>
      </div>
    );
  }
}
