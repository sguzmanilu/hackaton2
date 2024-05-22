import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Grid, TextField, Button } from "@mui/material";
import LoadingButton from '../../components/loadingButton';
import api from "../../utils/api";

export default function TournamentForm({ handleClose, item }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (item) {
            setName(item.name);
            setDescription(item.description);
        }
    }, [item])

    const onSubmitted = () => {
        setLoading(true);
        if (name === "" || description === "") 
            return toast.error("Debe completar todos los campos");

        if (item) {
            api.Put(`tournament/${item.id}`, { name, description })
                .then(() => {
                    toast.success("Torneo actualizado");
                    handleClose();
                })
                .catch((e) => {
                    toast.error("Error al actualizar torneo");
                })
                .finally(() => {
                    setLoading(false);
                })
            return null
        }
        else {
            api.Post('tournament', { name, description })
                .then(() => {
                    toast.success("Torneo creado");
                    handleClose();
                })
                .catch((e) => {
                    toast.error("Error al crear torneo");
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
                <TextField
                    id="name"
                    label="Nombre"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    id="description"
                    label="Descripción"
                    variant="outlined"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
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