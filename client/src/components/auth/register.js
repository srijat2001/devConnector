import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import classnames from 'classnames';
import {connect} from 'react-redux';
import {registerUser} from '../../actions/authAction';
import PropTypes from 'prop-types';


class register extends Component {
    constructor(){
        super();
        this.state = {
            name : '',
            email : '',
            password :'',
            password2 :'',
            errors : {}
        };
        this.onChange = this.onChange.bind(this);
    }
    onChange(e){
        this.setState({[e.target.name] : e.target.value});
    }
    onSubmit(event){
        event.preventDefault();
        const newUser = {
            name : this.state.name,
            email : this.state.email,
            password : this.state.password,
            password2 : this.state.password2
        }
        this.props.registerUser(newUser);
        /*axios.post('/api/users/register',newUser)
          .then(res => console.log(res.data))
          .catch(err => this.setState({errors : err.response.data}))*/
    }
    render() {
        const {errors} = this.state;
        const {user} = this.props.auth;
        return (
                <div className="container">
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
      <form noValidate className="form" onSubmit={this.onSubmit.bind(this)}>
        <div className="form-group">
          <input 
            type="text" 
            placeholder="Name" 
            name="name" 
            className={classnames('form-control form-control-lg',{
              'is-invalid' : errors.name
            })}
            value = {this.state.name}
            onChange = {this.onChange}
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
        </div>
        <div className="form-group">
          <input 
            type="email" 
            placeholder="Email Address" 
            name="email"
            className={classnames('form-control form-control-lg',{
              'is-invalid' : errors.email
            })}
            value = {this.state.email}
            onChange = {this.onChange} />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          <small className="form-text"
            >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small
          >
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            className={classnames('form-control form-control-lg',{
              'is-invalid' : errors.password
            })}
            value = {this.state.password}
            minLength="6"
            onChange = {this.onChange}
          />
           {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            className={classnames('form-control form-control-lg',{
              'is-invalid' : errors.password2
            })}
            value = {this.state.password2}
            minLength="6"
            onChange = {this.onChange}
          />
          {errors.password2 && (
              <div className="invalid-feedback">{errors.password2}</div>
            )}
        </div> 
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </div>   
        )
    }
}
register.propTypes = {
  auth: PropTypes.object.isRequired,
  registerUser: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  auth : state.auth
})
export default connect(null,{registerUser})(register);
