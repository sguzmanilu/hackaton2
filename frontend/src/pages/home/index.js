import React, { useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { toast } from "react-toastify";
// import Layout from "../../components/layout";

const Home = (props) => {

    useEffect(() => {
        
        toast.success("Bienvenido");
    }, []);

    return (
        // <Layout title="Home">
        <React.Fragment>
            <Container maxWidth="lg">
                <Typography variant="h4" style={{ textAlign: "center", marginBottom: 15 }}>
                    Proceso de Hackaton II
                </Typography>
            </Container>
            <br />
            <Container maxWidth="sm">
                <img src={'./logo.png'} style={{ width: "100%" }} />
            </Container>
        </React.Fragment>
        // </Layout>
    )

}

export default Home;