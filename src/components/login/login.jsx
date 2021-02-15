import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import './login.css'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            loading: false,
            alert: false,
            alertMsg: "",
            remember: false
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleCheck = (e) => {

    }

    handleClick = () => {

        this.setState({ alert: false, alertMsg: "", loading: true })
        fetch('https://covid-19-shopping.herokuapp.com/login', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        })
            .then(response => response.json())
            .then(res => {
                if (res.id) {
                    this.props.routeChange('home');
                    this.props.loadUser(res, 'auth');
                    if (this.state.remember) {
                        localStorage.setItem('user', JSON.stringify(res))
                    }
                } else {
                    this.setState({ alert: true, alertMsg: res, loading: false })
                }
            })
            .catch(() => {
                this.setState({ alert: true, alertMsg: 'could not fetch to the server', loading: false })
            })
    }

    handleChecked = (e) => {
        this.setState({ remember: e.target.checked })
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                        <div className="card card-signin my-5" style={{background: 'rgba(0,0,0,0.8)', border: '2px solid #00FF35'}}>
                            <div className="dott">
                            <div className="card-body">
                                <h5 className="card-title text-center" style={{color: '#ffffff',  fontFamily: 'Rajdhani', fontWeight: '500', fontSize: '2em',}}>SIGN IN</h5>
                                {this.state.alert && <div className="alert alert-danger" role="alert">{this.state.alertMsg}</div>}
                                <form className="form-signin">
                                    <div className="form-label-group">
                                        <input onChange={this.handleChange} name="email" type="email" id="inputEmail" className="form-control" placeholder="Email address" style={{background: 'rgba(0,0,0,0.8)', color: '#00ff35', border: '1px solid #00FF35', fontFamily: 'Rajdhani', fontWeight: '500', fontSize: '1em',}} />
                                        <label htmlFor="inputEmail" style={{color: '#00ff35', fontFamily: 'Rajdhani', fontWeight: '500', fontSize: '1em',}}>Email address</label>
                                    </div>
                                    <div className="form-label-group">
                                        <input onChange={this.handleChange} name="password" type="password" id="inputPassword" className="form-control" placeholder="Password" style={{background: 'rgba(0,0,0,0.8)', color: '#00ff35', border: '1px solid #00FF35', fontFamily: 'Rajdhani', fontWeight: '500', fontSize: '1em',}} />
                                        <label htmlFor="inputPassword" style={{color: '#00ff35', fontFamily: 'Rajdhani', fontWeight: '500', fontSize: '1em',}}>Password</label>
                                    </div>
                                    <div className="custom-control custom-checkbox mb-3" >
                                        <input name="remember-me" id="remember-me" onChange={this.handleChecked} type="checkbox" style={{background: 'rgba(0,0,0,0.8)', color: '#00ff35', border: '1px solid #00FF35'}}/>
                                        <label style={{ cursor: 'default', marginLeft: '5px', userSelect: 'none' }} htmlFor="remember-me" style={{color: '#00ff35', fontFamily: 'Rajdhani', fontWeight: '500', fontSize: '1em',}}>Remember password</label>
                                    </div>
                                    <button disabled={this.state.loading} type="button" onClick={this.handleClick} className="btn btn-lg btn-primary btn-block text-uppercase"  style={{background: 'rgba(0,0,0,0.8)', color: '#00ff35', border: '1px solid #00FF35'}}>
                                        {this.state.loading && <CircularProgress style={{ color: "white" }} size={15} />}
                                        {!this.state.loading && "Sign In"}
                                    </button>
                                    <hr className="my-4" />
                                    <h6 onClick={() => this.props.routeChange('register')} style={{ textAlign: 'center', cursor: 'pointer', color: '#FFFFFF' ,  fontFamily: 'Rajdhani', fontWeight: '500', fontSize: '1.5em',}}>Register instead</h6>
                                </form>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;