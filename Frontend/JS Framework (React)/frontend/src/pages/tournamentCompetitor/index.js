import React, { useEffect, useState } from 'react';
import { Grid, IconButton, Paper, Typography } from '@mui/material';
import SimpleBreadcrumbs from '../../components/breadCums';
import Bread from '../../components/breadCums/bread';
import HeaderBar from '../../components/headerBar';
import { useNavigate, useParams } from 'react-router-dom';
import ViewListIcon from '@mui/icons-material/ViewList';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { toast } from "react-toastify";
import styles from './styles.module.css';
import api from "../../utils/api";
import ProgressBar from './progressBar';
import { ChallengesRender } from '../tournamentResume/cardCompetitor';


export default function TournamentCompetitor(props) {
  const [tournament, setTournament] = useState(null);
  const [competitor, setCompetitor] = useState(null);
  const { tournamentId, competitorId } = useParams();
  const navigate = useNavigate();


  useEffect(() => {
    getTournament();
    getCompetitor();
  }, [tournamentId]);

  const getTournament = () => {
    api.Get(`tournament/${tournamentId}`)
      .then((response) => {
        setTournament(response.data)
      })
      .catch((e) => {
        toast.error("Error al cargar torneos");
      })
  }

  const getCompetitor = () => {
    api.Get(`tournament-detail/${competitorId}`)
      .then((response) => {
        setCompetitor(response.data)
      })
      .catch((e) => {
        toast.error("Error al cargar el competidor");
      })
  }

  return (
    <Grid container spacing={3}>
      <HeaderBar
        title='Torneos'
      />
      <Grid container item>
        <SimpleBreadcrumbs>
          <Bread isHome title={'Listado de Torneos'} link='/' />
          <Bread title={tournament ? tournament.name : ''} link={`/tournament/${tournamentId}/dashboard`} />
          <Bread isLast title={competitor ? competitor.user.name : ''} />
        </SimpleBreadcrumbs>
      </Grid>
      <Grid container item className={styles.mainCard}>
        <Grid item md={6} component={Paper} className={styles.characterCard}>
          <img
            className={`animate__animated animate__pulse animate__infinite	infinite ${styles.characterImg}`}
            src={competitor?.character?.image} alt={competitor?.character?.name}
          />
        </Grid>
        <Grid
          item
          direction='column'
          xs={12} md={6}
          sx={{ paddingLeft: { xs: 0, md: '1rem'}, marginTop: { xs: '1rem', md: 0 } }}
        >
          <Grid container direction='column' component={Paper} style={{ padding: '1rem' }}>
            <Typography variant='h6'>Información del Competidor</Typography>
            <Typography variant='body1'>Nombre: {competitor ? competitor.user.name : ''}</Typography>
            <Typography variant='subtitle1'>Personaje: {competitor ? competitor.character?.name : ''}</Typography>
            <Typography variant='subtitle1'>Ki: {competitor ? competitor.ki_level : ''}</Typography>
          </Grid>
          <Grid container direction='column' component={Paper} style={{ padding: '1rem', marginTop: '1rem' }}>
            <Typography variant='h6'>Esferas Obtenidas</Typography>
            <ChallengesRender totalChallenges={competitor ? competitor.total_challenges : 0} />
          </Grid>
          <Grid container direction='column' component={Paper} style={{ padding: '1rem', marginTop: '1rem' }}>
            <Typography variant='h6'>Retos Asignados</Typography>
            {competitor && competitor.challenges.map((challenge, index) => (
              <ProgressBar
                key={index}
                value={challenge.score}
                name={challenge.challenge?.name}
                completed={challenge.completed}
              />
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
