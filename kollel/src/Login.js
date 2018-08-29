import React, { Component } from 'react';
import './App.css';
import Page from './Page';
import LoginForm from './LoginForm';
import GoogleLogin from 'react-google-login';

const responseGoogle = (response) => {
    console.log(response);
}

export default class Login extends Component {
    constructor(props){
        super(props);
        // console.log(props);
        this.state = {};
        this.success = this.success.bind(this);
    }
    success(googleResponse){
        fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                // 'Access-Control-Allow-Origin': 'http://localhost:5000/'
            },
            credentials: "include",
            body: JSON.stringify(googleResponse)
        }).then((response) => {
            return response.json();
        }).then((response) => {
            this.props.callback(response);
        })

    }
    render(){
        return (
            <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_KEY}
            buttonText="Login"
            onSuccess={this.success}
            onFailure={responseGoogle}
            />
        );
    }
}
