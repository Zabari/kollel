import React, { Component } from 'react';

export default class HourLog extends Component{
    constructor(props){
        super(props);
        this.state = {
            logList: [],
            totals: {
                hours: 0,
                minutes: 0,
            },
        };
        // console.log("construct");
        // if ("name" in this.props){
        //     console.log("name");
        //     this.setState({
        //         name: this.props.name,
        //     });
        // }
        // if ("id" in this.props){
        //     this.state.id = this.props.id;
        // }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.fetchLog = this.fetchLog.bind(this);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    }
    componentDidMount(){
        this.fetchLog(this.props.id);
    }

    componentWillReceiveProps(props){
        this.fetchLog(props.id);
    }

    fetchLog(id){
        let tempId = false;
        if (id) {
            tempId = id;
        }
        else {
            tempId = this.props.id;
        }
        fetch('/api/getlog', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            },
            credentials: "include",
            body: JSON.stringify({"id": tempId}),
        }).then((response) => {
            return response.json();
        }).then((response) => {
            this.setState({
                logList: response.logList,
                totals: response.totals
            });
        });
    }
    render(){
        let title = "You";
        if (this.props.name){
            title = this.props.name;
        }
        const hours = this.state.totals.hours + Math.floor(this.state.totals.minutes/60);
        const minutes = this.state.totals.minutes % 60;
        const logList = this.state.logList.map((data)=>{
            let startTime = new Date(data.start_time);
            let endTime = new Date(data.end_time);
            let date = new Date(data.date);
            let day = data.day.charAt(0).toUpperCase() + data.day.slice(1);

            return (
                <li key={data.rowid}>
                {title} learned on {startTime.toDateString()} from{" "}
                {(startTime.getHours()<10?"0":"") + startTime.getHours()}:
                {(startTime.getMinutes()<10?"0":"") + startTime.getMinutes()} to{" "}
                {(endTime.getHours()<10?"0":"") + endTime.getHours()}:
                {(endTime.getMinutes()<10?"0":"")+ endTime.getMinutes()}{" "}
                for a total of {data.hours} hours and about {data.minutes} minutes.
                </li>
            );
        });
        return(
            <div>
            <h1> {title} learned for a total of {hours} hours and{" "}
                {minutes} minutes.</h1>
                {"\n"}
                {logList}
            </div>
        );
    }
}
