import React from "react";
import { Grid, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import styles from './styles.module.css';

export default function HeaderBar({ title, showButton, buttonTitle, buttonAction, customComponent }) {
    return (
        <Grid container item direction='row' spacing={3} justifyContent='space-between'>
            <Grid item >
                <Typography variant="h4" component="h1">{title}</Typography>
            </Grid>
            {showButton && (
                <Grid item direction='row'>
                    <div style={{ display: 'flex' }}>
                        {customComponent && (
                            <div style={{ marginRight: 1 }}>
                                {customComponent}
                            </div>
                        )}
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={buttonAction}
                            startIcon={<AddIcon />}
                        >
                            {buttonTitle}
                        </Button>
                    </div>
                </Grid>
            )}
        </Grid>
    )

}
