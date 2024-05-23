import React from 'react';
import { Avatar, Grid, Paper, Typography, IconButton } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import styles from './styles.module.css';

export const ChallengesRender = ({ totalChallenges }) => {
  const challenges = Array.from({ length: totalChallenges }, (v, i) => i);
  console.log('challenges', challenges)

  // REnderizar hasta un maximo de 10 iconos
  let challengesRender = challenges;
  if (challengesRender.length > 10) challengesRender = challengesRender.slice(0, 10);
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {challengesRender.map((i) => (
        <img src='/ball-icon.png' alt='Reto' className={styles.challengeIcon} />
      ))}
      {challenges.length > 10 && <MoreHorizIcon fontSize='large' sx={{ marginLeft: 2 }} />}
    </div>
  )
}

export default function CardCompetitor({ id, user, kiLevel, character, totalChallenges, onClick }) {
  return (
    <Grid
      className={`${styles.card} animate__animated animate__bounce`}
      item
      sm={12}
      component={Paper}
      style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}
      onClick={onClick}
    >
      <div className={styles.cardRow}>
        <div className={styles.cardAvatar}>
          <Avatar>{user.name[0]}</Avatar>
        </div>
        <div className={styles.cardCompetitor}>
          <Typography variant='h6'>{user.name}</Typography>
          <Typography variant='subtitle1'>Ki: {kiLevel}</Typography>
        </div>
        <div className={styles.challengesIcons}>
          <ChallengesRender totalChallenges={totalChallenges} />
        </div>
          <ArrowForwardIosIcon color='info' />
      </div>
    </Grid>
  )
}