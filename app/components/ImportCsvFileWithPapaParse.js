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


class ImportCsvFileWithPapaParse extends Component {
  state: {
    csvFile: string,
    oneDataItem : array,
    csvFileData : array,

    transactionDate: string,
    packageNameFromCsv: string,
    totalUserInstalls: number,
    activeDeviceInstalls: number
  }
  constructor() {
    super();
    this.readCsvFilePapaParse = this.readCsvFilePapaParse.bind(this);
    this.state = {
      csvFile: "no CSV file selected yet",
      oneDataItem: ["2017-10-09","org.mixtecosilacayoapan.mks",3,4,5,6,7,8],
      csvFileData: [[1],[2]],

      transactionDate: 'transactionDate',
      packageNameFromCsv: 'packageNameFromCsv',
      totalUserInstalls: -1,
      activeDeviceInstalls: -1
    };
  }
  readCsvFilePapaParse = () => {
    console.log('entering readCsvFilePapaParse');
    const filename = this.state.csvFile;
    this.parseDataC1(filename, this.doStuffC1);

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
  doStuffC1 = (data) => {
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

  render() {
    /*
    if (this.state.jobFilepathSelected && this.state.metaDataFolderSelected) {
      $('#sendButton').removeAttr('disabled');
    } else {
      $('#sendButton').attr('disabled', 'true');
    }
    */
    let transactionDate = 'transactionDate';
    let packageNameFromCsv = 'packageNameFromCsv';
    let totalUserInstalls = -1;
    let activeDeviceInstalls = -1;

    if (this.state.csvFile === 'no CSV file selected yet') {
      // possibly do something
    } else {
      transactionDate = this.state.transactionDate;
      packageNameFromCsv = this.state.packageNameFromCsv;
      totalUserInstalls = this.state.totalUserInstalls;
      activeDeviceInstalls = this.state.activeDeviceInstalls;
    }

    return (
      <div className="panel panel-primary">
        <div className="panel-heading apt-addheading">Select Downloaded Stats (csv) File and Display Install Stats</div>
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
              <br></br>
              <div className="col-sm-offset-3 col-sm-9">
                <div className="pull-right">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.readCsvFilePapaParse}
                  >Process CSV File Papa</button>&nbsp;
                </div>
              </div> {/* className="col-sm-offset-3 col-sm-9" */}
            </div> {/* form-group */}

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
          </form>
        </div>
      </div>
    );
  }
}

export default ImportCsvFileWithPapaParse;
