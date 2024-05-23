import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Grid, Button } from "@mui/material";
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import LoadingButton from '../../components/loadingButton';
import { useParams } from "react-router-dom";
import api from "../../utils/api";

export default function ChallengeForm({ handleClose, competitor }) {
    const [challenges, setChallenges] = useState([]);
    const [challengesAssignedOriginal, setChallengesAssignedOriginal] = useState([]);
    const [challengesAssigned, setChallengesAssigned] = useState([]);
    const [loading, setLoading] = useState(false);

    const { tournamentId } = useParams();

    useEffect(() => {
        getChallenges();
        if (competitor)
            getChallengesByCompetitor();
    }, [competitor])

    const getChallenges = () => {
        api.Get('category/challenges')
            .then((response) => {
                setChallenges(response.data)
            })
            .catch((e) => {
                toast.error("Error al cargar los retos");
            })
    }

    const getChallengesByCompetitor = () => {
        api.Get(`challenge-assign/${competitor.id}`)
            .then((response) => {
                setChallengesAssignedOriginal(response.data.map((c) => ({challenge: c.challenge.id})))
                setChallengesAssigned(response.data.map((c) => ({challenge: c.challenge.id})))
            })
            .catch((e) => {
                toast.error("Error al cargar los retos del participante");
            })
    }

    const handleChange = (event, challengeId) => {
        const { name, checked } = event.target;
        if (checked) {
            setChallengesAssigned([...challengesAssigned, { challenge: challengeId }]);
        }
        else {
            setChallengesAssigned(challengesAssigned.filter((c) => c.challenge !== challengeId));
        }
    }

    const onSubmitted = () => {
        setLoading(true);
        if (challengesAssigned.length === 0)
            return toast.error("Debe asignar al menos un reto");

        // Body format
        const response = {
            tournament: tournamentId,
            competitor: competitor.id,
            challenges: challengesAssigned
        }

        if (challengesAssignedOriginal.length > 0) {
            api.Put('challenge-assign', response)
                .then(() => {
                    toast.success("Retos actualizados");
                    handleClose();
                })
                .catch((e) => {
                    toast.error("Error al actualizar los retos");
                })
                .finally(() => {
                    setLoading(false);
                })
            return null
        }
        else {
            api.Post('challenge-assign', response)
                .then(() => {
                    toast.success("Retos asignados");
                    handleClose();
                })
                .catch((e) => {
                    toast.error("Error al asignar los retos");
                })
                .finally(() => {
                    setLoading(false);
                })
        }
        return null
    }

    return (
        <Grid container sx={{ marginTop: 1 }} spacing={3}>
            <Grid item container xs={12} spacing={2}>
                {challenges.map((category, i) => (
                    <Grid item xs={12} md={6} key={i}>
                        <FormControl>
                            <FormLabel component="legend">{category.name}</FormLabel>
                            <FormGroup>
                                {category.challenges.map((challenge, j) => (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name={challenge.name}
                                                checked={challengesAssigned.some((c) => c.challenge === challenge.id)}
                                                onChange={(e) => handleChange(e, challenge.id)}
                                            />
                                        }
                                        label={challenge.name}
                                        key={j}
                                    />
                                ))}
                            </FormGroup>
                        </FormControl>
                    </Grid>
                ))}
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
