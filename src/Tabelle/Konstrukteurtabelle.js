import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './../utils/firebase';
import Table from 'react-bootstrap/Table';
import { ScrollArea } from '@mantine/core';
import './konstrukteurtabelle.css';
import KonstrukteurLineChart from '../Charts/LineChart_Konstrukteur';
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
import China from './../Flaggen/China.png';
import Großbritannien from './../Flaggen/UK.png';
// Icons der Konstrukteure
import Ferrari from '../Teamlogos/Ferrari.png';
import AstonMartin from '../Teamlogos/AstonMartin.png';
import Merceds from '../Teamlogos/MercedesIcon.png';
import RedBull from '../Teamlogos/RedBullIcon.svg';
import Williams from '../Teamlogos/Williams.png';
import McLaren from '../Teamlogos/MclarenIcon.png';
import Alpine from '../Teamlogos/Alpine.png';
import KickSauber from '../Teamlogos/StakeSauber.png';
import Haas from '../Teamlogos/Haas.png';
import VisaRB from '../Teamlogos/VisaCashAppWithBackground.jpg';

const Konstrukteurtabelle = () => {
    const [teams, setTeams] = useState([]);
    const [Strecken, setStrecken] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'teams'), (snapshot) => {
            const teamsData = [];
            snapshot.forEach((doc) => {
                const { gesamtPunkte, team, wertung } = doc.data();
                if (gesamtPunkte !== undefined) { // Fügen Sie nur Teams hinzu, wenn gesamtPunkte nicht undefined ist
                    teamsData.push({
                        id: doc.id,
                        gesamtPunkte: gesamtPunkte,
                        team,
                        wertung
                    });
                }
            });
            teamsData.sort((a, b) => b.gesamtPunkte - a.gesamtPunkte);
            setTeams(teamsData);
            console.log("Team Standing", teamsData);
        });

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
            // Sortiere die tempListe basierend auf dem Datum
            tempListe.sort((a, b) => new Date(a.datum) - new Date(b.datum));
            console.log("StreckenArray:", tempListe);
            setStrecken(tempListe);
        });
    
        // Aufräumen bei Unmount
        return () => unsubscribe();
    }, []);

    function renderTeamLogo(team) {
        if (team === 'Ferrari') {
          return <img src={Ferrari} alt="Ferrari Logo" style={{ width: '15px', height: '20px', marginLeft: '10px' }} />;
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
          return <img src={McLaren} alt="McLaren Logo" style={{ width: '25px', height: '25px', marginLeft: '8px' }} />;
        }
        if (team === 'Alpine') {
          return <img src={Alpine} alt="Alpine Logo" style={{ width: '20px', height: '20px', marginLeft: '8px' }} />;
        }
        if (team === 'Kick Sauber') {
          return <img src={KickSauber} alt="Kick Sauber Logo" style={{ width: '20px', height: '20px', marginLeft: '8px' }} />;
        }
        if (team === 'Haas') {
          return <img src={Haas} alt="Haas Logo" style={{ width: '40px', height: '15px', marginLeft: '8px' }} />;
        }
        if (team === 'Visa RB') {
          return <img src={VisaRB} alt="Visa RB Logo" style={{ width: '25px', height: '20px', marginLeft: '8px' }} />;
        }
        return null;
    }

    function shouldRenderImage(Strecken, imageName) {
        // Überprüfen Sie, ob das Array 'strecken' ein Objekt mit einer ID enthält, die dem Namen der Bildquelle ähnlich ist
         // und dessen 'ansicht'-Attribut auch true ist
        return Strecken.some(strecke => strecke.id.toLowerCase().includes(imageName.toLowerCase()) && strecke.ansicht === true);
    }

    return (
        <>
        <div className='table-container'>
            <ScrollArea type='never' className='scrollarea' h={380}>
                <Table striped bordered hover>
                    <thead className='thead-sticky'>
                        <tr>
                            <th id='sticky-konstrukteur'>Konstrukteur</th>
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
                        {teams.filter(team => team.gesamtPunkte !== undefined).map((team) => (
                            <tr key={team.id}>
                                <td  className='sticky-konstrukteur-body'>
                                    <div>
                                        <span>{team.id}</span>
                                        {renderTeamLogo(team.id)}
                                    </div>
                                </td>
                                {shouldRenderImage(Strecken, 'Bahrain') && 
                                <td>{team?.wertung?.Bahrain}</td>
                                }
                                {
                                    Strecken.filter(strecke => strecke.ansicht)
                                    .map((strecke, index) => 
                                        <td key={index}>
                                            {team?.wertung?.[strecke.name] ?? ''}
                                        </td>
                                    )
                                }
                                <td>{team.gesamtPunkte}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </ScrollArea>
            <div className='chart-container'>
               <KonstrukteurLineChart teams={teams}/>
            </div>
        </div>
        </>
    );
};
export default Konstrukteurtabelle;