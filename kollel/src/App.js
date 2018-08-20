import React, { Component } from 'react';
import './App.css';
import Page from './Page';
import LoginForm from './LoginForm';
import Login from './Login';

const responseGoogle = (response) => {
  console.log(response);
}
// {/*<Page/>*/}

export default class App extends Component {
    constructor(props){
        super(props);
        console.log(props);
        this.state = {
            id: 0,
        };
        this.authenticateUser = this.authenticateUser.bind(this);
    }
    authenticateUser(id){
        this.setState({
            id
        });
    }
    render(){
        let loginComponent = (<Login callback={this.authenticateUser} />);
        if (this.state.id){
            loginComponent = (<p> Welcome to the site!</p>);
        }

        return (
            <div>
                {loginComponent}
            </div>
        );
    }
}
