import React from 'react';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

export default function Bread({isHome, isLast, link, title}) {

    const navigate = useNavigate();

    if (isLast) {
        return (
            <Typography
                sx={{ display: 'flex', alignItems: 'center' }}
                color="text.primary"
            >
                {isHome ? <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" /> : null}
                {title}
            </Typography>
        )
    }

    return (
        <Link
            underline="hover"
            sx={{ display: 'flex', alignItems: 'center' }}
            color="inherit"
            onClick={() => navigate(link)}
            href={link}
        >
            {isHome ? <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" /> : null}
            {title}
        </Link>
    )
}
