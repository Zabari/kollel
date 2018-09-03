import React, { Component } from 'react';
import HourLog from './HourLog';

export default class Hours extends Component{
    constructor(props){
        super(props);
        this.state = {
            startTime: false,
            endTime: false,
        };
        this.handleClick = this.handleClick.bind(this);
        this.renderTime = this.renderTime.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.fetchState = this.fetchState.bind(this);
    }

    componentDidMount(){
        this.fetchState();
    }
    fetchState(){
        fetch('/api/getlearningstate', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                // 'Access-Control-Allow-Origin': '*'
            },
            credentials: "include",
        }).then((response) => {
            return response.json();
        }).then((response) => {
            // console.log(response);
            this.setState({
                startTime: response
            });
        });
    }

    handleClick(e){
        e.preventDefault();
            if (!this.state.startTime){
                fetch('/api/startlearning', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        // 'Access-Control-Allow-Origin': '*'
                    },
                    credentials: "include",
                }).then((response) => {
                    return response.json();
                }).then((response) => {
                    // console.log(response);
                    this.setState({
                        startTime: response
                    });
                });
        }
        else {
            fetch('/api/endlearning', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                credentials: "include",
            }).then((response) => {
                return response.json();
            }).then((response) => {
                this.setState({
                    startTime: response
                });
            })
        }
    }
    renderTime(){
        let text = (<p> Start Learning!</p>);
        if (this.state.startTime){
            text = (<p> Finish Learning!</p>);
        }
        return(
            <div>
            <button onClick={this.handleClick}>
                {text}
            </button>
            <HourLog/>
            </div>
        );
    }
    render(){

        return (
            <div>
                {this.renderTime()}
            </div>
        );
    }
}
