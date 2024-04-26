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

import React, {useEffect, useState} from 'react';
import { db } from './../utils/firebase';
import {onSnapshot, doc} from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import './Profiltabelle.css';

const Profiltabelle = () => {

    const [person, setPersonen] = useState([]);
    const { id } = useParams(); // Extrahieren Sie die ID aus der URL

    useEffect(() => {
        const personenRef = doc(db, 'personen', id); // Verwenden Sie die ID, um auf das spezifische Dokument zuzugreifen
        const unsubscribe = onSnapshot(personenRef, (doc) => {
            if (doc.exists()) {
                setPersonen({ id: doc.id, ...doc.data() }); // Aktualisieren Sie den Zustand mit den Daten des Dokuments
            } else {
                console.log('Kein solches Dokument!');
            }
        });

        // Aufräumen bei Unmount
        return () => unsubscribe();
    }, [id]); // Fügen Sie die ID als Abhängigkeit hinzu, um den Effekt erneut auszulösen, wenn sich die ID ändert

    //Initialisierung der Gesamtpunkte auf 0
    let gesamtPunkte = 0;
    //Berechnung der Gesamtpunkte
    if(person?.wertung){
        gesamtPunkte = Object.values(person.wertung).reduce((a, b) => {
            // Überprüfen, ob der Wert eine Zahl ist
            if (!isNaN(b)) {
                return a + Number(b);
            } else {
                // Wenn der Wert keine Zahl ist, gebe den aktuellen Wert zurück
                return a;
            }
        }, 0);
    }
    const data = [
        {header: <img src={Bahrain} alt="Bahrain" className='img-size'/>, value: person?.wertung?.bahrain || 0},
        {header: <img src={SaudiArabien} alt="SaudiArabien" className='img-size'/>, value: person?.wertung?.saudiarabien || 0},
        {header: <img src={Australien} alt="Australien" className='img-size'/>, value: person?.wertung?.australien || 0},
        {
            header: <img src={Aserbaidschan} alt="Aserbaidschan" className='img-size'/>,
            value: (person?.wertung?.usa_Sprint === "DNF" && person?.wertung?.usa_Rennen === "DNF") 
                ? "DNF"
                : (person?.wertung?.aserbaidschan_Sprint !== undefined || person?.wertung?.aserbaidschan_Rennen !== undefined) 
                    ? ((person?.wertung?.aserbaidschan_Sprint === "DNF" ? 0 : person?.wertung?.aserbaidschan_Sprint) || 0) 
                    + ((person?.wertung?.aserbaidschan_Rennen === "DNF" ? 0 : person?.wertung?.aserbaidschan_Rennen) || 0)
                    : 0
        },
        {header: <img src={USA} alt="Miami" className='img-size'/>, value: person?.wertung?.miami || 0},
        {header: <img src={Italien} alt="Italien" className='img-size'/>, value: person?.wertung?.italien || 0},
        {header: <img src={Monaco} alt="Monaco" className='img-size'/>, value: person?.wertung?.monaco || 0},
        {header: <img src={Spanien} alt="Spanien" className='img-size'/>, value: person?.wertung?.spanien || 0},
        {header: <img src={Kanada} alt="Kanada" className='img-size'/>, value: person?.wertung?.kanada || 0},
        {
            header: <img src={Österreich} alt="Österreich" className='img-size'/>,
            value: (person?.wertung?.österreich_Sprint === "DNF" && person?.wertung?.österreich_Rennen === "DNF") 
                ? "DNF"
                : (person?.wertung?.österreich_Sprint !== undefined || person?.wertung?.österreich_Rennen !== undefined) 
                    ? ((person?.wertung?.österreich_Sprint === "DNF" ? 0 : person?.wertung?.österreich_Sprint) || 0) 
                    + ((person?.wertung?.österreich_Rennen === "DNF" ? 0 : person?.wertung?.österreich_Rennen) || 0)
                    : 0
        },
        {header: <img src={England} alt="England" className='img-size'/>, value: person?.wertung?.england || 0},
        {header: <img src={Ungarn} alt="Ungarn" className='img-size'/>, value: person?.wertung?.ungarn || 0},
        {
            header: <img src={Belgien} alt="Belgien" className='img-size'/>,
            value: (person?.wertung?.belgien_Sprint === "DNF" && person?.wertung?.belgien_Rennen === "DNF") 
                ? "DNF"
                : (person?.wertung?.belgien_Sprint !== undefined || person?.wertung?.belgien_Rennen !== undefined) 
                    ? ((person?.wertung?.belgien_Sprint === "DNF" ? 0 : person?.wertung?.belgien_Sprint) || 0) 
                    + ((person?.wertung?.belgien_Rennen === "DNF" ? 0 : person?.wertung?.belgien_Rennen) || 0)
                    : 0
        },
        {header: <img src={Niederlande} alt="Niederlande" className='img-size'/>, value: person?.wertung?.niederlande || 0},
        {header: <img src={Singapur} alt="Singapur" className='img-size'/>, value: person?.wertung?.singapur || 0},
        {header: <img src={Japan} alt="Japan" className='img-size'/>, value: person?.wertung?.japan || 0},
        {
            header: <img src={Katar} alt="Katar" className='img-size'/>,
            value: (person?.wertung?.katar_Sprint === "DNF" && person?.wertung?.katar_Rennen === "DNF") 
                ? "DNF"
                : (person?.wertung?.katar_Sprint !== undefined || person?.wertung?.katar_Rennen !== undefined) 
                    ? ((person?.wertung?.katar_Sprint === "DNF" ? 0 : person?.wertung?.katar_Sprint) || 0) 
                    + ((person?.wertung?.katar_Rennen === "DNF" ? 0 : person?.wertung?.katar_Rennen) || 0)
                    : 0
        },
        {
            header: <img src={USA} alt="USA" className='img-size'/>,
            value: (person?.wertung?.usa_Sprint === "DNF" && person?.wertung?.usa_Rennen === "DNF") 
                ? "DNF"
                : (person?.wertung?.usa_Sprint !== undefined || person?.wertung?.usa_Rennen !== undefined) 
                    ? ((person?.wertung?.usa_Sprint === "DNF" ? 0 : person?.wertung?.usa_Sprint) || 0) 
                    + ((person?.wertung?.usa_Rennen === "DNF" ? 0 : person?.wertung?.usa_Rennen) || 0)
                    : 0
        },
        {header: <img src={Mexiko} alt="Mexiko" className='img-size'/>, value: person?.wertung?.mexiko || 0},
        {
            header: <img src={Brasilien} alt="Brasilien" className='img-size'/>,
            value: (person?.wertung?.brasilien_Sprint === "DNF" && person?.wertung?.brasilien_Rennen === "DNF") 
                ? "DNF"
                : (person?.wertung?.brasilien_Sprint !== undefined || person?.wertung?.brasilien_Rennen !== undefined) 
                    ? ((person?.wertung?.brasilien_Sprint === "DNF" ? 0 : person?.wertung?.brasilien_Sprint) || 0) 
                    + ((person?.wertung?.brasilien_Rennen === "DNF" ? 0 : person?.wertung?.brasilien_Rennen) || 0)
                    : 0
        },
        {header: <img src={USA} alt="Las Vegas" className='img-size'/>, value: person?.wertung?.lasvegas || 0},
        {header: <img src={AbuDhabi} alt="AbuDhabi" className='img-size'/>, value: person?.wertung?.abudhabi || 0},
        {header: 'Gesamtpunkte', value: gesamtPunkte}
    ];

    return (
        <div className='table-container'>
            <h5 className='table-header'>Punkteübersicht</h5>
            <div className='profiltabelle'>
                <Table striped bordered hover>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <th>{item.header}</th>
                                <td>{item.value}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default Profiltabelle;