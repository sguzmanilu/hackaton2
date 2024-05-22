import React from "react";
import { Grid, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function HeaderBar({ title, showButton, buttonTitle, buttonAction }) {
    return (
        <Grid container item direction='row' spacing={3} justifyContent='space-between'>
            <Grid item >
                <Typography variant="h4" component="h1">{title}</Typography>
            </Grid>
            {showButton && (
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={buttonAction}
                        startIcon={<AddIcon />}
                    >
                        {buttonTitle}
                    </Button>
                </Grid>
            )}
        </Grid>
    )

}
