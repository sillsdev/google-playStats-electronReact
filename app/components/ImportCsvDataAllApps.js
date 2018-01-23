// @flow
import React, { Component } from 'react';
import electron from 'electron';
import jquery from 'jquery';
import Papa from 'papaparse';

const app = electron.remote;
const dialog = app.dialog;
const countriesIso = require("i18n-iso-countries");
var gplay = require('google-play-scraper');

var path = require('path');
var fs = require('fs');

class ImportCsvDataAllApps extends Component {
  state: {
    overviewDataAllApps: array,
    countryDataAllApps: array,
    osversionDataAllApps: array,

    appsFolderSelected: boolean,
    appsFolder: string,

    listOfAppTitles : array,
    titleFromScraperApp: string,
    totalNumberOfWBTApps: string,
    numberOfAppTitlesProcessed: string

  }
  constructor() {
    super();
    this.onSelectAppsFolder = this.onSelectAppsFolder.bind(this);
    this.onProcessAllCountryFilesInFolder = this.onProcessAllCountryFilesInFolder.bind(this);
    this.onProcessAllOverviewFilesInFolder = this.onProcessAllOverviewFilesInFolder.bind(this);
    this.onProcessAllOSversionFilesInFolder = this.onProcessAllOSversionFilesInFolder.bind(this);
    this.state = {
      overviewDataAllApps: [],
      countryDataAllApps: [],
      osversionDataAllApps: [],

      appsFolderSelected: false,
      appsFolder: 'appsFolder',

      listOfAppTitles: [],
      titleFromScraperApp: '',
      totalNumberOfWBTApps: 'no count yet',
      numberOfAppTitlesProcessed: 'none yet'
    };
  }
  onSelectAppsFolder= () =>  {
  console.log('called onSelectAppsFolder');
  var path = dialog.showOpenDialog(
    { title:"Select a folder", properties: ["openDirectory"] }
  );
  if(path === undefined){
      console.log("No destination folder selected");
      this.setState({ appsFolderSelected: false });
      this.setState({  appsFolder: '' });
  }else{
        //console.log('going to set the path and boolean' + path);
        this.setState({ appsFolderSelected: true });
        this.setState({  appsFolder: path[0] });
        console.log(path[0]);
    }
    console.log('end of onSelectAppsFolder');
  }

  onProcessAllCountryFilesInFolder = () =>  {
    console.log('called onProcessAllCountryFilesInFolder');
    this.setState({ countryDataAllApps: [] });
    let directoryPath = this.state.appsFolder;
    fs.readdir(directoryPath, this.saveAppDataFromEachCountriesFile);
    console.log('end of onProcessAllCountryFilesInFolder');
  }

  onProcessAllOverviewFilesInFolder = () =>  {
    console.log('called onProcessAllOverviewFilesInFolder');
    this.setState({ overviewDataAllApps: [] });
    let directoryPath = this.state.appsFolder;
    fs.readdir(directoryPath, this.saveAppDataFromEachOverviewFile);
    console.log('end of onProcessAllOverviewFilesInFolder');
  }

  onProcessAllOSversionFilesInFolder = () =>  {
    console.log('called onProcessAllOSversionFilesInFolder');
    this.setState({ osversionDataAllApps: [] });
    let directoryPath = this.state.appsFolder;
    fs.readdir(directoryPath, this.saveAppDataFromEachOSversionFile);
    console.log('end of onProcessAllOSversionFilesInFolder');
  }

  parseDataWithPapaParse = (url, callBack) => {
      Papa.parse(url, {
          download: true,
          dynamicTyping: true,
          complete: function(results) {
              callBack(results.data);
          }
      });
  }

