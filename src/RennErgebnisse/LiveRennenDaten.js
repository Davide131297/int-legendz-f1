import React, { useState, useEffect} from "react";
import { useDisclosure } from '@mantine/hooks';
import { Modal, ScrollArea, Center, Title, Space, Progress, Text, Switch, SimpleGrid, ActionIcon, Tooltip } from '@mantine/core';
import Table from 'react-bootstrap/Table';
import './Rennergebnise.css';
import { IoIosSave } from "react-icons/io";
import { realtimeDatabase, db } from './../utils/firebase';
import { ref, set } from 'firebase/database';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { notifications } from '@mantine/notifications';

const LiveRennenDaten = ({SessionData, Fahrerliste, Rundendaten, CarTelemetry, CarStatus, CarDamage, CarMotion}) => {

    const [opened, { open, close }] = useDisclosure(false);
    const [TelemetrieIndex, setTelemetrieIndex] = useState(null);
    const [openedTestModal, setOpenTestModal] = useState(false);

    useEffect(() => {
        console.log('Fahrerliste:', Fahrerliste);
        console.log('Rundendaten:', Rundendaten);
        console.log('CarTelemetry:', CarTelemetry);
        console.log('CarStatus:', CarStatus);
        console.log('CarDamage:', CarDamage);
        console.log('CarMotion:', CarMotion);
    }, [Fahrerliste, Rundendaten, CarTelemetry, CarStatus, CarDamage, CarMotion]);

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

    function getStatus(PitStatus, resultStatus) {
        if (resultStatus === 2) {
            switch (PitStatus) {
                case 0: return "";
                case 1: return "In der Box";
                case 2: return "In der Pitlane";
                default: return "Unbekannter Status";
            }
        } else if ([3, 4, 5].includes(resultStatus)) {
            switch (resultStatus) {
                case 3: return "🏁";
                case 4: return "DNF";
                case 5: return "DSQ";
                default: return "Unbekannter Status";
            }
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
        } else if (throttle >= 0.1 && throttle <= 0.2) {
            return 10;
        } else if (throttle >= 0.21 && throttle <= 0.3) {
            return 20;
        }  else if (throttle >= 0.31 && throttle <= 0.4) {
            return 30;
        } else if (throttle >= 0.41 && throttle <= 0.5) {
            return 40;
        } else if (throttle >= 0.51 && throttle <= 0.6) {
            return 50;
        } else if (throttle >= 0.61 && throttle <= 0.7) {
            return 60;
        } else if (throttle >= 0.71 && throttle <= 0.8) {
            return 70;
        } else if (throttle >= 0.81 && throttle <= 0.9) {
            return 80;
        } else if (throttle >= 0.91 && throttle <= 0.99) {
            return 90;
        } else if (throttle === 1) {
            return 100;
        }
    }

    function getBrake(brake) {
        if (brake === 0) {
            return 0;
        } else if (brake >= 0.1 && brake <= 0.2) {
            return 10;
        } else if (brake >= 0.21 && brake <= 0.3) {
            return 20;
        }  else if (brake >= 0.31 && brake <= 0.4) {
            return 30;
        } else if (brake >= 0.41 && brake <= 0.5) {
            return 40;
        } else if (brake >= 0.51 && brake <= 0.6) {
            return 50;
        } else if (brake >= 0.61 && brake <= 0.7) {
            return 60;
        } else if (brake >= 0.71 && brake <= 0.8) {
            return 70;
        } else if (brake >= 0.81 && brake <= 0.9) {
            return 80;
        } else if (brake >= 0.91 && brake <= 0.99) {
            return 90;
        } else if (brake === 1) {
            return 100;
        }
    }

    function getDRS(drs) {
        if (drs === 0) {
            return false;
        } else if (drs === 1) { 
            return true;
        }
    }

    function getERSMode(ers) {
        if (ers === 0) {
            return false;
        } else if (ers >= 1) {
            return true;
        }
    }

    function getERSDescription(ers) {
        if (ers === 0) {
            return "ERS Aus";
        } else if (ers === 1) {
            return "Mittel";
        } else if (ers === 2) {
            return "Hotlap";
        } else if (ers === 3) {
            return "Überholen";
        } else {
            return "Unbekannt";
        }
    }

    function getVisualTyre(tyre) {
        if (tyre === 16) {
            return "http://tyre-assets.pirelli.com/staticfolder/Tyre/resources/img/red-parentesi.png";
        } else if (tyre === 17) {
            return "http://tyre-assets.pirelli.com/staticfolder/Tyre/resources/img/yellow-parentesi.png";
        } else if (tyre === 18) {
            return "http://tyre-assets.pirelli.com/staticfolder/Tyre/resources/img/white-parentesi.png";
        } else if (tyre === 7) {
            return "https://tyre-assets.pirelli.com/images/global/380/862/cinturato-green-intermediate-4505508953587.png";
        } else if (tyre === 8) {
            return "https://tyre-assets.pirelli.com/images/global/968/233/cinturato-blue-wet-4505508953865.png";
        }
    }

    const handleZeilenKlick = (item) => {
        console.log("Item:", item);
        setTelemetrieIndex(item);
        open();
    };

    function handlePointsforPosition(position) {
        switch (position) {
            case 1:
                return 25;
            case 2:
                return 18;
            case 3:
                return 15;
            case 4:
                return 12;
            case 5:
                return 10;
            case 6:
                return 8;
            case 7:
                return 6;
            case 8:
                return 4;
            case 9:
                return 2;
            case 10:
                return 1;
            default:
                return 0;
        }
    };

    function getResultStatus(status) {
        switch (status) {
            case 0:
                return "Invalid";
            case 1:
                return "Inactive";
            case 2:
                return "Active";
            case 3:
                return "Finished";
            case 4:
                return "Did not finish";
            case 5:
                return "Disqualified";
            default:
                return "Unbekannt";
        }
    }

    async function handleUploadfinalClassification() {
        const classificationData = {};
    
        Fahrerliste.forEach((fahrer, index) => {
            classificationData[index] = {
                m_position: Rundendaten[index] ? Rundendaten[index].m_carPosition : 'N/A',
                m_gridPosition: Rundendaten[index] ? Rundendaten[index].m_gridPosition : 'N/A',
                m_points: handlePointsforPosition(Rundendaten[index] ? Rundendaten[index].m_carPosition : 'N/A'),
                m_numPitStops: Rundendaten[index] ? Rundendaten[index].m_numPitStops : 'N/A',
                m_resultStatus: getResultStatus(Rundendaten[index] ? Rundendaten[index].m_resultStatus : 'N/A'),
                m_penaltiesTime: Rundendaten[index] ? Rundendaten[index].m_penalties : 'N/A',
                m_name: Fahrerliste[index].m_name,
                m_teamId: Fahrerliste[index].m_teamId
            };
        });
    
        const finalData = {
            m_classificationData: classificationData
        };
    
        console.log('finalData:', finalData);
        
        try {
            const docRef = doc(db, "Ergebnisse", Strecke);
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
                notifications.show({
                    title: 'Bereits hochgeladen',
                    message: 'Dokument existiert bereits, Daten werden nicht erneut hochgeladen',
                    color: 'red'
                });
            } else {
                const uploadToRealtimeDatabase = set(ref(realtimeDatabase, 'finalClassification'), finalData);
                const uploadToFirestore = setDoc(doc(db, "Ergebnisse", Strecke), finalData);
    
                await Promise.all([uploadToRealtimeDatabase, uploadToFirestore]);
    
                console.log('Both uploads were successful');
                notifications.show({
                    title: 'Erfolgreich',
                    message: 'Endklassifizierung erfolgreich hochgeladen',
                    color: 'green'
                });
            }
        } catch (error) {
            console.error('Error uploading data:', error);
        }
    };

    function getRearDamageColor(damage) {
        if (damage >= 0 && damage <= 10) {
            return '#01DF3A';
        } else if (damage >= 11 && damage <= 16) {
            return 'blue';
        } else if (damage >= 17 && damage <= 25) {
            return '#A5DF00';
        } else if (damage >= 26 && damage <= 35) {
            return '#F4FA58';
        } else if (damage >= 36 && damage <= 50) {
            return '#FFFF00';
        } else if (damage >= 51 && damage <= 75) {
            return '#FF8000';
        } else if (damage === 100)
            return '#FF0000';
    }

    function getFrontWingDamageColor(damage) {
        if (damage >= 0 && damage <= 10) {
            return '#01DF3A';
        } else if (damage >= 11 && damage <= 50) {
            return '#9ACD32'
        } else if (damage >= 50 && damage <= 70) {
            return '#FFBF00';
        } else if (damage >= 71 && damage <= 99) {
            return '#FF8000';
        } else if (damage === 100) {
            return '#FF0000';
        }
    }

    function getUniversalDamageColor(damage) {
        if (damage >= 0 && damage <= 10) {
            return '#01DF3A';
        } else if (damage >= 11 && damage <= 50) {
            return '#FFBF00';
        } else if (damage >= 51 && damage <= 70) {
            return '#FF8000';
        } else if (damage >= 71 && damage <= 99) {
            return '#DF3A01';
        } else if (damage === 100) {
            return '#FF0000';
        }
    }

    function handleTestModal() {
        setOpenTestModal(true);
        setTelemetrieIndex(19);
    }

    function getGradient(brake) {
        console.log('Brake:', brake);
        if (brake === 0) {
            console.log('0%');
            return "0%";
        } else if (brake >= 0.1 && brake <= 0.2) {
            console.log('10%');
            return "10%";
        } else if (brake >= 0.21 && brake <= 0.3) {
            console.log('20%');
            return "20%";
        }  else if (brake >= 0.31 && brake <= 0.4) {
            console.log('30%');
            return "30%";
        } else if (brake >= 0.41 && brake <= 0.5) {
            console.log('40%');
            return "40%";
        } else if (brake >= 0.51 && brake <= 0.6) {
            console.log('50%');
            return "50%";
        } else if (brake >= 0.61 && brake <= 0.7) {
            console.log('60%');
            return "60%";
        } else if (brake >= 0.71 && brake <= 0.8) {
            console.log('70%');
            return "70%";
        } else if (brake >= 0.81 && brake <= 0.9) {
            console.log('80%');
            return "80%";
        } else if (brake >= 0.91 && brake <= 0.99) {
            console.log('90%');
            return "90%";
        } else if (brake === 1) {
            console.log('100%');
            return "100%";
        }
    }

    function getDRSMode(drs) {
        if (drs === 0) {
            return "white";
        } else if (drs === 1) {
            return "yellow";
        }
    }

    return (
        <>  
            <div style={{marginLeft: '20px', marginTop: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <p>Rennstrecke: {Strecke}</p>
                <p>Sessionlänge: {SessionLänge}</p>
                <p>Sessiontyp: {SessionTyp}</p>
            </div>

            <div>
                <Center>
                    <Tooltip label="Ergebnis Speichern">
                        <ActionIcon variant="transparent" aria-label="Settings" color="black" onClick={handleUploadfinalClassification}>
                            <IoIosSave size={20} stroke={1.5}/>
                        </ActionIcon>
                    </Tooltip>
                </Center>
                <Center>
                    <button onClick={handleTestModal}>Öffnen</button>
                </Center>
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
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody style={{cursor: 'pointer'}}>
                            {
                                Fahrerliste && Rundendaten && CarTelemetry && CarStatus && Fahrerliste.slice(0, -2)
                                    .map((fahrer, index) => ({ 
                                        fahrer, 
                                        rundendaten: Rundendaten[index],
                                        carTelemetry: CarTelemetry[index],
                                        carStatus: CarStatus[index],
                                        originalIndex: index
                                    }))
                                    .filter(item => item.fahrer.m_name !== "") // Filtert alle Elemente, bei denen m_carPosition nicht 0 ist
                                    .sort((a, b) => a.rundendaten.m_carPosition - b.rundendaten.m_carPosition)
                                    .map((item, index) => (
                                        <tr key={index} onClick={() => handleZeilenKlick(item.originalIndex)}>
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
                                            <td>{item.rundendaten ? getStatus(item.rundendaten.m_pitStatus, item.rundendaten.m_resultStatus) : 'N/A'}</td>
                                        </tr>
                                    ))
                            }
                        </tbody>
                    </Table>
                </ScrollArea>
            </div>

            <Modal 
                opened={opened} 
                onClose={close} 
                centered 
                title="Live Telemetrie"
            >
                <div>
                    <Center>
                        <Title order={2}>Live Telemetrie von {Fahrerliste[TelemetrieIndex]?.m_name}</Title>
                    </Center>
                </div>

                <Space h="xl" />
                
                {CarDamage[TelemetrieIndex] && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <div style={{marginLeft: '20px'}}>
                            {CarTelemetry[TelemetrieIndex] && (
                                <>
                                    <svg width="130%" height="auto" viewBox="0 0 3375 3375" version="1.1" xmlns="http://www.w3.org/2000/svg" style={{ fillRule: 'evenodd', clipRule: 'evenodd', strokeLinecap: 'round', strokeLinejoin: 'round', strokeMiterlimit: 1.5 }}>
                                        <defs>
                                            <linearGradient id="brakeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" style={{ stopColor: 'red', stopOpacity: 1 }} />
                                            <stop offset={getGradient((CarTelemetry[TelemetrieIndex]?.m_brake))} style={{ stopColor: 'red', stopOpacity: 1 }} />
                                            <stop offset={getGradient((CarTelemetry[TelemetrieIndex]?.m_brake))} style={{ stopColor: '#fff', stopOpacity: 1 }} />
                                            <stop offset="100%" style={{ stopColor: '#fff', stopOpacity: 1 }} />
                                            </linearGradient>
                                        </defs>
                                        <circle id="Hintergrund" cx="1687.5" cy="1687.5" r="1666.67" style={{ fillOpacity: 0.9 }} />
                                        <rect id="Throttle" x="2593.22" y="840.25" width="272.224" height="1694.5" style={{ fill: '#fff', stroke: '#001cff', strokeWidth: '20.83px' }} />
                                        <rect id="Brake" x="510.719" y="840.25" width="272.224" height="1694.5" style={{ fill: 'url(#brakeGradient)', stroke: '#001cff', strokeWidth: '20.83px' }} />
                                        <circle cx="1687.5" cy="1687.5" r="1666.67" style={{ fill: 'none', stroke: '#001cff', strokeWidth: '41.67px' }} />
                                        <path id="DRS_Bereich" d="M2027.92,2115.17l0,154.855c0,62.835 -51.014,113.85 -113.849,113.85l-453.14,-0c-62.835,-0 -113.849,-51.015 -113.849,-113.85l-0,-154.855c-0,-62.836 51.014,-113.85 113.849,-113.85l453.14,-0c62.835,-0 113.849,51.014 113.849,113.85Z" style={{ fill: getDRSMode(CarTelemetry[TelemetrieIndex]?.m_drs) }} />
                                        <g id="DRS_Text" transform="matrix(235.553,0,0,235.553,1933.23,2276.91)"></g>
                                        <text x="1435.9px" y="2276.91px" style={{ fontFamily: 'ArialMT, Arial, sans-serif', fontSize: '235.553px' }}>DRS</text>
                                        <g id="KMH_data" transform="matrix(536.393,0,0,536.393,2136.55,1016.56)"></g>
                                        <text x="1241.6px" y="1016.56px" style={{ fontFamily: 'ArialMT, Arial, sans-serif', fontSize: '536.393px', fill: '#fff' }}>{CarTelemetry[TelemetrieIndex]?.m_speed}</text>
                                        <g transform="matrix(200,0,0,200,1910.45,1254.56)"></g>
                                        <text x="1466.02px" y="1254.56px" style={{ fontFamily: 'ArialMT, Arial, sans-serif', fontSize: '200px', fill: '#fff' }}>KMH</text>
                                        <g id="RPM_data" transform="matrix(331.652,0,0,331.652,2150.25,1604.71)"></g>
                                        <text x="1228.01px" y="1604.71px" style={{ fontFamily: 'ArialMT, Arial, sans-serif', fontSize: '331.652px', fill: '#fff' }}>{CarTelemetry[TelemetrieIndex]?.m_engineRPM}</text>
                                        <g transform="matrix(200,0,0,200,1906.94,1813.34)"></g>
                                        <text x="1462.5px" y="1813.34px" style={{ fontFamily: 'ArialMT, Arial, sans-serif', fontSize: '200px', fill: '#fff' }}>RPM</text>
                                        <g id="GEAR_data" transform="matrix(200,0,0,200,2061.33,2741.53)"></g>
                                        <text x="1950.1px" y="2741.53px" style={{ fontFamily: 'ArialMT, Arial, sans-serif', fontSize: '200px', fill: '#fff' }}>{CarTelemetry[TelemetrieIndex]?.m_gear}</text>
                                        <g transform="matrix(200,0,0,200,1878.61,2741.53)"></g>
                                        <text x="1311.81px" y="2741.53px" style={{ fontFamily: 'ArialMT, Arial, sans-serif', fontSize: '200px', fill: '#fff' }}>GEAR</text>
                                    </svg>
                                </>
                            )}
                        </div>

                        <div style={{marginLeft: '60px'}}>
                            <svg 
                                width="90%" 
                                height="auto" 
                                viewBox="0 0 263 542" 
                                ersion="1.1" 
                                xmlns="http://www.w3.org/2000/svg" 
                                style={{
                                    fillRule: 'evenodd',
                                    clipRule: 'evenodd',
                                    strokeLinejoin: 'round',
                                    strokeMiterlimit: 2
                                }}
                            >
                                <g>
                                    <path 
                                        id="reifen_hinten_links" 
                                        d="M35.742,444.466l-23.655,-0.483l-0.149,-72.683l23.791,-0.004l0.013,73.17Z"
                                        style={{ fill: getRearDamageColor(CarDamage[TelemetrieIndex]?.m_tyresDamage[0])}}
                                    />
                                    <path 
                                        id="reifen_hinten_rechts" 
                                        d="M226.046,374.113l23.792,-0.005l0.012,70.15l-23.792,0.005l-0.012,-70.15Z" 
                                        style={{ fill: getRearDamageColor(CarDamage[TelemetrieIndex]?.m_tyresDamage[1])}}
                                    />
                                    <path 
                                        id="reifen_vorne_links" 
                                        d="M11.908,175.396l-0.012,-70.15l23.787,-0.004l0.013,70.15l-23.788,0.004Z" 
                                        style={{ fill: getRearDamageColor(CarDamage[TelemetrieIndex]?.m_tyresDamage[2])}}
                                    />
                                    <path 
                                        id="reifen_vorne_rechts" 
                                        d="M249.792,105.208l0.012,70.146l-23.787,0.004l-0.013,-70.145l23.788,-0.005Z" 
                                        style={{ fill: getRearDamageColor(CarDamage[TelemetrieIndex]?.m_tyresDamage[3])}}
                                    />
                                    <path 
                                        id="fluegel_vorne_links" 
                                        d="M23.783,58.479l-0.008,-35.075l83.267,-0.012l0.004,35.075l-83.263,0.012Z" 
                                        style={{ fill: getFrontWingDamageColor(CarDamage[TelemetrieIndex]?.m_frontLeftWingDamage)}}
                                    />
                                    <path 
                                        id="fluegel_vorne_rechts" 
                                        d="M237.883,23.371l0.009,35.071l-83.267,0.016l-0.004,-35.075l83.262,-0.012Z" 
                                        style={{ fill: getFrontWingDamageColor(CarDamage[TelemetrieIndex]?.m_frontRightWingDamage)}}
                                    />
                                    <path 
                                        id="Heckfluegel" 
                                        d="M202.275,479.342l0.008,46.762l-142.741,0.025l-0.005,-46.767l142.738,-0.02Z" 
                                        style={{ fill: getUniversalDamageColor(CarDamage[TelemetrieIndex]?.m_rearWingDamage)}}
                                    />
                                    <path 
                                        id="Motor" 
                                        d="M116.079,444.279l-40.796,-128.6l31.804,-0.004l0.009,35.075c-0,6.467 5.316,11.692 11.896,11.692l23.791,-0.005c6.575,-0.004 11.892,-5.229 11.892,-11.695l-0.008,-35.075l31.808,-0.005l-40.754,128.613l-29.642,0.004Z" 
                                        style={{ fill: getUniversalDamageColor(CarDamage[TelemetrieIndex]?.m_engineDamage)}}
                                    />
                                    <path 
                                        id="Seitenkasten_Right" 
                                        d="M190.371,432.575l-28.367,0.004l28.354,-90.612l0.013,90.608Z" 
                                        style={{ fill: getUniversalDamageColor(CarDamage[TelemetrieIndex]?.m_floorDamage)}}
                                    />
                                    <path 
                                        id="Seitenkasen_Left" 
                                        d="M71.425,432.596l-0.017,-90.608l28.384,90.604l-28.367,0.004Z" 
                                        style={{ fill: getUniversalDamageColor(CarDamage[TelemetrieIndex]?.m_floorDamage)}}
                                    />
                                    <path 
                                        d="M214.108,105.213l0.005,23.383l-59.475,0.008c-0.005,-19.467 -0.005,-39.808 -0.009,-58.454l83.263,-0.017l0.004,11.692l11.896,-0l-0.013,-70.15l-95.158,0.017c-0.004,-7.388 -0.004,-11.692 -0.004,-11.692l-47.58,0.008l0,11.692l-95.158,0.017l0.013,70.145l11.895,0l-0.004,-11.691l83.267,-0.013c-0,18.646 0.004,38.988 0.008,58.455l-59.475,0.012l-0.004,-23.383c0,-6.467 -5.317,-11.692 -11.896,-11.692l-23.791,0.004c-6.575,0 -11.892,5.229 -11.892,11.696l0.012,70.146c0,6.466 5.317,11.691 11.896,11.691l23.792,-0.004c6.575,-0.004 11.892,-5.229 11.892,-11.696l-0.005,-16.566l59.484,35.054l-0,16.579c0.008,35.075 -47.563,93.538 -47.563,93.538l0.013,93.533l-11.892,0l-0.004,-23.383c-0.004,-6.463 -5.321,-11.688 -11.9,-11.688l-23.788,0.004c-6.579,0 -11.895,5.225 -11.891,11.692l0.008,70.15c0.004,6.462 5.321,11.692 11.9,11.688l23.788,-0.005c6.579,0 11.895,-5.225 11.891,-11.691l0,-23.384l11.892,0l0.004,23.38l43.917,-0.005l3.666,11.692l11.896,-0.004l0,11.692l-71.371,0.012l0.013,70.146l166.529,-0.025l-0.012,-70.15l-71.367,0.012l-0.004,-11.691l11.896,-0l3.662,-11.692l43.917,-0.008l-0.004,-23.384l11.895,-0.004l0,23.383c0.005,6.467 5.321,11.692 11.9,11.692l23.788,-0.004c6.579,0 11.896,-5.229 11.896,-11.696l-0.013,-70.146c0,-6.466 -5.321,-11.691 -11.896,-11.691l-23.791,0.004c-6.579,0.004 -11.896,5.229 -11.892,11.696l0.004,23.383l-11.896,0l-0.016,-93.529c-0,-0 -47.588,-58.45 -47.596,-93.525l-0,-16.579l59.467,-35.071l0.004,16.566c-0,6.463 5.316,11.688 11.896,11.688l23.791,-0.004c6.575,-0 11.892,-5.225 11.892,-11.692l-0.013,-70.15c0,-6.462 -5.316,-11.687 -11.895,-11.687l-23.792,0.004c-6.575,-0 -11.892,5.225 -11.892,11.692Zm-178.366,339.079l-23.655,-0.459l-0.15,-69.683l23.792,-0.004l0.013,70.146Zm166.533,35.05l0.008,46.762l-142.741,0.025l-0.005,-46.766l142.738,-0.021Zm23.771,-105.229l23.791,-0.005l0.013,70.15l-23.792,0.005l-0.012,-70.15Zm11.837,-350.742l0.009,35.071l-83.267,0.016c0,-13.387 -0.004,-25.416 -0.004,-35.075l83.262,-0.012Zm-214.1,35.108l-0.008,-35.075l83.267,-0.012c-0,9.654 0.004,21.687 0.004,35.075l-83.263,0.012Zm-11.875,116.917l-0.012,-70.15l23.787,-0.004l0.013,70.15l-23.788,0.004Zm47.229,-23.392l47.926,-0.008c-0.001,10.208 0.004,19.758 0.004,28.258l-47.93,-28.25Zm12.288,280.592l-0.017,-90.608l28.384,90.604l-28.367,0.004Zm44.654,11.683l-40.796,-128.6l31.804,-0.004l0.009,35.075c-0,6.467 5.316,11.692 11.896,11.692l23.791,-0.004c6.575,-0.005 11.892,-5.23 11.892,-11.696l-0.008,-35.075l31.808,-0.004l-40.754,128.612l-29.642,0.004Zm2.896,-175.371l23.792,-0.004l0.012,81.842l-23.787,0.004l-0.017,-81.842Zm71.396,163.667l-28.367,0.004l28.354,-90.612l0.013,90.608Zm-3.138,-128.604l-32.566,0.004l-0.005,-35.071c-0.004,-6.466 -5.32,-11.691 -11.9,-11.691l-23.787,0.004c-6.579,-0 -11.896,5.229 -11.892,11.691l0.004,35.075l-32.57,0.009c13.525,-17.788 44.454,-61.984 44.45,-93.542l-0.034,-198.754l23.792,-0.004l0.033,198.754c0.005,31.558 30.963,75.746 44.475,93.525Zm-32.591,-151.983l47.925,-0.009l-47.921,28.267c-0,-8.5 -0.004,-18.05 -0.004,-28.258Zm95.15,-46.78l0.012,70.146l-23.787,0.004l-0.013,-70.145l23.788,-0.005Z" 
                                        style={{ fillRule: 'nonzero' }}
                                    />
                                </g>
                            </svg>
                        </div>
                </div>
                )}
            </Modal>

            <Modal 
                opened={openedTestModal} 
                onClose={() => setOpenTestModal(false)} 
                centered 
                title="Test Modal"
                size="xl"
            >
                <div>
                    <Center>
                        <Title order={2}>Test Modal</Title>
                    </Center>
                </div>

                <Space h="xl" />

                <Center>
                    <svg width="30%" height="auto" viewBox="0 0 3375 3375" version="1.1" xmlns="http://www.w3.org/2000/svg" style={{ fillRule: 'evenodd', clipRule: 'evenodd', strokeLinecap: 'round', strokeLinejoin: 'round', strokeMiterlimit: 1.5 }}>
                        <defs>
                            <linearGradient id="brakeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: 'red', stopOpacity: 1 }} />
                            <stop offset={getGradient((CarTelemetry[TelemetrieIndex]?.m_brake))} style={{ stopColor: 'red', stopOpacity: 1 }} />
                            <stop offset={getGradient((CarTelemetry[TelemetrieIndex]?.m_brake))} style={{ stopColor: '#fff', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#fff', stopOpacity: 1 }} />
                            </linearGradient>
                        </defs>
                        <circle id="Hintergrund" cx="1687.5" cy="1687.5" r="1666.67" style={{ fillOpacity: 0.9 }} />
                        <rect id="Throttle" x="2593.22" y="840.25" width="272.224" height="1694.5" style={{ fill: '#fff', stroke: '#001cff', strokeWidth: '20.83px' }} />
                        <rect id="Brake" x="510.719" y="840.25" width="272.224" height="1694.5" style={{ fill: 'url(#brakeGradient)', stroke: '#001cff', strokeWidth: '20.83px' }} />
                        <circle cx="1687.5" cy="1687.5" r="1666.67" style={{ fill: 'none', stroke: '#001cff', strokeWidth: '41.67px' }} />
                        <path id="DRS_Bereich" d="M2027.92,2115.17l0,154.855c0,62.835 -51.014,113.85 -113.849,113.85l-453.14,-0c-62.835,-0 -113.849,-51.015 -113.849,-113.85l-0,-154.855c-0,-62.836 51.014,-113.85 113.849,-113.85l453.14,-0c62.835,-0 113.849,51.014 113.849,113.85Z" style={{ fill: getDRSMode(CarTelemetry[TelemetrieIndex]?.m_drs) }} />
                        <g id="DRS_Text" transform="matrix(235.553,0,0,235.553,1933.23,2276.91)"></g>
                        <text x="1435.9px" y="2276.91px" style={{ fontFamily: 'ArialMT, Arial, sans-serif', fontSize: '235.553px' }}>DRS</text>
                        <g id="KMH_data" transform="matrix(536.393,0,0,536.393,2136.55,1016.56)"></g>
                        <text x="1241.6px" y="1016.56px" style={{ fontFamily: 'ArialMT, Arial, sans-serif', fontSize: '536.393px', fill: '#fff' }}>{CarTelemetry[TelemetrieIndex]?.m_speed}</text>
                        <g transform="matrix(200,0,0,200,1910.45,1254.56)"></g>
                        <text x="1466.02px" y="1254.56px" style={{ fontFamily: 'ArialMT, Arial, sans-serif', fontSize: '200px', fill: '#fff' }}>KMH</text>
                        <g id="RPM_data" transform="matrix(331.652,0,0,331.652,2150.25,1604.71)"></g>
                        <text x="1228.01px" y="1604.71px" style={{ fontFamily: 'ArialMT, Arial, sans-serif', fontSize: '331.652px', fill: '#fff' }}>{CarTelemetry[TelemetrieIndex]?.m_engineRPM}</text>
                        <g transform="matrix(200,0,0,200,1906.94,1813.34)"></g>
                        <text x="1462.5px" y="1813.34px" style={{ fontFamily: 'ArialMT, Arial, sans-serif', fontSize: '200px', fill: '#fff' }}>RPM</text>
                        <g id="GEAR_data" transform="matrix(200,0,0,200,2061.33,2741.53)"></g>
                        <text x="1950.1px" y="2741.53px" style={{ fontFamily: 'ArialMT, Arial, sans-serif', fontSize: '200px', fill: '#fff' }}>{CarTelemetry[TelemetrieIndex]?.m_gear}</text>
                        <g transform="matrix(200,0,0,200,1878.61,2741.53)"></g>
                        <text x="1311.81px" y="2741.53px" style={{ fontFamily: 'ArialMT, Arial, sans-serif', fontSize: '200px', fill: '#fff' }}>GEAR</text>
                    </svg>
                </Center>
            </Modal>
        </>
    );
}
export default LiveRennenDaten;