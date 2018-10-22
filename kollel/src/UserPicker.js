import React, { Component } from 'react';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import HourLog from './HourLog';
import HourRequest from './HourRequest';


export default class UserPicker extends Component{
    constructor(props){
        super(props);
        this.state = {
            logList: [],
            totals: {
                hours: 0,
                minutes: 0,
            },
            user: false,
            userList: [],
            currentEmail: ""

        };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleNewHours = this.handleNewHours.bind(this);
        this.renderCurrentHours = this.renderCurrentHours.bind(this);

    }
    handleNewHours(event){
        console.log(event.target.value);
    }
    handleChange(event){
        // console.log(event.target.value)
        const obj = JSON.parse(event.target.value);
        if (obj){
            // console.log(JSON.parse(event.target.value));
            this.setState({
                currentEmail: obj.email,
                currentId: obj.id,
                currentName: (obj.first_name + " " + obj.last_name),
                user: event.target.value,
            });
        }
        else{
            this.setState({
                user: false,
                currentEmail: "",
            });
        }
    }
    componentDidMount(){
        fetch('/api/getuserlist', {
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
                userList: response,
            });
        });
    }

    renderCurrentHours(){
        // console.log(this.state.user);
        if (this.state.user){
            // console.log("woot");
            return (
                <div>
                <HourLog id={this.state.currentId}
                    name={this.state.currentName}/>
                </div>
            );
        }
        return (
            <div>
            </div>
        );
    }
    renderRequestHours(){
        // console.log(this.state.user);
        if (this.state.user){
            // console.log("woot");
            return (
                <div>
                <HourRequest id={this.state.currentId}/>
                </div>
            );
        }
        return (
            <div>
            </div>
        );
    }

    render(){
        const options = this.state.userList.map((data)=>(
                <option key={data.id} value=
                    {JSON.stringify(data)}
                >
                    {data.first_name} {data.last_name}
                </option>
        ));
        const currentHours = this.renderCurrentHours();
        return(
            <div>
                <p></p>
                <h3>Choose a name to view hours:</h3>

          <Select
            native
            value={this.state.user}
            onChange={this.handleChange}
            name="user"
          >
            <option value={false} />
            {options}
          </Select>
          {this.state.currentEmail}
          {currentHours}
          {this.renderRequestHours()}
          <p>
          </p>
            </div>
        );
    }
}
