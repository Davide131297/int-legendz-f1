import React, { useState, useEffect} from "react";
import { useDisclosure } from '@mantine/hooks';
import { Modal, ScrollArea, Center, Title, Space, Progress, Text, Switch, SimpleGrid, ActionIcon, Tooltip } from '@mantine/core';
import Table from 'react-bootstrap/Table';
import './Rennergebnise.css';
import { IoIosSave } from "react-icons/io";
import { realtimeDatabase } from './../utils/firebase';
import { ref, onValue } from 'firebase/database'; // Importieren Sie die ref und onValue Funktionen

const LiveRennenDaten = ({SessionData, Fahrerliste, Rundendaten, CarTelemetry, CarStatus}) => {

    const [opened, { open, close }] = useDisclosure(false);
    const [TelemetrieIndex, setTelemetrieIndex] = useState(null);

    useEffect(() => {
        console.log('Fahrerliste:', Fahrerliste);
        console.log('Rundendaten:', Rundendaten);
        console.log('CarTelemetry:', CarTelemetry);
        console.log('CarStatus:', CarStatus);
    }, [Fahrerliste, Rundendaten, CarTelemetry, CarStatus]);

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

    {/*
    const handleUploadfinalClassification = () => {
        const classificationData = {};
    
        // Annahme: 'Fahrerliste' enthält die Daten der Fahrer in einer Liste
        Fahrerliste.forEach((fahrer, index) => {
            classificationData[index] = {
                m_position: "",
                m_gridPosition: "",
                m_points: "",
                m_numPitStops: "",
                m_resultStatus: "",
                m_bestLapTimeInMS: "",
                m_totalRaceTime: "",
                m_penaltiesTime: ""
                // Hier alle weiteren notwendigen Felder hinzufügen
            };
        });
    
        set(ref(realtimeDatabase, 'finalClassification'), classificationData)
            .then(() => {
                console.log('Data successfully uploaded');
            })
            .catch((error) => {
                console.error('Error uploading data:', error);
            });
    };
    */}

    return (
        <>  
            <div style={{marginLeft: '20px', marginTop: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <p>Rennstrecke: {Strecke}</p>
                <p>Sessionlänge: {SessionLänge}</p>
                <p>Sessiontyp: {SessionTyp}</p>
            </div>

            {/*}
            <div>
                <Center>
                    <Tooltip label="Ergebnis Speichern">
                        <ActionIcon variant="transparent" aria-label="Settings" color="black" onClick={handleUploadfinalClassification}>
                            <IoIosSave size={20} stroke={1.5}/>
                        </ActionIcon>
                    </Tooltip>
                </Center>
            </div>
            */}

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

            <Modal opened={opened} onClose={close} centered title="Live Telemetrie">
                <div>
                    <Center>
                        <Title order={2}>Live Telemetrie von {Fahrerliste[TelemetrieIndex]?.m_name}</Title>
                    </Center>
                </div>

                <Space h="md" />

                {CarTelemetry[TelemetrieIndex] && (
                    <>
                        <div>
                            <Progress value={getEngineRPM(CarTelemetry[TelemetrieIndex]?.m_engineRPM)} />
                            <Text size="sm">{CarTelemetry[TelemetrieIndex]?.m_engineRPM} RPM</Text>
                        </div>

                        <Space h="md" />

                        <div>
                            <SimpleGrid cols={2}>
                                <div>
                                    <Center>
                                        <Title order={1} size="h1">{CarTelemetry[TelemetrieIndex]?.m_gear}</Title>
                                    </Center>
                                    <Center>
                                        <Text size="sm">{CarTelemetry[TelemetrieIndex]?.m_speed} KM/H</Text>
                                    </Center>
                                </div>
                                <div>
                                    <Center>
                                        <img src={getVisualTyre(CarStatus[TelemetrieIndex]?.m_visualTyreCompound)} alt="Reifen" height={60} width={60} />
                                    </Center>
                                    <Center>
                                        <Text size="sm">{CarStatus[TelemetrieIndex]?.m_tyresAgeLaps} Runde(n)</Text>
                                    </Center>
                                </div>
                            </SimpleGrid>
                            <Space h="md" />
                            <Progress color="green" value={getThrottle(CarTelemetry[TelemetrieIndex]?.m_throttle)} size={5}/>
                            <Progress color="red" value={getBrake(CarTelemetry[TelemetrieIndex]?.m_brake)} size={5}/>
                        </div>
                        <div style={{marginTop: '10px'}}>
                            <Center>
                                <Switch 
                                    checked={getDRS(CarTelemetry[TelemetrieIndex]?.m_drs)} 
                                    label="DRS"
                                    style={{marginRight: '20px'}}
                                />
                                <Switch
                                    checked={getERSMode(CarStatus[TelemetrieIndex]?.m_ersDeployMode)}
                                    label={getERSDescription(CarStatus[TelemetrieIndex]?.m_ersDeployMode)}
                                />
                            </Center>
                        </div>
                    </>
                )}
            </Modal>
        </>
    );
}
export default LiveRennenDaten;