import React, { Component } from 'react';
import './App.css';
import Radio from '@material-ui/core/Radio';
import Button from '@material-ui/core/Button';
import HourRequest from './HourRequest';
import RequestLog from './RequestLog';



export default class RequestButton extends Component {
    constructor(props){
        super(props);
        this.state = {
            clicked: false,
            updateNumber: 0,
        }
        this.handleClick = this.handleClick.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.requestSubmitted = this.requestSubmitted.bind(this);
    }
    componentDidUpdate(props){
    }
    requestSubmitted(){
        this.setState({
            updateNumber: this.state.updateNumber + 1,
        });
    }
    handleClick(){
        this.setState({
            clicked: !this.state.clicked
        });
    }
            render(){
                // const error = this.state.error;
                if (!this.state.clicked){
                    return (
                        <Button variant="contained"
                            onClick={this.handleClick}>
                            Request Hours
                        </Button>
                    );
                }
                return (
                    <div>
                    <Button variant="contained"
                        onClick={this.handleClick}>
                        Hide Requests
                    </Button>
                    <p></p>
                    This is to request hours you forgot to log, or hours you
                    learned on Shabbat. They are subject to approval.
                    <HourRequest update={this.requestSubmitted}/>
                    <RequestLog key={this.state.updateNumber} admin={this.props.admin}/>
                    </div>
                );
            }
        }
