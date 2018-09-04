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
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                // 'Access-Control-Allow-Origin': '/'
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
        // let x = GoogleLogin();
        // console.log(x);
        const googleButton = props =>(<GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_KEY}
            buttonText="Login"
            onSuccess={this.success}
            onFailure={responseGoogle}
        {...props}/>);
        return (
            <Button
                variant="contained"
                className="Welcomebutton"
                component={googleButton}
            >
            Login
            </Button>
        );
    }
}
