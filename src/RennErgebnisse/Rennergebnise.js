import React, { useEffect, useState } from 'react';
import { realtimeDatabase } from './../utils/firebase';
import { ref, onValue } from 'firebase/database'; // Importieren Sie die ref und onValue Funktionen
import './Rennergebnise.css';
import ErgebnisTabelle from './ErgebnisTabelle';
import LiveRennenDaten from './LiveRennenDaten';
import { Tabs, rem } from '@mantine/core';
import { CiViewTable } from "react-icons/ci";
import { MdLiveTv } from "react-icons/md";
import WeatherWidget from './WetterWidget';


const Rennergebnise = () => {

    const iconStyle = { width: rem(12), height: rem(12) };
    const [RennErgebnis, setRennergebnis] = useState(null);
    const [Fahrerliste, setFahrerliste] = useState(null);
    const [WetterDaten, setWetterDaten] = useState(null);
    const [SessionData, setSessionData] = useState(null);
    const [Rundendaten, setRundendaten] = useState(null);

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

    useEffect(() => {
        const sessionRef = ref(realtimeDatabase, 'session');
        onValue(sessionRef, (snapshot) => {
            const data = snapshot.val();
            setSessionData(data);

            console.log("Eingegangene Sessiondaten:" ,data);
            const wetterDaten = data.m_weatherForecastSamples;
            const wetterDatenGespeichert = wetterDaten.slice(0, data.m_totalLaps);
            console.log("Eingegangene Wetterdaten:" ,wetterDatenGespeichert);
            console.log ("Anzahl der Runden:" ,data.m_totalLaps);
            setWetterDaten(wetterDatenGespeichert);
        });
    }, []);

    useEffect(() => {
        const lapData = ref(realtimeDatabase, 'lapData');
        onValue(lapData, (snapshot) => {
            const data = snapshot.val();
            const Rundendaten = Object.values(data);
            const RundendatenGespeichert = Rundendaten[1];
            RundendatenGespeichert.splice(-2, 2);
            console.log("Eingegangene Rundendaten:" ,RundendatenGespeichert);
            setRundendaten(RundendatenGespeichert);

        });
    }, []);

    const downloadJSON = () => {
        const data = RennErgebnis.slice(0, -2)
            .map((ergebnis, index) => ({
                fahrer: Fahrerliste[index],
                ergebnis,
                rundendaten: Rundendaten[index]
            }))
            .filter(item => item.ergebnis.m_position !== 0)
            .sort((a, b) => a.ergebnis.m_position - b.ergebnis.m_position)
            .map((item) => ({
                position: item.ergebnis.m_position,
                nationalitaet: item.fahrer.m_nationality,
                fahrername: item.fahrer.m_name,
                team: item.fahrer.m_teamId,
                gridPosition: item.ergebnis.m_gridPosition,
                bestePersoenlicheRunde: item.ergebnis.m_bestLapTimeInMS,
                rennzeit: item.ergebnis.m_totalRaceTime,
                punkte: item.ergebnis.m_points,
                ergebnisStatus: item.ergebnis.m_resultStatus,
                boxenstopps: item.rundendaten ? item.rundendaten.m_numPitStops : 'N/A',
                strafen: item.rundendaten ? item.rundendaten.m_penalties : 'N/A'
            }));

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'Rennergebnis.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <>
        {WetterDaten && (
        <div> 
            <Tabs defaultValue="Ergebnistabelle">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                <Tabs.List>
                    <Tabs.Tab value="Ergebnistabelle" leftSection={<CiViewTable style={iconStyle} />}>
                        Ergebnistabelle
                    </Tabs.Tab>
                    <Tabs.Tab value="LiveRace" leftSection={<MdLiveTv  style={iconStyle} />}>
                        Aktuelles Rennen
                    </Tabs.Tab>
                    <Tabs.Tab value="settings">
                        Settings
                    </Tabs.Tab>
                </Tabs.List>
            </div>

                <Tabs.Panel value="Ergebnistabelle">
                    <ErgebnisTabelle RennErgebnis={RennErgebnis} Fahrerliste={Fahrerliste} Rundendaten={Rundendaten} />
                </Tabs.Panel>

                <Tabs.Panel value="LiveRace">
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px'}}>
                        <WeatherWidget WetterDaten={WetterDaten} />
                    </div>
                    <LiveRennenDaten SessionData={SessionData} Fahrerliste={Fahrerliste} Rundendaten={Rundendaten}/>
                </Tabs.Panel>

                <Tabs.Panel value="settings">
                    <button onClick={downloadJSON}>Download JSON</button>
                </Tabs.Panel>
            </Tabs>
        </div>
        )}
        </>
    );
}

export default Rennergebnise;