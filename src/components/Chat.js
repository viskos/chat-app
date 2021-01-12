import React, {useContext, useEffect, useRef, useState} from 'react'
import {Context} from "../index";
import {useAuthState} from "react-firebase-hooks/auth";
import {Avatar, Container, Grid} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {useCollectionData} from "react-firebase-hooks/firestore";
import Loader from "./Loader";
import firebase from "firebase";

const Chat = () => {
    const {auth, firestore} = useContext(Context)
    const [user] = useAuthState(auth)
    const [value, setValue] = useState('')
    const chatRef = useRef(null)
    const [message, loading] = useCollectionData(
        firestore.collection('messages').orderBy('createdAt')
    )

    useEffect(() => {
        if (message) chatRef.current.scrollTop = chatRef.current.scrollHeight
    })

    const sendMessage = async (e) => {
        e.preventDefault()
        firestore.collection('messages').add({
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
            text: value,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        setValue('')
    }

    if (loading) {
        return <Loader/>
    }

    return (
        <Container>
            <Grid
                container
                justify={"center"}
                style={{height: window.innerHeight - 50, marginTop: 20}}
            >
                <div ref={chatRef} style={{width: '100%', height: '70vh', border: '1px solid #dadada', overflowY: 'auto'}}>
                    {
                        message.map(message =>
                            <div style={{
                                margin: 10,
                                border: user.uid === message.uid ? '1px solid #3CAEA3' : '1px solid #ED553B',
                                borderRadius: 5,
                                marginLeft: user.uid === message.uid ? 'auto' : '10px',
                                width: 'fit-content',
                                padding: 10
                            }}>
                                <Grid container>
                                    <Avatar src={message.photoURL}/>
                                    <div>{message.displayName}</div>
                                </Grid>
                                <div
                                    style={{paddingTop: 10}}
                                >
                                    {message.text}
                                </div>
                            </div>
                        )
                    }
                </div>
                <Grid
                    container
                    direction={"column"}
                    alignItems={"flex-end"}
                    style={{width: '100%'}}
                >
                    <form style={{width: '100%'}}>
                        <TextField
                            variant={"outlined"}
                            label={'Enter message'}
                            fullWidth
                            rowsMax={2}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            autoFocus
                        />
                        <Button type={"submit"} onClick={sendMessage} variant={"outlined"}>Send</Button>
                    </form>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Chat