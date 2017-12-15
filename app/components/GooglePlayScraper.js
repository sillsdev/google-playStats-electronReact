// @flow
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
//  import { Link } from 'react-router-dom';
//  import styles from './UpdateStateInHome.css';

var gplay = require('google-play-scraper');
var exec = require('child_process').exec;
var cmd=require('node-cmd');

class GooglePlayScraper extends Component {
  props: {
  };
  state: {
    packageNameFromCsv: string,
    googlePlaySearchStr: string,
    scraperSearchResults: array,
    scraperAppResults: array
  }
  constructor() {
    super();
    this.getGooglePlaySearchResults = this.getGooglePlaySearchResults.bind(this);
    this.getGooglePlayAppResults = this.getGooglePlayAppResults.bind(this);
    this.state = {
      packageNameFromCsv: 'packageNameFromCsv',
      googlePlaySearchStr: 'some googlePlaySearchStr',
      scraperSearchResults: ['a'],
      scraperAppResults: ['a']
    };
  }
  getGooglePlayAppResults = () => {
    console.log('entering getGooglePlayAppResults');

    //========================== app
    let results = gplay.app({appId: 'org.scriptureearth.adj.nt.apk'})
      .then(console.log, console.log);

    gplay.app({appId: 'org.scriptureearth.adj.nt.apk'})
        .then((value) => {
          this.setState({ scraperAppResults: value });
          console.log(value);

        });

    console.log('here are the results =============>');
    console.log(results);

    console.log('leaving getGooglePlayAppResults');
  } //================= getGooglePlayAppResults
  getGooglePlayDeveloperResults = () => {
    console.log('entering getGooglePlayDeveloperResults');
    //========================== developer
    gplay.developer({devId: "Wycliffe Bible Translators, Inc"}).then(console.log);
    console.log('leaving getGooglePlayDeveloperResults');
  } //================= getGooglePlayDeveloperResults
  getGooglePlayAppReviews = () => {
    console.log('entering getGooglePlayAppReviews');
    //========================== reviews
    // org.scriptureearth.adj.nt.apk
    // org.scriptureearth.bzj.nt.apk
    // org.wycliffe.bzd.pb.apk
    gplay.reviews({
      appId: 'org.scriptureearth.adj.nt.apk',
      page: 0,
      sort: gplay.sort.RATING
    }).then(console.log, console.log);

    console.log('leaving getGooglePlayAppReviews');
  } //================= getGooglePlayAppReviews
  getGooglePlaySearchResults = () => {
    console.log('entering getGooglePlaySearchResults');

    //========================== search
    /*
    gplay.search({
      term: "Wycliffe Bible Inc",
      num: 249
    }).then(console.log, console.log);
    */

    /*gplay.search({
      term: "Belize Kriol - Bible",
      num: 1
    }).then(console.log, console.log);
    */
    let results2 = gplay.search({
      term: "Belize Kriol - Bible",
      num: 1
    }).then((value) => {
      this.setState({ scraperSearchResults: value });
      let packageNm = value[0].appId;
      this.setState({ packageNameFromCsv: packageNm });
      console.log('value ===>');
      console.log(value);
      console.log('value[0] ===>');
      console.log(value[0]);
      console.log('value[0].appId ===>');
      console.log(value[0].appId);
    });
    console.log('here are the results =============>');
    console.log(results2);



    console.log('leaving getGooglePlaySearchResults');
  }
  gsutilRunACommand = () => {
    console.log('entering gsutilRunACommand');
    let command = "gsutil cp -r gs://pubsite_prod_rev_05224823036325035822/stats/installs/installs_org.scriptureearth.acrn.nt.apk_*.csv app/components/gsutil-downloads";
    console.log (command);
    cmd.run(command);
    cmd.get(
        'ls app/components',
        function(err, data, stderr){
            console.log('the current dir contains these files :\n\n',data)
        }
    );


    console.log('leaving gsutilRunACommand');
  }

  handleSearchStringChange = (event) => {
    const target = event.target;
    console.log(target.name);
    console.log(target.value);
    if (target.name === 'googlePlayAppSearchStringBox') {
      this.setState({ googlePlaySearchStr: target.value });
    }
  }
  render() {
    //  const { emailAddy } = this.props;
    //  const { propInHome } = this.props;
    let packageNameFromCsv = 'packageNameFromCsv';
    packageNameFromCsv = this.state.packageNameFromCsv;
    return (
      <div className="panel panel-primary">
        <div className="panel-heading apt-addheading">Select CSV Google Play Store Stats File</div>
        <div className="panel-body">
          <form className="form" onSubmit={this.localHandleSend}>
            <div className="container">
              <div className="btn-toolbar" role="group" aria-label="Basic example">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={this.getGooglePlaySearchResults}
                >get GooglePlay SearchResults</button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={this.getGooglePlayAppResults}
                >get GooglePlay App Full Results</button>
              </div>
              <br></br><br></br>
              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="packageNameFromCsv">Package Name</label>
                <div className="form-text" id="packageNameFromCsv" placeholder="packageNameFromCsv" >{packageNameFromCsv}</div>
                <br></br>
              </div> {/* form-group */}
            </div>
            <div className="form-group">
              <label className="col-sm-3 control-label" htmlFor="googlePlaySearchStr">Google Play App SearchString</label>
              <div className="col-sm-9">
                <input
                  name="googlePlayAppSearchStringBox"
                  type="text" className="form-control"
                  id="googlePlayAppSearchString"
                  onChange={this.handleSearchStringChange}
                  value={this.state.googlePlayAppSearchString}
                  placeholder="googlePlayAppSearchString"
                />
              </div>
            </div> {/* form-group */}
            <br></br><br></br>
            <div className="container">
              <div className="form-group">
                <div className="col-sm-offset-1 col-sm-9">
                  <div className="pull-left">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={this.gsutilRunACommand}
                    >run gsutil download stat files for </button>&nbsp;
                  </div>
                  <label className="col-sm-6 control-label" htmlFor="gsutilProjectName">scriptureearth.acrn.nt.apk</label>
                </div>  {/* className="col-sm-offset-3 col-sm-9" */}
              </div> {/* form-group */}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default GooglePlayScraper;
