// @flow
import React, { Component } from 'react';
import electron from 'electron';
import Papa from 'papaparse';

// with es6
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

const app = electron.remote;
const dialog = app.dialog;

class ListWbtApps extends Component {
  props: {
  };
  state: {
    tableOfApps: array,
    appsFolderSelected: boolean,
    appsFolder: string
  }
  constructor() {
    super();
    this.getWbtBibleIncApps = this.getWbtBibleIncApps.bind(this);
    this.onSelectAppsFolder = this.onSelectAppsFolder.bind(this);
    this.state = {
      tableOfApps: [],
      appsFolderSelected: false,
      appsFolder: 'appsFolder'
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

  getWbtBibleIncApps = () => {
    console.log('entering getWbtBibleIncApps');
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
    console.log('leaving getWbtBibleIncApps');
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

      if (this.state.tableOfApps.length != 0)
      {
        wbtApps = this.state.tableOfApps;
      }

    return (
      <div className="panel-group">
        <div className="panel panel-primary">
          <div className="panel-heading apt-addheading">Get Full List</div>

          <div className="panel panel-info">
            <div className="panel-heading">Display All Wycliffe Bible Translators Apps</div>
            <div className="panel-body">
              <div className="btn-toolbar" role="group" aria-label="Basic example">
                <div className="pull-left">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.getWbtBibleIncApps}
                  >Get Wycliffe Bible Inc Apps</button>&nbsp;
                </div>
                <div className="col-sm-offset-3">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.onSelectAppsFolder}
                  >Select Folder for Apps</button>&nbsp;
                </div>
              </div>
            </div>
          </div>
          {/* ===================================================================================================================== */}
          <BootstrapTable data={wbtApps} headerStyle={ { borderRadius: 0, border: 0, padding : 0, backgroundColor: '#eeeeee'  } } search searchPlaceholder='type items to search for...' multiColumnSearch>
              <TableHeaderColumn isKey dataField='title' width='40%'>App Title</TableHeaderColumn>
              <TableHeaderColumn dataField='packageName' width='30%'>Package Name</TableHeaderColumn>
              <TableHeaderColumn dataField='link' width='30%'>Link To App</TableHeaderColumn>
          </BootstrapTable>
        </div>

      </div>

    );
  }
}

export default ListWbtApps;
