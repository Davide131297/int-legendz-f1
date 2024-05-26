import React, { useEffect, useState } from 'react';
import { realtimeDatabase } from './../utils/firebase';
import { ref, onValue, get } from 'firebase/database'; // Importieren Sie die ref und onValue Funktionen
import { ScrollArea } from '@mantine/core';
import './Rennergebnise.css';

const Rennergebnise = () => {
    const [RennErgebnis, setRennergebnis] = useState(null);
    const [Fahrerliste, setFahrerliste] = useState(null);
    const [height, setHeight] = useState('90vh');

    let fastestLap;
    if (RennErgebnis) {
        fastestLap = Math.min(...RennErgebnis.filter(ergebnis => ergebnis.m_bestLapTimeInMS !== 0).map(ergebnis => ergebnis.m_bestLapTimeInMS));
    }

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth < 767) {
                setHeight('74vh');
            } else {
                setHeight('90vh');
            }
        }

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    function getNationality(nationalityId) {
        const nationalities = {
            1: 'https://cdn.countryflags.com/thumbs/united-states-of-america/flag-square-250.png',
            3: 'https://cdn.countryflags.com/thumbs/australia/flag-square-250.png',
            4: 'https://cdn.countryflags.com/thumbs/austria/flag-square-250.png',
            9: 'https://cdn.countryflags.com/thumbs/brazil/flag-square-250.png',
            10: 'https://cdn.countryflags.com/thumbs/united-kingdom/flag-square-250.png',
            13: 'https://cdn.countryflags.com/thumbs/canada/flag-square-250.png',
            15: 'https://cdn.countryflags.com/thumbs/china/flag-square-250.png',
            21: 'https://cdn.countryflags.com/thumbs/denmark/flag-square-250.png',
            22: 'https://cdn.countryflags.com/thumbs/netherlands/flag-square-250.png',
            24: 'https://cdn.countryflags.com/thumbs/england/flag-square-250.png',
            27: 'https://cdn.countryflags.com/thumbs/finland/flag-square-250.png',
            28: 'https://cdn.countryflags.com/thumbs/france/flag-square-250.png',
            29: 'https://cdn.countryflags.com/thumbs/germany/flag-square-250.png',
            31: 'https://cdn.countryflags.com/thumbs/greece/flag-square-250.png',
            41: 'https://cdn.countryflags.com/thumbs/italy/flag-square-250.png',
            43: 'https://cdn.countryflags.com/thumbs/japan/flag-square-250.png',
            53: 'https://cdn.countryflags.com/thumbs/monaco/flag-square-250.png',
            77: 'https://cdn.countryflags.com/thumbs/spain/flag-square-250.png',
            80: 'https://cdn.countryflags.com/thumbs/thailand/flag-square-250.png',
            89: 'https://cdn.countryflags.com/thumbs/bosnia-and-herzegovina/flag-square-250.png'

        };

        return nationalities[nationalityId] || '/pfad/zum/standardbild.png';
    }

    function getTeam(teamId) {
        const teams = {
            0: { url: 'https://cdn3.emoji.gg/emojis/6785_Mercedes_Logo.png', width: '25', height: '25' }, // Mercedes
            1: { url: 'https://cdn3.emoji.gg/emojis/ferrari.png', width: '22', height: '28' }, // Ferrari
            2: { url: 'https://www.hatchwise.com/wp-content/uploads/2021/12/Screen-Shot-2021-12-22-at-7.31.56-AM-1024x607.png.webp', width: '50', height: '35' }, // Red Bull
            3: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Logo_Williams_F1.png/300px-Logo_Williams_F1.png', width: '25', height: '20' }, // Williams
            4: { url: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/bd/Aston_Martin_Lagonda_brand_logo.png/220px-Aston_Martin_Lagonda_brand_logo.png', width: '40', height: '20' }, // Aston Martin
            5: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Alpine_F1_Team_Logo.svg/200px-Alpine_F1_Team_Logo.svg.png', width: '25', height: '25' }, // Alpine
            6: { url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAZlBMVEX////r6+u8vL2mpqfg4OCvr6/v7+9ycnIAAAD7+/vU1NVPT1C4uLgiIiKbm5vo6OkdHR4AAAJ6enoyMjI6OjsICAkpKSlBQUGFhYbd3d5jY2NpaWrGxsZZWVn19fVLS0vMzMyQkJEEf5xWAAAAw0lEQVR4Ad2QBZbEIBQEf9COu/v9L7n0us0FphKgH4XLsxEprSIGY43V7yghzoP4OEmBLMc7BV1ZAXUNNAoB1aImgKPsUCPQJj1DNuDNpXQZu0bfFRNDOk9ACF2qKBcAq0hccjMtsiU7ACtCKgAJT8ylDxETS7D6p5wBnDyfzNv7zK9lV9RsRc/b1eIK6etAIwIqvsx4H7HvY6qvq6DGfuWdv6fi7DTF1yPUvOkYPM/avKuv52ucOQFVodKPH/465Pl4Aa3GDR90HEWMAAAAAElFTkSuQmCC', width: '30', height: '30' }, // AlphaTauri
            7: { url: 'https://logos-world.net/wp-content/uploads/2022/07/Haas-Symbol-700x394.png', width: '45', height: '25' }, // Haas
            8: { url: 'https://cdn3.emoji.gg/emojis/9807_McLaren_Logo.png', width: '35', height: '35' }, // McLaren
            9: { url: 'https://upload.wikimedia.org/wikipedia/de/thumb/c/c7/Alfa_Romeo_2015.svg/512px-Alfa_Romeo_2015.svg.png?20190221044846', width: '30', height: '30' }  // Alfa Romeo
        };

        return teams[teamId] || { url: '/pfad/zum/standardbild.png', width: '35', height: '20' };
    }

    function formatRaceTime(timeInSeconds) {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
        const milliseconds = Math.floor((timeInSeconds * 1000) % 1000).toString().padStart(3, '0');

        return `${minutes}:${seconds}:${milliseconds}`;
    }

    function formatResultStatus(status) {
        const statuses = {
            0: 'invcalid',
            1: 'inactive',
            2: 'active',
            3: 'finished',
            4: 'DNF',
            5: 'Disqualifziert',
            6: 'Nicht gestartet',
            7: 'Zurückgezogen',
        }

        return statuses[status] || 'Status unbekannt';

    }

    function formatBestRaceTime(timeInMilliseconds) {
    const minutes = Math.floor(timeInMilliseconds / 60000);
    const seconds = Math.floor((timeInMilliseconds % 60000) / 1000).toString().padStart(2, '0');
    const milliseconds = (timeInMilliseconds % 1000).toString().padStart(3, '0');

    return `${minutes}:${seconds}:${milliseconds}`;
}


    return (
        <div>
            <h1>Rennergebnisse</h1>
            <ScrollArea h={height}>
            <table>
                <thead>
                    <tr>
                        <th>Nationalität</th>
                        <th>Fahrername</th>
                        <th>Team</th>
                        <th>Grid Position</th>
                        <th>Position</th>
                        <th>Beste Persönliche Runde</th>
                        <th>Rennzeit</th>
                        <th>Punkte</th>
                        <th>{/* Ereigniss*/}</th>
                    </tr>
                </thead>
                <tbody>
                    {
                    RennErgebnis && Fahrerliste && RennErgebnis.slice(0, -2)
                        .map((ergebnis, index) => ({ fahrer: Fahrerliste[index], ergebnis }))
                        .sort((a, b) => a.ergebnis.m_position - b.ergebnis.m_position)
                        .map((item, index) => (
                            <tr key={index}>
                                <td><img src={getNationality(item.fahrer.m_nationality)} alt="Nationalität" width="20" height="20" /></td>
                                <td>{item.fahrer.m_name}</td>
                                <td>
                                    <img 
                                        src={getTeam(item.fahrer.m_teamId).url} 
                                        alt="Team" 
                                        width={getTeam(item.fahrer.m_teamId).width} 
                                        height={getTeam(item.fahrer.m_teamId).height} 
                                    />
                                </td>
                                <td>{item.ergebnis.m_gridPosition}</td>
                                <td>{item.ergebnis.m_position}</td>
                                <td style={{ color: item.ergebnis.m_bestLapTimeInMS === fastestLap ? 'purple' : 'black' }}>
                                    {formatBestRaceTime(item.ergebnis.m_bestLapTimeInMS)}
                                </td>
                                <td>{formatRaceTime(item.ergebnis.m_totalRaceTime)}</td>
                                <td>{item.ergebnis.m_points}</td>
                                { item.ergebnis.m_resultStatus !== 3 && 
                                    <td>{formatResultStatus(item.ergebnis.m_resultStatus)}</td>
                                }
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            </ScrollArea>
        </div>
    );
}

export default Rennergebnise;