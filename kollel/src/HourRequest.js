import React, { Component } from 'react';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import moment from 'moment';


export default class HourRequest extends Component{
    constructor(props){
        super(props);
        const dateNow = moment().format().substring(0,16);
        this.state = {
            logList: [],
            totals: {
                hours: 0,
                minutes: 0,
            },
            props: this.props,
            startTime: dateNow,
            endTime: dateNow,
        };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleNewHours = this.handleNewHours.bind(this);
        this.handleStartTime = this.handleStartTime.bind(this);
        this.handleEndTime = this.handleEndTime.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
    }
    componentDidMount(){
        this.setState({
            id: this.props.id,
        });
        // this.handleNewHours(this.props.id);
    }

    componentDidUpdate(props){
        if (props !== this.state.props){
            // this.handleNewHours(props.id);
            this.setState({
                props,
                id: props.id,
            });

        }
    }
    handleClick(e){
        fetch('/api/requesthours', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            },
            credentials: "include",
            body: JSON.stringify({
                "id": this.state.id,
                "start_time": this.state.startTime,
                "end_time": this.state.endTime,
            }),
        }).then((response) => {
            return response.json();
        }).then((response) => {
            this.props.update();
        });
    }
    handleStartTime(e){
        // console.log(e.target.value);
        this.setState({
            startTime: e.target.value,
        });
    }
    handleEndTime(e){
        this.setState({
            endTime: e.target.value,
        });
    }
    handleNewHours(e){

    }

    render(){
        return(
            <div>
            <TextField
            label="Start Time"
            type="datetime-local"
            defaultValue={this.state.startTime}
            onChange={this.handleStartTime}
            InputLabelProps={{
                shrink: true,
            }}
            />
            <p>
            </p>
            <TextField
            label="End Time"
            type="datetime-local"
            defaultValue={this.state.endTime}
            onChange={this.handleEndTime}
            InputLabelProps={{
                shrink: true,
            }}
            />
            <Button variant="contained" onClick={this.handleClick}>
                Submit Request
            </Button>
            </div>
        );
    }
}
