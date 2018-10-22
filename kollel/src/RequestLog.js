import React, { Component } from 'react';
import Button from '@material-ui/core/Button';

export default class RequestLog extends Component{
    constructor(props){
        super(props);
        this.state = {
            logList: [],
            totals: {
                hours: 0,
                minutes: 0,
            },
            props: this.props,
        };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.fetchLog = this.fetchLog.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.handleApprove = this.handleApprove.bind(this);
        this.handleReject = this.handleReject.bind(this);

    }
    componentDidMount(){
        this.fetchLog();
    }

    handleApprove(rowid){
        fetch('/api/approverequest', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            },
            credentials: "include",
            body: JSON.stringify({rowid}),
        }).then((response) => {
            return response.json();
        }).then((response) => {
            this.fetchLog();
        });
    }
    handleReject(rowid){
        fetch('/api/rejectrequest', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            },
            credentials: "include",
            body: JSON.stringify({rowid}),
        }).then((response) => {
            return response.json();
        }).then((response) => {
            this.fetchLog();
        });
    }
    componentDidUpdate(props){
        if (props !== this.state.props){
            this.fetchLog();
            this.setState({props});

        }
    }

    fetchLog(){
        fetch('/api/getrequestlog', {
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
            this.setState({
                logList: response.logList,
            });
        });
    }
    render(){
        let title = "You";
        if (this.props.name){
            title = this.props.name;
        }
        const logList = this.state.logList.map((data)=>{
            let startTime = new Date(data.start_time);
            let endTime = new Date(data.end_time);
            let date = new Date(data.date);
            let day = data.day.charAt(0).toUpperCase() + data.day.slice(1);
            if (this.props.admin)
                return (
                    <li key={data.rowid} indexKey={data.rowid}>
                        <Button variant="contained" onClick={()=>this.handleApprove(data.rowid)}>
                            Approve </Button>

                    {data.name} learned on {startTime.toDateString()} from{" "}
                    {(startTime.getHours()<10?"0":"") + startTime.getHours()}:
                    {(startTime.getMinutes()<10?"0":"") + startTime.getMinutes()} to{" "}
                    {(endTime.getHours()<10?"0":"") + endTime.getHours()}:
                    {(endTime.getMinutes()<10?"0":"")+ endTime.getMinutes()}{" "}
                    for a total of {data.hours} hours and about {data.minutes} minutes.
                    <Button variant="contained" onClick={()=>this.handleReject(data.rowid)}>
                        Reject </Button>

                    </li>
                );
                return (
                    <li key={data.rowid} indexKey={data.rowid}>
                        <Button variant="contained" onClick={()=>this.handleReject(data.rowid)}>
                            Delete </Button>

                    You learned on {startTime.toDateString()} from{" "}
                    {(startTime.getHours()<10?"0":"") + startTime.getHours()}:
                    {(startTime.getMinutes()<10?"0":"") + startTime.getMinutes()} to{" "}
                    {(endTime.getHours()<10?"0":"") + endTime.getHours()}:
                    {(endTime.getMinutes()<10?"0":"")+ endTime.getMinutes()}{" "}
                    for a total of {data.hours} hours and about {data.minutes} minutes.
                    </li>
                );
        });
        let text = "";
        if (this.state.logList.length){
            text = (<h1> Unapproved Requests:</h1>);
        }
        return(
            <div>
                {text}

                {"\n"}
                {logList}
            </div>
        );
    }
}
