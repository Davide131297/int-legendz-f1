import React, { useState } from "react";
import { ScrollArea } from "@mantine/core";

const LiveRennenDaten = ({SessionData, Fahrerliste, Rundendaten}) => {

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
                return "Sehr Kurz";
            case 3:
                return "Kurz";
            case 4:
                return "Mittel";
            case 5:
                return "Lang";
            case 6:
                return "Volle Länge";
            default:
                return "Unbekannte Session"; // Rückgabe eines Standardnamens, wenn die ID nicht erkannt wird
        }
    }

    function getSessionType(type) {
        switch(type) {
            case 0:
                return "Unbekannt";
            case 1:
                return "P12";
            case 2:
                return "P2";
            case 3:
                return "P3";
            case 4:
                return "Blitz Qualifying";
            case 5:
                return "Q1"
            case 6:
                return "Q2";
            case 7:
                return "Q3";
            case 8:
                return "Kurze Qualifying";
            case 9:
                return "OSQ";
            case 10:
                return "Rennen";
            case 11:
                return "Rennen 2";
            case 12:
                return "Rennen 3";
            case 13:
                return "Zeitrennen";
            default:
                return "Unbekannte Session"; // Rückgabe eines Standardnamens, wenn die ID nicht erkannt wird
        }
    }


    const Strecke = getTrackName(SessionData.m_trackId);
    const SessionLänge = getSessionLengh(SessionData.m_sessionLength);
    const SessionTyp = getSessionType(SessionData.m_sessionType);

    return (
        <>
            <div>
                <p>Rennstrecke: {Strecke}</p>
                <p>Sessionlänge: {SessionLänge}</p>
                <p>Sessiontyp: {SessionTyp}</p>
            </div>

            <div>
                <ScrollArea h={height}>
                    <table>
                        <thead>
                            <tr>
                                <th>Fahrername</th>
                                <th>Auto Position</th>
                                <th>Grid Position</th>
                                <th>Anzahl der Boxenstopps</th>
                                <th>Strafen</th>
                                <th>Boxenstopp Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                            Fahrerliste && Rundendaten && Fahrerliste.slice(0, -2)
                                .map((fahrer, index) => ({ fahrer, rundendaten: Rundendaten[index] }))
                                .map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.fahrer.m_name}</td>
                                        <td>{item.rundendaten ? item.rundendaten.m_carPosition : 'N/A'}</td>
                                        <td>{item.rundendaten ? item.rundendaten.m_gridPosition : 'N/A'}</td>
                                        <td>{item.rundendaten ? item.rundendaten.m_numPitStops : 'N/A'}</td>
                                        <td>{item.rundendaten ? item.rundendaten.m_penalties : 'N/A'}</td>
                                        <td>{item.rundendaten ? item.rundendaten.m_pitStatus : 'N/A'}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </ScrollArea>
            </div>
        </>
    );
}
export default LiveRennenDaten;