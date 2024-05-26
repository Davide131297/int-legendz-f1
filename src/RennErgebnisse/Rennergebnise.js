import React, { useEffect, useState } from 'react';
import { realtimeDatabase } from './../utils/firebase';
import { ref, onValue } from 'firebase/database';  // Importieren Sie die ref und onValue Funktionen

const Rennergebnise = () => {
    const [RennErgebnis, setRennergebnis] = useState(null);
    const [Fahrerliste, setFahrerliste] = useState(null);

    useEffect(() => {
        const rennergebniseRef = ref(realtimeDatabase, 'finalClassification');
        onValue(rennergebniseRef, (snapshot) => {
            const data = snapshot.val();
            const Cdata = data.m_classificationData;

            // Umwandlung des Cdata Objekts in ein Array
            const rennergebnisArray = Object.values(Cdata);

            console.log("Eingegangene Rennergebnisee:" ,rennergebnisArray);
            setRennergebnis(rennergebnisArray);
        });
    }, []);

    useEffect(() => {
        const fahrerlisteRef = ref(realtimeDatabase, 'participants');
        onValue(fahrerlisteRef, (snapshot) => {
            const data = snapshot.val();
            const Cdata = data.m_participants;

            // Umwandlung des Cdata Objekts in ein Array
            const fahrerlisteArray = Object.values(Cdata);

            console.log("Eingegangene Fahrerliste:" ,fahrerlisteArray);
            setFahrerliste(fahrerlisteArray);
        });
    }, []);


    return (
        <div>
            <h1>Rennergebnise</h1>
            <table>
                <thead>
                    <tr>
                        <th>Fahrername</th>
                        <th>Grid Position</th>
                        <th>Position</th>
                        <th>Punkte</th>
                    </tr>
                </thead>
                <tbody>
                    {
                    RennErgebnis && Fahrerliste && RennErgebnis.slice(0, -2)
                        .map((ergebnis, index) => ({ fahrer: Fahrerliste[index], ergebnis }))
                        .sort((a, b) => a.ergebnis.m_position - b.ergebnis.m_position)
                        .map((item, index) => (
                            <tr key={index}>
                                <td>{item.fahrer.m_name}</td>
                                <td>{item.ergebnis.m_gridPosition}</td>
                                <td>{item.ergebnis.m_position}</td>
                                <td>{item.ergebnis.m_points}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
}

export default Rennergebnise;