import React, { useState, useEffect} from "react";
import { useDisclosure } from '@mantine/hooks';
import { Modal, ScrollArea, Center, Title, Space, Progress, Box, Text } from '@mantine/core';
import Table from 'react-bootstrap/Table';
import './Rennergebnise.css';

const LiveRennenDaten = ({SessionData, Fahrerliste, Rundendaten, CarTelemetry}) => {

    const [opened, { open, close }] = useDisclosure(false);
    const [TelemetrieData, setTelemetrieData] = useState(null);

    useEffect(() => {
        console.log('Fahrerliste:', Fahrerliste);
        console.log('Rundendaten:', Rundendaten);
        console.log('CarTelemetry:', CarTelemetry);
    }, [Fahrerliste, Rundendaten, CarTelemetry]);

    const [height, setHeight] = useState('90vh');

    function getTrackName(id) {
        switch(id) {
            case 0:
                return "Australien";
            case 1:
                return "Paul Ricard";
            case 2:
                return "China";
            case 3:
                return "Bahrain";
            case 4:
                return "Spanien";
            case 5:
                return "Monaco";
            case 6:
                return "Kanda";
            case 7:
                return "Großbritannien";
            case 8:
                return "Hockenheim";
            case 9:
                return "Ungarn";
            case 10:
                return "Belgien";
            case 11:
                return "Monza";
            case 12:
                return "Singapur";
            case 13:
                return "Japan";
            case 14:
                return "Abu Dhabi";
            case 15:
                return "Texas";
            case 16:
                return "Brasilien";
            case 17:
                return "Österreich";
            case 18:
                return "Russland";
            case 19:
                return "Mexiko";
            case 20:
                return "Aserbaidschan";
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
                return "Portugal";
            case 29:
                return "Saudi Arabien";
            case 30:
                return "Miami";
            case 31:
                return "Las Vegas";
            case 32:
                return "Katar";
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

    function getEngineRPM(engineRPM) {
        if (engineRPM === 0) {
            return 0;
        } else if (engineRPM >= 3500 && engineRPM <= 10075) {
            return 6; 
        } else if (engineRPM >= 10076 && engineRPM <= 10210) {
            return 13;
        } else if (engineRPM >= 10211 && engineRPM <= 10350) {
            return 19;
        } else if (engineRPM >= 10351 && engineRPM <= 10490) {
            return 25;
        } else if (engineRPM >= 10491 && engineRPM <= 10630) {
            return 33; //Grün bis hier hin
        } else if (engineRPM >= 10631 && engineRPM <= 10800) {
            return 40;
        } else if (engineRPM >= 10801 && engineRPM <= 11000) {
            return 46;
        } else if (engineRPM >= 11001 && engineRPM <= 11150) {
            return 52;
        } else if (engineRPM >= 11151 && engineRPM <= 11300) {
            return 58;
        } else if (engineRPM >= 11301 && engineRPM <= 11470) {
            return 65; //Rot bis hier hin
        } else if (engineRPM >= 11471 && engineRPM <= 11615) {
            return 70;
        } else if (engineRPM >= 11616 && engineRPM <= 11750) {
            return 78;
        } else if (engineRPM >= 11751 && engineRPM <= 11900) {
            return 85;
        } else if (engineRPM >= 11901 && engineRPM <= 12050) {
            return 95;
        } else if (engineRPM >= 12051) {
            return 100; //Lila bis hier hin
        }
    }

    function getThrottle(throttle) {
        if (throttle === 0) {
            return 0;
        } else if (throttle === 0.1) {
            return 10;
        } else if (throttle === 0.2) {
            return 20;
        } else if (throttle === 0.3) {
            return 30;
        } else if (throttle === 0.4) {
            return 40;
        } else if (throttle === 0.5) {
            return 50;
        } else if (throttle === 0.6) {
            return 60;
        } else if (throttle === 0.7) {
            return 70;
        } else if (throttle === 0.8) {
            return 80;
        } else if (throttle === 0.9) {
            return 90;
        } else if (throttle === 1) {
            return 100;
        }
    }

    function getBrake(brake) {
        if (brake === 0) {
            return 0;
        } else if (brake === 0.1) {
            return 10;
        } else if (brake === 0.2) {
            return 20;
        } else if (brake === 0.3) {
            return 30;
        } else if (brake === 0.4) {
            return 40;
        } else if (brake === 0.5) {
            return 50;
        } else if (brake === 0.6) {
            return 60;
        } else if (brake === 0.7) {
            return 70;
        } else if (brake === 0.8) {
            return 80;
        } else if (brake === 0.9) {
            return 90;
        } else if (brake === 1) {
            return 100;
        }
    }

    const handleZeilenKlick = (item) => {
        console.log("Item:", item);
        setTelemetrieData(item);
        open();
    };

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
                                Fahrerliste && Rundendaten && CarTelemetry && Fahrerliste.slice(0, -2)
                                    .map((fahrer, index) => ({ 
                                        fahrer, 
                                        rundendaten: Rundendaten[index],
                                        carTelemetry: CarTelemetry[index]
                                    }))
                                    .filter(item => item.fahrer.m_name !== "") // Filtert alle Elemente, bei denen m_carPosition nicht 0 ist
                                    .sort((a, b) => a.rundendaten.m_carPosition - b.rundendaten.m_carPosition)
                                    .map((item, index) => (
                                        <tr key={index} onClick={() => handleZeilenKlick(item)}>
                                            <td>{item.rundendaten ? item.rundendaten.m_carPosition : 'N/A'}</td>
                                            <td>{item.fahrer.m_name}</td>
                                            <td>{item.rundendaten ? (item.rundendaten.m_gridPosition  + 1): 'N/A'}</td>
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

            <Modal opened={opened} onClose={close} centered title="Live Telemetrie">
                <div>
                    <Center>
                        <Title order={2}>Live Telemetrie von {TelemetrieData?.fahrer?.m_name}</Title>
                    </Center>
                </div>

                <Space h="md" />
                
                <div>
                    <Progress value={getEngineRPM(TelemetrieData?.carTelemetry?.m_engineRPM)} />
                </div>

                <Space h="md" />

                <div>
                    <Center>
                        <Title order={1} size="h1">{TelemetrieData?.carTelemetry?.m_gear}</Title>
                    </Center>
                    <Center>
                        <Text size="sm">{TelemetrieData?.carTelemetry?.m_speed} KM/H</Text>
                    </Center>
                    <Space h="md" />
                    <Progress color="green" value={getThrottle(TelemetrieData?.carTelemetry?.m_throttle)} size={5}/>
                    <Progress color="red" value={getBrake(TelemetrieData?.carTelemetry?.m_brake)} size={5}/>
                </div>
            </Modal>
        </>
    );
}
export default LiveRennenDaten;