import React, { useEffect, useState } from 'react';
import { db } from './../utils/firebase';
import { collection, onSnapshot, getDoc, doc } from 'firebase/firestore';
import Table from 'react-bootstrap/Table';
import './TeilnehmerTabelle.css';
import { ScrollArea, Box } from '@mantine/core';
import {useNavigate} from 'react-router-dom';
import { getStorage } from 'firebase/storage';
import { Modal } from '@mantine/core';
import Stake from '../Teamlogos/StakeSauber.png';
import RedBullIcon from './../Teamlogos/RedBullIcon.png';
import FastestLap from './FastestLap.png';

// Flaggen
import Bahrain from './../Flaggen/bahrain.png';
import SaudiArabien from './../Flaggen/saudiarabien.png';
import Australien from './../Flaggen/australien.png';
import Aserbaidschan from './../Flaggen/azerbeidschan.png';
import USA from './../Flaggen/usa.png';
import Italien from './../Flaggen/italien.png';
import Monaco from './../Flaggen/monaco.png';
import Spanien from './../Flaggen/spanien.png';
import Kanada from './../Flaggen/kanada.png';
import Österreich from './../Flaggen/österreich.png';
import England from './../Flaggen/england.png';
import Ungarn from './../Flaggen/ungarn.png';
import Belgien from './../Flaggen/belgien.png';
import Niederlande from './../Flaggen/niederlande.png';
import Singapur from './../Flaggen/singapur.png';
import Japan from './../Flaggen/japan.png';
import Katar from './../Flaggen/katar.png';
import Mexiko from './../Flaggen/mexico.png';
import Brasilien from './../Flaggen/brasilien.png';
import AbuDhabi from './../Flaggen/abudhabi.png';

import Ferrari from '../Teamlogos/Ferrari.png';
import AstonMartin from '../Teamlogos/AstonMartin.png';
import Merceds from '../Teamlogos/MercedesIcon.png';
import RedBull from '../Teamlogos/RedBullIcon.svg';
import Williams from '../Teamlogos/Williams.png';
import McLaren from '../Teamlogos/MclarenIcon.png';
import Alpine from '../Teamlogos/Alpine.png';
import Haas from '../Teamlogos/Haas.png';
import RBVisa from '../Teamlogos/VisaCashAppWithBackground.jpg';
import KickSauber from '../Teamlogos/StakeSauber.png';


