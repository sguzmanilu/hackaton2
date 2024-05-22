import React from 'react';
import { Button, CircularProgress } from '@mui/material';

export default function LoadingButton(props) {
    const { loading, children, ...rest } = props;
    return (
        <Button {...rest} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : children}
        </Button>
    )
}
