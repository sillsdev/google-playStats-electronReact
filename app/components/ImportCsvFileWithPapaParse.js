// @flow
import React, { Component } from 'react';
import electron from 'electron';
import jquery from 'jquery';
// import PropTypes from 'prop-types';
//  import { Link } from 'react-router-dom';
//  import styles from './LoginForm.css';

const app = electron.remote;
const dialog = app.dialog;
const fs = require('fs');
const fsOutput = require('fs');

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
    btDonorFile: string,
    wbtGiftsFile: string
  }
  constructor() {
    super();
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
      wbtDonorFile: "nada",
      wbtGiftsFile: "nada dada baba"
    };
  }
  readCsvFile = () => {
    console.log('entering readCsvFile');
    const filename = this.state.csvFile;
    console.log('filename is');
    console.log(filename);
    const subfileName = filename.replace(/^.*[\\\/]/, '').substring(16, 34);
    console.log('subfileName is');
    console.log(subfileName);
    const donorfile = `${subfileName}DonorList.csv`;
    console.log('donorfile is');
    console.log(donorfile);
    const giftfile = `${subfileName}Gifts.csv`;
    console.log('giftfile is');
    console.log(giftfile);
    console.log('filename is==> ' + filename);
    fs.readFile(filename, (err, html) => {
      let jqueryHtml;
      if (err) {
        // handle error
        console.log('inside readCsvFile fs.readFile has an error');
      } else {
        console.log('entering else of fs.readFile   readCsvFile');
        // console.log(html);
        jqueryHtml = jquery(html.toString());
        console.log('jqueryHtml.className===>');
        console.log(jqueryHtml.className);
        console.log('jqueryHtml is set to ===> \n');
        console.log(jqueryHtml);
        //----------------------------------------------------------------------------
        //------------Open Donor File  and Write to it-------------------------------------
        //----------------------------------------------------------------------------
        const donorFileName = `./app/components/output/${donorfile}`;
        this.setState({ wbtDonorFile: donorFileName });
        const outputFileDonors = fs.createWriteStream(donorFileName, {flags: 'a'});
        outputFileDonors.write('\n');
        outputFileDonors.write('[ORGANIZATION]\n');
        outputFileDonors.write('Name=Wycliffe Canada\n');
        outputFileDonors.write('\n');
        outputFileDonors.write('Abbreviation=WBTC\n');
        //----------------------------------------------------------------------------
        //------------Open Gifts File  and Write to it-------------------------------------
        //----------------------------------------------------------------------------
        const giftsFileName = `./app/components/output/${giftfile}`;
        this.setState({ wbtGiftsFile: giftsFileName });
        const outputFileGifts = fs.createWriteStream(giftsFileName, {flags: 'a'});
        outputFileGifts.write('[GIFTS]\n');
        outputFileGifts.write('"PEOPLE_ID","ACCT_NAME","DISPLAY_DATE","AMOUNT","DONATION_ID","DESIGNATION","MEMO","MOTIVATION","PAYMENT_METHOD"\n');
        let accountRecord = 'some account record information......';
        let giftFromSupporter = 'some text for a place holder';
        let donationId = '';

        let addressToOutput = 'some address to output';

        //giftFromSupporter = `"${tntUserIdLp}","${tntAcctName}","${displayDate}","${amountDtlp}","${donationId}","51361","","Unknown","${methodDtLp}"`;
        outputFileGifts.write(giftFromSupporter);
        outputFileGifts.write('\n');
        outputFileDonors.write(accountRecord);
        outputFileDonors.write(addressToOutput);
        outputFileDonors.write('\n');

        // ============================================================
        // ================================================================
        outputFileDonors.end(); // close string
        outputFileGifts.end(); // close file
        //----------------------------------------------------------------------------
        //----------------------------------------------------------------------------
        //----------------------------------------------------------------------------
        //----------------------------------------------------------------------------
      }
    });
    console.log('leaving readCsvFile');
  }
  selectCsvFile = () => {
    console.log('called selectCsvFile');
    const fileNames = dialog.showOpenDialog();
    if (fileNames === undefined) {
      console.log('inside selectCsvFile No file selected');
      this.setState({ wbtStatementFile: '' });
    } else {
      // console.log('going to set the filename and boolean' + fileNames);
      this.setState({ wbtStatementFile: fileNames[0] });
    }
    console.log('end of selectCsvFile');
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

    return (
      <div className="panel panel-primary">
        <div className="panel-heading apt-addheading">Select CSV Google Play Store Stats File</div>
        <div className="panel-body">
          <form className="form" onSubmit={this.localHandleSend}>
            <div className="form-group">
              <label htmlFor="wbtStatementFile">Show Scripture Apps Download Stats</label>
              <div className="form-text" id="wbtStatementFileId" >{this.state.wbtStatementFile}</div>
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
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="wbtDonorFile">output DonorFile</label>
              <div className="form-text" id="wbtDonorFileId" >{this.state.wbtDonorFile}</div>
              <label htmlFor="wbtGiftsFile">output GiftsFile</label>
              <div className="form-text" id="wbtGiftsFileId" >{this.state.wbtGiftsFile}</div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default ImportCsvFileWithPapaParse;
