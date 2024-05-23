import React, { useEffect, useState } from 'react';
import { Grid, IconButton, Paper } from '@mui/material';
import SimpleBreadcrumbs from '../../components/breadCums';
import Bread from '../../components/breadCums/bread';
import HeaderBar from '../../components/headerBar';
import { useNavigate, useParams } from 'react-router-dom';
import ViewListIcon from '@mui/icons-material/ViewList';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { toast } from "react-toastify";
import api from "../../utils/api";
import CardCompetitor from './cardCompetitor';

export default function TournamentResume(props) {

  const [tournament, setTournament] = useState(null);
  const [competitors, setCompetitors] = useState([]);
  const { tournamentId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getTournament();
    getCompetitors();
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

  const getCompetitors = () => {
    api.Get(`tournament-resume/${tournamentId}`)
      .then((response) => {
        setCompetitors(response.data)
      })
      .catch((e) => {
        toast.error("Error al cargar los competidores");
      })
  }

  return (
    <Grid container spacing={3}>
      <HeaderBar
        title='Torneos'
        showButton
        buttonTitle='Evaluar Retos'
        buttonAction={() => null}
        customComponent={
          <div>
            <IconButton onClick={() => navigate(`/tournament/${tournamentId}`)}>
              <ViewListIcon />
            </IconButton>
            <IconButton color='primary' onClick={() => navigate(`/tournament/${tournamentId}/dashboard`)}>
              <DashboardIcon />
            </IconButton>
          </div>
        }
      />
      <Grid container item>
        <SimpleBreadcrumbs>
          <Bread isHome title={'Listado de Torneos'} link='/' />
          <Bread isLast title={tournament ? tournament.name : ''} />
        </SimpleBreadcrumbs>
      </Grid>
      <Grid container item>
        {/* Renderizar los competidores */}
        {competitors.map((competitor) => (
          <CardCompetitor
            key={competitor.id}
            id={competitor.id}
            user={competitor.user}
            kiLevel={competitor.ki_level}
            character={competitor.character}
            totalChallenges={competitor.total_challenges}
          />
        ))}
      </Grid>
    </Grid>
  )
}
