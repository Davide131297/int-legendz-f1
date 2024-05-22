import React, {useState, useEffect} from 'react';
import { Box, ScrollArea, Avatar, Paper, Text, Button } from '@mantine/core';
import { db } from './../utils/firebase';
import { collection, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { CiHeart } from "react-icons/ci";
import Cookies from 'js-cookie';
import './SocialMedia.css';

const SocialMedia = () => {

    const [Nachrichten, setNachrichten] = useState([]);
    const [updateStatus, setUpdateStatus] = useState(false);

    useEffect(() => {
        const NachrichtenRef = collection(db, 'Nachrichten');
        let tempListe = [];
        const unsubscribe = onSnapshot(NachrichtenRef, (snapshot) => {
            tempListe = []; // Leeren Sie das Array, bevor Sie die Daten abrufen
            snapshot.forEach((doc) => {
                let data = doc.data();
                tempListe.push({
                    id: doc.id,
                    message: data.Nachricht,
                    zeit: data.Zeit.toDate().toLocaleString(),
                    like: data.Like
                });
            })
            setNachrichten(tempListe);
            console.log("Zeige Nachrichten: ", tempListe);
        });
        return () => unsubscribe();
    }, [updateStatus]);

    const clickedLikeButton = async (id) => {
        const nachrichtRef = doc(db, 'Nachrichten', id);
        const nachricht = Nachrichten.find(nachricht => nachricht.id === id);

        // Überprüfen, ob ein Cookie für diese Nachricht existiert
        const likeCookie = Cookies.get(`like-${id}`);

        let newLikeValue;
        if (likeCookie) {
            // Wenn ein Cookie existiert, verringern Sie den "Like"-Wert um 1 und entfernen Sie das Cookie
            newLikeValue = nachricht.like - 1;
            Cookies.remove(`like-${id}`);
        } else {
            // Wenn kein Cookie existiert, erhöhen Sie den "Like"-Wert um 1 und setzen Sie ein Cookie
            newLikeValue = nachricht.like + 1;
            Cookies.set(`like-${id}`, newLikeValue, { expires: 30 }); // Der Cookie läuft nach 30 Tagen ab
        }

        await updateDoc(nachrichtRef, {
            Like: newLikeValue
        });
        setUpdateStatus(!updateStatus);
    }


    return (
        <div style={{ display: 'flex', justifyContent: 'center', height: 'calc(100vh - 80px)' }}>
            <Box bg="#F2F2F2" style={{ marginTop: '20px', width: '40%', borderTopLeftRadius: '30px', borderTopRightRadius: '30px' }}>
                <ScrollArea style={{ height: '100%' }}>
                <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70px', borderBottom: '1px solid #ccc' }}>
                    <h2>International Gaming Feed</h2>
                </Box>
                    {Nachrichten.map((nachricht) => (
                        <Paper key={nachricht.id} shadow="xs" padding="xl" style={{marginTop: '10px', width: '95%', marginLeft: 'auto', marginRight: 'auto', display: 'flex', flexDirection: 'row'}}>
                            <div style={{ flex: '0 0 10%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', height: '100%', padding: '10px' }}>
                                <Avatar
                                    size="md"
                                    src={process.env.PUBLIC_URL + '/ligalogo.png'}
                                    radius="xl"
                                />
                            </div>
                            <div style={{ flex: '1 0 90%', display: 'flex', flexDirection: 'column', padding: '10px' }}>
                                <div>
                                    <h4>F1 Legendz Gaming</h4>
                                </div>
                                <div>
                                    <Text>
                                        {nachricht.message}
                                    </Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Button leftSection={<CiHeart size={14}/>} variant="transparent" style={{marginLeft: '-12px'}} onClick={() => clickedLikeButton(nachricht.id)}>
                                        {nachricht.like !== 0 ? nachricht.like : null}
                                    </Button>
                                    <Text c="dimmed" size='12px'>{nachricht.zeit}</Text>
                                </div>
                            </div>
                        </Paper>
                    ))}
                </ScrollArea>
            </Box>
        </div>
    );
}
export default SocialMedia;