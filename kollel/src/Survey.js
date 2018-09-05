import React, { Component } from 'react';
import './App.css';
import Radio from '@material-ui/core/Radio';
import Button from '@material-ui/core/Button';


export default class Survey extends Component {
    constructor(props){
        super(props);
        this.state = {
            error: "",
            planList: [false, false, false, false, false],
            chevrutaList: [false, false, false, false, false],
            planChoice: false,
            chevrutaChoice: false,
            chevrutaChoices: [
                "Based on topic.",
                "Based on time.",
                "I’ll shoot you an email with my specific preferences.",
                "I would not like a chevruta.",
            ],
            planChoices: [
                "3 hours a week.",
                "6 hours a week.",
                "10 hours a week.",
                "I can’t commit to hours but I’d like a chevruta.",
                "I can’t commit to hours and would not like a chevruta.",
            ],

        }
        this.handlePlan = this.handlePlan.bind(this);
        this.handleChevruta = this.handleChevruta.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);


    }
    handleSubmit(){
        if ((this.state.planChoice)){
            fetch('/api/submitsurvey', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:3000'
                },
                credentials: "include",
                body: JSON.stringify({"hours": this.state.planChoice, "chevruta": this.state.chevrutaChoice}),
            }).then((response) => {
                return response.json();
            }).then((response) => {
                window.location.reload();
            });

        }
        else{
            alert("Please complete all fields before submitting.");
            // this.setState({
            //     error: "Please complete all fields before submitting."
            // });
        }

    }
    handlePlan(event){
        const obj = JSON.parse(event.target.value);
        const newList = this.state.planList.map(
            (val, i)=>{
                return i===obj.index;
            });
        this.setState({
            planList: newList,
            planChoice: this.state.planChoices[obj.index],
        });
    }
    handleChevruta(event){
        const obj = JSON.parse(event.target.value);
        const newList = this.state.chevrutaList.map(
            (val, i)=>{
                return i===obj.index;
            });
        this.setState({
            chevrutaList: newList,
            chevrutaChoice: this.state.chevrutaChoices[obj.index],
        });
    }
    render(){
        // const error = this.state.error;
            return (
                <div>
                    Choose a weekly plan:
                    <p>
                    <Radio value={JSON.stringify({index: 0, hours: 3})}
                        checked={this.state.planList[0]}
                        onChange={this.handlePlan}/>
                        3 hours a week
                    </p>
                    <p>
                    <Radio value={JSON.stringify({index: 1, hours: 6})}
                        checked={this.state.planList[1]}
                        onChange={this.handlePlan}/>
                        6 hours a week
                    </p>
                    <p>
                    <Radio value={JSON.stringify({index: 2, hours: 10})}
                        checked={this.state.planList[2]}
                        onChange={this.handlePlan}/>
                        10 hours a week
                    </p>
                    <p>
                    <Radio value={JSON.stringify({index: 3, hours: 0})}
                        checked={this.state.planList[3]}
                        onChange={this.handlePlan}/>
                        I can’t commit to hours but I’d like a chevruta.
                    </p>
                    <p>
                    <Radio value={JSON.stringify({index: 4, hours: 0})}
                        checked={this.state.planList[4]}
                        onChange={this.handlePlan}/>
                        I can’t commit to hours and would not like a chevruta.
                        </p>


                    <Button onClick={this.handleSubmit} variant="contained">
                        Submit
                    </Button>
                    <p></p>
                    {this.state.error}
                </div>
            );
    }
}

// I would like to be paired with a chevruta:
// <p>
// <Radio value={JSON.stringify({index: 0, hours: 3})}
//     checked={this.state.chevrutaList[0]}
//     onChange={this.handleChevruta}/>
//     Based on topic.
// </p>
// <p>
// <Radio value={JSON.stringify({index: 1, hours: 6})}
//     checked={this.state.chevrutaList[1]}
//     onChange={this.handleChevruta}/>
//     Based on time.
// </p>
// <p>
// <Radio value={JSON.stringify({index: 2, hours: 10})}
//     checked={this.state.chevrutaList[2]}
//     onChange={this.handleChevruta}/>
//     I’ll shoot you an email with my specific
//     preferences.
// </p>
// <p>
// <Radio value={JSON.stringify({index: 3, hours: 0})}
//     checked={this.state.chevrutaList[3]}
//     onChange={this.handleChevruta}/>
//     I would not like a chevruta.
// </p>
