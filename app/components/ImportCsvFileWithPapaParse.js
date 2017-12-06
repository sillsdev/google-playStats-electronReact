// @flow
import React, { Component } from 'react';
import electron from 'electron';
import jquery from 'jquery';
import Papa from 'papaparse';
console.log('get papaparse loaded');
// import PropTypes from 'prop-types';
//  import { Link } from 'react-router-dom';
//  import styles from './LoginForm.css';

const app = electron.remote;
const dialog = app.dialog;
const fs = require('fs');
const fsOutput = require('fs');
const jsonData = require('./SABprojectsData.json');
const csv=require('csvtojson');
const csvToArray = require("csv-to-array");


function doStuff(data) {
    //Data is usable here
    console.log(data);
}

function parseData(url, callBack) {
    Papa.parse(url, {
        download: true,
        dynamicTyping: true,
        complete: function(results) {
            callBack(results.data);
        }
    });
}

class ImportCsvFileWithPapaParse extends Component {
  state: {
    csvFile: string,
    packageName: string,
    totalUserInstalls: number,
    activeDeviceInstalls: number,
    monthYear: string,
    monthUserInstalls: number,
    monthUserUninstalls: number,
    appTitle: string,
    ethnologueCode: string,
    country: string,
    population: number,
    csvOutPut1: string,
    csvOutPut2: string,
    jsonButtonClicked: boolean,
    toggleJsonFileDataUsed: boolean,
    oneDataItem : array
  }
  constructor() {
    super();
    this.readCsvFile = this.readCsvFile.bind(this);
    this.readCsvFilePapaParseC1 = this.readCsvFilePapaParseC1.bind(this);
    this.state = {
      csvFile: "no CSV file selected yet",
      packageName: 'org.scriptureearth.djk.nt.apk',
      totalUserInstalls: 384,
      activeDeviceInstalls: 111,
      monthYear: "10/2017",
      monthUserInstalls: 31,
      monthUserUninstalls: 26,
      appTitle: 'Aukaans - Bible',
      ethnologueCode: "djk",
      country: "Suriname",
      population: 39700,
      csvOutPut1: "nada",
      csvOutPut2: "nada dada baba",
      jsonButtonClicked: false,
      toggleJsonFileDataUsed: false,
      oneDataItem: ["2017-10-09","org.mixtecosilacayoapan.mks",3,4,5,6,7,8]
    };
  }

  readCsvFile = () => {
    console.log('entering readCsvFile');
    const filename = this.state.csvFile;
    console.log('filename is');
    console.log(filename);
    let columns = ["Date", "Package Name", "Daily Device Installs",
    "Daily Device Uninstalls", "Daily Device Upgrades", "Total User Installs",
    "Daily User Installs", "Daily User Uninstalls", "Active Device Installs"];
    const options = {
      file: filename,
      columns: columns
    };
    csvToArray(options, function (err, array) {
      console.log(err || array);
      //this.callbackSaveArray(err || array); //JS returns the left operand (err) if it is truthy or the right operand  (array) otherwise
    });
    this.csvToArrayCall();

    console.log('leaving readCsvFile');
  }
  csvToArrayCall = () => {
    console.log('calling csvToArrayCall=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+');
    console.log('doing this with this.csvToArrayCall');
    //this.callbackSaveArray(err || array); //JS returns the left operand (err) if it is truthy or the right operand  (array) otherwise
  }
  callbackSaveArray = (finalData) => {
    console.log('entering inside callbackSaveArray');
    console.log(finalData);
    console.log('exiting callbackSaveArray');
  }
  readCsvFilePapaParse = () => {
    console.log('entering readCsvFilePapaParse');
    const filename = this.state.csvFile;
    parseData(filename, doStuff);

    console.log('leaving readCsvFilePapaParse');
  }
  readCsvFilePapaParseC1 = () => {
    console.log('entering readCsvFilePapaParseC1');
    const filename = this.state.csvFile;
    this.parseDataC1(filename, this.doStuffC1);

    console.log('leaving readCsvFilePapaParseC1');
  }
  parseDataC1 = (url, callBack) => {
      Papa.parse(url, {
          download: true,
          dynamicTyping: true,
          complete: function(results) {
              callBack(results.data);
          }
      });
  }
  doStuffC1 = (data) => {
      //Data is usable here
      console.log(data);
      const oneData = data[8];
      this.setState({ oneDataItem: oneData });
  }


