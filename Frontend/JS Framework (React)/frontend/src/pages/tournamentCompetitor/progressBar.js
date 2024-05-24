import React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { Typography } from '@mui/material';
import styles from './styles.module.css';

export default function ProgressBar({ name, value, completed }) {
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === value) {
                    return value;
                }
                const diff = Math.random() * 10;
                return Math.min(oldProgress + diff, value);
            });
        }, 100);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', marginTop: 1 }}>
            {/* <LinearProgress variant="determinate" value={progress} valueBuffer={100} /> */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" color="text.secondary">{name}</Typography>
                {completed && <img src='/ball-icon.png' alt='Reto' className={styles.challengeIcon} />}
            </div>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress color={completed ? 'primary' : 'error'} variant="determinate" value={progress} valueBuffer={100} />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body1" color="text.secondary">{`${Math.round(
                        progress,
                    )}%`}</Typography>
                </Box>
            </Box>
        </Box>
    );
}
