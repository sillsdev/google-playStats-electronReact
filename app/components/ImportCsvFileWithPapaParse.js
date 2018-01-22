// @flow
import React, { Component } from 'react';
import electron from 'electron';
import jquery from 'jquery';
import Papa from 'papaparse';
console.log('get papaparse loaded');
// import PropTypes from 'prop-types';
//  import { Link } from 'react-router-dom';
//  import styles from './LoginForm.css';

// with es6
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
// http://allenfang.github.io/react-bootstrap-table/start.html

const app = electron.remote;
const dialog = app.dialog;
const jsonData = require('./SABprojectsData.json');
const countriesIso = require("i18n-iso-countries");
var gplay = require('google-play-scraper');

var path = require('path');
var fs = require('fs');


class ImportCsvFileWithPapaParse extends Component {
  state: {
    csvOverviewFile: string,
    csvCountryFile: string,
    csvOsVersionFile: string,
    oneDataItem : array,
    csvOverviewFileData : array,
    csvCountryFileData : array,
    countryTableData: array,
    csvOsVersionFileData : array,
    osVersionTableData: array,

    transactionDate: string,
    countryTransDate: string,
    packageNameFromCsv: string,
    totalUserInstalls: number,
    activeDeviceInstalls: number,

    osVersionTransDate: string,
    titleFromScraperApp: string,

    reviewsFromScraperApp: string,
    scoreNameFromScraperApp: string,
    versionFromScraperApp: string,
  }
  constructor() {
    super();
    this.readOverviewCsvFilePP = this.readOverviewCsvFilePP.bind(this);
    this.readCountryCsvFilePP = this.readCountryCsvFilePP.bind(this);
    this.readOsVersionCsvFilePP = this.readOsVersionCsvFilePP.bind(this);
    this.state = {
      csvOverviewFile: "no overview.csv file selected yet",
      csvCountryFile: "no country.csv file selected yet",
      csvOsVersionFile: "no os_versiion.csv file selected yet",
      oneDataItem: ["2017-10-09","org.mixtecosilacayoapan.mks",3,4,5,6,7,8],
      csvOverviewFileData: [[1],[2]],
      csvCountryFileData: [[1],[2]],
      countryTableData: ['some initial state'],

      transactionDate: 'transactionDate',
      countryTransDate: 'countryTransDate',
      packageNameFromCsv: 'packageNameFromCsv',
      totalUserInstalls: -1,
      activeDeviceInstalls: -1,

      osVersionTransDate: 'osVersionTransDate',
      titleFromScraperApp: "no package chosen yet 2",
      csvOsVersionFileData: [[1],[2]],
      osVersionTableData: ['some initial state'],

      reviewsFromScraperApp: 'nada',
      scoreNameFromScraperApp: 'nada',
      versionFromScraperApp: 'nada',
    };
  }
  getGooglePlayAppResults = (packageName) => {
    console.log('entering getGooglePlayAppResults');
    const appPackageName = packageName;
    // eg 'org.scriptureearth.adj.nt.apk'
    gplay.app({appId: appPackageName})
        .then((value) => {
          this.setState({ titleFromScraperApp: value.title });
          this.setState({ reviewsFromScraperApp: value.reviews });
          this.setState({ scoreNameFromScraperApp: value.score });
          this.setState({ versionFromScraperApp: value.version });
          console.log(value.title);
        });
    console.log('leaving getGooglePlayAppResults');
  } //================= getGooglePlayAppResults

  parseDataWithPapaParse = (url, callBack) => {
      Papa.parse(url, {
          download: true,
          dynamicTyping: true,
          complete: function(results) {
              callBack(results.data);
          }
      });
  }

