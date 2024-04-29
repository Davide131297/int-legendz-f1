import React, {useContext, useEffect, useState} from "react";
import { AccessTokenContext } from "../utils/AccesTokenContext";
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './../utils/firebase';
import { DataGrid, SearchPanel, Column, Editing, RequiredRule } from 'devextreme-react/data-grid';
import { notifications } from '@mantine/notifications';
import './AdminDashboard.css';
import deMessages from "devextreme/localization/messages/de.json";
import { locale, loadMessages } from "devextreme/localization";

const AdminDashboard = () => {
    const { accessToken } = useContext(AccessTokenContext);
    const [Personen, setPersonen] = useState([]);

    loadMessages(deMessages);
    locale("de");
    
    useEffect(() => {
        console.log("accessToken:", accessToken);
    }, [accessToken]);

    useEffect(() => {
    const personenRef = collection(db, 'personen');
    const unsubscribe = onSnapshot(personenRef, (snapshot) => {
        let tempListe = [];
        snapshot.forEach((doc) => {
            let data = doc.data();
            tempListe.push({ spielerID: data.spielerID, team: data.team, id: data.id});
        });
        setPersonen(tempListe);
        console.log("Personen:", tempListe);
    });
    return unsubscribe; // Vergessen Sie nicht, das Abonnement zu kündigen, wenn die Komponente unmountet
    }, []);

    const handleRowInserted = async (e) => {
        const personData = {
            spielerID: e.data.spielerID,
            team: e.data.team,
        };
        try {
            const docRef = await addDoc(collection(db, "personen"), personData);
            await updateDoc(doc(db, "personen", docRef.id), {
                id: docRef.id
            });
            notifications.show({
                title: 'Erfolgreich hinzugefügt',
                message: personData.spielerID + " wurde erfolgreich hinzugefügt.",
                color: 'green',
            })
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const handleRowRemoved = async (e) => {
        try {
            await deleteDoc(doc(db, "personen", e.data.id));
            notifications.show({
                title: 'Erfolgreich gelöscht',
                message: e.data.spielerID + " wurde erfolgreich gelöscht.",
                color: 'green',
            })
            console.log("Document deleted with ID: ", e.data.id);
        } catch (e) {
            console.error("Error deleting document: ", e);
        }
    };

    const handleRowUpdated = async (e) => {
        const personData = {
            spielerID: e.data.spielerID,
            team: e.data.team,
            id: e.data.id
        };
        try {
            await updateDoc(doc(db, "personen", e.data.id), personData);
            notifications.show({
                title: 'Erfolgreich aktualisiert',
                message: personData.spielerID + " wurde erfolgreich aktualisiert.",
                color: 'green',
            })
            console.log("Document updated with ID: ", e.data.id);
        } catch (e) {
            console.error("Error updating document: ", e);
        }
    };


    return (
        <>
            {accessToken === null ? (
                <h1>Kein Zugriff, bitte Einloggen.</h1> 
            ) : (
            <div>
                <div className="adminDashboard">
                    <h1>Admin Dashboard</h1>
                    
                    <div className="dataGridContainer">
                        <h5>Teilnehmerfeld</h5>
                        <DataGrid 
                            dataSource={Personen} 
                            keyExpr="id"
                            onRowInserted={handleRowInserted}
                            onRowRemoved={handleRowRemoved}
                            onRowUpdated={handleRowUpdated}
                        >
                            <SearchPanel visible={true} />
                            <Column dataField="id"  caption="ID" allowEditing={false} />
                            <Column dataField="spielerID" caption="Spieler ID">
                                <RequiredRule />
                            </Column>
                            <Column dataField="team" caption="Team">
                                <RequiredRule />
                            </Column>
                            <Editing
                                mode="row"
                                allowUpdating={true}
                                allowDeleting={true}
                                allowAdding={true}
                            />
                        </DataGrid>
                    </div>
                </div>
            </div>
            )}
        </>
    );
}
export default AdminDashboard;