  selectCsvFile = () => {
    console.log('called selectCsvFile');
    const fileNames = dialog.showOpenDialog();
    if (fileNames === undefined) {
      console.log('inside selectCsvFile No file selected');
      this.setState({ csvFile: '' });
    } else {
      // console.log('going to set the filename and boolean' + fileNames);
      this.setState({ csvFile: fileNames[0] });
    }
    console.log('end of selectCsvFile');
  }
  readJsonDataFile = () => {
    console.log('called readJsonDataFile');

    console.log("SABprojectsData.json");
    console.log(jsonData);
    let objFromData;
    if (this.state.toggleJsonFileDataUsed){
      this.setState({ toggleJsonFileDataUsed: false });
       objFromData = jsonData[1];
    } else {
      this.setState({ toggleJsonFileDataUsed: true });
      objFromData = jsonData[0];
    }
    console.log("first record from json data file");
    console.log(objFromData);
    console.log(objFromData.packageName);
    console.log(objFromData.population);
    this.setState({ jsonButtonClicked: true });
    this.setState({ packageName: objFromData.packageName });
    this.setState({ totalUserInstalls: objFromData.totalUserInstalls });
    this.setState({ activeDeviceInstalls: objFromData.activeDeviceInstalls });
    this.setState({ monthYear: objFromData.monthYear });
    this.setState({ monthUserInstalls: objFromData.monthUserInstalls });
    this.setState({ monthUserUninstalls: objFromData.monthUserUninstalls });
    this.setState({ appTitle: objFromData.appTitle });
    this.setState({ ethnologueCode: objFromData.ethnologueCode });
    this.setState({ country: objFromData.country });
    this.setState({ population: objFromData.population });
    console.log('end of readJsonDataFile');
  }
  handleTransactionDate = (event) => {
    const target = event.target;
    console.log(target.name);
    console.log(target.value);
    if (target.name === 'transactionDateTextBox') {
      this.setState({ transactionDate: target.value });
    }
    this.props.onTransactionDate(this.state.transactionDate);
  }
  render() {
    /*
    if (this.state.jobFilepathSelected && this.state.metaDataFolderSelected) {
      $('#sendButton').removeAttr('disabled');
    } else {
      $('#sendButton').attr('disabled', 'true');
    }
    */
    let packageName = 'blah packageName';
    let totalUserInstalls = -12345;
    let activeDeviceInstalls = -12345;
    let monthYear = 'blah monthYear';
    let monthUserInstalls = -12345;
    let monthUserUninstalls = -12345;
    let appTitle = 'blah appTitle';
    let ethnologueCode = 'blah ethnologueCode';
    let country = 'blala Country';
    let population = -12345;

    if (this.state.csvFile === 'no CSV file selected yet') {
      // possibly do something
    } else {
      packageName = this.state.packageName;
      totalUserInstalls = this.state.totalUserInstalls;
      activeDeviceInstalls = this.state.activeDeviceInstalls;
      monthYear = this.state.monthYear;
      monthUserInstalls = this.state.monthUserInstalls;
      monthUserUninstalls = this.state.monthUserUninstalls;
      appTitle = this.state.appTitle;
      ethnologueCode = this.state.ethnologueCode;
      country = this.state.country;
      population = this.state.population;
    }
    if (this.state.jsonButtonClicked) {
      packageName = this.state.packageName;
      totalUserInstalls = this.state.totalUserInstalls;
      activeDeviceInstalls = this.state.activeDeviceInstalls;
      monthYear = this.state.monthYear;
      monthUserInstalls = this.state.monthUserInstalls;
      monthUserUninstalls = this.state.monthUserUninstalls;
      appTitle = this.state.appTitle;
      ethnologueCode = this.state.ethnologueCode;
      country = this.state.country;
      population = this.state.population;
    }

    return (
      <div className="panel panel-primary">
        <div className="panel-heading apt-addheading">Select CSV Google Play Store Stats File</div>
        <div className="panel-body">
          <form className="form" onSubmit={this.localHandleSend}>
            <div className="form-group">
              <label htmlFor="wbtStatementFile">Show Scripture Apps Download Stats</label>
              <div className="form-text" id="csvFileId" >{this.state.csvFile}</div>
              <div className="col-sm-offset-3 col-sm-9">
                <div className="pull-right">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.selectCsvFile}
                  >Select CSV File</button>&nbsp;
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-3 control-label" htmlFor="packageName">packageName</label>
              <div className="form-text" id="packageName" placeholder="packageName" >{packageName}</div>
              <br></br>
              <label className="col-sm-3 control-label" htmlFor="totalUserInstalls">totalUserInstalls</label>
              <div className="form-text" id="totalUserInstalls" placeholder="totalUserInstalls" >{totalUserInstalls}</div>
              <br></br>
              <label className="col-sm-3 control-label" htmlFor="activeDeviceInstalls">activeDeviceInstalls</label>
              <div className="form-text" id="activeDeviceInstalls" placeholder="activeDeviceInstalls" >{activeDeviceInstalls}</div>
              <br></br>
              <label className="col-sm-3 control-label" htmlFor="monthYear">monthYear</label>
              <div className="form-text" id="monthYear" placeholder="monthYear" >{monthYear}</div>
              <br></br>
              <label className="col-sm-3 control-label" htmlFor="monthUserInstalls">monthUserInstalls</label>
              <div className="form-text" id="monthUserInstalls" placeholder="monthUserInstalls" >{monthUserInstalls}</div>
              <br></br>
              <label className="col-sm-3 control-label" htmlFor="monthUserUninstalls">monthUserUninstalls</label>
              <div className="form-text" id="monthUserUninstalls" placeholder="monthUserUninstalls" >{monthUserUninstalls}</div>
              <br></br>
              <label className="col-sm-3 control-label" htmlFor="appTitle">appTitle</label>
              <div className="form-text" id="appTitle" placeholder="appTitle" >{appTitle}</div>
              <br></br>
              <label className="col-sm-3 control-label" htmlFor="ethnologueCode">ethnologueCode</label>
              <div className="form-text" id="ethnologueCode" placeholder="ethnologueCode" >{ethnologueCode}</div>
              <br></br>
              <label className="col-sm-3 control-label" htmlFor="country">country</label>
              <div className="form-text" id="country" placeholder="country" >{country}</div>
              <br></br>
              <label className="col-sm-3 control-label" htmlFor="population">population</label>
              <div className="form-text" id="population" placeholder="population" >{population}</div>
              <br></br>
              <div className="col-sm-offset-3 col-sm-9">
                <div className="pull-right">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.readCsvFile}
                  >Process CSV File</button>&nbsp;
                </div>
              </div> {/* className="col-sm-offset-3 col-sm-9" */}
              <div className="col-sm-offset-3 col-sm-9">
                <div className="pull-right">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.readCsvFilePapaParseC1}
                  >Process CSV File Papa</button>&nbsp;
                </div>
              </div> {/* className="col-sm-offset-3 col-sm-9" */}
            </div> {/* form-group */}
            <div className="form-group">
              <div className="col-sm-offset-3 col-sm-9">
                <div className="pull-left">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.readJsonDataFile}
                  >Get JsonData File</button>&nbsp;
                </div>
              </div>  {/* className="col-sm-offset-3 col-sm-9" */}
            </div> {/* form-group */}
            <div className="form-group">
              <label htmlFor="csvOutPut1">Output File 1</label>
              <div className="form-text" id="csvOutPut1-Id" >{this.state.csvOutPut1}</div>
              <label htmlFor="csvOutPut2">Output File 2</label>
              <div className="form-text" id="csvOutPut2-Id" >{this.state.csvOutPut2}</div>
            </div> {/*  */}//form-group
          </form>
        </div>
      </div>
    );
  }
}

export default ImportCsvFileWithPapaParse;
