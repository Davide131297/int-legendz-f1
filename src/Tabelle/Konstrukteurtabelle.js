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
import AlfaRomeo from '../Teamlogos/AlfaRomeoIcon.png';
import Haas from '../Teamlogos/Haas.png';
import AlphaTauri from '../Teamlogos/AlphaTauri.png';

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
        if (team === 'Alfa Romeo') {
          return <img src={AlfaRomeo} alt="AlfaRomeo Logo" style={{ width: '20px', height: '20px', marginLeft: '8px' }} />;
        }
        if (team === 'Haas') {
          return <img src={Haas} alt="Haas Logo" style={{ width: '40px', height: '15px', marginLeft: '8px' }} />;
        }
        if (team === 'Alpha Tauri') {
          return <img src={AlphaTauri} alt="Alpha Tauri Logo" style={{ width: '25px', height: '20px', marginLeft: '8px' }} />;
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
                            {shouldRenderImage(Strecken, 'Bahrain') && 
                            <th><img src={Bahrain} alt="Bahrain" className='img-size'/></th>
                            }
                            {shouldRenderImage(Strecken, 'Saudi Arabien') &&
                            <th><img src={SaudiArabien} alt="SaudiArabien" className='img-size'/></th>
                            }
                            {shouldRenderImage(Strecken, 'Australien') &&
                            <th><img src={Australien} alt="Australien" className='img-size'/></th>
                            }
                            {shouldRenderImage(Strecken, 'Japan') &&
                            <th><img src={Japan} alt="Japan" className='img-size'/></th>
                            }
                            {shouldRenderImage(Strecken, 'China') &&
                            <th><img src={China} alt="China" className='img-size'/></th>
                            }
                            {shouldRenderImage(Strecken, 'Miami') &&
                            <th><img src={USA} alt="Miami" className='img-size'/></th>
                            }
                            {shouldRenderImage(Strecken, 'Imola') &&
                            <th><img src={Italien} alt="Imola" className='img-size'/></th>
                            }
                            {shouldRenderImage(Strecken, 'Monaco') &&
                            <th><img src={Monaco} alt="Monaco" className='img-size'/></th>
                            }
                            {shouldRenderImage(Strecken, 'Kanada') &&
                            <th><img src={Kanada} alt="Kanada" className='img-size'/></th>
                            }
                            {shouldRenderImage(Strecken, 'Spanien') &&
                            <th><img src={Spanien} alt="Spanien" className='img-size'/></th>
                            }
                            {shouldRenderImage(Strecken, 'Österreich') &&
                            <th><img src={Österreich} alt="Österreich" className='img-size'/></th>
                            }
                            {shouldRenderImage(Strecken, 'Großbritannien') &&
                            <th><img src={Großbritannien} alt="Großbritannien" className='img-size'/></th>
                            }

                            {/*

                            {shouldRenderImage(Strecken, 'Ungarn') &&
                            <th><img src={Ungarn} alt="Ungarn" className='img-size'/></th>
                            }
                            {shouldRenderImage(Strecken, 'Belgien') &&
                            <th><img src={Belgien} alt="Belgien" className='img-size'/></th>
                            }
                            {shouldRenderImage(Strecken, 'Niederlande') &&
                            <th><img src={Niederlande} alt="Niederlande" className='img-size'/></th>
                            }
                            {shouldRenderImage(Strecken, 'Monza') &&
                            <th><img src={Italien} alt="Monza" className='img-size'/></th>
                            }
                            {shouldRenderImage(Strecken, 'Aserbaidschan') &&
                            <th><img src={Aserbaidschan} alt="Aserbaidschan" className='img-size'/></th>
                            }
                            {shouldRenderImage(Strecken, 'Singapur') &&
                            <th><img src={Singapur} alt="Singapur" className='img-size'/></th>
                            }
                            {shouldRenderImage(Strecken, 'Austin') &&
                            <th><img src={USA} alt="Austin" className='img-size'/></th>
                            }
                            {shouldRenderImage(Strecken, 'Mexiko') &&
                            <th><img src={Mexiko} alt="Mexiko" className='img-size'/></th>
                            }
                            {shouldRenderImage(Strecken, 'Brasilien') &&
                            <th><img src={Brasilien} alt="Brasilien" className='img-size'/></th>
                            }
                            {shouldRenderImage(Strecken, 'LasVegas') &&
                            <th><img src={USA} alt="LasVegas" className='img-size'/></th>
                            }
                            {shouldRenderImage(Strecken, 'Katar') &&
                            <th><img src={Katar} alt="Katar" className='img-size'/></th>
                            }
                            {shouldRenderImage(Strecken, 'AbuDhabi') &&
                            <th><img src={AbuDhabi} alt="AbuDhabi" className='img-size'/></th>
                            } 
                            */}
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
                                {shouldRenderImage(Strecken, 'SaudiArabien') &&
                                <td>{team?.wertung?.SaudiArabien}</td>
                                }
                                {shouldRenderImage(Strecken, 'Australien') &&
                                <td>{team?.wertung?.Australien}</td>
                                }
                                {shouldRenderImage(Strecken, 'Japan') &&
                                <td>{team?.wertung?.Japan}</td>
                                }
                                {shouldRenderImage(Strecken, 'China') &&
                                <td>{team?.wertung?.China}</td>
                                }                              
                                {shouldRenderImage(Strecken, 'Miami') && 
                                <td>{team?.wertung?.Miami}</td>
                                }
                                {shouldRenderImage(Strecken, 'Imola') &&
                                <td>{team?.wertung?.Imola}</td>
                                }
                                {shouldRenderImage(Strecken, 'Monaco') &&
                                <td>{team?.wertung?.Monaco}</td>
                                }
                                {shouldRenderImage(Strecken, 'Kanada') &&
                                <td>{team?.wertung?.Kanada}</td>
                                }
                                {shouldRenderImage(Strecken, 'Spanien') &&
                                <td>{team?.wertung?.Spanien}</td>
                                }
                                {shouldRenderImage(Strecken, 'Österreich') &&
                                <>
                                <td>
                                    {(team?.wertung?.Österreich_Sprint !== undefined || team?.wertung?.Österreich_Rennen !== undefined) 
                                        ? (team?.wertung?.Österreich_Sprint || 0) + (team?.wertung?.Österreich_Rennen || 0)
                                        : ''}
                                </td>
                                </>
                                }
                                {shouldRenderImage(Strecken, 'Großbritannien') &&
                                <td>{team?.wertung?.Großbritannien}</td>
                                }

                                {/*

                                {shouldRenderImage(Strecken, 'Ungarn') &&
                                <td>{team?.wertung?.Ungarn}</td>
                                }

                                {shouldRenderImage(Strecken, 'Belgien') &&
                                <td>{team?.wertung?.Belgien}</td>
                                }

                                {shouldRenderImage(Strecken, 'Niederlande') &&
                                <td>{team?.wertung?.Niederlande}</td>
                                }

                                {shouldRenderImage(Strecken, 'Monza') &&
                                <td>{team?.wertung?.Monza}</td>
                                }
                                
                                {shouldRenderImage(Strecken, 'Aserbaidschan') &&
                                <td>{team?.wertung?.Aserbaidschan}</td>
                                }

                                {shouldRenderImage(Strecken, 'Singapur') &&
                                <td>{team?.wertung?.Singapur}</td>
                                }

                                {shouldRenderImage(Strecken, 'Austin') &&
                                <>
                                <td>
                                    {(team?.wertung?.Austin_Sprint !== undefined || team?.wertung?.Austin_Rennen !== undefined)
                                        ? (team?.wertung?.Austin_Sprint || 0) + (team?.wertung?.Austin_Rennen || 0)
                                        : ''}
                                </td>
                                </>
                                }

                                {shouldRenderImage(Strecken, 'Mexiko') &&
                                <td>{team?.wertung?.Mexiko}</td>
                                }

                                {shouldRenderImage(Strecken, 'Brasilien') &&
                                <>
                                    <td>
                                        {(team?.wertung?.Brasilien_Sprint !== undefined || team?.wertung?.Brasilien_Rennen !== undefined)
                                            ? (team?.wertung?.Brasilien_Sprint || 0) + (team?.wertung?.Brasilien_Rennen || 0)
                                            : ''}
                                    </td>
                                </>
                                }

                                {shouldRenderImage(Strecken, 'LasVegas') &&
                                <td>{team?.wertung?.LasVegas}</td>
                                }

                                {shouldRenderImage(Strecken, 'Katar') &&
                                <>
                                    <td>
                                        {(team?.wertung?.Katar_Sprint !== undefined || team?.wertung?.Katar_Rennen !== undefined)
                                            ? (team?.wertung?.Katar_Sprint || 0) + (team?.wertung?.Katar_Rennen || 0)
                                            : ''}
                                    </td>
                                </>
                                }

                                {shouldRenderImage(Strecken, 'AbuDhabi') &&
                                <td>{team?.wertung?.AbuDhabi}</td>
                                }
                                */}
                                <td></td> {/* Platzhalter für die Gesamtpunkte */}
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