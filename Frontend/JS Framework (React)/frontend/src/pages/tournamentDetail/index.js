import React, { useEffect, useState } from 'react';
import { Grid, IconButton } from '@mui/material';
import { toast } from "react-toastify";
import SimpleBreadcrumbs from '../../components/breadCums';
import Bread from '../../components/breadCums/bread';
import HeaderBar from '../../components/headerBar';
import TransitionsModal from '../../components/dialogs/modal';
import CompetitorsGrid from './competitorsGrid';
import { useNavigate, useParams } from 'react-router-dom';
import CompetitorForm from './competitorForm';
import ChallengeForm from './challengesForm';
import api from "../../utils/api";
import ScoreChallengesForm from './scoreChallengesForm';
import ViewListIcon from '@mui/icons-material/ViewList';
import DashboardIcon from '@mui/icons-material/Dashboard';

const TournamentDetail = (props) => {

  const [modalCompetitorsForm, setModalCompetitorsForm] = useState(false);
  const [modalChallengesForm, setModalChallengesForm] = useState(false);
  const [modalScoresForm, setModalScoresForm] = useState(false);
  const [tournament, setTournament] = useState(null);
  const [competitors, setCompetitors] = useState([]);
  const [item, setItem] = useState(null);
  
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
    api.Get(`competitor/${tournamentId}`)
      .then((response) => {
        setCompetitors(response.data)
      })
      .catch((e) => {
        toast.error("Error al cargar participantes");
      })
  }

  const handleChallenges = (competitor) => {
    setItem(competitor);
    setModalChallengesForm(true);
  }

  const handleScores = (competitor) => {
    setItem(competitor);
    setModalScoresForm(true);
  }

  return (
    <Grid container spacing={3}>
      <HeaderBar
        title='Torneos'
        showButton
        buttonTitle='Agregar Participante'
        buttonAction={() => setModalCompetitorsForm(true)}
        customComponent={
          <div>
            <IconButton color='primary' onClick={() => navigate(`/tournament/${tournamentId}`)}>
              <ViewListIcon />
            </IconButton>
            <IconButton onClick={() => navigate(`/tournament/${tournamentId}/dashboard`)}>
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
        <CompetitorsGrid data={competitors} handleItemDetail={handleChallenges} handleScores={handleScores} />
      </Grid>

      <TransitionsModal
        open={modalCompetitorsForm}
        handleClose={() => setModalCompetitorsForm(false)}
        title={'Agregar Participantes'}
      >
        <CompetitorForm
          _competitors={competitors}
          handleClose={() => {
            getCompetitors();
            setModalCompetitorsForm(false);
          }}
        />
      </TransitionsModal>
      <TransitionsModal
        open={modalChallengesForm}
        handleClose={() => setModalChallengesForm(false)}
        title={'Asignar retos'}
      >
        <ChallengeForm
          competitor={item}
          handleClose={() => {
            getCompetitors();
            setModalChallengesForm(false);
          }}
        />
      </TransitionsModal>
      <TransitionsModal
        open={modalScoresForm}
        handleClose={() => { setModalScoresForm(false); getCompetitors();}}
        title={'Asignar retos'}
      >
        <ScoreChallengesForm
          competitor={item}
          handleClose={() => {
            getCompetitors();
            setModalScoresForm(false);
          }}
        />
      </TransitionsModal>
    </Grid>
  )

}

export default TournamentDetail;