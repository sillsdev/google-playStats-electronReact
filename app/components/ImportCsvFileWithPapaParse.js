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
const countries = require("i18n-iso-countries");


class ImportCsvFileWithPapaParse extends Component {
  state: {
    csvOverviewFile: string,
    csvCountryFile: string,
    oneDataItem : array,
    csvFileData : array,
    csvCountryFileData : array,

    transactionDate: string,
    countryTransDate: string,
    countryCode: string,
    countryName: string,
    countryInstalls: string,
    countryActiveDevices: string,
    packageNameFromCsv: string,
    totalUserInstalls: number,
    activeDeviceInstalls: number
  }
  constructor() {
    super();
    this.readCsvFilePapaParse = this.readCsvFilePapaParse.bind(this);
    this.readCountryCsvFilePapaParse = this.readCountryCsvFilePapaParse.bind(this);
    this.state = {
      csvOverviewFile: "no overview.csv file selected yet",
      csvCountryFile: "no country.csv file selected yet",
      oneDataItem: ["2017-10-09","org.mixtecosilacayoapan.mks",3,4,5,6,7,8],
      csvFileData: [[1],[2]],
      csvCountryFileData: [[1],[2]],

      transactionDate: 'transactionDate',
      countryTransDate: 'countryTransDate',
      countryCode: 'countryCode',
      countryName: 'countryName',
      countryInstalls: 'countryInstalls',
      countryActiveDevices: 'countryActiveDevices',
      packageNameFromCsv: 'packageNameFromCsv',
      totalUserInstalls: -1,
      activeDeviceInstalls: -1
    };
  }
  readCsvFilePapaParse = () => {
    console.log('entering readCsvFilePapaParse');
    const filename = this.state.csvOverviewFile;
    this.parseDataC1(filename, this.doStuffOverview);

    console.log('leaving readCsvFilePapaParse');
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
  doStuffOverview = (data) => {
      //Data is usable here
      console.log(data);
      this.setState({ csvFileData: data });
      console.log( data.length);
      console.log('Column Headings in file: ');
      console.log(data[0]);
      const lastEntry = data[data.length-2];
      console.log('Last entry in file: ');
      this.setState({ oneDataItem: lastEntry });
      console.log(lastEntry);
      console.log(lastEntry[0]);
      console.log(lastEntry[1]);
      console.log(lastEntry[5]);
      console.log(lastEntry[8]);
      this.setState({ transactionDate: lastEntry[0] });
      this.setState({ packageNameFromCsv: lastEntry[1] });
      this.setState({ totalUserInstalls: lastEntry[5] });
      this.setState({ activeDeviceInstalls: lastEntry[8] });
  }
  readCountryCsvFilePapaParse = () => {
    console.log('entering readCountryCsvFilePapaParse');
    const filename = this.state.csvCountryFile;
    this.parseDataC1(filename, this.doStuffCountry);

    console.log('leaving readCountryCsvFilePapaParse');
  }
  doStuffCountry = (data) => {
      //Data is usable here
      console.log(data);
      this.setState({ csvCountryFileData: data });
      console.log( data.length);
      console.log('Column Headings in file: ');
      console.log(data[0]);
      const firstEntry = data[1];
      console.log('Last entry in file: ');
      this.setState({ oneDataItem: firstEntry });
      console.log(firstEntry);
      console.log('Date: ' + firstEntry[0]);
      this.setState({ countryTransDate: firstEntry[0] });
      console.log('Package Name: ' + firstEntry[1]);
      console.log('Country: ' + firstEntry[2]);
      this.setState({ countryCode: firstEntry[2] });
      this.setState({ countryName: countries.getName(firstEntry[2], "en") });
      this.setState({ countryInstalls: firstEntry[6] });
      this.setState({ countryActiveDevices: firstEntry[9] });
      let firstTransactionDate = firstEntry[0];
      let i = 1;
      while (data[i][0] === firstTransactionDate) {
        let row = data[i];
        console.log('Code: ' + row[2] + ', TotalInstalls: ' + row[6] + ', ActiveDevices: ' + row[9] +", Country => " + countries.getName(row[2], "en") );
        i++;
      }

  }


  selectCsvOverviewFile = () => {
    console.log('called selectCsvOverviewFile');
    const fileNames = dialog.showOpenDialog({ title:"Select an overview.csv file", filters:[{name: '...overview.csv', extensions: ['csv']}] });
    //var path = dialog.showOpenDialog( { title:"Select a folder", properties: ["openDirectory"] } );
    if (fileNames === undefined) {
      console.log('inside selectCsvOverviewFile No file selected');
      this.setState({ csvOverviewFile: '' });
    } else {
      // console.log('going to set the filename and boolean' + fileNames);
      this.setState({ csvOverviewFile: fileNames[0] });
    }
    console.log('end of selectCsvOverviewFile');
  }
  selectCsvCountryFile = () => {
    console.log('called selectCsvCountryFile');
    const fileNames = dialog.showOpenDialog({ title:"Select an country.csv file", filters:[{name: '...country.csv', extensions: ['csv']}] });
    //var path = dialog.showOpenDialog( { title:"Select a folder", properties: ["openDirectory"] } );
    if (fileNames === undefined) {
      console.log('inside selectCsvCountryFile No file selected');
      this.setState({ csvCountryFile: '' });
    } else {
      // console.log('going to set the filename and boolean' + fileNames);
      this.setState({ csvCountryFile: fileNames[0] });
    }
    console.log('end of selectCsvCountryFile');
  }

  render() {
    /*
    if (this.state.jobFilepathSelected && this.state.metaDataFolderSelected) {
      $('#sendButton').removeAttr('disabled');
    } else {
      $('#sendButton').attr('disabled', 'true');
    }
    */
    let transactionDate = 'transactionDate';
    let countryTransDate = 'countryTransDate';
    let countryCode = 'countryCode';
    let countryName = 'countryName';
    let countryInstalls = 'countryInstalls';
    let countryActiveDevices = 'countryActiveDevices';
    let packageNameFromCsv = 'packageNameFromCsv';
    let totalUserInstalls = -1;
    let activeDeviceInstalls = -1;

    if (this.state.csvOverviewFile === 'no overview.csv file selected yet') {
      // possibly do something
    } else {
      transactionDate = this.state.transactionDate;
      packageNameFromCsv = this.state.packageNameFromCsv;
      totalUserInstalls = this.state.totalUserInstalls;
      activeDeviceInstalls = this.state.activeDeviceInstalls;
    }
    if (this.state.csvCountryFile === 'no country.csv file selected yet') {
      // possibly do something
    } else {
      countryTransDate = this.state.countryTransDate;
      countryCode = this.state.countryCode;
      countryName = this.state.countryName;
      countryInstalls = this.state.countryInstalls;
      countryActiveDevices = this.state.countryActiveDevices;
    }

    return (
      <div className="panel panel-primary">
        <div className="panel-heading apt-addheading">Scripture App Download Stats</div>
        <div className="panel-body">
          <form className="form" onSubmit={this.localHandleSend}>
            <div className="form-group">
              <label htmlFor="wbtStatementFile">Select Downloaded (csv) File and Display Stats</label>
              <br></br><br></br>
              <div className="panel panel-info">
                <div className="panel-heading">Display Results from Overview file...</div>
                <div className="panel-body">
                  <div className="btn-toolbar" role="group" aria-label="Basic example">
                    <div className="pull-left">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={this.selectCsvOverviewFile}
                      >Select ...overview.csv File</button>&nbsp;
                    </div>
                    <div className="col-sm-offset-3">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={this.readCsvFilePapaParse}
                      >Process CSV File Papa</button>&nbsp;
                    </div>
                  </div>
                  <div className="form-text" id="csvOverviewFileId" >{this.state.csvOverviewFile}</div>
                  <div className="form-group">
                    <label className="col-sm-6 control-label" htmlFor="transactionDate">Date</label>
                    <div className="form-text" id="transactionDate" placeholder="transactionDate" >{transactionDate}</div>
                    <br></br>
                    <label className="col-sm-6 control-label" htmlFor="packageNameFromCsv">Package Name</label>
                    <div className="form-text" id="packageNameFromCsv" placeholder="packageNameFromCsv" >{packageNameFromCsv}</div>
                    <br></br>
                    <label className="col-sm-6 control-label" htmlFor="totalUserInstalls">Total User Installs</label>
                    <div className="form-text" id="totalUserInstalls" placeholder="totalUserInstalls" >{totalUserInstalls}</div>
                    <br></br>
                    <label className="col-sm-6 control-label" htmlFor="activeDeviceInstalls">Active Device Installs</label>
                    <div className="form-text" id="activeDeviceInstalls" placeholder="activeDeviceInstalls" >{activeDeviceInstalls}</div>
                    <br></br>
                  </div> {/* form-group */}
                </div>
              </div>
              <div className="panel panel-info">
                <div className="panel-heading">Display Results from Countries file...</div>
                <div className="panel-body">
                  <div className="btn-toolbar" role="group" aria-label="Basic example">
                    <div className="pull-left">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={this.selectCsvCountryFile}
                      >Select ...country.csv File</button>&nbsp;
                    </div>
                    <div className="col-sm-offset-3">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={this.readCountryCsvFilePapaParse}
                      >Process country.csv File Papa</button>&nbsp;
                    </div>
                  </div>
                  <div className="form-text" id="csvOverviewFileId" >{this.state.csvCountryFile}</div>
                  <div className="form-group">
                    <label className="col-sm-6 control-label" htmlFor="countryTransDate">Date</label>
                    <div className="form-text" id="countryTransDate" placeholder="countryTransDate" >{countryTransDate}</div>
                    <br></br>
                    <label className="col-sm-6 control-label" htmlFor="countryCode">Country Code</label>
                    <div className="form-text" id="countryCode" placeholder="countryCode" >{countryCode}</div>
                    <br></br>
                    <label className="col-sm-6 control-label" htmlFor="countryName">Country Name</label>
                    <div className="form-text" id="countryName" placeholder="countryName" >{countryName}</div>
                    <br></br>
                    <label className="col-sm-6 control-label" htmlFor="countryInstalls">Total User Installs</label>
                    <div className="form-text" id="countryInstalls" placeholder="countryInstalls" >{countryInstalls}</div>
                    <br></br>
                    <label className="col-sm-6 control-label" htmlFor="countryActiveDevices">Active Device Installs</label>
                    <div className="form-text" id="countryActiveDevices" placeholder="countryActiveDevices" >{countryActiveDevices}</div>
                    <br></br>
                  </div> {/* form-group */}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default ImportCsvFileWithPapaParse;
