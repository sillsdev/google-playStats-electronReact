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
    tryTextLocalState: string
  }
  constructor() {
    super();
    this.runSimpleGooglePlayScraper = this.runSimpleGooglePlayScraper.bind(this);
    this.state = {
      tryTextLocalState: 'some tryTextLocalState'
    };
  }
  gsutilRunACommand = () => {
    console.log('entering gsutilRunACommand');
    let command = "gsutil cp -r gs://pubsite_prod_rev_05224823036325035822/stats/installs/installs_org.scriptureearth.acrn.nt.apk_*.csv app/components/gsutil-acrn";
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
  runSimpleGooglePlayScraper = () => {
    console.log('entering runSimpleGooglePlayScraper');

    //========================== app
    let results = gplay.app({appId: 'org.scriptureearth.adj.nt.apk'})
      .then(console.log, console.log);

    console.log('here are the results =============>');
    console.log(results);

    //========================== search
    gplay.search({
      term: "Wycliffe Bible Inc",
      num: 249
    }).then(console.log, console.log);

    //========================== developer
    gplay.developer({devId: "Wycliffe Bible Translators, Inc"}).then(console.log);

    //========================== reviews
    // org.scriptureearth.adj.nt.apk
    // org.scriptureearth.bzj.nt.apk
    // org.wycliffe.bzd.pb.apk
    gplay.reviews({
      appId: 'org.scriptureearth.adj.nt.apk',
      page: 0,
      sort: gplay.sort.RATING
    }).then(console.log, console.log);

    console.log('leaving runSimpleGooglePlayScraper');
  }

  handleTextLocalState = (event) => {
    const target = event.target;
    console.log(target.name);
    console.log(target.value);
    if (target.name === 'tryTextLocalStateBox') {
      this.setState({ tryTextLocalState: target.value });
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
                    onClick={this.runSimpleGooglePlayScraper}
                  >runSimpleGooglePlayScraper</button>&nbsp;
                </div>
              </div>  {/* className="col-sm-offset-3 col-sm-9" */}
            </div> {/* form-group */}
            <div className="form-group">
              <div className="col-sm-offset-3 col-sm-9">
                <div className="pull-left">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.gsutilRunACommand}
                  >gsutilRunACommand</button>&nbsp;
                </div>
              </div>  {/* className="col-sm-offset-3 col-sm-9" */}
            </div> {/* form-group */}
            <div className="form-group">
              <label className="col-sm-3 control-label" htmlFor="tryTextLocalState">tryTextLocalState</label>
              <div className="col-sm-9">
                <input
                  name="tryTextLocalStateBox"
                  type="text" className="form-control"
                  id="tryTextLocalState"
                  onChange={this.handleTextLocalState}
                  value={this.state.tryTextLocalState}
                  placeholder="tryTextLocalState"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default GooglePlayScraper;