function TeilnehmerTabelle() {
    const [personen, setPersonen] = useState([]);
    const [userID, setUserID] = useState('');
    const navigate = useNavigate();
    const storage = getStorage();
    const [selectedFlag, setSelectedFlag] = useState(false);
    const [Strecken, setStrecken] = useState([]);
    const [nameClickedFlag, setNameClickedFlag] = useState(null);
    const [RennInformationen, setRennInformationen] = useState([]);

    useEffect(() => {
        const personenRef = collection(db, 'personen');
        const unsubscribe = onSnapshot(personenRef, (snapshot) => {
            let tempListe = [];
            snapshot.forEach((doc) => {
                let data = doc.data();
                tempListe.push({ 
                    id: doc.id,
                    ...data // Hier werden alle Attribute des Dokuments abgerufen
                });
            });
            tempListe.sort((a, b) => {
                return Object.values(b?.wertung || {}).reduce((a, b) => a + (Number.isInteger(b) ? b : 0), 0) - Object.values(a?.wertung || {}).reduce((a, b) => a + (Number.isInteger(b) ? b : 0), 0);
            });
            console.log("PersonenArray:", tempListe);
            setPersonen(tempListe);
        });

        // Aufräumen bei Unmount
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const streckenRef = collection(db, 'Strecken');
        const unsubscribe = onSnapshot(streckenRef, (snapshot) => {
            let tempListe = [];
            snapshot.forEach((doc) => {
                let data = doc.data();
                tempListe.push({
                    name: doc.id,
                    ansicht: data.Ansicht,
                    datum: data.Datum.toDate().toLocaleDateString('de-DE'),
                    flagge: data.Flagge
                });
            });
            setStrecken(tempListe);
            console.log("StreckenArray:", tempListe);
        });

        // Aufräumen bei Unmount
        return () => unsubscribe();
    }, []);

    const handleClick = (id) => {
        navigate(`/profil/${id}`);
    }

    function renderTeamLogo(team) {
        if (team === 'Ferrari') {
          return <img src={Ferrari} alt="Ferrari Logo" style={{ width: '10px', height: '15px', marginLeft: '10px' }} />;
        }
        if (team === 'Aston Martin') {
          return <img src={AstonMartin} alt="Aston Martin Logo" style={{ width: '15px', height: '15px', marginLeft: '5px' }} />;
        }
        if (team === 'Mercedes') {
          return <img src={Merceds} alt="Mercedes Logo" style={{ width: '20px', height: '20px', marginLeft: '5px' }} />;
        }
        if (team === 'Red Bull') {
          return <img src={RedBull} alt="Red Bull Logo" style={{ width: '20px', height: '20px', marginLeft: '10px' }} />;
        }
        if (team === 'Williams') {
          return <img src={Williams} alt="Williams Logo" style={{ width: '20px', height: '20px', marginLeft: '10px' }} />;
        }
        if (team === 'McLaren') {
          return <img src={McLaren} alt="McLaren Logo" style={{ width: '20px', height: '20px', marginLeft: '5px' }} />;
        }
        if (team === 'Alpine') {
          return <img src={Alpine} alt="Alpine Logo" style={{ width: '20px', height: '20px', marginLeft: '8px' }} />;
        }
        if (team === 'Kick Sauber') {
          return <img src={KickSauber} alt="KickSauber Logo" style={{ width: '20px', height: '20px', marginLeft: '8px' }} />;
        }
        if (team === 'Visa RB') {
            return <img src={RBVisa} alt="RB Visa Logo" style={{ width: '20px', height: '15px', marginLeft: '8px' }} />;
        }
        if (team === 'Haas') {
          return <img src={Haas} alt="Haas Logo" style={{ width: '40px', height: '15px', marginLeft: '8px' }} />;
        }
        return null;
      }

      function getCellStyle(value) {
        if (value === 25 || value === 26) {
            return { backgroundColor: 'gold' };
        }
        if (value === 18 || value === 19) {
            return { backgroundColor: 'silver' };
        }
        if (value === 15 || value === 16) {
            return { backgroundColor: 'peru' };
        }
        if (value === "DNF") {
            return { backgroundColor: 'black', color: 'white' };
        }
        return { backgroundColor: 'transparent' };
    }

    async function modalFunction(strecke) {
        console.log("Streckenname:", strecke.name);
        const docRef = doc(db, 'Ergebnisse', strecke.name);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setRennInformationen(docSnap.data());
            setSelectedFlag(true);
        } else {
            console.log("Kein solches Dokument gefunden!");
        }
    };

    function formatRaceTime(timeInSeconds) {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
        const milliseconds = Math.floor((timeInSeconds * 1000) % 1000).toString().padStart(3, '0');

        return `${minutes}:${seconds}:${milliseconds}`;
    }

    function formatBestRaceTime(timeInMilliseconds) {
        const minutes = Math.floor(timeInMilliseconds / 60000);
        const seconds = Math.floor((timeInMilliseconds % 60000) / 1000).toString().padStart(2, '0');
        const milliseconds = (timeInMilliseconds % 1000).toString().padStart(3, '0');

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
            40: 'https://www.countryflags.com/wp-content/uploads/israel-flag-png-large.png',
            41: 'https://cdn.countryflags.com/thumbs/italy/flag-square-250.png',
            42: 'https://cdn.countryflags.com/thumbs/jamaica/flag-square-500.png',
            43: 'https://cdn.countryflags.com/thumbs/japan/flag-square-250.png',
            49: 'https://cdn.countryflags.com/thumbs/luxembourg/flag-square-500.png',
            52: 'https://cdn.countryflags.com/thumbs/mexico/flag-square-250.png',
            53: 'https://cdn.countryflags.com/thumbs/monaco/flag-square-250.png',
            64: 'https://cdn.countryflags.com/thumbs/portugal/flag-square-500.png',
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
            2: { url: RedBullIcon, width: '50', height: '35' }, // Red Bull
            3: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Logo_Williams_F1.png/300px-Logo_Williams_F1.png', width: '25', height: '20' }, // Williams
            4: { url: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/bd/Aston_Martin_Lagonda_brand_logo.png/220px-Aston_Martin_Lagonda_brand_logo.png', width: '40', height: '20' }, // Aston Martin
            5: { url: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Alpine_logo.png', width: '35', height: '25' }, // Alpine
            6: { url: 'https://www.visacashapprb.com/wp-content/uploads/2024/01/logo-f1-1.svg', width: '30', height: '30' }, // Visa RB
            7: { url: 'https://logos-world.net/wp-content/uploads/2022/07/Haas-Symbol-700x394.png', width: '45', height: '25' }, // Haas
            8: { url: 'https://cdn3.emoji.gg/emojis/9807_McLaren_Logo.png', width: '35', height: '35' }, // McLaren
            9: { url: Stake, width: '30', height: '30' }  // Stake F1
        };

        const screenWidth = window.innerWidth;
        if (screenWidth < 700) {
            Object.keys(teams).forEach(key => {
                teams[key].width = (teams[key].width * 0.8).toString();
                teams[key].height = (teams[key].height * 0.8).toString();
            });
        }

        return teams[teamId] || { url: '/pfad/zum/standardbild.png', width: '35', height: '20' };
    }

    return (
        <div className='table-container'>
            <ScrollArea type='never' className='scrollarea'>
                <Table striped bordered hover>
                   <thead className='thead-sticky'>
                        <tr>
                            <th>Pos</th>
                            <th id='fahrer'>Fahrer</th>
                            <th style={{zIndex: '10'}}>Konstrukteur</th>
                            {
                                Strecken.sort((a, b) => {
                                    let datumA = a.datum.split(".").reverse().join("/");
                                    let datumB = b.datum.split(".").reverse().join("/");
                                    return new Date(datumA) - new Date(datumB);
                                })
                                .filter(strecke => strecke.ansicht)
                                .map((strecke, index) => 
                                    <th key={index}>
                                        <img src={strecke.flagge} alt="Flagge" height="10px" width="20px" onClick={() => { modalFunction(strecke); setNameClickedFlag(strecke.name); }} />
                                    </th>
                                )
                            }
                            <th>Gesamtpunkte</th>
                        </tr>
                    </thead>
                        <tbody>
                            {personen.map((person, index) => (
                                <tr key={index}>
                                    <td className='pos'>{index + 1}</td> {/* Pos */}
                                    
                                    <td className='fahrer' onClick={() => handleClick(person.id)}>{person.spielerID}</td> {/* Fahrer */}
                                    
                                    <td>
                                        <div>
                                            <span className='teamname'>{person.team ? person.team : "Reservefahrer"}</span>
                                            {person.team && renderTeamLogo(person.team)}
                                        </div>
                                    </td> {/* Konstrukteur */}

                                    {
                                        Strecken.sort((a, b) => {
                                            let datumA = a.datum.split(".").reverse().join("/");
                                            let datumB = b.datum.split(".").reverse().join("/");
                                            return new Date(datumA) - new Date(datumB);
                                        })
                                        .filter(strecke => strecke.ansicht)
                                        .map((strecke, index) => 
                                            <td key={index} style={getCellStyle(person?.wertung?.[strecke.name])}>
                                                {person?.wertung?.[strecke.name] ?? ''}
                                            </td>
                                        )
                                    }

                                    <td>
                                        {Object.values(person?.wertung || {}).reduce((a, b) => a + (Number.isInteger(b) ? b : 0), 0)}
                                    </td> {/* Gesamtpunkte */} {/* Gesamtpunkte */}
                                </tr>
                            ))}
                        </tbody>
                </Table>
            </ScrollArea>
            <Modal opened={selectedFlag} onClose={() => setSelectedFlag(false)} title={nameClickedFlag} size="100%" closeOnClickOutside={false} zIndex={9999}>
                <ScrollArea w="auto">
                    <Box w="auto">
                        <Table striped bordered hover>
                            <thead id='theadRaceResult'>
                                <tr style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                    <th>Position</th>
                                    <th style={{ position: 'sticky', left: 0, zIndex: 1, backgroundColor: 'white' }}>Fahrer</th>
                                    <th>Nationalität</th>
                                    <th>Team</th>
                                    <th>Grid Position</th>
                                    <th>Beste Persönliche Runde</th>
                                    <th>Rennzeit</th>
                                    <th>Punkte</th>
                                    <th>Strafen (s)</th>
                                    <th>Anzahl der boxenstopps</th>
                                    <th>Ergebnisstatus</th>
                                </tr>
                            </thead>
                            <tbody id='tbodyRaceResult'>
                                {
                                    (() => {
                                        const teilnehmerMitInfos = Object.keys(RennInformationen)
                                            .map(key => ({ ...RennInformationen[key], key }));
                                        const schnellsteRunde = Math.min(...teilnehmerMitInfos.map(info => info.bestePersoenlicheRunde));

                                        return teilnehmerMitInfos
                                            .sort((a, b) => a.position - b.position)
                                            .map(({ key, ...info }) => (
                                                <tr key={key} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                                    <td>{info.position}</td>
                                                    <td style={{ position: 'sticky', left: 0, backgroundColor: 'white', zIndex: 1 }}>{info.fahrername}</td>
                                                    <td>
                                                        <img src={getNationality(info.nationalitaet)} alt="Nationalität" width="15" height="15" />
                                                    </td>
                                                    <td>
                                                        <img 
                                                            src={getTeam(info.team).url} 
                                                            alt="Team" 
                                                            width={getTeam(info.team).width} 
                                                            height={getTeam(info.team).height} 
                                                        />
                                                    </td>
                                                    <td>{info.gridPosition}</td>
                                                    <td style={{ color: info.bestePersoenlicheRunde === schnellsteRunde ? 'purple' : 'inherit' }}>
                                                        {formatBestRaceTime(info.bestePersoenlicheRunde)}
                                                        {info.bestePersoenlicheRunde === schnellsteRunde && (
                                                            <img src={FastestLap} alt="Schnellste Runde" width="15" height="15" style={{marginLeft: '5px'}}/>
                                                        )}
                                                    </td>
                                                    <td>{formatRaceTime(info.rennzeit)}</td>
                                                    <td>{info.punkte}</td>
                                                    <td>{info.strafen}</td>
                                                    <td>{info.boxenstopps}</td>
                                                    <td>{info.ergebnisStatus !== 3 ? 
                                                        formatResultStatus(info.ergebnisStatus) : ''}
                                                    </td>
                                                </tr>
                                            ));
                                    })()
                                }
                            </tbody>
                        </Table>
                    </Box>
                </ScrollArea>
            </Modal>
        </div>
    );
}

export default TeilnehmerTabelle;