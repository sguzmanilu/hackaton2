import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Grid, TextField, Button, Autocomplete } from "@mui/material";
import LoadingButton from '../../components/loadingButton';
import { useParams } from "react-router-dom";
import api from "../../utils/api";

export default function ChallengeForm({ handleClose, _competitors}) {
    const [users, setUsers] = useState([]);
    const [competitors, setCompetitors] = useState([]);
    const [loading, setLoading] = useState(false);

    const { tournamentId } = useParams();

    useEffect(() => {
        getUsers();
        if (_competitors) {
            setCompetitors(_competitors.map((c) => c.user))
        }
    }, [_competitors])

    const getUsers = () => {
        api.Get('auth')
            .then((response) => {
                setUsers(response.data)
            })
            .catch((e) => {
                toast.error("Error al cargar usuarios");
            })
    
    }

    const onSubmitted = () => {
        setLoading(true);
        if (competitors.length === 0)
            return toast.error("Debe asignar al menos un participante");

        // Body format
        const response = {
            tournament: tournamentId,
            users: competitors.map((c) => ({ user: c.id }))
        }

        if (_competitors.length > 0) {
            api.Put('competitor', response)
                .then(() => {
                    toast.success("Participantes actualizados");
                    handleClose();
                })
                .catch((e) => {
                    toast.error("Error al actualizar los participantes");
                })
                .finally(() => {
                    setLoading(false);
                })
            return null
        }
        else {
            api.Post('competitor', response)
                .then(() => {
                    toast.success("Participantes asignados");
                    handleClose();
                })
                .catch((e) => {
                    toast.error("Error al actualizar los participantes");
                })
                .finally(() => {
                    setLoading(false);
                })
        }
        return null
    }

    return (
        <Grid container spacing={3} sx={{ marginTop: 1 }}>
            <Grid item xs={12}>
                <Autocomplete
                    id="competitors"
                    multiple
                    options={users}
                    onChange={(event, newValue) => { setCompetitors(newValue) }}
                    getOptionLabel={(option) => option.name}
                    value={competitors}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            label="Participantes"
                            placeholder="Buscar Participantes..."
                        />
                    )}
                />
            </Grid>
            <Grid item container xs={12}>
                <Button
                    variant="text"
                    color="secondary"
                    onClick={handleClose}
                    sx={{ marginRight: 2 }}
                >
                    Cancelar
                </Button>
                <LoadingButton
                    loading={loading}
                    variant="contained"
                    color="primary"
                    onClick={onSubmitted}
                >
                    Guardar
                </LoadingButton>
            </Grid>
        </Grid>
    );
}
