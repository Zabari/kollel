import React, { Component } from 'react';
import './App.css';
import Radio from '@material-ui/core/Radio';
import Button from '@material-ui/core/Button';
import { GoogleLogout } from 'react-google-login';


export default class Logout extends Component {
    constructor(props){
        super(props);
        this.state = {
        }
        this.handleClick = this.handleClick.bind(this);

    }
    handleClick(){
        fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            },
            credentials: "include",
        }).then((response) => {
            return response.json();
        }).then((response) => {
            window.location.reload();
        });
    }
            render(){
                // const error = this.state.error;
                const googleButton = props => (<GoogleLogout
                      buttonText="Logout"
                      onLogoutSuccess={this.handleClick}
                    {...props}/>)
                return (
                    <div>
                    <p></p>


                    <Button color="secondary" variant="contained"
                        component={googleButton}>
                    Logout
                    </Button>
                    <p></p>

                    </div>
                );
            }
        }
