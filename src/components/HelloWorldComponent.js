import React from 'react';
// import sortBy from 'lodash'; 
import '../css/skeleton.css';
import '../css/skeleton-alerts.css';
import '../css/custom.css';
// var MediaQuery = require('react-responsive');
// var classNames = require('classnames');
// var Radium = require('radium');
let InputMoment = require('input-moment/src/input-moment.js');
require('input-moment/src/less/input-moment.less');

let moment = require('moment');

import styles from './style';
export default class HelloWorldComponent extends React.Component {
  constructor(props) {
    super(props);
    this._toggleShowMe = this._toggleShowMe.bind(this);
    this.state = {
      showMe: props.showMe,
      m: moment()
    };
    console.log(props);
  }
  static defaultProps = {
    showMe: true
  }
  static propTypes = {
    showMe: React.PropTypes.bool.isRequired
  }
  _toggleShowMe() {
    this.setState({showMe: !this.state.showMe});
  }
  render() {
    let logoURL = require("../images/logo.png");
    
    return (
      <div className="container" style={styles.topDiv}>
        <div className="sixteen columns">
         <img src={logoURL} style={styles.logo} className="u-pull-left" />
            <h4 style={styles.header}>Analytics</h4> 
             <br/>
              <input
                type="text"
                value={this.state.m.format('llll')}
                readOnly
              />
              <InputMoment
                moment={this.state.m}
               />
                <button className="button-primary" onClick={this._toggleShowMe}>
                  press me
                </button>
                <p style={Object.assign({}, this.state.showMe ? {} : styles.hidden)}>
                  hello world!!
                </p>
        </div>
      </div>
    );
  }
}