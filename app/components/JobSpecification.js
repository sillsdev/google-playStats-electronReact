// @flow
import React, { Component } from 'react';
import electron from 'electron';
import $ from 'jquery';
// import PropTypes from 'prop-types';
//  import { Link } from 'react-router-dom';
//  import styles from './LoginForm.css';

const app = electron.remote;
const dialog = app.dialog;

class JobSpecification extends Component {
  constructor() {
    super();
    this.state = {
      metaDataFolder: 'heyhey',
      metaDataFolderSelected: false,
      jobFilepath: 'jobFilepath',
      jobFilepathSelected: false,
    };
  }
  selectJobSpecsFile = () => {
    console.log('called selectJobSpecsFile');
    const fileNames = dialog.showOpenDialog();
    if (fileNames === undefined) {
      console.log('No file selected');
      this.setState({ jobFilepathSelected: false });
      this.setState({ jobFilepath: '' });
    } else {
      // console.log('going to set the filename and boolean' + fileNames);
      this.setState({ jobFilepathSelected: true });
      this.setState({ jobFilepath: fileNames[0] });
    }
    // NOTE put this back in when the first part is working
    // persistData('jobFilePersistKey', fileNames[0]);
    console.log('end of selectJobSpecsFile');
  }
  selectMetaDataFile = () => {
    console.log('called selectMetaDataFile');
    const path = dialog.showOpenDialog(
      { title: 'Select a folder', properties: ['openDirectory'] }
    );
    console.log('called showOpenDialog and returned');
    console.log('path is =====>' + path);
    if (path === undefined) {
      console.log('No destination folder selected');
      this.setState({ metaDataFolderSelected: false });
      this.setState({ metaDataFolder: '' });
    } else {
      console.log('path returned from dialog.showOpenDialog select a folder is....> ' + path);
      // console.log('path[0] is....> ' + path[0]);
      this.setState({ metaDataFolderSelected: true });
      this.setState({ metaDataFolder: path[0] });
    }
    // NOTE put this back in when the first part is working
    // persistData('metaDataPersistKey', path[0]);
    console.log('end of selectMetaDataFile');
  }
  render() {
    /*
    if (this.state.jobFilepathSelected && this.state.metaDataFolderSelected) {
      $('#sendButton').removeAttr('disabled');
    } else {
      $('#sendButton').attr('disabled', 'true');
    }
    */
    let itemButton;
    if (this.state.jobFilepathSelected && this.state.metaDataFolderSelected) {
      itemButton = <button type="submit" id="sendButton" className="btn btn-primary pull-left">Send</button>
    } else {
      itemButton = <button disabled="true" type="submit" id="sendButton" className="btn btn-primary pull-left">Send</button>
    }
    return (
      <div className="panel panel-primary">
        <div className="panel-heading apt-addheading">Job</div>
        <div className="panel-body">
          <form className="form" onSubmit={this.localHandleSend}>
            <h3>Job</h3>
            <div className="form-group">
              <label htmlFor="metaDataFolder">Metadata File</label>
              <div className="form-text" id="metaDataFolderId" >{this.state.metaDataFolder}</div>
              <div className="col-sm-offset-3 col-sm-9">
                <div className="pull-right">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.selectMetaDataFile}
                  >Select metadata.xml</button>&nbsp;
                </div>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="metaDataFolder">Job Spec</label>
              <div className="form-text" id="metaDataFolderId" >{this.state.jobFilepath}</div>
              <div className="col-sm-offset-3 col-sm-9">
                <div className="pull-right">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.selectJobSpecsFile}
                  >Select job specification</button>&nbsp;
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="col-sm-offset-2 col-sm-10">
                {itemButton}
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default JobSpecification;
