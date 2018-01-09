// @flow
import React, { Component } from 'react';

// with es6
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

var gplay = require('google-play-scraper');

class DisplayGoogleWbtApps extends Component {
  props: {
  };
  state: {
    packageNameFromScraperSearch: string
  }
  constructor() {
    super();
    this.getWbtBibleIncApps = this.getWbtBibleIncApps.bind(this);
    this.state = {
      packageNameFromScraperSearch: 'packageNameFromScraperSearch'
    };
  }

  getGooglePlayDeveloperResults = () => {
    console.log('entering getGooglePlayDeveloperResults');
    //========================== developer
    gplay.developer({devId: "Wycliffe Bible Translators, Inc"}).then(console.log);
    console.log('leaving getGooglePlayDeveloperResults');
  } //================= getGooglePlayDeveloperResults
  getWbtBibleIncApps = () => {
    console.log('entering getWbtBibleIncApps');

    //========================== search


    gplay.search({
      term: "org.scriptureearth",
      num: 225
    }).then(console.log, console.log);



    /*gplay.search({
      term: "Belize Kriol - Bible",
      num: 1
    }).then(console.log, console.log);
    */

    // eg. "Belize Kriol - Bible"
    /*
    gplay.search({
      term: "Wycliffe Bible Translators, Inc",
      num: 1
    }).then((value) => {
      this.setState({ scraperSearchResults: value });
      console.log('here are the results =============>');
      console.log(value);
    });
    */

    console.log('leaving getWbtBibleIncApps');
  }
  render() {
    //  const { emailAddy } = this.props;
    //  const { propInHome } = this.props;
    let packageNameFromScraperSearch = 'packageNameFromScraperSearch';
    packageNameFromScraperSearch = this.state.packageNameFromScraperSearch;
    let wbtApps = [
      {
        title: "Ga'dang - Bible",
        packageName: 'org.wycliffe.gdg.nt.apk'
      },
      {
        title: "Garífuna (Caribe) - Bible",
        packageName: 'org.scriptureearth.cab.nt.apk'
      }];

    return (
      <div className="panel-group">
        <div className="panel panel-primary">
          <div className="panel-heading apt-addheading">Get Full List</div>

          <div className="panel panel-info">
            <div className="panel-heading">Display All Wycliffe Bible Translators Apps</div>
            <div className="panel-body">
              <div className="form-group">
                <div className="col-sm-offset-1 col-sm-4">
                  <div className="pull-right">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={this.getWbtBibleIncApps}
                    >Get Wycliffe Bible Inc Apps</button>&nbsp;
                  </div>
                  <br></br>

                </div>  {/* className="col-sm-offset-3 col-sm-9" */}
              </div> {/* form-group */}
            </div>
          </div>
          {/* ===================================================================================================================== */}
          <BootstrapTable data={wbtApps} headerStyle={ { borderRadius: 0, border: 0, padding : 0, backgroundColor: '#eeeeee'  } } search searchPlaceholder='type items to search for...' multiColumnSearch>
              <TableHeaderColumn isKey dataField='title' width='55%'>App Title</TableHeaderColumn>
              <TableHeaderColumn dataField='packageName' width='45%'>Package Name</TableHeaderColumn>
          </BootstrapTable>
        </div>

      </div>

    );
  }
}

export default DisplayGoogleWbtApps;
