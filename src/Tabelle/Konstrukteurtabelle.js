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

const Konstrukteurtabelle = () => {
    const [teams, setTeams] = useState([]);

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
        return null;
    }

    return (
        <>
        <div className='table-container'>
            <ScrollArea type='never' className='scrollarea' h={330}>
                <Table striped bordered hover>
                    <thead className='thead-sticky'>
                        <tr>
                            <th id='sticky-konstrukteur'>Konstrukteur</th>
                            <th><img src={Bahrain} alt="Bahrain" className='img-size'/></th>
                            <th><img src={SaudiArabien} alt="SaudiArabien" className='img-size'/></th>
                            <th><img src={Australien} alt="Australien" className='img-size'/></th>
                            <th><img src={Aserbaidschan} alt="Aserbeidschan" className='img-size'/></th>
                            <th><img src={USA} alt="Miami" className='img-size'/></th>
                            <th><img src={Italien} alt="Italien" className='img-size'/></th>
                            <th><img src={Monaco} alt="Monaco" className='img-size'/></th>
                            <th><img src={Spanien} alt="Spanien" className='img-size'/></th>
                            <th><img src={Kanada} alt="Kanada" className='img-size'/></th>
                            <th><img src={Österreich} alt="Österreich" className='img-size'/></th>
                            <th><img src={England} alt="England" className='img-size'/></th>
                            <th><img src={Ungarn} alt="Ungarn" className='img-size'/></th>
                            <th><img src={Belgien} alt="Belgien" className='img-size'/></th>
                            <th><img src={Niederlande} alt="Niederlande" className='img-size'/></th>
                            <th><img src={Singapur} alt="Singapur" className='img-size'/></th>
                            <th><img src={Japan} alt="Japan" className='img-size'/></th>
                            <th><img src={Katar} alt="Katar" className='img-size'/></th>
                            <th><img src={USA} alt="USA" className='img-size'/></th>
                            <th><img src={Mexiko} alt="Mexiko" className='img-size'/></th>
                            <th><img src={Brasilien} alt="Brasilien" className='img-size'/></th>
                            <th><img src={USA} alt="LasVegas" className='img-size'/></th>
                            <th><img src={AbuDhabi} alt="AbuDhabi" className='img-size'/></th>
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
                                <td>{team?.wertung?.bahrain}</td>
                                <td>{team?.wertung?.saudiarabien}</td>
                                <td>{team?.wertung?.australien}</td>
                                <td>
                                    {(team?.wertung?.aserbaidschan_Sprint !== undefined || team?.wertung?.aserbaidschan_Rennen !== undefined) 
                                        ? (team?.wertung?.aserbaidschan_Sprint || 0) + (team?.wertung?.aserbaidschan_Rennen || 0)
                                        : ''}
                                </td>
                                <td>{team?.wertung?.miami}</td>
                                <td>{team?.wertung?.italien}</td>
                                <td>{team?.wertung?.monaco}</td>
                                <td>{team?.wertung?.spanien}</td>
                                <td>{team?.wertung?.kanada}</td>
                                <td>
                                    {(team?.wertung?.österreich_Sprint !== undefined || team?.wertung?.österreich_Rennen !== undefined) 
                                        ? (team?.wertung?.österreich_Sprint || 0) + (team?.wertung?.österreich_Rennen || 0)
                                        : ''}
                                </td>
                                <td>{team?.wertung?.england}</td>
                                <td>{team?.wertung?.ungarn}</td>
                                <td>
                                    {(team?.wertung?.belgien_Sprint !== undefined || team?.wertung?.belgien_Rennen !== undefined) 
                                        ? (team?.wertung?.belgien_Sprint || 0) + (team?.wertung?.belgien_Rennen || 0)
                                        : ''}
                                </td>
                                <td>{team?.wertung?.niederlande}</td>
                                <td>{team?.wertung?.singapur}</td>
                                <td>{team?.wertung?.japan}</td>
                                <td>
                                    {(team?.wertung?.katar_Sprint !== undefined || team?.wertung?.katar_Rennen !== undefined) 
                                        ? (team?.wertung?.katar_Sprint || 0) + (team?.wertung?.katar_Rennen || 0)
                                        : ''}
                                </td>
                                <td>
                                    {(team?.wertung?.usa_Sprint !== undefined || team?.wertung?.usa_Rennen !== undefined) 
                                        ? (team?.wertung?.usa_Sprint || 0) + (team?.wertung?.usa_Rennen || 0)
                                        : ''}
                                </td>
                                <td>{team?.wertung?.mexiko}</td>
                                <td>
                                    {(team?.wertung?.brasilien_Sprint !== undefined || team?.wertung?.brasilien_Rennen !== undefined) 
                                        ? (team?.wertung?.brasilien_Sprint || 0) + (team?.wertung?.brasilien_Rennen || 0)
                                        : ''}
                                </td>
                                <td>{team?.wertung?.lasvegas}</td>
                                <td>{team?.wertung?.abuDhabi}</td>
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