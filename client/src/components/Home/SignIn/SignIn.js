import React, { Component } from 'react';
import './SignIn.css';
import { BrowserRouter as Redirect, Router, Route, Link, NavLink } from 'react-router-dom';
import { _login } from '../../../services/AuthService';

class SignIn extends Component {
    constructor() {
        super();

        this.state = {
            email: '',
            password: '',
            SignUp: false,
            redirect: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }
    // getToken = () => {
    //     return localStorage.getItem('token');
    //   }

    handleChange(e) {
        let target = e.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        let name = target.name;

        this.setState({
          [name]: value
        });
    }

    handleLogin(e) {
      e.preventDefault();

      const { history } = this.props;

      let email = e.target.children[0].children[1].value;
      let password = e.target.children[1].children[1].value;

      if (!email || !password) {
        alert("please enter in the required fields");
      } else {
        return _login(email, password).then(res => {
            if (res.token){
              localStorage.setItem('token', res.token);
              console.log(res.token);
              alert("You've successfully logged in");
              //redirect user to the feed/deals
              history.push('/feed/deals');
            }else{
              console.log("Login error: ", res);
              alert(res.err);
            }
          });

      }
    }

    //     logout = (event) => {
    //       event.preventDefault();

    //       this.setState({logged_in: false}, function(){
    //         localStorage.removeItem('token');
    //       });

    //     console.log('The form was submitted with the following data:');
    //     console.log(this.state);

    // };


    render() {

      if(localStorage.getItem('token')){
        this.props.history.push('/feed/deals');
      }
        return (
            <div className="App">
            <div className="App__Aside">
              <img className="crypto-img img-fluid mb-5 d-block mx-auto" src="../../../assets/images/logo.png" alt=""></img>
              <h1 className="text-uppercase mb-0">Accept My Crypto</h1>
              <hr className="star-light"></hr>
              <h2 className="font-weight-light mb-0">
                <ul>
                  <br></br>
                  <li><i class="homepage-icons fas fa-dollar-sign"></i>
                    Grab Deals for Purchase with Cryptocurrency
                  </li>
                  <br></br>
                  <li><i class="homepage-icons fa fa-user" aria-hidden="true"></i>
                    Find Friends with Matching Currencies
                  </li>
                  <br></br>
                  <li><i class="homepage-icons fa fa-users" aria-hidden="true"></i>
                    Engage with Your Crypto Community
                  </li>
                </ul>
              </h2>
            </div>
            <div className="App__Form">
            <div className="PageSwitcher">
                  <NavLink to="/" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Sign In</NavLink>
                  <NavLink exact to="/SignUp" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Sign Up</NavLink>
                </div>

                {/* <div className="FormTitle">
                    <NavLink to="/" activeClassName="FormTitle__Link--Active" className="FormTitle__Link">Sign In</NavLink> or <NavLink exact to="/SignUp" activeClassName="FormTitle__Link--Active" className="FormTitle__Link">Sign Up</NavLink>
                </div> */}
            <div className="FormCenter">
            <form onSubmit={this.handleLogin} className="FormFields">
            <div className="FormField">
                <label className="FormField__Label" htmlFor="email">E-Mail Address</label>
                <input type="email" id="email" className="FormField__Input" placeholder="Enter your email" name="email" value={this.state.email} onChange={this.handleChange} required />
              </div>

              <div className="FormField">
                <label className="FormField__Label" htmlFor="password">Password</label>
                <input type="password" id="password" className="FormField__Input" placeholder="Enter your password" name="password" value={this.state.password} onChange={this.handleChange} required />
              </div>

              <div className="FormField">
                  <button className="FormField__Button mr-10">Sign In</button> <Link to="/" className="FormField__Link">Create an account</Link>
              </div>
            </form>
          </div>
            </div>
          </div>
        );
    }
}

export default SignIn;