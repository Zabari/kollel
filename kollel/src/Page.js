import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import BasicExample from './BasicExample';
import FormControl from '@material-ui/core/FormControl';
import LoginForm from './LoginForm';
import App from './App';
import Login from './Login';





// const customButton = Button(
//     {
//         variant: "outlined",
//         className = "Welcomebutton",
//     }
// );

class HomePage extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <div className="Front-page">
            <header className="Welcomebanner">
                Welcome to Kollel!
            </header>
            <Grid
                container
                direction="row"
                justify="space-evenly"
                alignItems="center"
                style={{ minHeight: '100vh' }}
            >

                <Login callback={this.props.authenticateUser}/>


                <Link to="929" style={{ textDecoration: 'none' }}>
                <Button variant="contained" className="Welcomebutton"  >
                    929 Tanach
                </Button>
                </Link>
                <Link to="about" style={{ textDecoration: 'none' }}>
                <Button variant="contained" className="Welcomebutton"  >
                    About Us
                </Button>
                </Link>
            </Grid>
            </div>
        );
    }
}
const LoginPage = () => (
    <div>
    <Grid
        container
        direction="column"
        justify="space-evenly"
        alignItems="center"
    >
    <h1>Login</h1>
    <LoginForm/>
    </Grid>
    </div>
)
const About = () => (
    <h1>About</h1>
)
const Tanach = () => (
    <h1>929</h1>
)
class Page extends Component {
    constructor(props){
        // console.log(super());
        super(props);
        console.log("hey");
        // super(props);
        // super.constructor();
    }
    render() {
        // console.log(BasicExample);
        // console.log(classes.button);
        return (
            <div>
                <Router>
                <div>
                    <Route exact path="/" render={()=>(<HomePage authenticateUser={this.props.authenticateUser}/>)}/>
                    <Route path="/login" component={LoginPage}/>
                    <Route path="/about" component={About}/>
                    <Route path="/929" component={Tanach}/>
                </div>
                </Router>
            </div>
        );
    }
}


export default Page;
