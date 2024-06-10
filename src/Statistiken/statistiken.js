import React, {useState, useEffect} from 'react';
import { db } from './../utils/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { DonutChart } from '@mantine/charts';
import './statistiken.css';
import { Table } from 'react-bootstrap';
import { ScrollArea } from '@mantine/core';

const Statistiken = () => {
    const [personen, setPersonen] = useState([]);
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        const personenRef = collection(db, 'personen');
        const unsubscribe = onSnapshot(personenRef, (snapshot) => {
            let tempListe = [];
            snapshot.forEach((doc) => {
                tempListe.push(doc.data());
            });
            tempListe.sort((a, b) => {
                return Object.values(b?.wertung || {}).reduce((a, b) => a + (Number.isInteger(b) ? b : 0), 0) - Object.values(a?.wertung || {}).reduce((a, b) => a + (Number.isInteger(b) ? b : 0), 0);
            });
            console.log("Fahrerdaten",tempListe);
            setPersonen(tempListe);
        });
        return () => unsubscribe();
    }, []);

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

    const farben = [
        'indigo.6',
        'yellow.6',
        'teal.6',
        'gray.6',
        'red.6',
        'blue.6',
        'cyan.6',
        'purple',
        'lime.6',
        'pink.6',
        'beige',
        'aqua',
        'violet.6',
        'teal.6',
        'orange.6',
        'green.6',
        'darkorange',
        'chocolate',
        'lightBlue.6',
        'blueviolet'
    ]; 
    
    const teamColors = {
        'Ferrari': '#FF0000',
        'Mercedes': '#788086',
        'McLaren': '#fc8404',
        'Red Bull': 'darkblue',
        'Alpine': '#ff82ab',
        'AlphaTauri': '#040505',
        'Aston Martin': '#008B00',
        'Alfa Romeo': '#CD0000',
        'Haas': 'red',
        'Williams': '#049cdc'
    };

    const myDataPole = personen
        .filter(person => {
            const poleCount = Object.entries(person.wertung || {})
                .filter(([key, value]) => key.startsWith('pole_') && value === true)
                .length;
            return poleCount > 0;
        })
        .map((person, index) => {
            const poleCount = Object.entries(person.wertung || {})
                .filter(([key, value]) => key.startsWith('pole_') && value === true)
                .length;
            return {
                name: person.spielerID,
                value: poleCount,
                color: teamColors[person.team] || farben[index % farben.length], // Verwenden Sie die Farbe des Teams, wenn sie vorhanden ist, sonst verwenden Sie die Farbe aus der Liste
                // Fügen Sie hier weitere Attribute hinzu, wenn Sie möchten
            };
        }
    );

    const myDataDriverOfTheDay = personen
        .filter(person => {
            const driverOfTheDayCount = Object.entries(person.wertung || {})
                .filter(([key, value]) => key.startsWith('driverOfTheDay_') && value === true)
                .length;
            return driverOfTheDayCount > 0;
        })
        .map((person, index) => {
            const driverOfTheDayCount = Object.entries(person.wertung || {})
                .filter(([key, value]) => key.startsWith('driverOfTheDay_') && value === true)
                .length;
            return {
                name: person.spielerID,
                value: driverOfTheDayCount,
                color: teamColors[person.team] || farben[index % farben.length], // Verwenden Sie die Farbe des Teams, wenn sie vorhanden ist, sonst verwenden Sie die Farbe aus der Liste
                // Fügen Sie hier weitere Attribute hinzu, wenn Sie möchten
            };
        }
    );

    const gesuchteWerte = [26, 19, 16, 13, 11, 9, 7, 5, 3];
    const myDataFastetLap = personen
        .filter(person => {
            const wertungValues = Object.entries(person.wertung || {})
                .filter(([key, value]) => !key.endsWith('_Sprint'))
                .map(([key, value]) => value);
            return gesuchteWerte.some(wert => wertungValues.includes(wert));
        })
        .map((person, index) => {
            const wertungValues = Object.entries(person.wertung || {})
                .filter(([key, value]) => !key.endsWith('_Sprint'))
                .map(([key, value]) => value);
            return {
                name: person.spielerID,
                value: wertungValues.filter(value => gesuchteWerte.includes(value)).length,
                color: teamColors[person.team] || farben[index % farben.length], // Verwenden Sie die Farbe des Teams, wenn sie vorhanden ist, sonst verwenden Sie die Farbe aus der Liste
                // Fügen Sie hier weitere Attribute hinzu, wenn Sie möchten
            };
        }
    );

    const siege = personen
        .map((person) => {
            const siegCount = Object.values(person.wertung || {})
                .filter(value => value === 25 || value === 26)
                .length;
            return {
                name: person.spielerID,
                value: siegCount,
                color: teamColors[person.team] || farben[personen.indexOf(person) % farben.length],
            };
        })
    .filter(person => person.value > 0);

    const teamstaerke = [...teams]
        .sort((a, b) => b.gesamtPunkte - a.gesamtPunkte)
        .map((team) => {
            return {
                name: team.team,
                value: team.gesamtPunkte,
                color: teamColors[team.team] || farben[teams.indexOf(team) % farben.length],
            };
    });


    useEffect(() => {
        console.log("Poles", myDataPole);
        console.log("Driver of the Day", myDataDriverOfTheDay);
        console.log("Fastest Lap", myDataFastetLap);
        console.log("Wins", siege);
        console.log("Teams nach Stärke sortiert", teamstaerke);
    }, [myDataPole, myDataDriverOfTheDay, myDataFastetLap, siege, teamstaerke]);

    const TabelleLegende = ({ daten }) => (
    <Table striped bordered hover>
        <thead>
        <tr>
            <th>Name</th>
            <th>Wert</th>
        </tr>
        </thead>
        <tbody>
        {daten.map((item, index) => (
            <tr key={index}>
            <td style={{padding: '0'}}>{item.name}</td>
            <td style={{padding: '0'}}>{item.value}</td>
            </tr>
        ))}
        </tbody>
    </Table>
    );

    return (
        <>
            <div className='statistiken-container'>
            <div>
                <h2>Pole Position</h2>
                <DonutChart size={180} withLabelsLine withLabels chartLabel="Pole Position" data={myDataPole} />
                <TabelleLegende daten={myDataPole} />
            </div>
            <div>
                <h2>Fahrer des Tages</h2>
                <DonutChart size={180} withLabelsLine withLabels chartLabel="Driver of the Day" data={myDataDriverOfTheDay} />
                <TabelleLegende daten={myDataDriverOfTheDay} />
            </div>
            <div>
                <h2>Schnellste Runde</h2>
                <DonutChart size={180} withLabelsLine withLabels chartLabel="Fastest Lap" data={myDataFastetLap} />
                <TabelleLegende daten={myDataFastetLap} />
            </div>
            <div>
                <h2 style={{display: 'flex', justifyContent: 'center'}}>Rennsiege</h2>
                <DonutChart size={180} withLabelsLine withLabels chartLabel="Wins" data={siege} />
                <TabelleLegende daten={siege} />
            </div>
            <div>
                <h2>Teams nach Stärke</h2>
                <DonutChart size={180} withLabelsLine withLabels chartLabel="Team Strength" data={teamstaerke} />
                <TabelleLegende daten={teamstaerke} />
            </div>
            </div>
        </>
    );
}
export default Statistiken;
