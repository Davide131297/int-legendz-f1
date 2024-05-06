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
                    gesamtPunkte: data.gesamtPunkte ? data.gesamtPunkte : 0, // Fallback-Wert hinzufügen
                    ...data // Hier werden alle Attribute des Dokuments abgerufen
                });
            });
            tempListe.sort((a, b) => {
                return Object.values(b?.wertung || {}).reduce((a, b) => a + (Number.isInteger(b) ? b : 0), 0) - Object.values(a?.wertung || {}).reduce((a, b) => a + (Number.isInteger(b) ? b : 0), 0);
            });
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
                    id: doc.id,
                    ansicht: data.ansicht
                });
            });
            setStrecken(tempListe);
            console.log(tempListe);
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

    async function handleFlagClick(event) {

        // Setzen des Flaggenbilds, das geklickt wurde
        setClickedFlag(event.target.alt);
        // Referenz auf den Bucket
        const listRef = ref(storage, 'gs://f1-liga-int-legendz.appspot.com');

        // Findet alle Dateien im Bucket
        const res = await listAll(listRef);

        let fileExists = false;
        let selectedImages = [];

        for (const itemRef of res.items) {
            // itemRef.name ist der Name der Datei
            if (itemRef.name.includes(event.target.alt) && (itemRef.name.includes("_Sprint") || itemRef.name.includes("_Rennen") || (!itemRef.name.includes("_Sprint") && !itemRef.name.includes("_Rennen")))) {
                fileExists = true;
                const url = await getDownloadURL(itemRef);
                // Füge die URL zum Array hinzu
                selectedImages.push(url);
                // Beenden Sie die Schleife, sobald beide Bilder gefunden wurden
                if (selectedImages.length == 2) {
                    break;
                }
            }
        }

        if (!fileExists) {
            setSelectedImage(null);
            console.log(event.target.alt, 'Bild(er) nicht gefunden');
        } else {
            // Setzen Sie die ausgewählten Bilder
            setSelectedImage(selectedImages);
            console.log(event.target.alt, 'Bild(er) gefunden');
            console.log(selectedImages);
        }
    }

    function shouldRenderImage(Strecken, imageName) {
        // Überprüfen Sie, ob das Array 'strecken' ein Objekt mit einer ID enthält, die dem Namen der Bildquelle ähnlich ist
         // und dessen 'ansicht'-Attribut auch true ist
        return Strecken.some(strecke => strecke.id.toLowerCase().includes(imageName.toLowerCase()) && strecke.ansicht === true);
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

                            {shouldRenderImage(Strecken, 'Bahrain') && 
                                <th onClick={handleFlagClick}>
                                    <img src={Bahrain} alt="Bahrain" className='img-size'/>
                                </th>
                            }

                            {shouldRenderImage(Strecken, 'SaudiArabien') &&
                            <th onClick={handleFlagClick}><img src={SaudiArabien} alt="Saudi Arabien" className='img-size'/></th>
                            }

                            {shouldRenderImage(Strecken, 'Australien') &&
                            <th onClick={handleFlagClick}><img src={Australien} alt="Australien" className='img-size'/></th>
                            }

                            {shouldRenderImage(Strecken, 'Aserbaidschan') &&
                            <th onClick={handleFlagClick} colSpan={2}><img src={Aserbaidschan} alt="Aserbaidschan" className='img-size'/>
                            <tr>
                                <td className='zweiRennen'>SPR</td>
                                <td className='zweiRennen'>HAU</td>
                            </tr>
                            </th>
                            }

                            {shouldRenderImage(Strecken, 'Miami') &&
                            <th onClick={handleFlagClick}><img src={USA} alt="Miami" className='img-size'/></th>
                            }

                            {shouldRenderImage(Strecken, 'Italien') &&
                            <th onClick={handleFlagClick}><img src={Italien} alt="Italien" className='img-size'/></th>
                            }

                            {shouldRenderImage(Strecken, 'Monaco') &&
                            <th onClick={handleFlagClick}><img src={Monaco} alt="Monaco" className='img-size'/></th>
                            }

                            {shouldRenderImage(Strecken, 'Spanien') &&
                            <th onClick={handleFlagClick}><img src={Spanien} alt="Spanien" className='img-size'/></th>
                            }

                            {shouldRenderImage(Strecken, 'Kanada') &&
                            <th onClick={handleFlagClick}><img src={Kanada} alt="Kanada" className='img-size'/></th>
                            }

                            {shouldRenderImage(Strecken, 'Österreich') && 
                                <th onClick={handleFlagClick} colSpan={2}><img src={Österreich} alt="Österreich" className='img-size'/>
                                <tr>
                                    <td className='zweiRennen'>SPR</td>
                                    <td className='zweiRennen'>HAU</td>
                                </tr>
                                </th>
                            }

                            {shouldRenderImage(Strecken, 'Großbritannien') &&
                            <th onClick={handleFlagClick}><img src={England} alt="England" className='img-size'/></th>
                            }

                            {shouldRenderImage(Strecken, 'Ungarn') &&
                            <th onClick={handleFlagClick}><img src={Ungarn} alt="Ungarn" className='img-size'/></th>
                            }

                            {shouldRenderImage(Strecken, 'Belgien') &&
                            <th onClick={handleFlagClick} colSpan={2}><img src={Belgien} alt="Belgien" className='img-size'/>
                            <tr>
                                <td className='zweiRennen'>SPR</td>
                                <td className='zweiRennen'>HAU</td>
                            </tr>
                            </th>
                            }

                            {shouldRenderImage(Strecken, 'Niederlande') &&
                            <th onClick={handleFlagClick}><img src={Niederlande} alt="Niederlande" className='img-size'/></th>
                            }

                            {shouldRenderImage(Strecken, 'Singapur') &&
                            <th onClick={handleFlagClick}><img src={Singapur} alt="Singapur" className='img-size'/></th>
                            }

                            {shouldRenderImage(Strecken, 'Japan') &&
                            <th onClick={handleFlagClick}><img src={Japan} alt="Japan" className='img-size'/></th>
                            }

                            {shouldRenderImage(Strecken, 'Katar') &&
                            <th onClick={handleFlagClick} colSpan={2}><img src={Katar} alt="Katar" className='img-size'/>
                            <tr>
                                <td className='zweiRennen'>SPR</td>
                                <td className='zweiRennen'>HAU</td>
                            </tr>
                            </th>
                            }

                            {shouldRenderImage(Strecken, 'USA') &&
                            <th onClick={handleFlagClick} colSpan={2}><img src={USA} alt="USA" className='img-size'/>
                            <tr>
                                <td className='zweiRennen'>SPR</td>
                                <td className='zweiRennen'>HAU</td>
                            </tr>
                            </th>
                            }

                            {shouldRenderImage(Strecken, 'Mexiko') &&
                            <th onClick={handleFlagClick}><img src={Mexiko} alt="Mexiko" className='img-size'/></th>
                            }

                            {shouldRenderImage(Strecken, 'Brasilien') &&
                            <th onClick={handleFlagClick} colSpan={2}><img src={Brasilien} alt="Brasilien" className='img-size'/>
                            <tr>
                                <td className='zweiRennen'>SPR</td>
                                <td className='zweiRennen'>HAU</td>
                            </tr>
                            </th>
                            }

                            {shouldRenderImage(Strecken, 'LasVegas') &&
                            <th onClick={handleFlagClick}><img src={USA} alt="Las Vegas" className='img-size'/></th>
                            }

                            {shouldRenderImage(Strecken, 'Abu Dhabi') &&
                            <th onClick={handleFlagClick}><img src={AbuDhabi} alt="Abu Dhabi" className='img-size'/></th>
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

                            {shouldRenderImage(Strecken, 'Bahrain') && 
                            <td style={getCellStyle(person?.wertung?.bahrain)}>
                                {person?.wertung?.bahrain ?? ''}
                            </td>
                            }

                            {shouldRenderImage(Strecken, 'SaudiArabien') &&
                            <td style={getCellStyle(person?.wertung?.saudiarabien)}>
                                {person?.wertung?.saudiarabien ?? ''}
                            </td>
                            }

                            {shouldRenderImage(Strecken, 'Australien') &&
                            <td style={getCellStyle(person?.wertung?.australien)}>
                                {person?.wertung?.australien ?? ''}
                            </td>
                            }

                            {shouldRenderImage(Strecken, 'Aserbaidschan') &&
                            <td style={getCellStyle(person?.wertung?.aserbaidschan_Sprint)}>
                                {person?.wertung?.aserbaidschan_Sprint ?? ''}
                            </td>
                            }

                            {shouldRenderImage(Strecken, 'Aserbaidschan') &&
                            <td style={getCellStyle(person?.wertung?.aserbaidschan_Rennen)}>
                                {person?.wertung?.aserbaidschan_Rennen ?? ''}
                            </td>
                            }

                            {shouldRenderImage(Strecken, 'Miami') &&
                            <td style={getCellStyle(person?.wertung?.miami)}>
                                {person?.wertung?.miami ?? ''}
                            </td>
                            }

                            {shouldRenderImage(Strecken, 'Italien') &&
                            <td style={getCellStyle(person?.wertung?.italien)}>
                                {person?.wertung?.italien ?? ''}
                            </td>
                            }

                            {shouldRenderImage(Strecken, 'Monaco') &&
                            <td style={getCellStyle(person?.wertung?.monaco)}>
                                {person?.wertung?.monaco ?? ''}
                            </td>
                            }

                            {shouldRenderImage(Strecken, 'Spanien') &&
                            <td style={getCellStyle(person?.wertung?.spanien)}>
                                {person?.wertung?.spanien ?? ''}
                            </td>
                            }

                            {shouldRenderImage(Strecken, 'Kanada') &&
                            <td style={getCellStyle(person?.wertung?.kanada)}>
                                {person?.wertung?.kanada ?? ''}
                            </td>
                            }

                            {shouldRenderImage(Strecken, 'Österreich') &&
                            <td style={getCellStyle(person?.wertung?.österreich_Sprint)}>
                                {person?.wertung?.österreich_Sprint ?? ''}
                            </td>
                            }

                            {shouldRenderImage(Strecken, 'Österreich') &&
                            <td style={getCellStyle(person?.wertung?.österreich_Rennen)}>
                                {person?.wertung?.österreich_Rennen ?? ''}
                            </td>
                            }

                            {shouldRenderImage(Strecken, 'Großbritannien') &&
                            <td style={getCellStyle(person?.wertung?.england)}>
                                {person?.wertung?.england ?? ''}
                            </td>
                            }

                            {shouldRenderImage(Strecken, 'Ungarn') &&
                            <td style={getCellStyle(person?.wertung?.ungarn)}>
                                {person?.wertung?.ungarn ?? ''}
                            </td>
                            }

                            {shouldRenderImage(Strecken, 'Belgien') &&
                            <td style={getCellStyle(person?.wertung?.belgien_Sprint)}>
                                {person?.wertung?.belgien_Sprint ?? ''}
                            </td>
                            }

                            {shouldRenderImage(Strecken, 'Belgien') &&
                            <td style={getCellStyle(person?.wertung?.belgien_Rennen)}>
                                {person?.wertung?.belgien_Rennen ?? ''}
                            </td>
                            }

                            {shouldRenderImage(Strecken, 'Niederlande') &&
                            <td style={getCellStyle(person?.wertung?.niederlande)}>
                                {person?.wertung?.niederlande ?? ''}
                            </td>
                            }

                            {shouldRenderImage(Strecken, 'Singapur') &&
                            <td style={getCellStyle(person?.wertung?.singapur)}>
                                {person?.wertung?.singapur ?? ''}
                            </td>
                            }

                            {shouldRenderImage(Strecken, 'Japan') &&
                            <td style={getCellStyle(person?.wertung?.japan)}>
                                {person?.wertung?.japan ?? ''}
                            </td>
                            }

                            {shouldRenderImage(Strecken, 'Katar') &&
                            <td style={getCellStyle(person?.wertung?.katar_Sprint)}>
                                {person?.wertung?.katar_Sprint ?? ''}
                            </td>
                            }

                            {shouldRenderImage(Strecken, 'Katar') &&
                            <td style={getCellStyle(person?.wertung?.katar_Rennen)}>
                                {person?.wertung?.katar_Rennen ?? ''}
                            </td>
                            }

                            {shouldRenderImage(Strecken, 'USA') &&
                            <td style={getCellStyle(person?.wertung?.usa_Sprint)}>
                                {person?.wertung?.usa_Sprint ?? ''}
                            </td>
                            }

                            {shouldRenderImage(Strecken, 'USA') &&
                            <td style={getCellStyle(person?.wertung?.usa_Rennen)}>
                                {person?.wertung?.usa_Rennen ?? ''}
                            </td>
                            }

                            {shouldRenderImage(Strecken, 'Mexiko') &&
                            <td style={getCellStyle(person?.wertung?.mexiko)}>
                                {person?.wertung?.mexiko ?? ''}
                            </td>
                            }

                            {shouldRenderImage(Strecken, 'Brasilien') &&
                            <td style={getCellStyle(person?.wertung?.brasilien_Sprint)}>
                                {person?.wertung?.brasilien_Sprint || ''}
                            </td>
                            }

                            {shouldRenderImage(Strecken, 'Brasilien') &&
                            <td style={getCellStyle(person?.wertung?.brasilien_Rennen)}>
                                {person?.wertung?.brasilien_Rennen || ''}
                            </td>
                            }

                            {shouldRenderImage(Strecken, 'LasVegas') &&
                            <td style={getCellStyle(person?.wertung?.lasvegas)}>
                                {person?.wertung?.lasvegas ?? ''}
                            </td>
                            }

                            {shouldRenderImage(Strecken, 'Abu Dhabi') &&
                            <td style={getCellStyle(person?.wertung?.abuDhabi)}>
                                {person?.wertung?.abuDhabi ?? ''}
                            </td>
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