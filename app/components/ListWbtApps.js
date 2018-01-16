// @flow
import React, { Component } from 'react';
import electron from 'electron';
import Papa from 'papaparse';

// with es6
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

var gplay = require('google-play-scraper');
//requiring path and fs modules
var path = require('path');
var fs = require('fs');
var cmd=require('node-cmd');

const app = electron.remote;
const dialog = app.dialog;

class ListWbtApps extends Component {
  props: {
  };
  state: {
    tableOfApps: array,
    tableOfApps2: array,
    appsFolderSelected: boolean,
    appsFolder: string,
    oneDataItem : array,
    listOfFiles : array,
    listOfPackageNames : array,
    listOfApps : array,
    listOfAppTitles : array,

    titleFromScraperApp: string
  }
  constructor() {
    super();
    this.addEntryToTable = this.addEntryToTable.bind(this);
    this.onSelectAppsFolder = this.onSelectAppsFolder.bind(this);
    this.onListFilesInFolder = this.onListFilesInFolder.bind(this);
    this.onProcessFilesInFolder = this.onProcessFilesInFolder.bind(this);
    this.onProcessListOfApps = this.onProcessListOfApps.bind(this);

    this.gsutilDownloadNewestWbtOverviewFiles = this.gsutilDownloadNewestWbtOverviewFiles.bind(this);
    this.readOverviewCsvFilePP = this.readOverviewCsvFilePP.bind(this);
    this.getGooglePlayAppResults = this.getGooglePlayAppResults.bind(this);
    this.savePackageNamesToArray = this.savePackageNamesToArray.bind(this);


    this.state = {
      tableOfApps: [],
      tableOfApps2: [],
      appsFolderSelected: false,
      appsFolder: 'appsFolder',
      oneDataItem: [],
      listOfFiles: [],
      listOfApps: [],
      listOfPackageNames: [],
      listOfAppTitles: [],
      titleFromScraperApp: "no package chosen yet 2"

    };
  }

