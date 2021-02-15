import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import ProfileMenu from './profile/profile.jsx'
import './header.css'



const drawerWidth = 300;
const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
        // background: 'rgba(0,0,0,0.8)',

    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
    sectionDesktop: {
        display: 'flex',
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        // backgroundColor: 'rgba(0,0,0,0.7)',

    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: 'rgb(0,255,53)',
        border: '2px solid #5ce1e6',
        marginTop: '5%',

    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
        // backgroundColor: 'rgba(0,0,0,0.7)',
        // background: 'url("assets/images/dott.png") repeat 0px 0px',
        // backgroundsize: '2px'

},
    form: {
        '& > *': {
            margin: theme.spacing(0, 2)
        },

    }

}));

const Header = (props) => {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null)

    const [open, setOpen] = React.useState(false);
    const [profilePic, setProfilePic] = React.useState(props.pic)
    const [password, setPassword] = React.useState({ currentPw: "", newPw: "", newPwConfirm: "" })
    const [saveLoading, setSaveLoading] = React.useState(false)
    const [updateLoading, setUpdateLoading] = React.useState(false)


    const [imgUrl, setImgUrl] = React.useState('')
    const [alert, setAlert] = React.useState({ display: false, msg: "", variant: "" })
    const isMenuOpen = Boolean(anchorEl);







    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
        if (props.tipbox) {
            props.tipBoxClose()
        }
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };


    const saveDisabled = saveLoading || imgUrl === '' || updateLoading;
    const UpdateDisabled = saveLoading || updateLoading || password.currentPw === '' || password.newPw === '' || password.newPwConfirm === '' || password.newPw !== password.newPwConfirm;



    const handleDrawerOpen = () => {
        setOpen(true);
        handleMenuClose()
    };

    const handleDrawerClose = () => {
        setOpen(false);
        setPassword({ currentPw: "", newPw: "", newPwConfirm: "" })
        setImgUrl('')
        setAlert({ display: false, msg: "", variant: "" })
    };


    const handleUrlChange = (e) => {
        setImgUrl(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setPassword({ ...password, [e.target.name]: e.target.value })
    }

    const onSignOut = () => {
        handleMenuClose()
        props.onSignOut();
    }

    const routeChange = (route) => {
        handleMenuClose()
        props.routeChange(route)
    }

    const handleUpdatePic = () => {
        setAlert({ display: false, msg: "", variant: "" })
        setSaveLoading(true)
        const { name, email, id, type, joined } = props.user
        const UpdatingUser = {
            name,
            email,
            id,
            type,
            joined,
            pic: imgUrl
        }
        fetch('https://covid-19-shopping.herokuapp.com/newpicture', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(UpdatingUser)
        })
            .then(res => res.json())
            .then(res => {
                if (res.id) {
                    setProfilePic(res.pic)
                    setAlert({ display: true, msg: "Your profile pic has been updated successfully!", variant: "success" })
                    setProfilePic(res.pic);
                    setSaveLoading(false);
                    setImgUrl('')
                    props.loadUser(res, 'update');
                    localStorage.setItem('user', JSON.stringify(res))
                } else {
                    setAlert({ display: true, msg: res, variant: "danger" })
                    setSaveLoading(false)
                }
            })
            .catch(err => {
                setAlert({ display: true, msg: "request failed!", variant: "danger" })
                setSaveLoading(false)
            })
    }


    const handleUpdatePassword = () => {
        setAlert({ display: false, msg: "", variant: "" })
        const info = {
            email: props.user.email,
            password: password.currentPw,
            newPassword: password.newPw
        }
        if (password.newPw === password.newPwConfirm) {
            setUpdateLoading(true)
            fetch('https://covid-19-shopping.herokuapp.com/newpassword', {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(info)
            })
                .then(res => res.json())
                .then(res => {
                    if (res === 'success') {
                        setAlert({ display: true, msg: "Your account's password has been updated successfully!", variant: "success" })
                        setUpdateLoading(false)
                        setPassword({ currentPw: "", newPw: "", newPwConfirm: "" })
                    } else {
                        setAlert({ display: true, msg: res, variant: "danger" })
                        setUpdateLoading(false)
                        setPassword({ currentPw: "", newPw: "", newPwConfirm: "" })
                    }
                })
                .catch(() => {
                    setAlert({ display: true, msg: 'error, please try again later!', variant: "danger" })
                    setUpdateLoading(false)
                    setPassword({ currentPw: "", newPw: "", newPwConfirm: "" })
                })
        }
    }




    return (
        <div className={classes.grow} >
            {/*<AppBar position="static" style={{ background: 'rgb(4,58,11)' }}>*/}
            <AppBar position="static" style={{ background: 'rgb(0,0,0,0.9)' }}>
                <div className="dott">
                <Toolbar>
                    <Typography className={classes.title} style={{marginLeft: '40%'}}variant="h6"  noWrap>
                        <><span style={{color : '#fff', fontFamily: 'Rajdhani', fontWeight: '700', fontSize: '2em', }}>iHome</span> <span  style={{color : '#fe0023', fontFamily: 'Rajdhani', fontWeight: '100', fontSize: '0.5em', }}>  House Searching Made Easier </span></>
                    </Typography>
                    {props.signedIn && (

                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <InputBase
                                onChange={(e) => props.handleSearch(e)}
                                placeholder="Search for Hostels"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                inputProps={{ 'aria-label': 'search' }}

                                style={{ background: 'rgb(0,0,0,0.9)' , color: '#fff', border: '1px solid #fff', fontFamily: 'Rajdhani', fontWeight: '500', fontSize: '1em',}}
                            />

                        </div>

                    )}

                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>



                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-controls="interaction-menu"
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>

                        <ProfileMenu style={{ backgroundColor: 'rgba(0,0,0,0.8)' }} signedIn={props.signedIn} isMenuOpen={isMenuOpen} handleMenuClose={handleMenuClose} anchorEl={anchorEl} onProfileOpen={handleDrawerOpen} onSignOut={onSignOut} routeChange={routeChange} />

                    </div>

                </Toolbar>
                </div>
            </AppBar>

            {props.signedIn && (
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="top"
                    open={open}
                    classes={{
                        paper: classes.drawerPaper,
                    }}

                    style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}

                >
                    <div className="dott" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className={classes.drawerHeader} >
                        <h5 style={{color: '#00ff35', fontFamily: 'Rajdhani', fontWeight: '700', fontSize: '1.2em',}}>iHome <span  style={{color : '#fe0023', fontFamily: 'Rajdhani', fontWeight: '100', fontSize: '0.5em', }}>  House Searching Made Easier </span></h5>
                        <IconButton onClick={handleDrawerClose} style={{color: '#00ff35'}}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </div>
                    </div>
                    <Divider />
                    <div className="profile-header dott" style={{ backgroundColor: 'rgba(0,0,0,0.5)', margin: '0' }}>
                        <span style={{color: '#00ff35', fontFamily: 'Rajdhani', fontWeight: '700', fontSize: '1em',}}>YOUR PROFILE</span>
                    </div>
                    {/*<Divider />*/}
                    {alert.display && <div style={{ margin: 0, textAlign: 'center' }} className={`alert alert-${alert.variant}`} role="alert">{alert.msg}</div>}
                    {/*<Divider />*/}
                    <div className="profile-img-wrapper dott" style={{ backgroundColor: 'rgba(0,0,0,0.5)', margin: '0' }}>
                        <div className="profile-img" style={{ backgroundImage: `url(${profilePic})` }}></div>
                        <div>
                            <span className="profile-name" style={{color: '#00ff35', fontFamily: 'Rajdhani', fontWeight: '700', fontSize: '1em',}}>{props.user.name}</span>
                        </div>
                        <div>
                            <span className="profile-email" style={{color: '#00ff35', fontFamily: 'Rajdhani', fontWeight: '700', fontSize: '1em',}}>{props.user.email}</span>
                        </div>
                    </div>
                    <Divider />
                    <div className="profile-header dott" style={{ backgroundColor: 'rgba(0,0,0,0.5)', margin: '0' }}>
                        <span style={{color: '#00ff35', fontFamily: 'Rajdhani', fontWeight: '700', fontSize: '1em',}}>Settings</span>
                    </div>
                    {/*<Divider />*/}
                    <div className="profile-padding dott" style={{ backgroundColor: 'rgba(0,0,0,0.5)', margin: '0' }}>
                        <span style={{color: '#00ff35', fontFamily: 'Rajdhani', fontWeight: '700', fontSize: '1em',}}>Update your profile picture</span>
                        <TextField value={imgUrl} onChange={handleUrlChange} style={{ width: '80%',color: '#00ff35', fontFamily: 'Rajdhani', fontWeight: '700', fontSize: '1em', }} label="Image link" variant="standard" style={{color: '#00ff35', fontFamily: 'Rajdhani', fontWeight: '700', fontSize: '1em',}}/>
                        <IconButton color="primary" disabled={saveDisabled} onClick={handleUpdatePic} aria-label="save">
                            {saveLoading && <CircularProgress style={{ color: "#00ff35" }} size={20} />}
                            {!saveLoading && <SaveIcon />}

                        </IconButton>
                    </div>
                    <Divider />
                    <div className="profile-padding dott" style={{ backgroundColor: 'rgba(0,0,0,0.5)', margin: '0' }}>
                        <span style={{color: '#00ff35', fontFamily: 'Rajdhani', fontWeight: '700', fontSize: '1em', textAlign: 'center'}}>Update your password</span>
                        <form style={{color: '#00ff35', fontFamily: 'Rajdhani', fontWeight: '700', fontSize: '1em',}}>
                            <TextField value={password.currentPw} type="password" name="currentPw" onChange={handlePasswordChange} style={{ width: '95%',color: '#00ff35', fontFamily: 'Rajdhani', fontWeight: '700', fontSize: '1em', }} label="Current password" variant="standard" />
                            <TextField value={password.newPw} type="password" name="newPw" onChange={handlePasswordChange} style={{ width: '95%', color: '#00ff35', fontFamily: 'Rajdhani', fontWeight: '700', fontSize: '1em', }} label="New password" variant="standard" />
                            <TextField value={password.newPwConfirm} type="password" name="newPwConfirm" onChange={handlePasswordChange} style={{ width: '95%', color: '#00ff35', fontFamily: 'Rajdhani', fontWeight: '700', fontSize: '1em', }} label="Confirm new password" />
                            <div className="pw-btn-wrapper">
                                <Button type="button" disabled={UpdateDisabled} onClick={handleUpdatePassword} className="password-submit" variant="contained" color="primary">
                                    {updateLoading && <CircularProgress size={20} />}
                                    {!updateLoading && "Update"}
                                </Button>
                            </div>
                        </form>

                    </div>

                    <Divider />

                </Drawer>

            )}

        </div>
    );
}

export default Header;