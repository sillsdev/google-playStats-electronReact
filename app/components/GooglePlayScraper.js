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
    packageNameFromScraperSearch: string,
    titleFromScraperSearch: string,
    scoreFromScraperSearch: string,
    developerFromScraperSearch: string,

    packageNameFromScraperApp: string,
    titleFromScraperApp: string,
    reviewsFromScraperApp: string,
    scoreNameFromScraperApp: string,
    versionFromScraperApp: string,
    androidVersionTextFromScraperApp: string,
    developerEmailFromScraperApp: string,

    googlePlaySearchStr: string,
    scraperSearchResults: array,
    scraperAppResults: array,
  }
  constructor() {
    super();
    this.getGooglePlaySearchResults = this.getGooglePlaySearchResults.bind(this);
    this.getGooglePlayAppResults = this.getGooglePlayAppResults.bind(this);
    this.state = {
      packageNameFromScraperSearch: 'packageNameFromScraperSearch',
      titleFromScraperSearch: 'titleFromScraperSearch',
      scoreFromScraperSearch: 'scoreFromScraperSearch',
      developerFromScraperSearch: 'developerFromScraperSearch',

      packageNameFromScraperApp: 'string',
      titleFromScraperApp: 'string',
      reviewsFromScraperApp: 'string',
      scoreNameFromScraperApp: 'string',
      versionFromScraperApp: 'string',
      androidVersionTextFromScraperApp: 'string',
      developerEmailFromScraperApp: 'string',

      googlePlaySearchStr: 'some googlePlaySearchStr',
      scraperSearchResults: ['a'],
      scraperAppResults: ['a']
    };
  }

  getGooglePlayDeveloperResults = () => {
    console.log('entering getGooglePlayDeveloperResults');
    //========================== developer
    gplay.developer({devId: "Wycliffe Bible Translators, Inc", num: 260}).then(console.log);
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

  getGooglePlayAppResults = () => {
    console.log('entering getGooglePlayAppResults');

    //========================== app
    /*let results = gplay.app({appId: 'org.scriptureearth.adj.nt.apk'})
      .then(console.log, console.log);
      */


    const appPackageName = this.state.packageNameFromScraperSearch;
    // eg 'org.scriptureearth.adj.nt.apk'
    gplay.app({appId: appPackageName})
        .then((value) => {
          this.setState({ scraperAppResults: value });
          this.setState({ packageNameFromScraperApp: value.appId });
          this.setState({ titleFromScraperApp: value.title });
          this.setState({ reviewsFromScraperApp: value.reviews });
          this.setState({ scoreNameFromScraperApp: value.score });
          this.setState({ versionFromScraperApp: value.version });
          this.setState({ androidVersionTextFromScraperApp: value.androidVersionText });
          this.setState({ developerEmailFromScraperApp: value.developerEmail });

          console.log(value);

        });

    console.log('leaving getGooglePlayAppResults');
  } //================= getGooglePlayAppResults

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
    const searchString = this.state.googlePlaySearchStr;
    // eg. "Belize Kriol - Bible"
    let results = gplay.search({
      term: searchString,
      num: 1
    }).then((value) => {
      this.setState({ scraperSearchResults: value });
      this.setState({ packageNameFromScraperSearch: value[0].appId });
      this.setState({ titleFromScraperSearch: value[0].title });
      this.setState({ scoreFromScraperSearch: value[0].score });
      this.setState({ developerFromScraperSearch: value[0].developer });
      console.log('value ===>');
      console.log(value);
      console.log('value[0] ===>');
      console.log(value[0]);
      console.log('value[0].appId ===>');
      console.log(value[0].appId);
    });
    console.log('here are the results =============>');
    console.log(results);



    console.log('leaving getGooglePlaySearchResults');
  }
  gsutilDownloadAnAppStats = () => {
    console.log('entering gsutilDownloadAnAppStats');
    let filesToDownload = 'gs://pubsite_prod_rev_05224823036325035822/stats/installs/installs_' + this.state.packageNameFromScraperSearch + '_*.csv ';
    let command = "gsutil cp -r gs://pubsite_prod_rev_05224823036325035822/stats/installs/installs_org.scriptureearth.acrn.nt.apk_*.csv app/components/gsutil-downloads";
    console.log (filesToDownload);
    command = 'gsutil cp -r ' + filesToDownload + 'app/components/gsutil-downloads';
    console.log (command);
    cmd.run(command);
    /*
    cmd.get(
        'ls app/components',
        function(err, data, stderr){
            console.log('the current dir contains these files :\n\n',data)
        }
    );
    */
    console.log('leaving gsutilDownloadAnAppStats');
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
    let dt = new Date();
    let months = [
    'January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September',
    'October', 'November', 'December'
    ];
    //  const { emailAddy } = this.props;
    //  const { propInHome } = this.props;
    let packageNameFromScraperSearch = 'packageNameFromScraperSearch';
    let titleFromScraperSearch = 'titleFromScraperSearch';
    let scoreFromScraperSearch = 'scoreFromScraperSearch';
    let developerFromScraperSearch = 'developerFromScraperSearch';
    packageNameFromScraperSearch = this.state.packageNameFromScraperSearch;
    titleFromScraperSearch = this.state.titleFromScraperSearch;
    scoreFromScraperSearch = this.state.scoreFromScraperSearch;
    developerFromScraperSearch = this.state.developerFromScraperSearch;

    let packageNameFromScraperApp = 'packageNameFromScraperApp';
    let titleFromScraperApp = 'titleFromScraperApp';
    let reviewsFromScraperApp = 'reviewsFromScraperApp';
    let scoreNameFromScraperApp = 'scoreNameFromScraperApp';
    let versionFromScraperApp = 'versionFromScraperApp';
    let androidVersionTextFromScraperApp = 'androidVersionTextFromScraperApp';
    let developerEmailFromScraperApp = 'developerEmailFromScraperApp';
    packageNameFromScraperApp = this.state.packageNameFromScraperApp;
    titleFromScraperApp = this.state.titleFromScraperApp;
    reviewsFromScraperApp = this.state.reviewsFromScraperApp;
    scoreNameFromScraperApp = this.state.scoreNameFromScraperApp;
    versionFromScraperApp = this.state.versionFromScraperApp;
    androidVersionTextFromScraperApp = this.state.androidVersionTextFromScraperApp;
    developerEmailFromScraperApp = this.state.developerEmailFromScraperApp;
    return (
      <div className="panel-group">
        <div className="panel panel-primary">
          <div className="panel-heading apt-addheading">Select Play Store App</div>
          <div className="panel-body">
            <form className="form" onSubmit={this.localHandleSend}>
              <div className="container">

                <br></br>
                <div className="form-group">
                  <label className="col-sm-3 control-label" htmlFor="googlePlaySearchStr"><h4>Google Play App Search string (Title)</h4></label>
                  <div className="col-sm-4">
                    <input
                      name="googlePlayAppSearchStringBox"
                      type="text" className="form-control"
                      id="googlePlayAppSearchString"
                      onChange={this.handleSearchStringChange}
                      value={this.state.googlePlayAppSearchString}
                      placeholder="googlePlayAppSearchString"
                    />
                  </div>
                  <div className="btn-toolbar" role="group" aria-label="Basic example">

                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={this.getGooglePlaySearchResults}
                    >get GooglePlay SearchResults</button>
                  </div>
                </div> {/* form-group */}
              </div> {/* container */}
              <div className="container">
                <div className="form-group">
                  <label className="col-sm-3 control-label" htmlFor="packageNameFromScraperSearch">Package Name</label>
                  <div className="form-text" id="packageNameFromScraperSearch" placeholder="packageNameFromScraperSearch" >{packageNameFromScraperSearch}</div>
                  <br></br>
                  <label className="col-sm-3 control-label" htmlFor="titleFromScraperSearch">App Title</label>
                  <div className="form-text" id="titleFromScraperSearch" placeholder="titleFromScraperSearch" >{titleFromScraperSearch}</div>
                  <br></br>
                  <label className="col-sm-3 control-label" htmlFor="scoreFromScraperSearch">App Review Ratings</label>
                  <div className="form-text" id="scoreFromScraperSearch" placeholder="scoreFromScraperSearch" >{scoreFromScraperSearch} out of 5</div>
                  <br></br>
                  <label className="col-sm-3 control-label" htmlFor="developerFromScraperSearch">App Developer</label>
                  <div className="form-text" id="developerFromScraperSearch" placeholder="developerFromScraperSearch" >{developerFromScraperSearch}</div>
                  <br></br>
                </div> {/* form-group */}
              </div>
              <div className="container">
                <br></br>
                <div className="form-group">
                  <label className="col-sm-3 control-label" htmlFor="googlePlaySearchStr"><h4>Google Play Package Name</h4></label>
                  <div className="btn-toolbar" role="group" aria-label="Basic example">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={this.getGooglePlayAppResults}
                    >get GooglePlay App Full Results</button>
                  </div>
                </div> {/* form-group */}
              </div> {/* container */}
              <div className="container">
                <div className="form-group">
                  <label className="col-sm-4 control-label" htmlFor="packageNameFromScraperSearch">Package Name From Search: </label>
                  <div className="form-text" id="packageNameFromScraperSearch" placeholder="packageNameFromScraperSearch" >{packageNameFromScraperSearch}</div>
                </div> {/* form-group */}

                <div className="form-group">
                  <label className="col-sm-4 control-label" htmlFor="titleFromScraperApp">Title: </label>
                  <div className="form-text" id="titleFromScraperApp" placeholder="titleFromScraperApp" >{titleFromScraperApp}</div>
                </div> {/* form-group */}
                <div className="form-group">
                  <label className="col-sm-4 control-label" htmlFor="reviewsFromScraperApp">Number of reviews:</label>
                  <div className="form-text" id="reviewsFromScraperApp" placeholder="reviewsFromScraperApp" >{reviewsFromScraperApp}</div>
                </div> {/* form-group */}
                <div className="form-group">
                  <label className="col-sm-4 control-label" htmlFor="scoreNameFromScraperApp">Average score:</label>
                  <div className="form-text" id="scoreNameFromScraperApp" placeholder="scoreNameFromScraperApp" >{scoreNameFromScraperApp}</div>
                </div> {/* form-group */}
                <div className="form-group">
                  <label className="col-sm-4 control-label" htmlFor="versionFromScraperApp">Version: </label>
                  <div className="form-text" id="versionFromScraperApp" placeholder="versionFromScraperApp" >{versionFromScraperApp}</div>
                </div> {/* form-group */}
                <div className="form-group">
                  <label className="col-sm-4 control-label" htmlFor="androidVersionTextFromScraperApp">Android Version Text: </label>
                  <div className="form-text" id="androidVersionTextFromScraperApp" placeholder="androidVersionTextFromScraperApp" >{androidVersionTextFromScraperApp}</div>
                </div> {/* form-group */}
                <div className="form-group">
                  <label className="col-sm-4 control-label" htmlFor="developerEmailFromScraperApp">Developer Email: </label>
                  <div className="form-text" id="developerEmailFromScraperApp" placeholder="developerEmailFromScraperApp" >{developerEmailFromScraperApp}</div>
                </div> {/* form-group */}
              </div>
            </form>
          </div>
          <div className="panel panel-info">
            <div className="panel-heading">Download Files For packageName Specified</div>
            <div className="panel-body">
              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="packageNameFromScraperSearch">Package Name</label>
                <div className="form-text" id="packageNameFromScraperSearch" placeholder="packageNameFromScraperSearch" >{packageNameFromScraperSearch}</div>
              </div> {/* form-group */}
              <div className="form-group">
                <div className="col-sm-offset-1 col-sm-9">
                  <div className="pull-right">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={this.gsutilDownloadAnAppStats}
                    >Download</button>&nbsp;
                  </div>
                  <br></br>

                </div>  {/* className="col-sm-offset-3 col-sm-9" */}
              </div> {/* form-group */}
            </div>
          </div>

        </div>

      </div>

    );
  }
}

export default GooglePlayScraper;
