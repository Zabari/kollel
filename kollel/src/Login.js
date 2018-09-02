import React, { Component } from 'react';
import './App.css';
import Page from './Page';
import LoginForm from './LoginForm';
import GoogleLogin from 'react-google-login';
import Button from '@material-ui/core/Button';

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
        fetch(process.env.HOST + '/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                // 'Access-Control-Allow-Origin': process.env.HOST + '/'
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
            <Button
                variant="outlined"
                color="primary"
                className="Welcomebutton"
            >
            <GoogleLogin
                className="Welcomebutton"
                clientId={process.env.REACT_APP_GOOGLE_KEY}
                buttonText="Login"
                onSuccess={this.success}
                onFailure={responseGoogle}
            />
            </Button>
        );
    }
}
