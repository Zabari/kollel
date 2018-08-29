import React, { Component } from 'react';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormControl from '@material-ui/core/FormControl';
import HourLog from './HourLog';

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
    }

    handleChange(event){
        console.log(JSON.parse(event.target.value));
        const obj = JSON.parse(event.target.value);
        this.setState({
            currentEmail: obj.email,
            currentId: obj.id,
            currentName: (obj.first_name + " " + obj.last_name),
            user: event.target.value,
        });
    }
    componentDidMount(){
        fetch('http://localhost:5000/getuserlist', {
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
        if (this.state.user){
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

    render(){
        const options = this.state.userList.map((data)=>(
                <option key={data.id} value=
                    {JSON.stringify(data)}
                >
                    {data.first_name} {data.last_name}
                </option>
        ));
        return(
            <div>

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
          {this.renderCurrentHours()}
            </div>
        );
    }
}