  saveAppDataFromEachCountriesFile = (err, files) =>  {
    console.log('called saveAppDataFromEachCountriesFile');
      //handling error
      if (err) {
          return console.log('Unable to scan directory: ' + err);
      }
      Promise.all(
          Array.from(files).map(entry => this.getAppDataFromCountriesFile(entry))
      ).then(() => {
          // All done
          console.log('all done now');
      });
    console.log('end of saveAppDataFromEachCountriesFile');
  }
  getAppDataFromCountriesFile = (fileName) => {
    console.log('entering getAppDataFromCountriesFile');
    // Do whatever you want to do with the file
    let fileNamePath = path.join(this.state.appsFolder, fileName);
    //console.log('fileNamePath--> ' + fileNamePath);
    this.parseDataWithPapaParse(fileNamePath, this.doStuffCountriesFile);
    console.log('leaving getAppDataFromCountriesFile');
  }
  doStuffCountriesFile = (data) => {
      //Data is usable here
      //console.log(data);
      const lastEntry = data[data.length - 2 ];
      let packageName = lastEntry[1];
      console.log('PackageName: ' + packageName);
      let lastTransactionDate = lastEntry[0];
      let i = data.length - 2;
      var appData = [];
      var countryRow = {};
      while (data[i][0] === lastTransactionDate) {
        let row = data[i];
        //console.log('Code: ' + row[2] + ', TotalInstalls: ' + row[6] + ', ActiveDevices: ' + row[9] +", Country => " + countriesIso.getName(row[2], "en") );
        if (row[2] == "") {
          countryRow = { "code": "??", "installs": row[6], "active": row[9], "country": "unknown"};
        } else {
          countryRow = { "code": row[2], "installs": row[6], "active": row[9], "country": countriesIso.getName(row[2], "en")};
        }
        //console.log (countryRow);
        appData.push(countryRow);
        //console.log(tableData);
        i--;
      }
      let countryEntry = { "packageName": packageName, "countryData": appData};
      let countryAllData = this.state.countryDataAllApps;
      countryAllData.push(countryEntry);
      this.setState({ countryDataAllApps: countryAllData});
  }

  saveAppDataFromEachOverviewFile = (err, files) =>  {
    console.log('called saveAppDataFromEachOverviewFile');
      //handling error
      if (err) {
          return console.log('Unable to scan directory: ' + err);
      }
      this.setState({ totalNumberOfWBTApps: files.length});
      Promise.all(
          Array.from(files).map(entry => this.getAppDataFromOverviewFile(entry))
      ).then(() => {
          // All done
          console.log('all done now');
      });
    console.log('end of saveAppDataFromEachOverviewFile');
  }
  getAppDataFromOverviewFile = (fileName) => {
    console.log('entering getAppDataFromOverviewFile');
    // Do whatever you want to do with the file
    let fileNamePath = path.join(this.state.appsFolder, fileName);
    //console.log('fileNamePath--> ' + fileNamePath);
    this.parseDataWithPapaParse(fileNamePath, this.doStuffOverviewFile);
    console.log('leaving getAppDataFromOverviewFile');
  }
  doStuffOverviewFile = (data) => {
      //Data is usable here
      //console.log(data);
      //console.log( data.length);
      const lastEntry = data[data.length-2];
      let tmpListOfApps = this.state.overviewDataAllApps;
      tmpListOfApps.push(lastEntry);
      this.setState({ overviewDataAllApps: tmpListOfApps });
  }

  saveAppDataFromEachOSversionFile = (err, files) =>  {
    console.log('called saveAppDataFromEachOSversionFile');
      //handling error
      if (err) {
          return console.log('Unable to scan directory: ' + err);
      }
      Promise.all(
          Array.from(files).map(entry => this.getAppDataFromOSVersionFile(entry))
      ).then(() => {
          // All done
          console.log('all done now');
      });
    console.log('end of saveAppDataFromEachOSversionFile');
  }
  getAppDataFromOSVersionFile = (fileName) => {
    console.log('entering getAppDataFromOSVersionFile');
    // Do whatever you want to do with the file
    let fileNamePath = path.join(this.state.appsFolder, fileName);
    //console.log('fileNamePath--> ' + fileNamePath);
    this.parseDataWithPapaParse(fileNamePath, this.doStuffOsVersionFile);
    console.log('leaving getAppDataFromOSVersionFile');
  }
  doStuffOsVersionFile = (data) => {
      //Data is usable here
      console.log(data);
      this.setState({ csvOsVersionFileData: data });
      const lastEntry = data[data.length - 2 ];
      let packageName = lastEntry[1];
      console.log('PackageName: ' + packageName);
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
      let osVersionEntry = { "packageName": packageName, "osVersionData": tableData};
      let osVersionAllData = this.state.osversionDataAllApps;
      osVersionAllData.push(osVersionEntry);
      this.setState({ osversionDataAllApps: osVersionAllData});
  }

