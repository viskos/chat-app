import React from 'react'
import {Container, Grid} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

const Loader = () => {
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
                >
                    <div className="lds-ellipsis">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Loader