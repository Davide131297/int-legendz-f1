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
import China from './../Flaggen/China.png';

import React, {useEffect, useState} from 'react';
import { db } from './../utils/firebase';
import {onSnapshot, doc, collection} from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import './Profiltabelle.css';

const Profiltabelle = () => {

    const [person, setPersonen] = useState([]);
    const { id } = useParams(); // Extrahieren Sie die ID aus der URL
    const [Strecken, setStrecken] = useState([]);

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

    useEffect(() => {
        const streckenRef = collection(db, 'Strecken');
        const unsubscribe = onSnapshot(streckenRef, (snapshot) => {
            let tempListe = [];
            snapshot.forEach((doc) => {
                let data = doc.data();
                tempListe.push({
                    id: doc.id,
                    ansicht: data.Ansicht
                });
            });
            setStrecken(tempListe);
            console.log(tempListe);
        });

        // Aufräumen bei Unmount
        return () => unsubscribe();
    }, []);
    
    function shouldRenderImage(Strecken, imageName) {
        // Überprüfen Sie, ob das Array 'strecken' ein Objekt mit einer ID enthält, die dem Namen der Bildquelle ähnlich ist
         // und dessen 'ansicht'-Attribut auch true ist
        return Strecken.some(strecke => strecke.id.toLowerCase().includes(imageName.toLowerCase()) && strecke.ansicht === true);
    }


    const data = [
        shouldRenderImage(Strecken, 'Bahrain') && {header: <img src={Bahrain} alt="Bahrain" className='img-size'/>, value: person?.wertung?.Bahrain || 0},
        shouldRenderImage(Strecken, 'SaudiArabien') && {header: <img src={SaudiArabien} alt="SaudiArabien" className='img-size'/>, value: person?.wertung?.SaudiArabien || 0},
        shouldRenderImage(Strecken, 'Australien') && {header: <img src={Australien} alt="Australien" className='img-size'/>, value: person?.wertung?.Australien || 0},
        shouldRenderImage(Strecken, 'Japan') && {header: <img src={Japan} alt="Japan" className='img-size'/>, value: person?.wertung?.Japan || 0},
        shouldRenderImage(Strecken, 'China') && {header: <img src={China} alt="China" className='img-size'/>, value: person?.wertung?.China || 0},
        shouldRenderImage(Strecken, 'Miami') && {header: <img src={USA} alt="Miami" className='img-size'/>, value: person?.wertung?.Miami || 0},
        shouldRenderImage(Strecken, 'Imola') && {header: <img src={Italien} alt="Imola" className='img-size'/>, value: person?.wertung?.Imola || 0},
        shouldRenderImage(Strecken, 'Monaco') && {header: <img src={Monaco} alt="Monaco" className='img-size'/>, value: person?.wertung?.Monaco || 0},
        shouldRenderImage(Strecken, 'Kanada') && {header: <img src={Kanada} alt="Kanada" className='img-size'/>, value: person?.wertung?.Kanada || 0},
        shouldRenderImage(Strecken, 'Spanien') && {header: <img src={Spanien} alt="Spanien" className='img-size'/>, value: person?.wertung?.Spanien || 0},
        shouldRenderImage(Strecken, 'Österreich') && {header: <img src={Österreich} alt="Österreich" className='img-size'/>, value: person?.wertung?.Österreich || 0},
        shouldRenderImage(Strecken, 'Großbritannien') && {header: <img src={England} alt="Großbritannien" className='img-size'/>, value: person?.wertung?.Großbritannien || 0},
        {header: 'Gesamtpunkte', value: Object.values(person?.wertung || {}).reduce((a, b) => a + (Number.isInteger(b) ? b : 0), 0)}
    ];

    return (
        <div className='table-container'>
            <h5 className='table-header'>Punkteübersicht</h5>
            <div className='profiltabelle'>
                <Table striped bordered hover>
                    <tbody>
                        {data.filter(Boolean).map((item, index) => (
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