import React, {useEffect, useState} from 'react';
import { db } from './../utils/firebase';
import {onSnapshot, doc, collection} from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import './Profiltabelle.css';

const Profiltabelle = () => {

    const [person, setPersonen] = useState([]);
    const { id } = useParams(); // Extrahieren Sie die ID aus der URL
    const [Strecken, setStrecken] = useState([]);

    useEffect(() => {
        const personenRef = doc(db, 'personen', id); // Verwenden Sie die ID, um auf das spezifische Dokument zuzugreifen
        const unsubscribe = onSnapshot(personenRef, (doc) => {
            if (doc.exists()) {
                setPersonen({ id: doc.id, ...doc.data() }); // Aktualisieren Sie den Zustand mit den Daten des Dokuments
            } else {
                console.log('Kein solches Dokument!');
            }
        });

        // Aufräumen bei Unmount
        return () => unsubscribe();
    }, [id]); // Fügen Sie die ID als Abhängigkeit hinzu, um den Effekt erneut auszulösen, wenn sich die ID ändert

    useEffect(() => {
        const streckenRef = collection(db, 'Strecken');
        const unsubscribe = onSnapshot(streckenRef, (snapshot) => {
            let tempListe = [];
            snapshot.forEach((doc) => {
                let data = doc.data();
                tempListe.push({
                    name: doc.id,
                    ansicht: data.Ansicht,
                    datum: data.Datum.toDate(), // Speichere das Date-Objekt
                    flagge: data.Flagge,
                    sprint: data.Sprint
                });
            });
            // Sortiere die tempListe basierend auf dem Datum (Date-Objekte)
            tempListe.sort((a, b) => a.datum - b.datum);
            // Konvertiere das Datum in den lokalisierten String nach der Sortierung
            tempListe = tempListe.map(item => ({
                ...item,
                datum: item.datum.toLocaleDateString('de-DE')
            }));
            console.log("StreckenArray:", tempListe);
            setStrecken(tempListe);
        });
    
        // Aufräumen bei Unmount
        return () => unsubscribe();
    }, []);

    return (
        <div className='table-container'>
            <h5 className='table-header'>Punkteübersicht</h5>
            <div className='profiltabelle'>
                <Table striped bordered hover>
                    <tbody>
                    {
                        Strecken.filter(strecke => strecke.ansicht)
                            .map((strecke, index) => 
                                <tr key={index}>
                                    <td>
                                        <img src={strecke.flagge} alt="Flagge" height="10px" width="20px"/>
                                    </td>
                                    <td>
                                        {
                                            strecke.sprint ? 
                                            ((person?.wertung?.[`${strecke.name}_Sprint`] ?? null) === null && (person?.wertung?.[`${strecke.name}_Rennen`] ?? null) === null) ? 
                                            '' : 
                                            (person?.wertung?.[`${strecke.name}_Sprint`] ?? 0) + (person?.wertung?.[`${strecke.name}_Rennen`] ?? 0) :
                                            person?.wertung?.[strecke.name] ?? ''
                                        }
                                    </td>
                                </tr>
                            )
                    }
                        <tr>
                            <td>Gesamtpunkte</td>
                            <td>
                                {Object.values(person?.wertung || {}).reduce((a, b) => a + (Number.isInteger(b) ? b : 0), 0)}
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default Profiltabelle;