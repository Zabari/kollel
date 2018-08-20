import React, { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import App from './App';

class LoginForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            email: "",
            password: "",
            passwordError: false,
            emailError: false,
        };
    }
    handleClick = event => {
        if (!this.state.email){
            this.setState({emailError: true});
        }
        else {
            this.setState({emailError: false});
        }
        if (!this.state.password){
            this.setState({passwordError: true});
        }
        else {
            this.setState({passwordError: false});
        }
    }
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };
    render = () => {
        // let test = TextField({id:"dope", label:"Dope"});
        return (
            <div>
            <Grid
                container
                direction="column"
                justify="flex-start"
                alignItems="center"
                style={{ minHeight: '100vh' }}
            >
                <TextField
                    id="email"
                    label="E-mail"
                    value={this.state.email}
                    error={this.state.emailError}
                    onChange={this.handleChange('email')}
                    margin="normal"
                />
                <TextField
                    id="password"
                    label="Password"
                    value={this.state.password}
                    error={this.state.passwordError}
                    onChange={this.handleChange('password')}
                    type="password"
                    margin="normal"
                />
                <p></p>
                <Button
                    variant="contained"
                    fullWidth={true}
                    onClick={this.handleClick}
                >
                    Sign In
                </Button>
            </Grid>
            </div>
        );
    }
}
export default LoginForm;
