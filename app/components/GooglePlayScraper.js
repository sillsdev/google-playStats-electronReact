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
    googlePlaySearchStr: string,
    scraperSearchResults: array,
    scraperAppResults: array
  }
  constructor() {
    super();
    this.getGooglePlaySearchResults = this.getGooglePlaySearchResults.bind(this);
    this.state = {
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
      console.log(value);
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

  handleTextLocalState = (event) => {
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
    return (
      <div className="panel panel-primary">
        <div className="panel-heading apt-addheading">Select CSV Google Play Store Stats File</div>
        <div className="panel-body">
          <form className="form" onSubmit={this.localHandleSend}>
            <div className="form-group">
              <div className="col-sm-offset-3 col-sm-9">
                <div className="pull-left">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.getGooglePlaySearchResults}
                  >get GooglePlay SearchResults</button>&nbsp;
                </div>
              </div>  {/* className="col-sm-offset-3 col-sm-9" */}
            </div> {/* form-group */}
            <div className="form-group">
              <label className="col-sm-3 control-label" htmlFor="googlePlaySearchStr">Google Play App SearchString</label>
              <div className="col-sm-9">
                <input
                  name="googlePlayAppSearchStringBox"
                  type="text" className="form-control"
                  id="googlePlayAppSearchString"
                  onChange={this.handleTextLocalState}
                  value={this.state.googlePlayAppSearchString}
                  placeholder="googlePlayAppSearchString"
                />
              </div>
            </div> {/* form-group */}
            <br></br><br></br>
            <div className="form-group">
              <div className="col-sm-offset-3 col-sm-9">
                <div className="pull-right">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.gsutilRunACommand}
                  >run gsutil download stat files for </button>&nbsp;
                </div>
                <label className="col-sm-offset-6 col-sm-6 control-label" htmlFor="gsutilProjectName">scriptureearth.acrn.nt.apk</label>
              </div>  {/* className="col-sm-offset-3 col-sm-9" */}

            </div> {/* form-group */}
          </form>
        </div>
      </div>
    );
  }
}

export default GooglePlayScraper;
