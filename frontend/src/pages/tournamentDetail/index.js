import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { toast } from "react-toastify";
import SimpleBreadcrumbs from '../../components/breadCums';
import Bread from '../../components/breadCums/bread';
import HeaderBar from '../../components/headerBar';
import TransitionsModal from '../../components/dialogs/modal';
import CompetitorsGrid from './competitorsGrid';
// import TournamentForm from './tournamentForm';
import ConfirmDialog from '../../components/dialogs/confirmDialog';
import api from "../../utils/api";
import { useNavigate, useParams } from 'react-router-dom';
import CompetitorForm from './competitorForm';

const TournamentDetail = (props) => {

  const [modalForm, setModalForm] = useState(false);
  const [dialogDelete, setDialogDelete] = useState(false);
  const [tournament, setTournament] = useState(null);
  const [competitors, setCompetitors] = useState([]);
  const [data, setData] = useState([]);
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

  return (
    <Grid container spacing={3}>
      <HeaderBar
        title='Listado de proyectos'
        showButton
        buttonTitle='Agregar Participante'
        buttonAction={() => setModalForm(true)}
      />
      <Grid container item>
        <SimpleBreadcrumbs>
          <Bread isHome title={'Listado de Torneos'} link='/' />
          <Bread isHome isLast title={tournament ? tournament.name : ''} />
        </SimpleBreadcrumbs>
      </Grid>
      <Grid container item>
        <CompetitorsGrid data={competitors} />
        {/* <TournamentGrid data={data} handleItemEdit={handleItemEdit} handleItemDelete={handleItemDelete} /> */}
      </Grid>

      <TransitionsModal
        open={modalForm}
        handleClose={() => setModalForm(false)}
        title={'Agregar Participantes'}
      >
        <CompetitorForm
          _competitors={competitors}
          handleClose={() => {
            getCompetitors();
            setModalForm(false);
          }}
        />
      </TransitionsModal>
      {/* <ConfirmDialog
        open={dialogDelete}
        title='Eliminar Torneo'
        text='¿Está seguro que desea eliminar el torneo?'
        handleCloseProp={() => {
          setDialogDelete(false);
          setItem(null);
          getTournaments();
        }}
        onConfirm={onItemDelete}
      /> */}
    </Grid>
  )

}

export default TournamentDetail;