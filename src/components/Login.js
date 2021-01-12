import React, {useContext} from 'react'
import {Container, Grid} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import {Context} from "../index";
import firebase from "firebase";

const Login = () => {
    const {auth} = useContext(Context)

    const login = async () => {
        const provider = new firebase.auth.GoogleAuthProvider()
        const {user} = await auth.signInWithPopup(provider)
        console.log(user)
    }

    return (
        <Container>
            <Grid
                container
                style={{height: window.innerHeight - 50}}
                alignItems={"center"}
                justify={"center"}
            >
                <Grid
                    container
                    alignItems={"center"}
                    direction={"column"}
                    style={{width: 400, background: 'lightgray'}}
                >
                    <Box p={5}>
                        <Button
                            variant={"outlined"}
                            onClick={login}
                        >
                            Login with Google
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Login