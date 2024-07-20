import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './../utils/firebase';
import Table from 'react-bootstrap/Table';
import { ScrollArea } from '@mantine/core';
import './konstrukteurtabelle.css';
import KonstrukteurLineChart from '../Charts/LineChart_Konstrukteur';

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
                    datum: data.Datum.toDate(), // Speichere das Date-Objekt
                    flagge: data.Flagge,
                    sprint: data.Sprint
                });
            });
            // Sortiere die tempListe basierend auf dem Datum (Date-Objekte)
            tempListe.sort((a, b) => a.datum - b.datum);
            // Konvertiere das Datum in den lokalisierten String nach der Sortierung
            tempListe = tempListe.map(item => ({
                ...item,
                datum: item.datum.toLocaleDateString('de-DE')
            }));
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

    return (
        <>
        <div className='table-container'>
            <ScrollArea type='never' className='scrollarea' h={380}>
                <Table striped bordered hover>
                    <thead className='thead-sticky'>
                        <tr>
                            <th id='sticky-konstrukteur'>Konstrukteur</th>
                            {
                                Strecken.filter(strecke => strecke.ansicht)
                                .map((strecke, index) => 
                                    strecke.sprint ? (
                                        <th key={index} colSpan="2">
                                            <img src={strecke.flagge} alt="Flagge" height="10px" width="20px" />
                                        </th>
                                    ) : (
                                        <th key={index}>
                                            <img src={strecke.flagge} alt="Flagge" height="10px" width="20px" />
                                        </th>
                                    )
                                )
                            }
                            <th>Gesamtpunkte</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teams.filter(team => team.gesamtPunkte !== undefined).map((team) => (
                            <tr key={team.id}>
                                <td className='sticky-konstrukteur-body'>
                                    <div>
                                        <span>{team.id}</span>
                                        {renderTeamLogo(team.id)}
                                    </div>
                                </td>
                                {
                                    Strecken.sort((a, b) => {
                                        let datumA = a.datum.split(".").reverse().join("/");
                                        let datumB = b.datum.split(".").reverse().join("/");
                                        return new Date(datumA) - new Date(datumB);
                                    })
                                    .filter(strecke => strecke.ansicht)
                                    .flatMap((strecke, index) => 
                                        strecke.sprint ? [
                                            <td key={`${index}_sprint`}>
                                                {team?.wertung?.[`${strecke.name}_Sprint`] ?? ''}
                                            </td>,
                                            <td key={`${index}_rennen`}>
                                                {team?.wertung?.[`${strecke.name}_Rennen`] ?? ''}
                                            </td>
                                        ] : [
                                            <td key={index}>
                                                {team?.wertung?.[strecke.name] ?? ''}
                                            </td>
                                        ]
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