  readOverviewCsvFilePP = () => {
    console.log('entering readOverviewCsvFilePP');
    const filename = this.state.csvOverviewFile;
    this.parseDataWithPapaParse(filename, this.doStuffOverview);

    console.log('leaving readOverviewCsvFilePP');
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

  onListFilesInFolder = () =>  {
    console.log('called onListFilesInFolder');
    let directoryPath = this.state.appsFolder;
    fs.readdir(directoryPath, function (err, files) {
      //handling error
      if (err) {
          return console.log('Unable to scan directory: ' + err);
      }
      //this.setState({ listOfFiles: files });
      //listing all files using forEach
      files.forEach(function (file) {
          // Do whatever you want to do with the file
          let fileNamePath = path.join(this.state.appsFolder, fileName);
          console.log(fileNamePath);
      });
    });
    console.log('end of onListFilesInFolder');
  }
  onProcessFilesInFolder = () =>  {
    console.log('called onProcessFilesInFolder');
    this.setState({ listOfApps: [] });
    let directoryPath = this.state.appsFolder;
    fs.readdir(directoryPath, this.saveListOfFiles);
    console.log('end of onProcessFilesInFolder');
  }

  saveListOfFiles = (err, files) =>  {
    console.log('called saveListOfFiles');
      //handling error
      if (err) {
          return console.log('Unable to scan directory: ' + err);
      }
      //save files in State
      //this.setState({ listOfFiles: files });
      //files.forEach(this.getAppDataFromFile);
      //console.log(files);

      /*
      let i = 0;
      for (i=0; i < files.length; i++)
      {
        this.getAppDataFromFile(files[i]);
      }
      */
      //files.forEach(this.getAppDataFromFile);
      Promise.all(
          Array.from(files).map(entry => this.getAppDataFromFile(entry))
      ).then(() => {
          // All done
          //this.savePackageNamesToArray();
          console.log('all done now');
      });
    console.log('end of saveListOfFiles');
  }


  getAppDataFromFile = (fileName) => {
    //console.log('entering getAppDataFromFile');
    // Do whatever you want to do with the file
    let fileNamePath = path.join(this.state.appsFolder, fileName);
    //console.log('fileNamePath--> ' + fileNamePath);
    this.parseDataWithPapaParse(fileNamePath, this.doStuffOverview);
    //console.log('leaving getAppDataFromFile');
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
  doStuffOverview = (data) => {
      //Data is usable here
      //console.log(data);
      //console.log( data.length);
      //console.log('Column Headings in file: ');
      //console.log(data[0]);
      const lastEntry = data[data.length-2];
      //console.log('Last entry in file: ');
      //this.setState({ oneDataItem: lastEntry });
      let tmpListOfApps = this.state.listOfApps;
      tmpListOfApps.push(lastEntry);
      this.setState({ listOfApps: tmpListOfApps });
      //console.log(lastEntry);
      //console.log('Date--> ' + lastEntry[0]);
      //console.log('PackageName--> ' + lastEntry[1]);
      //console.log('TotalUserInstalls--> ' + lastEntry[5]);
      //console.log('ActiveDevice Installs--> ' + lastEntry[8]);
      //this.getGooglePlayAppResults(lastEntry[1]);
  }

  onProcessListOfApps = () => {
    this.savePackageNamesToArray();
  }

  savePackageNamesToArray2 = () => {
    // All done
    console.log('enter of savePackageNamesToArray');
    let i = 0;
    //console.log(this.state.listOfApps)
    let tmpListOfPackages = [];
    let tmpListOfApps = [];
    tmpListOfApps = this.state.listOfApps;
    //console.log('tmpListOfApps --->'  + tmpListOfApps);
    //console.log('tmpListOfApps.lengt --->'  + tmpListOfApps.length);
    for (i=0; i < tmpListOfApps.length; i++)
    {
      let packageName = tmpListOfApps[i][1];
      //console.log('packageName --->'  + packageName);
      this.getGooglePlayAppResults2(tmpListOfApps[i]);
    }
    console.log('end of savePackageNamesToArray');
  }

  getGooglePlayAppResults2 = (packageInfo) => {
    console.log('entering getGooglePlayAppResults');
    let appPackageName = packageInfo[1];
    let totalUserInstalls =  packageInfo[5];
    let activeDeviceInstalls = firstEntry[8];
    // eg 'org.scriptureearth.adj.nt.apk'
    gplay.app({appId: appPackageName, throttle: 5})
        .then((value) => {
          this.setState({ titleFromScraperApp: value.title });

          let tableEntries = this.state.tableOfApps2;
          let tableEntry = { "packageName": appPackageName, "title": value.title, "score": value.score,
              "totalInstalls": totalUserInstalls, "activeInstalls": activeDeviceInstalls};
          tableEntries.push(tableEntry);
          this.setState({ tableOfApps2: tableEntries });

          let appTitles = this.state.listOfAppTitles;
          let appInfo = { "packageName": appPackageName, "title": value.title, "score": value.score};
          appTitles.push(appInfo);
          //console.log('App Title gplay--> ' + value.title);
          this.setState({ listOfAppTitles: appTitles });
        }).catch( (fromReject) => {
          console.log('this package returned a REJECT promise error -->' + appPackageName);
          console.log('error message is -->' + fromReject);
          this.setState({ titleFromScraperApp: 'Current App Unplublished' });
          let appTitles = this.state.listOfAppTitles;
          let appInfo = { "packageName": appPackageName,  "title": 'unpublished', "score": 0};
          appTitles.push(appInfo);
          this.setState({ listOfAppTitles: appTitles });
        });
    console.log('leaving getGooglePlayAppResults');
  } //================= getGooglePlayAppResults

  savePackageNamesToArray = () => {
    // All done
    console.log('enter of savePackageNamesToArray');
    let i = 0;
    //console.log(this.state.listOfApps)
    let tmplistOfPackageNames = [];
    let tmpListOfApps = [];
    tmpListOfApps = this.state.listOfApps;
    //console.log('tmpListOfApps --->'  + tmpListOfApps);
    //console.log('tmpListOfApps.lengt --->'  + tmpListOfApps.length);
    for (i=0; i < tmpListOfApps.length; i++)
    {
      let packageName = tmpListOfApps[i][1];
      //console.log('packageName --->'  + packageName);
      tmplistOfPackageNames.push(packageName);
    }
    this.setState({ listOfPackageNames: tmplistOfPackageNames });

    for (i=0; i < tmplistOfPackageNames.length; i++)
    {
      let packageName = tmplistOfPackageNames[i];
      //console.log('packageName --->'  + packageName);
      this.getGooglePlayAppResults(packageName);
    }
    console.log('end of savePackageNamesToArray');
  }

  getGooglePlayAppResults = (packageName) => {
    console.log('entering getGooglePlayAppResults');
    const appPackageName = packageName;
    // eg 'org.scriptureearth.adj.nt.apk'
    gplay.app({appId: appPackageName, throttle: 5})
        .then((value) => {
          this.setState({ titleFromScraperApp: value.title });
          //this.setState({ reviewsFromScraperApp: value.reviews });
          //this.setState({ scoreNameFromScraperApp: value.score });
          //this.setState({ versionFromScraperApp: value.version });
          let appTitles = this.state.listOfAppTitles;
          let appInfo = { "packageName": appPackageName, "title": value.title, "score": value.score};
          appTitles.push(appInfo);
          //console.log('App Title gplay--> ' + value.title);
          this.setState({ listOfAppTitles: appTitles });
        }).catch( (fromReject) => {
          console.log('this package returned a REJECT promise error -->' + appPackageName);
          console.log('error message is -->' + fromReject);
          this.setState({ titleFromScraperApp: 'Current App Unplublished' });
          let appTitles = this.state.listOfAppTitles;
          let appInfo = { "packageName": appPackageName,  "title": 'unpublished', "score": 0};
          appTitles.push(appInfo);
          this.setState({ listOfAppTitles: appTitles });
        });
    console.log('leaving getGooglePlayAppResults');
  } //================= getGooglePlayAppResults


  gsutilDownloadNewestWbtOverviewFiles = () => {
    console.log('entering gsutilDownloadNewestWbtOverviewFiles');
    let dt = new Date();
    let monthsNums = [
    '01', '02', '03', '04', '05',
    '06', '07', '08', '09',
    '10', '11', '12'
    ];
    let filesToDownload = 'gs://pubsite_prod_rev_05224823036325035822/stats/installs/*' + dt.getFullYear() + monthsNums[dt.getMonth()] +'_overview.csv ';
    console.log(filesToDownload);
    let command = 'gsutil cp -r ' + filesToDownload + 'app/components/gsutil-downloads-currentmonth';
    console.log(command);
    cmd.run(command);
    /*
    cmd.get(
        'ls app/components/gsutil-download-currentMonth',
        function(err, data, stderr){
            console.log('the dir app/components/gsutil-download-currentMonth contains these files :\n\n',data)
        }
    );
    */
    console.log('leaving gsutilDownloadNewestWbtOverviewFiles');
  }

  addEntryToTable = () => {
    console.log('entering addEntryToTable');
    let wbtAppsUpdated = [
      {
        title: "Ga'dang - Bible",
        packageName: 'org.wycliffe.gdg.nt.apk',
        link: 'http://play.google.com'
      },
      {
        title: "Garífuna (Caribe) - Bible",
        packageName: 'org.scriptureearth.cab.nt.apk',
        link: 'http://play.google.com'
      },
      {
        title: "Alamblak - Bible",
        packageName: 'org.scriptureearth.amp.nt.apk',
        link: 'http://play.google.com'
      }];

      this.setState({ tableOfApps: wbtAppsUpdated });

    //========================== search
    console.log('leaving addEntryToTable');
  }

  render() {
    //  const { emailAddy } = this.props;
    //  const { propInHome } = this.props;
    let wbtApps = [
      {
        title: "Ga'dang - Bible",
        packageName: 'org.wycliffe.gdg.nt.apk',
        link: 'http://play.google.com'
      },
      {
        title: "Garífuna (Caribe) - Bible",
        packageName: 'org.scriptureearth.cab.nt.apk',
        link: 'http://play.google.com'
      }];
      let dt = new Date();
      let months = [
      'January', 'February', 'March', 'April', 'May',
      'June', 'July', 'August', 'September',
      'October', 'November', 'December'
      ];
      let currentMonthYear = 'currentMonthYear';
      currentMonthYear =  months[dt.getMonth()]  + ' '+ dt.getFullYear();

      let currentAppTitle = 'currentAppTitle';
      if (this.state.titleFromScraperApp != '')
      currentAppTitle = this.state.titleFromScraperApp;

      if (this.state.tableOfApps.length != 0)
      {
        wbtApps = this.state.tableOfApps;
      }

    return (
      <div className="panel-group">
        <div className="panel panel-primary">
          <div className="panel-heading apt-addheading">Get Full List</div>
          <div className="panel panel-info">
            <div className="panel-heading">Download This Month's Overview Files for All WBT Apps</div>
            <div className="panel-body">
              <div className="form-group">
                <label className="col-sm-4 control-label" htmlFor="currentMonthYear">Current Month and Year</label>
                <div className="form-text" id="currentMonthYear" placeholder="currentMonthYear" >{currentMonthYear}</div>
              </div> {/* form-group */}
              <div className="form-group">
                <div className="col-sm-offset-1 col-sm-5">
                  <div className="pull-right">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={this.gsutilDownloadNewestWbtOverviewFiles}
                    >Download OverView Files</button>&nbsp;
                  </div>
                  <br></br>

                </div>  {/* className="col-sm-offset-3 col-sm-9" */}
              </div> {/* form-group */}
            </div>
          </div>

          <div className="panel panel-info">
            <div className="panel-heading">Display All Wycliffe Bible Translators Apps</div>
            <div className="panel-body">
              <div className="btn-toolbar" role="group" aria-label="Basic example">

                <div className="pull-left">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.onSelectAppsFolder}
                  >Select Folder for Apps</button>&nbsp;
                </div>
                <div className="col-sm-offset-4">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.onListFilesInFolder}
                  >console.log ==> files In Folder</button>&nbsp;
                </div>
              </div>
              <br/>
              <div className="btn-toolbar" role="group" aria-label="Basic example">
                <div className="">

                  <div className="pull-left">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={this.onProcessFilesInFolder}
                    >Extract overview.csv files data</button>&nbsp;
                  </div>
                  <div className="col-sm-offset-4">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={this.onProcessListOfApps}
                    >Get all App Titles</button>&nbsp;
                  </div>
                </div>
              </div>
              <br/>
              <div className="form-group">
                <label className="col-sm-4 control-label" htmlFor="currentAppTitle">Current App Title</label>
                <div className="form-text" id="currentAppTitle" placeholder="currentAppTitle" >{currentAppTitle}</div>
              </div> {/* form-group */}
            </div>
          </div>
          {/* ===================================================================================================================== */}
          <div className="panel panel-info">
            <div className="panel-heading">Table of Apps</div>
            <div className="panel-body">
              <div className="btn-toolbar" role="group" aria-label="Basic example">
                <div className="pull-left">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.addEntryToTable}
                  >Add Entry to Table</button>&nbsp;
                </div>
              </div>
              <BootstrapTable data={wbtApps} headerStyle={ { borderRadius: 0, border: 0, padding : 0, backgroundColor: '#eeeeee'  } } search searchPlaceholder='type items to search for...' multiColumnSearch>
                  <TableHeaderColumn isKey dataField='title' width='40%'>App Title</TableHeaderColumn>
                  <TableHeaderColumn dataField='packageName' width='30%'>Package Name</TableHeaderColumn>
                  <TableHeaderColumn dataField='link' width='30%'>Link To App</TableHeaderColumn>
              </BootstrapTable>
            </div>
          </div>

        </div>

      </div>

    );
  }
}

export default ListWbtApps;
