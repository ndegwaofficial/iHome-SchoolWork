import React from 'react';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import './addbusiness.css'

const AddBtn = (props) => {
    const LightTooltip = withStyles((theme) => ({
        tooltip: {
            // backgroundColor: theme.palette.common.white,
            backgroundColor: 'rgba(255,0,0,0.9)',
            color: 'rgb(0,255,53)',
            boxShadow: theme.shadows[1],
            fontSize: 15,
            padding: '8px',
            maxWidth: '150px',
            textAlign: 'center',
            
        },
    }))(Tooltip);
    return (
        <LightTooltip placement="top-end" open={props.open} title="Click here to add a new hostel to the map" arrow>
            <Fab className="floating-btn dott" color="#5ce1e6" style={{backgroundColor: 'rgba(255,0,0,0.6)', color: '#00ff35', border: '2px solid #5ce1e6'}} onClick={props.onClick} aria-label="add">
                <AddIcon />
            </Fab>
        </LightTooltip>

    );
}

export default AddBtn;