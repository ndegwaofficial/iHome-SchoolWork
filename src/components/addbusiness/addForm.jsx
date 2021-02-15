import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import SvgIcon from '@material-ui/core/SvgIcon';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';


import './addbusiness.css'


const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '100%',
            hintColor: '#00ff35',

        },

    },

    btn: {
        width: '40px',
        height: '40px',

        margin: '0px!important',
    },

    multilineColor:{
        color:'#fff'
    },

    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        color: '#00ff35',
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
        color: '#00ff35',
    },


}));



const AddForm = (props) => {

    const classes = useStyles();

    const [alert, setAlert] = useState({ display: false, msg: "" })
    const [formStage, setFormStage] = useState('basic')
    const [doneLoading, setDoneLoading] = useState(false)

    const handleFormClick = (stage) => {
        setFormStage(stage)
    }


    const isStoreValid = props.store.name && props.store.type && props.store.items.every(i => Object.values(i).every(v => v)) && props.store.items.length > 0;

    const handleStoreCreate = () => {
        setAlert({ display: false, msg: "" })
        if (isStoreValid) {
            const newStore = props.store;
            setDoneLoading(true)
            fetch('https://covid-19-shopping.herokuapp.com/newstore', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newStore)
            })
                .then(response => response.json())
                .then(res => {
                    if (res.id) {
                        setDoneLoading(false)
                        props.handleAddStore(res)
                    } else {
                        setAlert({ display: true, msg: res })
                        setDoneLoading(false)
                    }
                })
                .catch(() => {
                    setAlert({ display: true, msg: "An error has occured while trying to fetch" })
                    setDoneLoading(false)
                })

        } else {
            setAlert({ display: true, msg: "Please fill all the inputs before clicking Done" })
        }
    }



    if (formStage === 'basic') {
        return (
            <div className="form-wrapper">
                <main className="form pa4 black-80 dott"  style={{backgroundColor: 'rgba(0,0,0,0.7)', border: '2px solid #00ff35'}}>
                    <form className="measure-basic center" noValidate autoComplete="off" style={{color: '#00ff35'}}>
                        <fieldset id="basic-add-form" className="ba b--transparent ph0 mh0">
                            <legend className="f4 fw6 ph0 mh0" style={{textAlign: 'center'}}>Add Hostel</legend>

                            {alert.display && <div style={{ margin: 0, textAlign: 'center' }} className="alert alert-danger" role="alert">{alert.msg}</div>}

                            <div className={`mt3 ${classes.root}`} style={{color:'#00ff35'}} >
                                {/*<h5>Business Name</h5>*/}
                                {/*<TextField name="name" onChange={props.handleInputChange} value={props.store.name} style={{backgroundColor:'rgba(92,225,230,0.5)' }}  />*/}
                                {/*<input type="text" name="name" onChange={props.handleInputChange} value={props.store.name} style={{backgroundColor:'rgba(92,225,230,0.5)', margin: '0'}}/>*/}

                                <InputLabel style={{ color: '#00ff35', fontFamily: 'Rajdhani', fontWeight: '500', fontSize: '1em',}} >Hostel Name</InputLabel>

                                <input onChange={props.handleInputChange} value={props.store.name}  name="name" id="inputBiz" className="form-control" placeholder="" style={{background: 'rgba(0,0,0,0.8)', color: '#00ff35', border: '1px solid #00ff35', fontFamily: 'Rajdhani', fontWeight: '500', fontSize: '1em',}} required />
                                {/*<label htmlFor="inputBiz" style={{color: '#5ce1e6', fontFamily: 'Rajdhani', fontWeight: '500', fontSize: '1em',}}>Business Name</label>*/}
                            </div>
                            <div className={`mt3 ${classes.root}`} >
                                <FormControl className={classes.formControl}  style={{background: 'rgba(0,0,0,0.8)',border: '1px solid #00ff35',  color: '#00ff35', fontFamily: 'Rajdhani', fontWeight: '500', fontSize: '1em',}}>
                                    <InputLabel style={{ color: '#00ff35', fontFamily: 'Rajdhani', fontWeight: '500', fontSize: '1em',}} >Genders Allowed</InputLabel>
                                    <Select
                                        onChange={props.handleInputChange}
                                        value={props.store.type}
                                        name="type"
                                        style={{paddingLeft: '5px', color: '#00ff35', fontFamily: 'Rajdhani', fontWeight: '500', fontSize: '1em',}}
                                    >

                                        <MenuItem value={"Both Genders Allowed"} style={{background: 'rgba(0,0,0,0.8)', color: '#00ff35', fontFamily: 'Rajdhani', fontWeight: '500', fontSize: '1em',}}>
                                            Both Genders Allowed
                                        </MenuItem>

                                        <MenuItem value={"Gents Only"} style={{background: 'rgba(0,0,0,0.8)', color: '#00ff35', fontFamily: 'Rajdhani', fontWeight: '500', fontSize: '1em',}}>
                                            Gents Only
                                        </MenuItem>
                                        <MenuItem value={"Ladies Only"} style={{background: 'rgba(0,0,0,0.8)', color: '#00ff35', fontFamily: 'Rajdhani', fontWeight: '500', fontSize: '1em',}}>
                                            Ladies Only
                                        </MenuItem>

                                    </Select>
                                </FormControl>

                            </div>
                            <div className={`mt3 ${classes.root}`} style={{visibility: 'hidden'}}>
                                <TextField
                                    label="Geometric location"
                                    defaultValue={`lat: ${props.lat}, lng: ${props.lng}`}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    variant="outlined"

                                />


                            </div>
                        </fieldset>


                        {/* ////////////////////////////// */}



                    </form>

                    <div className="form-btn-wrapper">
                        <Button style={{ margin: '0px 10px', backgroundColor: 'rgba(0,0,0,0.8)', color:'#00ff35'}} onClick={props.onCancel} >Cancel</Button>
                        <Button className="" onClick={() => handleFormClick('items')} style={{ margin: '0px 10px',  backgroundColor: 'rgb(0,255,53)', color:'#000000'}} variant="contained" >Next</Button>
                    </div>

                </main>

            </div>

        )
    } else if (formStage === 'items') {
        return (
            <div className="form-wrapper" >
                <main className="form pa4 black-80 dott">
                    <legend className="f4 fw6 ph0 mh0 tc" style={{color: '#fff'}}>Add Products to your business</legend>

                    {alert.display && <div style={{ textAlign: 'center' }} className="alert alert-danger" role="alert">{alert.msg}</div>}

                    <form className={`measure center`} noValidate autoComplete="off">
                        <fieldset id="basic-add-form" className="ba b--transparent ph0 mh0">

                            {/* // THIS IS THE LINE */}


                            {
                                props.store.items.map((item, i) => {
                                    return (
                                        <div key={i} className={`mt3 item-input-wrapper`}>
                                            <TextField
                                                onChange={(e) => props.handleItemChange('unittype', e, i)}
                                                value={item.unittype}
                                                style={{ width: '100%', color:'#fff'}}
                                                label="Unit Type"
                                                // placeholder="Unit Type"
                                                InputProps={{
                                                    className: classes.multilineColor
                                                }}
                                                InputLabelProps={{
                                                    style: {
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        width: '100%',
                                                        color: '#fff'
                                                    } }}

                                            />


                                            <TextField
                                                onChange={(e) => props.handleItemChange('unitquantity', e, i)}
                                                value={item.unitquantity}
                                                style={{ width: '100%' }}
                                                label="No. of Units"
                                                // placeholder="No. of Units"

                                                InputProps={{
                                                    className: classes.multilineColor
                                                }}

                                                InputLabelProps={{
                                                    style: {
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        width: '100%',
                                                        color: '#fff'
                                                    } }}
                                            />


                                            <TextField
                                                onChange={(e) => props.handleItemChange('rent', e, i)}
                                                value={item.rent}
                                                style={{ width: '100%', marginRight:2 }}
                                                label="Price Per Month"
                                                // placeholder="Price Per Month"
                                                InputProps={{
                                                    className: classes.multilineColor
                                                }}

                                                InputLabelProps={{
                                                    style: {
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        width: '100%',
                                                        color: '#fff'
                                                    } }}

                                            />


                                            <span className={classes.btn}>
                                                <IconButton onClick={(e) => props.deleteItem(i, e)} aria-label="delete">
                                                    <SvgIcon style={{ color: 'red' }} >
                                                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                                    </SvgIcon>
                                                </IconButton>
                                            </span>

                                        </div>
                                    )
                                })
                            }


                        </fieldset>

                    </form>
                    <div style={{ width: '100%', marginTop: '5%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                        <Button style={{ backgroundColor: 'rgba(0,0,0,0.9)', color: 'white' }} onClick={props.addItem} variant="contained"> + Add more</Button>
                    </div>
                    <div className="form-btn-wrapper">
                        <Button style={{ margin: '0px 10px' }} onClick={props.onCancel} color="primary">Cancel</Button>
                        <Button style={{ margin: '0px 10px' }} onClick={() => handleFormClick('basic')} color="#00ff35">Back</Button>

                        <Button disabled={doneLoading} onClick={() => handleStoreCreate()} variant="contained" color="primary">
                            {doneLoading && <CircularProgress size={24} />}
                            {!doneLoading && "Done"}
                        </Button>
                        {/*  <Button disabled={props.btnLoading} onClick={() => props.handleFormClick('finish')} variant="contained" color="primary">
                            {props.btnLoading && <CircularProgress size={24} />}
                            {!props.btnLoading && "Done"}
                        </Button> */}
                    </div>
                </main>
            </div>


        )
    }


}

export default AddForm;