  savePackageTitlesToArray = () => {
    // All done
    console.log('enter of savePackageTitlesToArray');
    this.setState({ listOfAppTitles: [] });
    //console.log(this.state.listOfApps)
    let tmpListOfApps = [];
    tmpListOfApps = this.state.overviewDataAllApps;
    //console.log('tmpListOfApps --->'  + tmpListOfApps);
    //console.log('tmpListOfApps.lengt --->'  + tmpListOfApps.length);
    let i=0;
    for (i=0; i < tmpListOfApps.length; i++)
    {
      //console.log('packageName --->'  + packageName);
      this.getGooglePlayGetAppTitle(tmpListOfApps[i]);
    }
    console.log('end of savePackageTitlesToArray');
  }

  getGooglePlayGetAppTitle = (packageInfo) => {
    console.log('entering getGooglePlayAppResults');
    let appPackageName = packageInfo[1];
    //let totalUserInstalls =  packageInfo[5];
    //let activeDeviceInstalls = packageInfo[8];
    // eg 'org.scriptureearth.adj.nt.apk'
    gplay.app({appId: appPackageName, throttle: 10})
        .then((value) => {
          let appTitles = this.state.listOfAppTitles;
          let appInfo = { "packageName": appPackageName, "title": value.title};
          appTitles.push(appInfo);
          console.log('App Title gplay--> ' + value.title);
          this.setState({ titleFromScraperApp: value.title });
          this.setState({ listOfAppTitles: appTitles });
          this.setState({numberOfAppTitlesProcessed : appTitles.length});
        }).catch( (fromReject) => {
          console.log('A REJECT promise occured while running google-play-scraper for ')
          console.log('this package because it is UNPUBLISHED but has some installs -->');
          console.log(appPackageName)
          console.log('error message is --> ' + fromReject);
          this.setState({ titleFromScraperApp: 'Current App Unplublished' });
          let appTitles = this.state.listOfAppTitles;
          let appInfo = { "packageName": appPackageName,  "title": 'UNPUBLISHED'};
          appTitles.push(appInfo);
          this.setState({ titleFromScraperApp: 'UNPUBLISHED' });
          this.setState({ listOfAppTitles: appTitles });
          this.setState({numberOfAppTitlesProcessed : appTitles.length});
        });
    console.log('leaving getGooglePlayAppResults');
  } //================= getGooglePlayAppResults

  onCombineDataAndSave = () => {
    console.log('entering onCombineDataAndSave');
    let countryDataArray = this.state.countryDataAllApps;
    let osversionDataArray = this.state.osversionDataAllApps;
    let overviewData = this.state.overviewDataAllApps;
    let appTitles = this.state.listOfAppTitles;

    let combinedData = {};
    let combinedDataOneApp = {};
    let packageName = '';
    let appTitle = '';
    let totalUserInstalls =  '';
    let activeDeviceInstalls = '';
    let osVersionData = '';
    let countriesData = '';

    let i = 0;
    for (i=0; i < 3; i++) {
      packageName = appTitles[i].packageName;
      appTitle = appTitles[i].title;
      totalUserInstalls = overviewData[i][5];
      activeDeviceInstalls = overviewData[i][8];
      osVersionData = osversionDataArray[i].osVersionData;
      countriesData = countryDataArray[i].countryData
      combinedDataOneApp = { packageName: packageName,
        appTitle: appTitle,
        totalUserInstalls: totalUserInstalls,
        activeDeviceInstalls: activeDeviceInstalls,
        osversionData: osVersionData,
        countriesData: countriesData };
      console.log(combinedDataOneApp);
    }

    console.log('leaving onCombineDataAndSave');
  }


