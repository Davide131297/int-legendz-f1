import React, {useState, useEffect} from 'react';
import moment from 'moment';
import { Card, Image, Text, Badge, Group, Loader } from '@mantine/core';
import './Home.css';
import TeilnehmerTabelle from '../Tabelle/TeilnehmerTabelle' // Importieren der TeilnehmerTabelle
import { ScrollArea } from '@mantine/core';
import Table from 'react-bootstrap/Table';
import { db } from './../utils/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import f1background from './F1Background.jpg';
import PirelliReifen from './PirelliReifen.webp';
import { Modal  } from '@mantine/core';

const Home = () => {

    const BahrainMap = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Circuit_Bahrain.svg/1920px-Circuit_Bahrain.svg.png";
    const SaudiArabienMap = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Jeddah_Street_Circuit_2021.svg/2560px-Jeddah_Street_Circuit_2021.svg.png";
    const AustralienMap = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Albert_Park_Circuit_2021.svg/1920px-Albert_Park_Circuit_2021.svg.png";
    const AserbaidschanMap = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Baku_Formula_One_circuit_map.svg/1920px-Baku_Formula_One_circuit_map.svg.png";
    const MiamiMap = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Hard_Rock_Stadium_Circuit_2022.svg/2880px-Hard_Rock_Stadium_Circuit_2022.svg.png";
    const ItalienMap = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Imola_2009.svg/2560px-Imola_2009.svg.png";
    const MonacoMap = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Circuit_Monaco.svg/1280px-Circuit_Monaco.svg.png";
    const SpanienMap = "https://upload.wikimedia.org/wikipedia/commons/f/fd/Circuit_Catalunya.png";
    const KanadaMap = "https://upload.wikimedia.org/wikipedia/commons/f/f1/Circuit_Montreal.png";
    const ÖsterreichMap = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Circuit_Red_Bull_Ring.svg/1920px-Circuit_Red_Bull_Ring.svg.png";
    const EnglandMap = "https://upload.wikimedia.org/wikipedia/commons/b/bd/Silverstone_Circuit_2020.png";
    const UngarnMap = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Circuit_Hungaroring.png";
    const BelgienMap = "https://upload.wikimedia.org/wikipedia/commons/1/11/Circuit_Spa_2007.png";
    const NiederlandeMap = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Zandvoort_Circuit.png/1920px-Zandvoort_Circuit.png";
    const SingapurMap = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Marina_Bay_circuit_2023.svg/1920px-Marina_Bay_circuit_2023.svg.png";
    const JapanMap = "https://upload.wikimedia.org/wikipedia/commons/7/79/Circuit_Suzuka.png";
    const KatarMap = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Lusail_International_Circuit_2023.svg/1920px-Lusail_International_Circuit_2023.svg.png";
    const USAMap = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Austin_circuit.svg/1280px-Austin_circuit.svg.png";
    const MexikoMap = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Autódromo_Hermanos_Rodríguez_2015.svg/1920px-Autódromo_Hermanos_Rodríguez_2015.svg.png";
    const BrasilienMap = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Circuit_Interlagos.svg/1280px-Circuit_Interlagos.svg.png";
    const LasVegasMap = "https://upload.wikimedia.org/wikipedia/commons/f/fa/Circuit_Caesars_Palace.png";
    const AbuDhabiMap = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Yas_Marina_Circuit.png/2560px-Yas_Marina_Circuit.png"

    const Rennstrecken = [
        {name: "Bahrain", flag: "https://www.worldometers.info/img/flags/ba-flag.gif", date: "22.03.2024", layout: BahrainMap},
        {name: "Saudi Arabien", flag: "https://www.worldometers.info/img/flags/sa-flag.gif", date: "29.03.2024", layout: SaudiArabienMap},
        {name: "Australien", flag: "https://www.worldometers.info/img/flags/as-flag.gif", date: "05.04.2022", layout: AustralienMap},
        {name: "Aserbaidschan", flag: "https://www.worldometers.info/img/flags/aj-flag.gif", date: "12.04.2024", layout: AserbaidschanMap},
        {name: "Miami", flag: "https://www.worldometers.info/img/flags/us-flag.gif", date: "19.04.2024", layout: MiamiMap},
        {name: "Italien", flag: "https://www.worldometers.info/img/flags/it-flag.gif", date: "26.04.2024", layout: ItalienMap},
        {name: "Monaco", flag: "https://www.worldometers.info/img/flags/mn-flag.gif", date: "03.05.2024", layout: MonacoMap},
        {name: "Spanien", flag: "https://www.worldometers.info/img/flags/sp-flag.gif", date: "10.05.2024", layout: SpanienMap},
        {name: "Kanada", flag: "https://www.worldometers.info/img/flags/ca-flag.gif", date: "17.05.2024", layout: KanadaMap},
        {name: "Österreich", flag: "https://www.worldometers.info/img/flags/au-flag.gif", date: "24.05.2024", layout: ÖsterreichMap},
        {name: "England", flag: "https://www.worldometers.info/img/flags/uk-flag.gif", date: "31.05.2024", layout: EnglandMap},
        {name: "Ungarn", flag: "https://www.worldometers.info/img/flags/hu-flag.gif", date: "07.06.2024", layout: UngarnMap},
        {name: "Belgien", flag: "https://www.worldometers.info/img/flags/be-flag.gif", date: "14.06.2024", layout: BelgienMap},
        {name: "Niederlande", flag: "https://www.worldometers.info/img/flags/nl-flag.gif", date: "21.06.2024", layout: NiederlandeMap},
        {name: "Singapur", flag: "https://www.worldometers.info/img/flags/sn-flag.gif", date: "28.06.2024", layout: SingapurMap},
        {name: "Japan", flag: "https://www.worldometers.info/img/flags/ja-flag.gif", date: "05.07.2024", layout: JapanMap},
        {name: "Katar", flag: "https://www.worldometers.info/img/flags/qa-flag.gif", date: "12.07.2024", layout: KatarMap},
        {name: "USA", flag: "https://www.worldometers.info/img/flags/us-flag.gif", date: "19.07.2024", layout: USAMap},
        {name: "Mexiko", flag: "https://www.worldometers.info/img/flags/mx-flag.gif", date: "26.07.2024", layout: MexikoMap},
        {name: "Brasilien", flag: "https://www.worldometers.info/img/flags/br-flag.gif", date: "02.08.2024", layout: BrasilienMap},
        {name: "Las Vegas", flag: "https://www.worldometers.info/img/flags/us-flag.gif", date: "09.08.2024", layout: LasVegasMap},
        {name: "Abu Dhabi", flag: "https://www.worldometers.info/img/flags/ae-flag.gif", date: "16.08.2024", layout: AbuDhabiMap}
    ];

    const [nextRace, setNextRace] = useState(null);
    const [timeLeft, setTimeLeft] = useState({});
    const [personen, setPersonen] = useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [mapLayout, setMapLayout] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [strecken, setStrecken] = useState([]);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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

    // Fetching Strecken data from Firebase, converting timestamp to Date
    useEffect(() => {
        const streckenRef = collection(db, 'Strecken');
        const unsubscribe = onSnapshot(streckenRef, (snapshot) => {
            let tempStrecken = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                if (data.Datum) { // Überprüfen Sie, ob das Feld Datum existiert
                    const datum = data.Datum.toDate(); // Convert Firebase Timestamp to Date
                    tempStrecken.push({
                        id: doc.id, // Track name
                        datum: datum,
                        flagge: data.Flagge,
                        layout: data.Layout,
                    });
                } else {
                    console.warn(`Document with id ${doc.id} does not have a Datum field.`);
                }
            });

            // Sortieren Sie tempStrecken basierend auf dem Datum, das am nächsten am aktuellen Datum liegt
            tempStrecken.sort((a, b) => Math.abs(new Date() - a.datum) - Math.abs(new Date() - b.datum));

            console.log("Strecken:", tempStrecken);
            setStrecken(tempStrecken);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const findNextRace = () => {
            const now = moment();
            for (let race of strecken) {
                let raceDate = moment(race.datum);
                if (raceDate.isAfter(now)) {
                    return race;
                }
            }
            return null;
        };

        const calculateTimeLeft = () => {
            if (nextRace) {
                const now = moment();
                const raceDate = moment(nextRace.datum);
                const diff = moment.duration(raceDate.diff(now));
                setTimeLeft({
                    days: diff.days(),
                    hours: diff.hours(),
                    minutes: diff.minutes(),
                    seconds: diff.seconds(),
                });
            }
        };

        setNextRace(findNextRace());
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [strecken, nextRace]);

    function handleImageClick() {
        console.log("Image clicked");
        setShowModal(true);
    }

    return (
        <>
        <div className="header-image">
            <img src={f1background} alt="F1 Background" />
        </div>
        <div className='top-container'>
            <div className='Rennkalender'>
                <div className='card-container'>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Card.Section>
                            <Image
                                onClick={handleImageClick}
                                src={nextRace?.flagge}
                                alt={nextRace ? nextRace.id : "Unknown"}
                                style={{ cursor: 'pointer' }}
                            />
                        </Card.Section>

                        <Group mt="md" mb="xs">
                            <Text fw={700}>Nächstes Rennen:</Text>
                            <Badge color="rgba(0, 0, 0, 1)">
                                {nextRace ? nextRace.id : "Kein Rennen geplant"}
                            </Badge>
                        </Group>

                        {timeLeft.days ? (
                            <Text size="sm" c="dimmed">
                            Startet in {`${timeLeft.days} Tagen, ${timeLeft.hours} Stunden, ${timeLeft.minutes} Minuten und ${timeLeft.seconds} Sekunden`}
                            </Text>
                        ) : (
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                <Loader type="dots" color='blue' size="lg" />
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            <div className='HomeTeilnehmerTabelle'>
                <ScrollArea h={windowWidth < 600 ? 300 : 275}>
                    <Table striped bordered hover>
                        <thead id='tabellenkopf'>
                            <tr>
                            <th className='table-content'>Pos</th>
                            <th className='table-content'>Spieler</th>
                            <th className='table-content'>Punkte</th>
                            </tr>
                        </thead>
                        <tbody>
                        {personen.map((person, index) => (
                            <tr key={index}>
                            <td className='table-content'>{index + 1}</td>
                            <td className='table-content'>{person.spielerID}</td>
                            <td className='table-content'>{Object.values(person?.wertung || {}).reduce((a, b) => a + (Number.isInteger(b) ? b : 0), 0)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </ScrollArea>
            </div>
        </div>
        <div className='bottom-container'>
            <div className='footer-image'>
                <img src={PirelliReifen} alt="Pirelli Reifen" />
            </div>
        </div>

        <Modal opened={showModal} onClose={() => setShowModal(false)} title="Streckenlayout" size="md" padding="xl" hideCloseButton centered> 
            <Image src={nextRace && nextRace.layout}  />
        </Modal>
        </>
    );
}
export default Home;