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
    const [files, setFiles] = useState([])
    const [base64Files, setBase64Files] = useState([])
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
            image: base64Files,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        alert(base64Files.length)
        setValue('')
        setFiles([])
        setBase64Files([])
    }

    const attachFile = (e) => {
        const fileList = files
        fileList.push(e.target.files)
        setFiles(fileList)
        fileEncodeToBase64(Object.values(fileList[0]))
    }

    const fileEncodeToBase64 = (fileList) => {
        fileList.forEach(file => {
            const baseFiles = base64Files
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                baseFiles.push(reader.result)
                setBase64Files(baseFiles)
            }
            reader.onerror = (e) => {
                console.error(e)
            }
        })
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
                        message.map(m => (
                            <div style={{
                                margin: 10,
                                backgroundColor: user.uid === m.uid ? '#2B5279' : '#182633',
                                color: '#fff',
                                borderRadius: 5,
                                marginLeft: user.uid === m.uid ? 'auto' : '10px',
                                width: 'fit-content',
                                padding: 10
                            }}
                                key={m.text}
                            >
                                <Grid 
                                    container 
                                    alignItems={'center'}
                                >
                                    <Avatar src={m.photoURL}/>
                                    <div>{m.displayName}</div>
                                </Grid>
                                <div
                                    style={{paddingTop: 10}}
                                >
                                    {m.text}
                                </div>
                                <div>
                                    {
                                        m.image.map((e, index) => (
                                            <img key={index} style={{width: '200px', margin: '5px'}} src={e} />
                                        ))
                                    }
                                </div>
                            </div>
                        ))
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
                        <label className="attach-file">
                            File
                            <input 
                                type="file"
                                onChange={attachFile}
                                multiple
                            />
                        </label>
                    </form>
                </Grid>
            </Grid>
    )
}

export default Chat
