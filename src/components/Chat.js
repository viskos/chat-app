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
            <Grid
                container
                justify={"center"}
                style={{height: window.innerHeight - 50}}
            >
                <div ref={chatRef} style={{width: '100%', height: '70vh', overflowY: 'auto'}}>
                    {
                        message.map(message =>
                            <div style={{
                                margin: 10,
                                backgroundColor: user.uid === message.uid ? '#2B5279' : '#182633',
                                color: '#fff',
                                borderRadius: 5,
                                marginLeft: user.uid === message.uid ? 'auto' : '10px',
                                width: 'fit-content',
                                padding: 10
                            }}>
                                <Grid 
                                    container 
                                    alignItems={'center'}
                                >
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
                    style={{width: '100%', backgroundColor: '#17212B'}}
                >
                    <form style={{width: '100%'}} >
                        <TextField
                            variant={"outlined"}
                            label={'Enter message'}
                            fullWidth
                            rowsMax={2}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            autoFocus
                            style={{color: '#fff', borderColor: '#fff'}}
                        />
                        <Button 
                            type={"submit"}
                            color="default"
                            onClick={sendMessage}
                            variant={"outlined"}
                        >
                            Send
                        </Button>
                    </form>
                </Grid>
            </Grid>
    )
}

export default Chat