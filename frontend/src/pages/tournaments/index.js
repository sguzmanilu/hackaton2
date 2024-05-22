import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { toast } from "react-toastify";
import SimpleBreadcrumbs from '../../components/breadCums';
import Bread from '../../components/breadCums/bread';
import HeaderBar from '../../components/headerBar';
import TournamentGrid from './tournamentGrid';
import TransitionsModal from '../../components/dialogs/modal';
import TournamentForm from './tournamentForm';
import ConfirmDialog from '../../components/dialogs/confirmDialog';
import { useNavigate } from 'react-router-dom';
import api from "../../utils/api";

const Tournaments = (props) => {

  const [modalForm, setModalForm] = useState(false);
  const [dialogDelete, setDialogDelete] = useState(false);
  const [data, setData] = useState([]);
  const [item, setItem] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    getTournaments();
  }, []);

  const getTournaments = () => {
    api.Get('tournament')
      .then((response) => {
        setData(response.data)
      })
      .catch((e) => {
        toast.error("Error al cargar torneos");
      })
  }

  const handleItemDetail = (item) => {
    navigate(`tournament/${item.id}`);
  }

  const handleItemEdit = (item) => {
    setItem(item);
    setModalForm(true);
  }

  const handleItemDelete = (item) => {
    setItem(item);
    setDialogDelete(true);
  }

  const onItemDelete = () => {
    api.Delete(`tournament/${item.id}`)
      .then(() => {
        toast.success("Torneo eliminado");
        setDialogDelete(false);
        setItem(null);
        getTournaments();
      })
      .catch((e) => {
        toast.error("Error al eliminar torneo");
      })
  }

  return (
    <Grid container spacing={3}>
      <HeaderBar
        title='Listado de proyectos'
        showButton
        buttonTitle='Nuevo Torneo'
        buttonAction={() => setModalForm(true)}
      />
      <Grid container item>
        <SimpleBreadcrumbs>
          <Bread isHome isLast title={'Listado torneos'} />
        </SimpleBreadcrumbs>
      </Grid>
      <Grid container item>
        <TournamentGrid
          data={data}
          handleItemEdit={handleItemEdit}
          handleItemDelete={handleItemDelete}
          handleItemDetail={handleItemDetail}
        />
      </Grid>

      <TransitionsModal
        open={modalForm}
        handleClose={() => setModalForm(false)}
        title={item ? 'Editar Torneo' : 'Nuevo Torneo'}
      >
        <TournamentForm
          item={item}
          handleClose={() => {
            setModalForm(false);
            getTournaments();
          }}
        />
      </TransitionsModal>
      <ConfirmDialog
        open={dialogDelete}
        title='Eliminar Torneo'
        text='¿Está seguro que desea eliminar el torneo?'
        handleCloseProp={() => {
          setDialogDelete(false);
          setItem(null);
          getTournaments();
        }}
        onConfirm={onItemDelete}
      />
    </Grid>
  )

}

export default Tournaments;