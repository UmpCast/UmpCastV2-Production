import React, {Component} from "react"
import {Link, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import PropTypes from 'prop-types';
import {login} from "../../actions/auth";

import {Layout} from "../Layout";
import Input from "./Input";
import {Form} from "react-bootstrap";

class Login extends Component {
    state = {}

    static propTypes = {
        login: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.login(this.state.username, this.state.password)
    }

    onChange = (e, controlId) => {
        this.setState({[controlId]: e.target.value})
    }

    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to='/'/>
        }

        return (
            <Layout>
                <div style={{"width": "500px"}}>
                    <div className="card card-body mt-5">
                        <h2 className="text-center">Login</h2>
                        <Form noValidate onSubmit={this.handleSubmit}>
                            <Input label="Email"
                                   controlId="email"
                                   type="email"
                                   from="register" handle={this.onChange} required/>
                            <Input label="Password"
                                   controlId="password"
                                   type="password"
                                   from="register" handle={this.onChange} required/>
                            <div className="form-group">
                                <button type="submit" className="btn btn-primary">
                                    Login
                                </button>
                            </div>
                        </Form>
                        <p>
                            Don't have an account?
                            <Link to="/register"> Register</Link>
                        </p>
                    </div>
                </div>
            </Layout>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {login})(Login);