  render() {
    let numberOfAppTitlesProcessed = this.state.numberOfAppTitlesProcessed;
    let totalNumberOfApps = this.state.totalNumberOfWBTApps;
    let currentAppTitle = 'currentAppTitle';
    if (this.state.titleFromScraperApp != '')
    currentAppTitle = this.state.titleFromScraperApp;
    let jsonDataFile = 'jsonDataFile';
    return (
      <div className="container">
        {/* ===================================================================================================================== */}
        <div className="container">
          <div className="panel panel-primary">
          {/* ===================================================================================================================== */}
          <div className="panel panel-info">
            <div className="panel-heading">Process data from all overview.csv files</div>
              <div className="panel-body">
                <div className="btn-toolbar" role="group" aria-label="Basic example">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.onSelectAppsFolder}
                  >1) Select overview Folder for Apps</button>&nbsp;
                  <button
                        type="button"
                        className="btn btn-primary"
                        onClick={this.onProcessAllOverviewFilesInFolder}
                      >2) Extract ...overview.csv files data
                  </button>&nbsp;
                  <button
                        type="button"
                        className="btn btn-primary"
                        onClick={this.savePackageTitlesToArray}
                      >3) Run Scraper for App Titles
                  </button>&nbsp;
                </div>
                <br/>
                <div className="form-group">
                  <label className="col-sm-4 control-label" htmlFor="currentAppTitle">Current App Title</label>
                  <div className="form-text" id="currentAppTitle" placeholder="currentAppTitle" >{currentAppTitle}</div>
                  <br/>
                  <label className="col-sm-4 control-label" htmlFor="totalNumberOfApps">Total Number of Apps to Process</label>
                  <div className="form-text" id="totalNumberOfApps" placeholder="totalNumberOfApps" >{totalNumberOfApps}</div>
                  <br/>
                  <label className="col-sm-4 control-label" htmlFor="numberOfAppTitlesProcessed">Number of App Titles Processed</label>
                  <div className="form-text" id="numberOfAppTitlesProcessed" placeholder="numberOfAppTitlesProcessed" >{numberOfAppTitlesProcessed}</div>
                </div> {/* form-group */}
              </div>
            </div> {/* panel-info */}
            {/* ===================================================================================================================== */}
          </div>
        </div>
        <div className="container">
          <div className="panel panel-primary">
          {/* ===================================================================================================================== */}
          <div className="panel panel-info">
            <div className="panel-heading">Process data from all countries.csv files</div>
              <div className="panel-body">
                <div className="btn-toolbar" role="group" aria-label="Basic example">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.onSelectAppsFolder}
                  >1) Select countries Folder for Apps</button>&nbsp;
                  <button
                        type="button"
                        className="btn btn-primary"
                        onClick={this.onProcessAllCountryFilesInFolder}
                      >2) Extract ...countries.csv files data
                  </button>&nbsp;
                </div>
              </div>
            </div> {/* panel-info */}
            {/* ===================================================================================================================== */}
          </div>
        </div>
        {/* ===================================================================================================================== */}
        <div className="container">
          <div className="panel panel-primary">
          {/* ===================================================================================================================== */}
          <div className="panel panel-info">
            <div className="panel-heading">Process data from all osversion.csv files</div>
              <div className="panel-body">
                <div className="btn-toolbar" role="group" aria-label="Basic example">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.onSelectAppsFolder}
                  >1) Select OSversion Folder for Apps</button>&nbsp;
                  <button
                        type="button"
                        className="btn btn-primary"
                        onClick={this.onProcessAllOSversionFilesInFolder}
                      >2) Extract ...OSversion.csv files data
                  </button>&nbsp;
                </div>
              </div>
            </div> {/* panel-info */}
            {/* ===================================================================================================================== */}
          </div>
        </div>
        {/* ===================================================================================================================== */}
        <div className="container">
          <div className="panel panel-primary">
          {/* ===================================================================================================================== */}
          <div className="panel panel-info">
            <div className="panel-heading">Combine Data for All Apps and Save as Json file</div>
              <div className="panel-body">
                <div className="btn-toolbar" role="group" aria-label="Basic example">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.onCombineDataAndSave}
                  >Combine Data And Save</button>&nbsp;
                </div>
                <br/>
                <div className="form-group">
                  <label className="col-sm-2 control-label" htmlFor="jsonDataFile">Data Saved As: </label>
                  <div className="form-text" id="jsonDataFile" placeholder="jsonDataFile" >{jsonDataFile}</div>
                </div> {/* form-group */}
              </div>
            </div> {/* panel-info */}
            {/* ===================================================================================================================== */}
          </div>
        </div>
        {/* ===================================================================================================================== */}

      </div>
    );
  }
}


export default ImportCsvDataAllApps;
