import React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';

export default function SimpleBreadcrumbs({children}) {

    function handleClick(event) {
        event.preventDefault();
        console.info('You clicked a breadcrumb.');
    }

    return (
        <div role="presentation" onClick={handleClick}>
            <Breadcrumbs aria-label="breadcrumb">
                {children}
            </Breadcrumbs>
        </div>
    )
}