  readOverviewCsvFilePP = () => {
    console.log('entering readOverviewCsvFilePP');
    const filename = this.state.csvOverviewFile;
    console.log(filename);
    this.parseDataWithPapaParse(filename, this.doStuffOverview);

    console.log('leaving readOverviewCsvFilePP');
  }
  doStuffOverview = (data) => {
      //Data is usable here
      console.log(data);
      this.setState({ csvOverviewFileData: data });
      console.log( data.length);
      console.log('Column Headings in file: ');
      console.log(data[0]);
      const lastEntry = data[data.length - 2 ];
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
  readCountryCsvFilePP = () => {
    console.log('entering readCountryCsvFilePP');
    const filename = this.state.csvCountryFile;
    this.parseDataWithPapaParse(filename, this.doStuffCountry);

    console.log('leaving readCountryCsvFilePP');
  }
  doStuffCountry = (data) => {
      //Data is usable here
      console.log(data);
      this.setState({ csvCountryFileData: data });
      console.log('Column Headings in file: ');
      console.log(data[0]);
      const lastEntry = data[data.length - 2 ];
      console.log('First entry in file: ');
      this.setState({ oneDataItem: lastEntry });
      console.log(lastEntry);
      console.log('Date: ' + lastEntry[0]);
      this.setState({ countryTransDate: lastEntry[0] });
      console.log('Package Name: ' + lastEntry[1]);
      this.getGooglePlayAppResults(lastEntry[1]);
      console.log('Country: ' + lastEntry[2]);
      let lastTransactionDate = lastEntry[0];
      let i = data.length - 2;
      var tableData = [];
      var tableRow = {};
      console.log(data[i][0]);
      while (data[i][0] === lastTransactionDate) {
        let row = data[i];
        //console.log('Code: ' + row[2] + ', TotalInstalls: ' + row[6] + ', ActiveDevices: ' + row[9] +", Country => " + countriesIso.getName(row[2], "en") );
        if (row[2] == "") {
          tableRow = { "code": "??", "installs": row[6], "active": row[9], "country": "unknown"};
        } else {
          tableRow = { "code": row[2], "installs": row[6], "active": row[9], "country": countriesIso.getName(row[2], "en")};
        }
        console.log (tableRow);
        tableData.push(tableRow);
        //console.log(tableData);
        i--;
      }
      this.setState({ countryTableData: tableData});
  }

  readOsVersionCsvFilePP = () => {
    console.log('entering readOsVersionCsvFilePP');
    const filename = this.state.csvOsVersionFile;
    this.parseDataWithPapaParse(filename, this.doStuffOsVersion);

    console.log('leaving readOsVersionCsvFilePP');
  }
  doStuffOsVersion = (data) => {
      //Data is usable here
      console.log(data);
      this.setState({ csvOsVersionFileData: data });
      console.log('Column Headings in file: ');
      console.log(data[0]);
      const lastEntry = data[data.length - 2 ];
      console.log('First entry in os_version file: ');
      console.log(lastEntry);
      console.log('Date: ' + lastEntry[0]);
      this.setState({ osVersionTransDate: lastEntry[0] });
      console.log('Package Name: ' + lastEntry[1]);
      this.getGooglePlayAppResults(lastEntry[1]);
      console.log('AndroidOSversion: ' + lastEntry[2]);
      console.log('Android Total User Installs: ' + lastEntry[6]);
      console.log('Android Active Device Installs: ' + lastEntry[9]);

      let lastTransactionDate = lastEntry[0];
      let i = data.length - 2;
      var tableData = [];
      var tableRow = {};
      while (data[i][0] === lastTransactionDate) {
        let row = data[i];
        if (row[2] == "") {
          tableRow = { "osVersion": "unknown", "installs": row[6], "active": row[9]};
        } else {
          tableRow = { "osVersion": row[2], "installs": row[6], "active": row[9]};
        }
        console.log (tableRow);
        tableData.push(tableRow);
        //console.log(tableData);
        i--;
      }
      console.log(tableData);
      this.setState({ osVersionTableData: tableData});
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
  selectCsvOsVersionFile = () => {
    console.log('called selectCsvOsVersionFile');
    const fileNames = dialog.showOpenDialog({ title:"Select an os_version.csv file", filters:[{name: '...os_version.csv', extensions: ['csv']}] });
    //var path = dialog.showOpenDialog( { title:"Select a folder", properties: ["openDirectory"] } );
    if (fileNames === undefined) {
      console.log('inside selectCsvOsVersionFile No file selected');
      this.setState({ csvOsVersionFile: '' });
    } else {
      // console.log('going to set the filename and boolean' + fileNames);
      this.setState({ csvOsVersionFile: fileNames[0] });
    }
    console.log('end of selectCsvOsVersionFile');
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
    let packageNameFromCsv = 'packageNameFromCsv';
    let titleFromCountryPackageName = 'noTitleSetYet';
    let reviewsFromScraperApp = 'noReviewsFetchedYet';
    let scoreNameFromScraperApp = 'nReviewScoresFetchedYet';
    let versionFromScraperApp = 'noVersionFetchedYet';
    let reviewsFromScraperAppOS = 'noReviewsFetchedYet';
    let scoreNameFromScraperAppOS = 'nReviewScoresFetchedYet';
    let versionFromScraperAppOS = 'noVersionFetchedYet';
    let totalUserInstalls = -1;
    let activeDeviceInstalls = -1;
    let countryStats = [
    {
      code: "br",
      installs:32,
      active: 29,
      country: 'tempDataBrazil'
    }];

    let osVersionTransDate = 'osVersionTransDate';
    let titleFromOSVersionPackageName = 'noTitleSetYet';
    let osVersionStats = [
    {
      osVersion: "Android R2D2",
      installs:16,
      active: 11
    }];

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
      countryStats = this.state.countryTableData;
      titleFromCountryPackageName = this.state.titleFromScraperApp;
      reviewsFromScraperApp = this.state.reviewsFromScraperApp;
      scoreNameFromScraperApp = this.state.scoreNameFromScraperApp;
      versionFromScraperApp = this.state.versionFromScraperApp;
    }
    if (this.state.csvOsVersionFile === 'no os_versiion.csv file selected yet') {
      // possibly do something
    } else {
      osVersionTransDate = this.state.osVersionTransDate;
      osVersionStats = this.state.osVersionTableData;
      titleFromOSVersionPackageName = this.state.titleFromScraperApp;
      reviewsFromScraperAppOS = this.state.reviewsFromScraperApp;
      scoreNameFromScraperAppOS = this.state.scoreNameFromScraperApp;
      versionFromScraperAppOS = this.state.versionFromScraperApp;
    }


    return (
    <div className="container">
        {/* ===================================================================================================================== */}
        {/* ===================================================================================================================== */}
        {/* ===================================================================================================================== */}
        {/* ===================================================================================================================== */}
        <div className="container">
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
                            onClick={this.readOverviewCsvFilePP}
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
                  {/* ===================================================================================================================== */}
                </div> {/* form-group */}
              </form>
            </div>
          </div>
        </div>
        {/* ===================================================================================================================== */}
        <div className="container">
        <div className="panel panel-primary">
          {/* ===================================================================================================================== */}
          <div className="panel panel-info">
            <div className="panel-heading">Display Results from Countries file...</div>
            <div className="panel-body">
              <div className="btn-toolbar" role="group" aria-label="Basic example">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.selectCsvCountryFile}
                  >Select ...country.csv File</button>&nbsp;
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.readCountryCsvFilePP}
                  >Process country.csv File Papa</button>&nbsp;
              </div><br/>
              <div className="form-text" id="csvOverviewFileId" >{this.state.csvCountryFile}</div>
                <div className="form-group">
                  <label className="col-xs-6 col-md-4 col-sm-4 control-label" htmlFor="countryTransDate">Date</label>
                  <div className="form-text" id="countryTransDate" placeholder="countryTransDate" >{countryTransDate}</div>
                  <br></br>
                  <label className="col-xs-6 col-md-4 col-sm-4 control-label" htmlFor="titleFromCountryPackageName">App Title</label>
                  <div className="form-text" id="titleFromCountryPackageName" placeholder="titleFromCountryPackageName" >{titleFromCountryPackageName}</div>
                  <br></br>
                  <label className="col-xs-6 col-md-4 col-sm-4 control-label" htmlFor="reviewsFromScraperApp">Number of reviews:</label>
                  <div className="form-text" id="reviewsFromScraperApp" placeholder="reviewsFromScraperApp" >{reviewsFromScraperApp}</div>
                  <br></br>
                  <label className="ccol-xs-6 col-md-4 col-sm-4 control-label" htmlFor="scoreNameFromScraperApp">Average score:</label>
                  <div className="form-text" id="scoreNameFromScraperApp" placeholder="scoreNameFromScraperApp" >{scoreNameFromScraperApp}</div>
                  <br></br>
                  <label className="col-xs-6 col-md-4 col-sm-4 control-label" htmlFor="versionFromScraperApp">Version: </label>
                  <div className="form-text" id="versionFromScraperApp" placeholder="versionFromScraperApp" >{versionFromScraperApp}</div>
                  <br></br>
                </div> {/* form-group */}
              </div>
            </div> {/* panel-info */}
            {/* ===================================================================================================================== */}
            <BootstrapTable data={countryStats} headerStyle={ { borderRadius: 0, border: 0, padding : 0, backgroundColor: '#eeeeee'  } } search searchPlaceholder='type items to search for...' multiColumnSearch>
                <TableHeaderColumn isKey dataField='code' width='20%'>Country Code</TableHeaderColumn>
                <TableHeaderColumn dataField='installs' width='20%'>Total Installs</TableHeaderColumn>
                <TableHeaderColumn dataField='active' width='20%'>Active Devices</TableHeaderColumn>
                <TableHeaderColumn dataField='country'width='40%'>Country</TableHeaderColumn>
            </BootstrapTable>
          </div>

        </div>

        <hr></hr>
        <div className="container">
        <div className="panel panel-primary">
          {/* ===================================================================================================================== */}
          <div className="panel panel-info">
            <div className="panel-heading">Display Results from OS Version file...</div>
            <div className="panel-body">
              <div className="btn-toolbar" role="group" aria-label="Basic example">
                <div className="pull-left">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.selectCsvOsVersionFile}
                  >Select ...os_version.csv File</button>&nbsp;
                </div>
                <div className="col-sm-offset-3">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.readOsVersionCsvFilePP}
                  >Process os_version.csv File Papa</button>&nbsp;
                </div>
              </div>
              <br/>
              <div className="form-text" id="csvOsVersionFileId" >{this.state.csvOsVersionFile}</div>
            </div>
            <label className="col-xs-6 col-md-4 col-sm-4 control-label" htmlFor="osVersionTransDate">Date</label>
            <div className="form-text" id="osVersionTransDate" placeholder="osVersionTransDate" >{osVersionTransDate}</div>
            <br></br>
            <label className="col-xs-6 col-md-4 col-sm-4 control-label" htmlFor="titleFromOSVersionPackageName">App Title</label>
            <div className="form-text" id="titleFromOSVersionPackageName" placeholder="titleFromOSVersionPackageName" >{titleFromOSVersionPackageName}</div>
            <br></br>
            <label className="col-xs-6 col-md-4 col-sm-4 control-label" htmlFor="reviewsFromScraperAppOS">Number of reviews:</label>
            <div className="form-text" id="reviewsFromScraperAppOS" placeholder="reviewsFromScraperAppOS" >{reviewsFromScraperAppOS}</div>
            <br></br>
            <label className="ccol-xs-6 col-md-4 col-sm-4 control-label" htmlFor="scoreNameFromScraperAppOS">Average score:</label>
            <div className="form-text" id="scoreNameFromScraperAppOS" placeholder="scoreNameFromScraperAppOS" >{scoreNameFromScraperAppOS}</div>
            <br></br>
            <label className="col-xs-6 col-md-4 col-sm-4 control-label" htmlFor="versionFromScraperAppOS">Version: </label>
            <div className="form-text" id="versionFromScraperAppOS" placeholder="versionFromScraperAppOS" >{versionFromScraperAppOS}</div>
            <br></br>
          </div> {/* panel-info */}

          <BootstrapTable data={osVersionStats} headerStyle={ { borderRadius: 0, border: 0, padding : 0, backgroundColor: '#eeeeee' } } >
              <TableHeaderColumn isKey dataField='osVersion' width='33%'>OS Version</TableHeaderColumn>
              <TableHeaderColumn dataField='installs' width='33%'>Total Installs</TableHeaderColumn>
              <TableHeaderColumn dataField='active' width='33%'>Active Devices</TableHeaderColumn>
          </BootstrapTable>
        </div>

        </div>

    </div>
    );
  }
}

export default ImportCsvFileWithPapaParse;
