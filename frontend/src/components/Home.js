import React from 'react';
import { Container, Grid } from '@material-ui/core';
import styled, { keyframes } from 'styled-components';
import { bounce } from 'react-animations';
import background from '../img/background.jpg'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import history from '../models/history';


const bounceAnimation = keyframes`${bounce}`;
 
const BouncyDiv = styled.div`
  animation: 1s ${bounceAnimation};
`;
const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
}));
const styles = {
    container: {
      textAlign: 'center',
      border: 0,
      borderRadius: 3,
      boxShadow: '0 0 0.5em rgba(0, 0, 0, 0.15)',
      color: 'white',
      padding: '0 30px',
      marginBottom:0
    },
    title :{
        paddingTop:'50px',
        color:'white',
        fontSize:'40px',
        fontFamily:'cursive' 
    },
    global:{
        backgroundImage: `url(${background})`,
        minHeight:'100vh'
    },
    bigtitle:{
      color:'white',
      fontSize:'30px',
      fontFamily:'cursive',
      marginBottom:'20px'
    },
    mincontainer: {
      marginTop: '50px',
      border: 1,
      borderRadius: 5 ,
      backgroundColor:'white',
      boxShadow: '0 0 0.5em rgba(0, 0, 2, 2)'
    },
    paragraph:{
      color:'blue',
      marginLeft:'10px',
      margin:'auto'
    },
    terms:{
      color:'grey',
      fontSize:'10px',
      textAlign:'center',
      margin: 'auto'
    }

  }

const Home = () => {
  const classes = useStyles();
    return (
        <div style={styles.global}>
            <Container maxWidth="xs" style={styles.container}>
                <BouncyDiv style={styles.title}>Matcha</BouncyDiv>
                <Grid container justify="center">
                  <Container maxWidth="xs" style={styles.mincontainer}>
                    <Grid item xs={12}>
                    <p style={styles.paragraph}> Déjà membre ?
                    </p>

                  <Button variant="outlined" color="primary" className={classes.button} onClick={() => history.push(`/login`)}>
                    Connecte toi !
                  </Button>
                  </Grid>

                  <Grid item xs={12}>
                    <p style={styles.paragraph}> Nouveau Ici ?
                    </p>

                  <Button variant="outlined" color="primary" className={classes.button} onClick={() => history.push(`/register`)}>
                    Inscris toi !
                  </Button>

                  <p style={styles.terms}>En vous inscrivant, vous acceptez nos Conditions générales. Découvrez comment nous recueillons, utilisons et partageons vos données en lisant notre Politique d’utilisation des données et comment nous utilisons les cookies et autres technologies similaires en consultant notre Politique d’utilisation des cookies.</p>

                    </Grid>
                </Container>
                </Grid>
            </Container>
        </div>
    )
}

export default Home;