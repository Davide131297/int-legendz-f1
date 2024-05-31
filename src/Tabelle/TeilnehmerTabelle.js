import React, { useEffect, useState } from 'react';
import { db } from './../utils/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import Table from 'react-bootstrap/Table';
import './TeilnehmerTabelle.css';
import { ScrollArea } from '@mantine/core';
import {useNavigate} from 'react-router-dom';
import { getStorage, ref, listAll, getDownloadURL} from 'firebase/storage';
import { Modal, Image } from '@mantine/core';

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
import AlfaRomeo from '../Teamlogos/AlfaRomeoIcon.png';
import AlphaTauri from '../Teamlogos/AlphaTauri.png';
import Haas from '../Teamlogos/Haas.png';


function TeilnehmerTabelle() {
    const [personen, setPersonen] = useState([]);
    const [userID, setUserID] = useState('');
    const navigate = useNavigate();
    const storage = getStorage();
    const [selectedImage, setSelectedImage] = useState(null);
    const [clickedFlag, setClickedFlag] = useState(null);
    const [Strecken, setStrecken] = useState([]);

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
        if (team === 'Alfa Romeo') {
          return <img src={AlfaRomeo} alt="AlfaRomeo Logo" style={{ width: '20px', height: '20px', marginLeft: '8px' }} />;
        }
        if (team === 'Alpha Tauri') {
            return <img src={AlphaTauri} alt="Alpha Tauri Logo" style={{ width: '20px', height: '15px', marginLeft: '8px' }} />;
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
                                        <img src={strecke.flagge} alt="Flagge" height="10px" width="20px" />
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
            <Modal opened={selectedImage !== null} onClose={() => setSelectedImage(null)} title={clickedFlag} centered size={Array.isArray(selectedImage) && selectedImage.length > 1 ? "md" : "xl"}  closeOnClickOutside={false}>
                {Array.isArray(selectedImage) ? selectedImage.map((image, index) => (
                    <Image key={index} src={image} alt="Selected" fit="cover" />
                )) : <Image src={selectedImage} alt="Selected" fit="cover" />}
            </Modal>
        </div>
    );
}

export default TeilnehmerTabelle;