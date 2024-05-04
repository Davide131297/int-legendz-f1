import React, {useContext, useEffect, useState} from "react";
import { AccessTokenContext } from "../utils/AccesTokenContext";
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from './../utils/firebase';
import { DataGrid, SearchPanel, Column, Editing, RequiredRule, Paging } from 'devextreme-react/data-grid';
import { notifications } from '@mantine/notifications';
import './AdminDashboard.css';
import deMessages from "devextreme/localization/messages/de.json";
import { locale, loadMessages } from "devextreme/localization";

const AdminDashboard = () => {
    const { accessToken } = useContext(AccessTokenContext);
    const [Personen, setPersonen] = useState([]);
    const [Strecken, setStrecken] = useState([]);

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

    // Fetching Strecken data from Firebase, converting timestamp to Date
    useEffect(() => {
        const streckenRef = collection(db, 'Strecken');
        const unsubscribe = onSnapshot(streckenRef, (snapshot) => {
            let tempStrecken = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                if (data.Datum) { // Überprüfen Sie, ob das Feld Datum existiert
                    const datum = data.Datum.toDate(); // Convert Firebase Timestamp to Date
                    tempStrecken.push({
                        id: doc.id, // Track name
                        datum: datum,
                        flagge: data.Flagge,
                        layout: data.Layout,
                    });
                } else {
                    console.warn(`Document with id ${doc.id} does not have a Datum field.`);
                }
            });
            console.log("Strecken:", tempStrecken);
            setStrecken(tempStrecken);
        });

        return () => unsubscribe();
    }, []);

    const handleRowInsertedStrecken = async (e) => {
        // JavaScript Date zu Firebase Timestamp umwandeln
        const date = new Date(e.data.datum);
        date.setHours(20, 0, 0, 0); // Setze die Stunden auf 20:00:00

        const datum = Timestamp.fromDate(date);

        console.log("Datum:", datum);

        const StreckenData = {
            Flagge: e.data.flagge,
            Layout: e.data.layout,
            Datum: datum, // Hinzufügen des umgewandelten Datums zu StreckenData
        };

        try {
            await setDoc(doc(db, "Strecken", e.data.id), StreckenData);
            notifications.show({
                title: 'Erfolgreich hinzugefügt',
                message: e.data.id + " wurde erfolgreich hinzugefügt.",
                color: 'green',
            })
            console.log("Document written with ID: ", e.data.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const handleRowRemovedStrecken = async (e) => {
        try {
            await deleteDoc(doc(db, "Strecken", e.data.id));
            notifications.show({
                title: 'Erfolgreich gelöscht',
                message: e.data.id + " wurde erfolgreich gelöscht.",
                color: 'green',
            })
            console.log("Document deleted with ID: ", e.data.id);
        } catch (e) {
            console.error("Error deleting document: ", e);
        }
    };

    const handleRowUpdatedStrecken = async (e) => {
       // JavaScript Date zu Firebase Timestamp umwandeln
       const date = new Date(e.data.datum);
       date.setHours(20, 0, 0, 0); // Setze die Stunden auf 20:00:00

       const datum = Timestamp.fromDate(date);

       console.log("Datum:", datum);

       const StreckenData = {
           Flagge: e.data.flagge,
           Layout: e.data.layout,
           Datum: datum, // Hinzufügen des umgewandelten Datums zu StreckenData
       };
        try {
            await updateDoc(doc(db, "Strecken", e.data.id), StreckenData);
            notifications.show({
                title: 'Erfolgreich aktualisiert',
                message: e.data.id + " wurde erfolgreich aktualisiert.",
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
                    
                    <div className="dataGridsContainer" style={{display: 'flex', justifyContent: 'space-between'}}>
                        <div className="dataGridContainer" style={{width: '30%'}}>
                            <h5>Teilnehmerfeld</h5>
                            <DataGrid 
                                dataSource={Personen} 
                                keyExpr="id"
                                onRowInserted={handleRowInserted}
                                onRowRemoved={handleRowRemoved}
                                onRowUpdated={handleRowUpdated}
                            >
                                <SearchPanel visible={true} />
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
                                <Paging enabled={true} pageSize={10}/>
                            </DataGrid>
                        </div>
                        <div className="dataGridContainerStrecken" style={{width: '70%'}}>
                            <h5>Strecken</h5>
                            <DataGrid
                                dataSource={Strecken} 
                                keyExpr="id"
                                onRowInserted={handleRowInsertedStrecken}
                                onRowRemoved={handleRowRemovedStrecken}
                                onRowUpdated={handleRowInsertedStrecken}
                            >
                                <SearchPanel visible={true} />
                                <Column dataField="id" caption="Strecke"/>
                                <Column dataField="datum" caption="Datum" dataType="date" format="dd.MM.yyyy" />
                                <Column dataField="flagge" caption="Flagge" />
                                <Column dataField="layout" caption="Layout" />
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
            </div>
            )}
        </>
    );
}
export default AdminDashboard;