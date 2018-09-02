import React, { Component } from 'react';
import './App.css';
import Page from './Page';
import LoginForm from './LoginForm';
import Login from './Login';
import Hours from './Hours';
import UserPicker from './UserPicker';

const responseGoogle = (response) => {
  console.log(response);
}
// {/*<Page/>*/}

export default class App extends Component {
    constructor(props){
        super(props);
        // console.log(props);
        this.state = {
            id: 0,
            admin: false,
        };
        this.fetchCookies = this.fetchCookies.bind(this);
        this.authenticateUser = this.authenticateUser.bind(this);
        this.renderHours = this.renderHours.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        // this.fetchCookies();
    }
    componentDidMount(){
        this.fetchCookies();
    }
    fetchCookies(){
        fetch(process.env.HOST + '/getid', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            },
            credentials: "include"
        }).then((response) => {
            return response.json();
        }).then((response) => {
            // console.log(response);
            this.setState({
                id: response.id,
                admin: response.admin,
            });
        });
    }
    authenticateUser(id){
        this.setState({
            id: id.id,
            admin: id.admin
        });
    }
    renderAdmin(){
        return (
            <div>
                {this.renderHours()}
                <UserPicker/>
            </div>
        );
    }
    renderHours(){
        return (
            <div>
                <Hours id={this.state.id} />
            </div>
        );
    }
    render(){
        if (this.state.id && this.state.admin){
            return this.renderAdmin();
        }
        if (this.state.id){
            return this.renderHours();
        }

        return (
            <div>
                <Page/>

            </div>
        );
    }
}


//                 <Login callback={this.authenticateUser} />
