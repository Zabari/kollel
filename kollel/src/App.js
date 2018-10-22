import React, { Component } from 'react';
import './App.css';
import Page from './Page';
import LoginForm from './LoginForm';
import Login from './Login';
import Hours from './Hours';
import UserPicker from './UserPicker';
import Survey from './Survey';
import Logout from './Logout';
import RequestButton from './RequestButton';




const responseGoogle = (response) => {
  console.log(response);
}
// {/*<Page/>*/}

export default class App extends Component {
    constructor(props){
        super(props);
        // console.log(props);
        this.state = {
            id: false,
            admin: false,
            survey: false,
        };
        this.fetchCookies = this.fetchCookies.bind(this);
        this.authenticateUser = this.authenticateUser.bind(this);
        this.renderHours = this.renderHours.bind(this);
        this.renderAdmin = this.renderAdmin.bind(this);
        this.renderSurvey = this.renderSurvey.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        // this.fetchCookies();
    }
    componentDidMount(){
        this.fetchCookies();
    }
    fetchCookies(){
        fetch('/api/getcookies', {
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
                survey: response.survey,
            });
        });
    }
    authenticateUser(id){
        this.setState({
            id: id.id,
            admin: id.admin,
            survey: id.survey,
        });
    }
    renderAdmin(){
        return (
            <div>
                <Hours id={this.state.id} />
                <Logout/>
                <RequestButton admin={true}/>
                <UserPicker/>
            </div>
        );
    }
    renderHours(){
        return (
            <div>
                <Hours id={this.state.id} />
                <Logout/>
                <RequestButton/>
            </div>
        );
    }
    renderSurvey(){
        return (
            <div>
                <Survey/>
            </div>
        );
    }
    render(){
        if (!this.state.survey && this.state.id){
            return this.renderSurvey();
        }
        if (this.state.id && this.state.admin){
            return this.renderAdmin();
        }
        if (this.state.id){
            return this.renderHours();
        }

        return (
            <div>
                <Page authenticateUser={this.authenticateUser}/>

            </div>
        );
    }
}


//                 <Login callback={this.authenticateUser} />
