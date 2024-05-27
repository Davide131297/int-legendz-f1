import React, { useState, useEffect } from "react";
import { db } from './../utils/firebase';
import { collection, setDoc, getDoc, doc, onSnapshot, query, where, getDocs, addDoc, updateDoc } from 'firebase/firestore';
import { Button, UnstyledButton, Paper, Select, Input, Divider, Checkbox } from '@mantine/core';
import { notifications } from "@mantine/notifications";

const ErgebnisEintragen = (props) => {
    const [personen, setPersonen] = useState([]);
    const [selectedData, setSelectedData] = useState({
        spielerID: "",
        strecke: "",
        punkte: "",
        pole: false,
        driverOfTheDay: false,
        team: ""
    });
    const setDrawerOpen = props.setDrawerOpen;
    const showForm = props.showForm;
    const setShowForm = props.setShowForm;
    const [newProfile, setNewProfile] = useState({
        name: "",
        team: ""
    });
    const [teamliste, setTeamliste] = useState([]);
    const [allTeamsHaveTwoMembers, setAllTeamsHaveTwoMembers] = useState();
    const [driverWithNoTeam, setDriverWithNoTeam] = useState();

    useEffect(() => {
        console.log("Alle Teams haben zwei Mitglieder?", allTeamsHaveTwoMembers);
    }, [allTeamsHaveTwoMembers]);

    useEffect(() => {
        const personenRef = collection(db, 'personen');
        const unsubscribe = onSnapshot(personenRef, (snapshot) => {
            let tempListe = [];
            snapshot.forEach((doc) => {
                tempListe.push({ 
                    id: doc.id, 
                    ...doc.data() // Hier werden alle Attribute des Dokuments abgerufen
                });
            });
            tempListe.sort((a, b) => b.gesamtPunkte - a.gesamtPunkte);
            setPersonen(tempListe);
        });

        const teamsRef = collection(db, 'teams');
        const unsubscribeTeams = onSnapshot(teamsRef, (snapshot) => {
            let tempListe = [];
            snapshot.forEach((doc) => {
                tempListe.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            setTeamliste(tempListe);
            console.log(tempListe);
        });

        // Aufräumen bei Unmount
        return () => {
            unsubscribe();
            unsubscribeTeams();
        };
    }, []);

    const teams = [
        { value: 'Mercedes', label: 'Mercedes' },
        { value: 'Red Bull', label: 'Red Bull' },
        { value: 'McLaren', label: 'McLaren' },
        { value: 'Aston Martin', label: 'Aston Martin' },
        { value: 'Alpine', label: 'Alpine' },
        { value: 'Ferrari', label: 'Ferrari' },
        { value: 'Visa RB', label: 'Visa RB' },
        { value: 'Kick Sauber', label: 'Kick Sauber' },
        { value: 'Haas', label: 'Haas' },
        { value: 'Williams', label: 'Williams' },
    ];

    const punkte = [
        "DNF",
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "15",
        "16",
        "18",
        "19",
        "25",
        "26"
    ];

    const strecken = [
        { value: 'bahrain', label: 'Bahrain' },
        { value: 'saudiarabien', label: 'Saudi Arabien' },
        { value: 'australien', label: 'Australien' },
        { value: 'aserbaidschan_Sprint', label: 'Aserbaidschan Sprint' },
        { value: 'aserbaidschan_Rennen', label: 'Aserbaidschan Rennen' },
        { value: 'miami', label: 'Miami' },
        { value: 'italien', label: 'Italien' },
        { value: 'monaco', label: 'Monaco' },
        { value: 'spanien', label: 'Spanien' },
        { value: 'kanada', label: 'Kanada' },
        { value: 'österreich_Sprint', label: 'Österreich Sprint' },
        { value: 'österreich_Rennen', label: 'Österreich Rennen' },
        { value: 'england', label: 'England' },
        { value: 'ungarn', label: 'Ungarn' },
        { value: 'belgien_Sprint', label: 'Belgien Sprint' },
        { value: 'belgien_Rennen', label: 'Belgien Rennen' },
        { value: 'niederlande', label: 'Niederlande' },
        { value: 'singapur', label: 'Singapur' },
        { value: 'japan', label: 'Japan' },
        { value: 'katar_Sprint', label: 'Katar Sprint' },
        { value: 'katar_Rennen', label: 'Katar Rennen' },
        { value: 'usa_Sprint', label: 'USA Sprint' },
        { value: 'usa_Rennen', label: 'USA Rennen' },
        { value: 'mexiko', label: 'Mexiko' },
        { value: 'brasilien_Sprint', label: 'Brasilien Sprint' },
        { value: 'brasilien_Rennen', label: 'Brasilien Rennen' },
        { value: 'lasvegas', label: 'Las Vegas' },
        { value: 'abudhabi', label: 'Abu Dhabi'}
    ];

    function handleClick() {
        console.log("Ausgewählt",selectedData);

        const person = personen.find(person => person.spielerID === selectedData.spielerID);

        if (person && person.team)   {
        handleSave();
        setDrawerOpen(Prev => !Prev)
        notifications.show({
            color: "green",
            title: 'Ergebnis gespeichert!',
            message: 'Ergebnis wurde erfolgreich eingetragen 👍',
            autoClose: 3000,
        });
        } else if (selectedData && selectedData.team) {
            handleSave();
            setDrawerOpen(Prev => !Prev)
            notifications.show({
                color: "green",
                title: 'Ergebnis gespeichert!',
                message: 'Ergebnis wurde erfolgreich eingetragen 👍',
                autoClose: 3000,
            });
        } 
        else {
            notifications.show({
                color: "red",
                title: 'Fehler!',
                message: 'Fahrer hat kein Team. Wähle für dieses Rennen das Team aus für das du Gefahren bist.',
                autoClose: 4000,
            });
            setDriverWithNoTeam(true);
        } 
    } 

    const handleSave = async () => {
        console.log("Ausgewählt",selectedData);
        console.log("Teamliste",teamliste);
        try {
            // Finden Sie das Dokument, das spielerID entspricht
            const person = personen.find(person => person.spielerID === selectedData.spielerID);
            console.log("Gib gesuchte person wieder",person);

            if (person && selectedData.punkte !== "DNF") {
                // Wenn der Fahrer existiert, aktualisieren Sie das Dokument
                const personenRef = doc(db, 'personen', person.id);
                const poleKey = `pole_${selectedData.strecke}`; // Dynamische Erstellung des Schlüssels für Pole-Position
                const driverOfTheDayKey = `driverOfTheDay_${selectedData.strecke}`; // Dynamische Erstellung des Schlüssels für Fahrer des Tages
                const updateData = {
                    wertung: {
                        ...person.wertung,
                        [selectedData.strecke]: parseInt(selectedData.punkte)
                    }
                };
    
                // Fügen Sie das Pole-Position-Attribut nur hinzu, wenn selectedData.pole true ist
                if (selectedData.pole) {
                    updateData.wertung[poleKey] = true;
                }

                // Fügen Sie das Fahrer-des-Tages-Attribut nur hinzu, wenn selectedData.driverOfTheDay true ist
                if (selectedData.driverOfTheDay) {
                    updateData.wertung[driverOfTheDayKey] = true;
                }
    
                await setDoc(personenRef, updateData, { merge: true });
            } else if (person && selectedData.punkte === "DNF") {
                // Wenn der Fahrer existiert und DNF ist
                const personenRef = doc(db, 'personen', person.id);
                const poleKey = `pole_${selectedData.strecke}`; // Dynamische Erstellung des Schlüssels
                const driverOfTheDayKey = `driverOfTheDay_${selectedData.strecke}`; // Dynamische Erstellung des Schlüssels
                const updateData = {
                    wertung: {
                        ...person.wertung,
                        [selectedData.strecke]: selectedData.punkte
                    }
                };
    
                // Fügen Sie das Pole-Position-Attribut nur hinzu, wenn selectedData.pole true ist
                if (selectedData.pole) {
                    updateData.wertung[poleKey] = true;
                }

                // Fügen Sie das Fahrer-des-Tages-Attribut nur hinzu, wenn selectedData.driverOfTheDay true ist
                if (selectedData.driverOfTheDay) {
                    updateData.wertung[driverOfTheDayKey] = true;
                }
    
                await setDoc(personenRef, updateData, { merge: true });
            } else {
                // Wenn der Fahrer nicht existiert, erstellen Sie ein neues Dokument
                const personenRef = doc(db, 'personen');
                const poleKey = `pole_${selectedData.strecke}`; // Dynamische Erstellung des Schlüssels
                const driverOfTheDayKey = `driverOfTheDay_${selectedData.strecke}`; // Dynamische Erstellung des Schlüssels
                const newPersonData = {
                    spielerID: selectedData.spielerID,
                    wertung: {
                        [selectedData.strecke]: parseInt(selectedData.punkte)
                    }
                };
    
                // Fügen Sie das Pole-Position-Attribut nur hinzu, wenn selectedData.pole true ist
                if (selectedData.pole) {
                    newPersonData.wertung[poleKey] = true;
                }
                
                // Fügen Sie das Fahrer-des-Tages-Attribut nur hinzu, wenn selectedData.driverOfTheDay true ist
                if (selectedData.driverOfTheDay) {
                    newPersonData.wertung[driverOfTheDayKey] = true;
                }
    
                await setDoc(personenRef, newPersonData);
            }

            // Finden Sie das Teamdokument, das dem ausgewählten Team entspricht
            const teamRef = doc(db, 'teams', person?.team || selectedData.team);
            const teamDoc = await getDoc(teamRef);
            console.log("Team Dokument vor dem speichern", teamDoc);

            if (teamDoc.exists() && teamDoc.data().wertung) {
                let punkte = selectedData.punkte === "DNF" ? 0 : parseInt(selectedData.punkte);
                let aktuelleStreckePunkte = teamDoc.data().wertung[selectedData.strecke] || 0;
                let neueStreckePunkte = aktuelleStreckePunkte + punkte;

                // Wenn das Team existiert und wertung ist definiert, aktualisieren Sie das Dokument
                await setDoc(teamRef, {
                    wertung: {
                        ...teamDoc.data().wertung,
                        [selectedData.strecke]: neueStreckePunkte
                    },
                    gesamtPunkte: Object.values(teamDoc.data().wertung).reduce((a, b) => a + b, 0) + punkte
                }, { merge: true });
            } else {
                // Wenn das Team nicht existiert oder wertung ist undefiniert, erstellen Sie ein neues Dokument
                let gesamtPunkte = selectedData.punkte === "DNF" ? 0 : parseInt(selectedData.punkte);
                await setDoc(teamRef, {
                    team: person?.team || selectedData.team,
                    wertung: {
                        [selectedData.strecke]: gesamtPunkte
                    },
                    gesamtPunkte: gesamtPunkte
                });
            }
            console.log("Daten erfolgreich gespeichert!", selectedData);
        } catch (error) {
            console.error("Fehler beim Speichern der Daten:", error);
        }
    };

    const handleRegister = async (event) => {
        event.preventDefault();
    
        // Überprüfen, ob sowohl SpielerID als auch Team eingegeben wurden
        if (!newProfile.name || !newProfile.team) {
            notifications.show({
                title: 'Fehler!',
                message: 'Bitte gib mindestens eine SpielerID und ein Team ein.',
                autoClose: 3000,
                color: 'red'
            });
            return;
        }
    
        const personData = {
            spielerID: newProfile.name,
            team: newProfile.team,
            wertung: {
            "Bahrain": null,
            "SaudiArabien": null,
            "Australien": null,
            "Japan": null,
            "China": null,
            "Miami": null,
            "Imola": null,
            "Monaco": null,
            "Kanada": null,
            "Spanien": null,
            "Österreich_Sprint": null, 
            "Österreich_Rennen": null,
            "Großbritannien": null,
            "Ungarn": null,
            "Belgien_Sprint": null,
            "Belgien_Rennen": null,
            "Niederlande": null,
            "Monza": null,
            "Aserbaidschan_Sprint": null,
            "Aserbaidschan_Rennen": null,
            "Singapur": null,
            "Austin": null,
            "Mexiko": null,
            "Brasilien_Sprint": null,
            "Brasilien_Rennen": null,
            "LasVegas": null,
            "Katar_Sprint": null,
            "Katar_Rennen": null,
            "AbuDhabi": null,
            },
            pole: {},
            driverOfTheDay: {},
        };
    
        try {
            // Überprüfen, ob die SpielerID bereits existiert
            const q = query(collection(db, "personen"), where("spielerID", "==", newProfile.name));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                notifications.show({
                    title: 'Fehler!',
                    message: 'Eine Person mit dieser SpielerID existiert bereits.',
                    autoClose: 3000,
                    color: 'red'
                });
                return;
            }

            // Überprüfen, ob alle Teams bereits voll sind
            const allPersonsQuery = collection(db, "personen");
            const allPersonsSnapshot = await getDocs(allPersonsQuery);
            let teams = {};
            allPersonsSnapshot.docs.forEach(doc => {
                const team = doc.data().team;
                if (!teams[team]) {
                    teams[team] = [];
                }
                teams[team].push(doc.data().spielerID);
            });
            const allTeamsHaveTwoMembers = Object.values(teams).every(team => team.length === 2);
            console.log("Alle Teams", teams);
            if (allTeamsHaveTwoMembers) {
                notifications.show({
                    title: 'Fehler!',
                    message: 'Alle Teams sind bereits voll. Registriere dich als Reservefahrer indem du auf "Als Reserve registrieren" klickst.',
                    autoClose: 6000,
                    color: 'red'
                });
                setAllTeamsHaveTwoMembers(true);
                return;
            }
    
            // Überprüfen, ob das Team bereits zwei Personen hat
            const teamQuery = query(collection(db, "personen"), where("team", "==", newProfile.team));
            const teamSnapshot = await getDocs(teamQuery);
            if (teamSnapshot.size >= 2) {
                notifications.show({
                    title: 'Fehler!',
                    message: 'Bitte wähle ein anderes Team, dieses Team ist bereits voll.',
                    autoClose: 3000,
                    color: 'red'
                });
                return;
            }
    
            const docRef = await addDoc(collection(db, "personen"), personData);
    
            // Fügen Sie die generierte ID dem Personendatensatz hinzu
            await updateDoc(doc(db, "personen", docRef.id), {
                id: docRef.id
            });

            setShowForm(false);
            setDrawerOpen(Prev => !Prev);
    
            notifications.show({
                title: 'Account erstellt!',
                message: 'Du hast dich erfolgreich Registriert! 🎉',
                autoClose: 3000,
                color: 'green'
            });
    
            setNewProfile({
                name: "",
                team: ""
            });
        } catch (e) {
            console.error("Fehler beim Speichern der Person: ", e);
        }
    };

    const handleRegisterReserve = async (event) => {

        // Überprüfen, ob die SpielerID eingegeben wurde 
        if (!newProfile.name) {
            notifications.show({
                title: 'Fehler!',
                message: 'Bitte gib mindestens eine SpielerID ein.',
                autoClose: 3000,
                color: 'red'
            });
            return;
        }

        const personData = {
            spielerID: newProfile.name,
        };

        const docRef = await addDoc(collection(db, "personen"), personData);
    
            // Fügen Sie die generierte ID dem Personendatensatz hinzu
            await updateDoc(doc(db, "personen", docRef.id), {
                id: docRef.id
            });

            setShowForm(false);
            setDrawerOpen(Prev => !Prev);
    
            notifications.show({
                title: 'Account erstellt!',
                message: 'Du hast dich erfolgreich Registriert! 🎉',
                autoClose: 3000,
                color: 'green'
            });
    
            setNewProfile({
                name: "",
            });
    }
    return (
        <>
            {!showForm && (
            <>
                <Divider />
                <div style={{ marginTop: '20px', marginBottom: '10px' }}>
                    <Select
                        label="Wähle deinen Fahrer aus:"
                        placeholder="Fahrer auswahl"
                        searchable
                        data={personen
                            .filter(person => person.spielerID !== "Driver OUT")
                            .map(person => ({value: person.spielerID, label: person.spielerID}))
                        }
                        onChange={(value) => setSelectedData({...selectedData, spielerID: value})}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <Select
                        label="Wähle die Strecke aus:"
                        placeholder="Strecken auswahl"
                        data={strecken}
                        onChange={(value) => setSelectedData({...selectedData, strecke: value})}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <Select
                        label="Wähle deine Punkte aus:"
                        placeholder="Punkte auswahl"
                        data={punkte.map(punkt => ({value: punkt, label: punkt}))}
                        onChange={(value) => setSelectedData({...selectedData, punkte: value})}
                    />
                </div>
                {driverWithNoTeam && (
                    <div style={{marginBottom: '10px'}}>
                        <Select
                            style={{ marginTop: '10px' }}
                            label="Team"
                            placeholder="Wähle das Team aus"
                            data={teams}
                            onChange={(value) => setSelectedData({...selectedData, team: value})}
                        />
                    </div>
                )}
                <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'flex-start' }}>
                    <Checkbox
                        label="Pole Position?"
                        defaultChecked={false}
                        style={{ marginRight: '15px' }}
                        onChange={(event) => setSelectedData({...selectedData, pole: event.currentTarget.checked})}
                    />
                    <Checkbox
                        label="Fahrer des Tages?"
                        defaultChecked={false}
                        onChange={(event) => setSelectedData({...selectedData, driverOfTheDay: event.currentTarget.checked})}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px'}}>
                    <UnstyledButton onClick={() => setShowForm(true)}>Noch kein Profil?</UnstyledButton>
                    <Button variant="filled" color="rgba(0, 0, 0, 1)" radius="lg" onClick={handleClick}>Speichern</Button>
                </div>
            </>
            )}

            {showForm && (
                <Paper padding="md" style={{ marginTop: '20px' }}>
                    <form>
                        <Input.Wrapper label="SpielerID">
                        <Input
                            placeholder="Gib hier deine SpielerID ein"
                            value={newProfile.name}
                            onChange={(event) => setNewProfile({ ...newProfile, name: event.currentTarget.value })}
                        />
                        </Input.Wrapper>
                        {!allTeamsHaveTwoMembers && (
                        <Select
                            style={{ marginTop: '10px' }}
                            label="Team"
                            placeholder="Wähle dein Team aus"
                            data={teams}
                            value={newProfile.team}
                            onChange={(value) => setNewProfile({ ...newProfile, team: value })}
                        />
                        )}
                        <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '10px'}}>
                        {!allTeamsHaveTwoMembers && (
                            <Button
                                style={{ marginTop: '10px' }}
                                variant="filled"
                                color="rgba(0, 0, 0, 1)"
                                radius="lg"
                                onClick={handleRegister}
                            >
                                Registrieren
                            </Button>
                        )}
                        {allTeamsHaveTwoMembers && (
                            <Button
                                style={{ marginTop: '10px' }}
                                variant="filled"
                                color="rgba(0, 0, 0, 1)"
                                radius="lg"
                                onClick={handleRegisterReserve}
                            >
                                Als Reserve registrieren
                            </Button>
                        )}
                        </div>
                    </form>
                </Paper>
            )}
        </>
    );
}

export default ErgebnisEintragen;