import React, { useState, useEffect} from "react";
import { ScrollArea } from "@mantine/core";
import Table from 'react-bootstrap/Table';
import './Rennergebnise.css';

const LiveRennenDaten = ({SessionData, Fahrerliste, Rundendaten}) => {

    useEffect(() => {
        console.log('Fahrerliste:', Fahrerliste);
        console.log('Rundendaten:', Rundendaten);
    }, [Fahrerliste, Rundendaten]);

    const [height, setHeight] = useState('90vh');

    function getTrackName(id) {
        switch(id) {
            case 0:
                return "Melbourne";
            case 1:
                return "Paul Ricard";
            case 2:
                return "Shanghai";
            case 3:
                return "Bahrain";
            case 4:
                return "Catalunya";
            case 5:
                return "Monaco";
            case 6:
                return "Montreal";
            case 7:
                return "Silverstone";
            case 8:
                return "Hockenheim";
            case 9:
                return "Hungaroring";
            case 10:
                return "Spa";
            case 11:
                return "Monza";
            case 12:
                return "Singapore";
            case 13:
                return "Suzuka";
            case 14:
                return "Abu Dhabi";
            case 15:
                return "Texas";
            case 16:
                return "Brazil";
            case 17:
                return "Austria";
            case 18:
                return "Sochi";
            case 19:
                return "Mexico";
            case 20:
                return "Baku";
            case 21:
                return "Sakhir Short";
            case 22:
                return "Silverstone Short";
            case 23:
                return "Texas Short";
            case 24:
                return "Suzuka Short";
            case 25:
                return "Hanoi";
            case 26:
                return "Zandvoort";
            case 27:
                return "Imola";
            case 28:
                return "Portimão";
            case 29:
                return "Jeddah";
            case 30:
                return "Miami";
            case 31:
                return "Las Vegas";
            case 32:
                return "Losail";
            default:
                return "Unbekannte Strecke"; // Rückgabe eines Standardnamens, wenn die ID nicht erkannt wird
        }
    }

    function getSessionLengh(length) {
        switch(length) {
            case 0:
                return "Keine Daten verfügbar";
            case 2:
                return "Quickfire";
            case 3:
                return "Sehr Kurz";
            case 4:
                return "Kurz";
            case 5:
                return "Mittel";
            case 6:
                return "Lang";
            case 7:
                return "Komplett";
            default:
                return "Unbekannte Session"; // Rückgabe eines Standardnamens, wenn die ID nicht erkannt wird
        }
    }

    function getSessionType(type) {
        switch(type) {
            case 0:
                return "Unbekannt";
            case 1:
                return "P1";
            case 2:
                return "P2";
            case 3:
                return "P3";
            case 4:
                return "Kurzes Training";
            case 5:
                return "Q1"
            case 6:
                return "Q2";
            case 7:
                return "Q3";
            case 8:
                return "Kurze Qualifying";
            case 9:
                return "Blitzqualifying";
            case 10:
                return "Spint Qualifying 1";
            case 11:
                return "Sprint Qualifying 2";
            case 12:
                return "Sprint Qualifying 3";
            case 13:
                return "Kurzes Sprint Qualifying";
            case 14:
                return "Biitz Sprintqualifying";
            case 15:
                return "Rennen";
            case 16:
                return "Rennen 2";
            case 17:
                return "Rennen 3";
            case 18:
                return "Zeit Fahren";
            default:
                return "Unbekannte Session"; // Rückgabe eines Standardnamens, wenn die ID nicht erkannt wird
        }
    }


    const Strecke = getTrackName(SessionData.m_trackId);
    const SessionLänge = getSessionLengh(SessionData.m_sessionLength);
    const SessionTyp = getSessionType(SessionData.m_sessionType);

    function formatLapTime(timeInMilliseconds) {
        const minutes = Math.floor(timeInMilliseconds / 60000);
        const seconds = Math.floor((timeInMilliseconds % 60000) / 1000).toString().padStart(2, '0');
        const milliseconds = (timeInMilliseconds % 1000).toString().padStart(3, '0');

        return `${minutes}:${seconds}:${milliseconds}`;
    }

    function getPitStatus(status) {
        switch(status) {
            case 0: return "";
            case 1: return "In der Box";
            case 2: return "In der Pitlane"; 
        break;
            default: return "Unbekannter Status";
        }
    }

    function getCardWidth() {
        if (window.innerWidth < 600) {
            return '400px'
        } else if (window.innerWidth < 800) {
            return '600px'
        } else if (window.innerWidth < 1000) {  
            return 'auto'
        }
    }


    return (
        <>  
            <div style={{marginLeft: '20px', marginTop: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <p>Rennstrecke: {Strecke}</p>
                <p>Sessionlänge: {SessionLänge}</p>
                <p>Sessiontyp: {SessionTyp}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                <ScrollArea h={height} w={getCardWidth()}>
                    <Table striped bordered hover className="Live-Table">
                        <thead>
                            <tr>
                                <th>Position</th>
                                <th>Fahrername</th>
                                <th>Grid Position</th>
                                <th>Sektor 1</th>
                                <th>Sektor 2</th>
                                <th>Sektor 3</th>
                                <th>Letzte Rundenzeit</th>
                                <th>Delta zum nächsten Fahrer</th>
                                <th>Anzahl der Boxenstopps</th>
                                <th>Strafen (s)</th>
                                <th>Boxenstopp Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Fahrerliste && Rundendaten && Fahrerliste.slice(0, -2)
                                    .map((fahrer, index) => ({ fahrer, rundendaten: Rundendaten[index] }))
                                    .filter(item => item.fahrer.m_aiControlled !== 1) // Filtert alle Elemente, bei denen m_carPosition nicht 0 ist
                                    .sort((a, b) => a.rundendaten.m_carPosition - b.rundendaten.m_carPosition)
                                    .map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.rundendaten ? item.rundendaten.m_carPosition : 'N/A'}</td>
                                            <td>{item.fahrer.m_name}</td>
                                            <td>{item.rundendaten ? item.rundendaten.m_gridPosition : 'N/A'}</td>
                                            <td>{item.rundendaten && item.rundendaten.m_sector1TimeInMS && !isNaN(item.rundendaten.m_sector1TimeInMS) ? formatLapTime(item.rundendaten.m_sector1TimeInMS) : ''}</td>
                                            <td>{item.rundendaten && item.rundendaten.m_sector2TimeInMS && !isNaN(item.rundendaten.m_sector2TimeInMS) ? formatLapTime(item.rundendaten.m_sector2TimeInMS) : ''}</td>
                                            <td>{item.rundendaten && item.rundendaten.lastLapTimeInMS && !isNaN(item.rundendaten.lastLapTimeInMS - (item.rundendaten.m_sector1TimeInMS + item.rundendaten.m_sector2TimeInMS)) ? formatLapTime(item.rundendaten.lastLapTimeInMS - (item.rundendaten.m_sector1TimeInMS + item.rundendaten.m_sector2TimeInMS)) : ''}</td>
                                            <td>{item.rundendaten && item.rundendaten.m_lastLapTimeInMS && !isNaN(item.rundendaten.m_lastLapTimeInMS) ? formatLapTime(item.rundendaten.m_lastLapTimeInMS) : ''}</td>
                                            <td>{item.rundendaten && item.rundendaten.m_deltaToCarInFrontInMS && !isNaN(item.rundendaten.m_deltaToCarInFrontInMS) ? '+' + formatLapTime(item.rundendaten.m_deltaToCarInFrontInMS) : ''}</td>
                                            <td>{item.rundendaten ? item.rundendaten.m_numPitStops : 'N/A'}</td>
                                            <td>{item.rundendaten ? item.rundendaten.m_penalties : 'N/A'}</td>
                                            <td>{item.rundendaten ? getPitStatus(item.rundendaten.m_pitStatus) : 'N/A'}</td>
                                        </tr>
                                    ))
                            }
                        </tbody>
                    </Table>
                </ScrollArea>
            </div>
        </>
    );
}
export default LiveRennenDaten;