import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import classnames from 'classnames';

class login extends Component {
    constructor(){
        super();
        this.state = {
            email : '',
            password :'',
            errors : {}
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onChange(e) {
        this.setState({[e.target.name] : e.target.value})
    }
    onSubmit(e){
        e.preventDefault();
        const User = {
            email : this.state.email,
            password : this.state.password
        };
        axios.post('/api/users/login',User)
          .then(res => console.log(res.data))
          .catch(err => this.setState({errors : err.response.data}))
    }
    render() {
        const {errors} = this.state;
        return (
                <div className="container">
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead"><i className="fas fa-user"></i> Sign into Your Account</p>
      <form noValidate className="form" onSubmit={this.onSubmit}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            className={classnames('form-control form-control-lg',{
                'is-invalid' : errors.email
            })}
            value={this.state.email}
            onChange={this.onChange}
          />
          {errors.email && (
               <div className="invalid-feedback">{errors.email}</div>
          )}
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            className={classnames('form-control form-control-lg',{
                'is-invalid' : errors.password
            })}
            value={this.state.password}
            onChange={this.onChange}
          />
          {errors.password && (
               <div className="invalid-feedback">{errors.password}</div>
          )}
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>    
        </div>
        )
    }
}

export default login;
