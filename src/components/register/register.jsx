import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import '../login/login.css'

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            password: "",
            type: "visitor",
            loading: false,
            alert: false,
            alertMsg: ""
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })

    }

    handleClick = () => {

        this.setState({ alert: false, alertMsg: "", loading: true })
        fetch('https://covid-19-shopping.herokuapp.com/register', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
                name: this.state.name,
                type: this.state.type
            })
        })
            .then(response => response.json())
            .then(res => {
                if (res.id) {
                    this.props.loadUser(res, 'auth');
                    this.props.routeChange('home');
                    localStorage.setItem('user', JSON.stringify(res))
                } else {
                    this.setState({ alert: true, alertMsg: res, loading: false })
                }
            })
            .catch(() => {
                this.setState({ alert: true, alertMsg: 'could not fetch to the server', loading: false })
            })
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                        <div className="card card-signin my-5" style={{background: 'rgba(0,0,0,0.8)', border: '2px solid #00FF35'}}>
                            <div className="dott">
                            <div className="card-body">
                                <h5 className="card-title text-center" style={{color: '#fff',  fontFamily: 'Rajdhani', fontWeight: '500', fontSize: '2em',}}>REGISTER</h5>
                                {this.state.alert && <div className="alert alert-danger" role="alert">{this.state.alertMsg}</div>}
                                <form className="form-signin">
                                    <div className="form-label-group">
                                        <input onChange={this.handleChange} name="name" type="text" id="inputName" className="form-control" placeholder="Name" style={{background: 'rgba(0,0,0,0.8)', color: '#00ff35', border: '1px solid #00FF35', fontFamily: 'Rajdhani', fontWeight: '500', fontSize: '1em',}} required />
                                        <label htmlFor="inputName" style={{color: '#00ff35', fontFamily: 'Rajdhani', fontWeight: '500', fontSize: '1em',}}>Name</label>
                                    </div>
                                    <div className="form-label-group">
                                        <input onChange={this.handleChange} name="email" type="email" id="inputEmail" className="form-control" placeholder="Email address" style={{background: 'rgba(0,0,0,0.8)', color: '#00ff35', border: '1px solid #00FF35', fontFamily: 'Rajdhani', fontWeight: '500', fontSize: '1em',}} required />
                                        <label htmlFor="inputEmail" style={{color: '#00ff35', fontFamily: 'Rajdhani', fontWeight: '500', fontSize: '1em',}}>Email address</label>
                                    </div>
                                    <div className="form-label-group">
                                        <input onChange={this.handleChange} name="password" type="password" id="inputPassword" className="form-control" placeholder="Password" style={{background: 'rgba(0,0,0,0.8)', color: '#00ff35', border: '1px solid #00FF35', fontFamily: 'Rajdhani', fontWeight: '500', fontSize: '1em',}} required />
                                        <label htmlFor="inputPassword" style={{color: '#00ff35', fontFamily: 'Rajdhani', fontWeight: '500', fontSize: '1em',}}>Password</label>
                                    </div>
                                    <div className="form-label-group select" style={{background: 'rgba(0,0,0,0.8)', color: '#00ff35'}}>
                                        <FormControl style={{ color: '#00ff35', margin: '0'}}>
                                            <InputLabel style={{color: '#00ff35', fontSize: '1em', fontFamily: 'Rajdhani', fontWeight: '500', }}>User Type</InputLabel>
                                            <Select
                                                onChange={this.handleChange}
                                                name="type"
                                                value={this.state.type}
                                                style={{color: '#00ff35', fontFamily: 'Rajdhani', fontWeight: '500', fontSize: '1em',}}
                                            >
                                                <MenuItem style={{background: 'rgba(0,0,0,0.8)', color: '#00ff35', fontFamily: 'Rajdhani', fontWeight: '500', fontSize: '1em', margin: '0'}} value={"visitor"}>Buyer (standard)</MenuItem>
                                                <MenuItem style={{background: 'rgba(0,0,0,0.8)', color: '#00ff35', fontFamily: 'Rajdhani', fontWeight: '500', fontSize: '1em', margin: '0'}} value={"business"}>Seller (business)</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>

                                    <button disabled={this.state.loading} type="button" onClick={this.handleClick} className="btn btn-lg btn-primary btn-block text-uppercase" style={{background: 'rgba(0,0,0,0.8)', color: '#00ff35', border: '1px solid #00FF35'}}>
                                        {this.state.loading && <CircularProgress  size={15} />}
                                        {!this.state.loading && "Register"}</button>
                                    <hr className="my-4" />
                                    <h6 onClick={() => this.props.routeChange('login')} style={{ textAlign: 'center', cursor: 'pointer', color: '#FFFFFF',  fontFamily: 'Rajdhani', fontWeight: '500', fontSize: '1.5em', }}>Sign in instead</h6>
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

export default Register;
