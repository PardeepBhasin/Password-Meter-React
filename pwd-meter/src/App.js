import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import { InputGroup, Input, Button } from 'reactstrap';
import { Alert } from 'reactstrap';

class App extends Component {
  constructor(props) {
    super(props);
    this.validatePassword = this.validatePassword.bind(this);
    this.showHide = this.showHide.bind(this);
    this.state = {
        type: 'password',
        password : "",
        meterTitle : 'Invalid',
        meterClass : 'danger',
        meterWidth : 25,
        scoreCheck : 'Score Check',
        rules : {
          isValidLength : false,
          hasNumber : false,
          hasLetter : false,
          noSpecialChar : false
        }
    }
  }

  validatePassword(e) {
    this.setState({
      password : e.target.value, 
      repeatedLetters : e.target.value.match(/^.*(.).*\1.*$/) ? true : false,     
      rules: {
          hasNumber: e.target.value.match(/\d/) ? true : false,
          hasLetter: e.target.value.match(/(?=.*?[A-Z])(?=.*?[a-z])/) ? true : false,
          isValidLength: e.target.value.match(/^.{8,}$/) ? true : false,
          noSpecialChar: !e.target.value.match(/[ \/"]/) ? true : false
      }
      },function() {
          this.setMeterAttributes(this.state.rules);
      });
  }

  setMeterAttributes(rules){
    var meterWidth = this.getMeterWidth(rules);
    this.updateMeterScore(rules);
    this.setState({
        meterWidth: meterWidth,
        meterTitle: (100 === meterWidth ? "Valid Password" : "Invalid Password"),
        meterClass: (100 > meterWidth ? "danger" : "success")           
    });  
    console.log(this.state);
  }

  updateMeterScore(rules) {
    if (rules.hasNumber && !rules.hasLetter || !rules.hasNumber && rules.hasLetter) {
        this.setState({
          scoreCheck : "week"
        })
    }
    if(this.state.repeatedLetters && rules.hasNumber && rules.hasLetter && rules.isValidLength && rules.noSpecialChar) {
      this.setState({
        scoreCheck : "strong"
      })
    } 
    if (this.state.repeatedLetters && (!rules.hasNumber || !rules.hasLetter || !rules.isValidLength || !rules.noSpecialChar)) {
        this.setState({
          scoreCheck : "weak"
        })
    }
  }

  getMeterWidth (rules) {
    var property_count = 0, valid_property_count = 0, property;
    for (property in rules) {
        if (rules.hasOwnProperty(property)) {
            property_count = property_count + 1;
            if (rules[property]) {
                valid_property_count = valid_property_count + 1;
            }
        }
    }
    return (valid_property_count / property_count) * 100;  
  }

  showHide(e){
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      type: this.state.type === 'input' ? 'password' : 'input'
    })  
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Password Complexity Meter</h1>
        </header>
        <div className="password-inputbox">
          <InputGroup>
            <Input placeholder="Enter Password"  value={this.state.password} type={this.state.type} onChange={this.validatePassword} />
            <Button bsstyle="info" className="show-password" onClick={this.showHide}>{this.state.type === 'input' ? 'Hide' : 'Show'}</Button>
          </InputGroup><br/><br/>
          <Alert color="warning">
            {this.state.scoreCheck}
          </Alert><br/>
          <div className="password-meter">
              <div style={{width : this.state.meterWidth + "%"}} className={`meter-height ${this.state.meterClass}`}></div>
          </div>
          <ul>
              <li className={this.state.rules.hasNumber ? 'valid' : 'invalid'}>
                  At least one number (0-9)
              </li>
              <li className={this.state.rules.hasLetter ? 'valid' : 'invalid'}>
                  At least one Upercase and one Lowercase letter (a-z A-Z)
              </li>
              <li className={this.state.rules.isValidLength ? 'valid' : 'invalid'}>
                  At least 8 characters
              </li>
              <li className={this.state.rules.noSpecialChar ? 'valid' : 'invalid'}>
                  No spaces, forward slashes (/) or double quote marks (")
              </li>     
            </ul>
        </div>
      </div>
    );
  }
}

export default App;
