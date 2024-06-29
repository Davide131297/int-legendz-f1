import { db } from './../utils/firebase';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';

const DokumentErstellung = ({Fahrerliste, Rundendaten, RennErgebnis, SessionData}) => {

    const [strecke, setStrecke] = useState('');
    const [RennDaten, setRennDaten] = useState([]);

    useEffect(() => {
        const Strecke = getTrackName(SessionData.m_trackId);
        setStrecke(Strecke);
    }, [SessionData]);

   useEffect(() => {
        const fetchDokumentMitStrecke = async () => {
            if (strecke) {
                const q = query(collection(db, 'Ergebnisse'), where('StreckenName', '==', strecke));
                const querySnapshot = await getDocs(q);
                const gefunden = !querySnapshot.empty;
                console.log(`Mindestens ein Dokument gefunden mit dem Namen '${strecke}':`, gefunden);
                querySnapshot.forEach((doc) => {
                    console.log(`${doc.id} =>`, doc.data());
                });
            }
        };

        fetchDokumentMitStrecke();
    }, [strecke]);

    function getTrackName(id) {
        switch(id) {
            case 0:
                return "Australien";
            case 1:
                return "Paul Ricard";
            case 2:
                return "China";
            case 3:
                return "Bahrain";
            case 4:
                return "Spanien";
            case 5:
                return "Monaco";
            case 6:
                return "Kanda";
            case 7:
                return "Großbritannien";
            case 8:
                return "Hockenheim";
            case 9:
                return "Ungarn";
            case 10:
                return "Belgien";
            case 11:
                return "Monza";
            case 12:
                return "Singapur";
            case 13:
                return "Japan";
            case 14:
                return "AbuDhabi";
            case 15:
                return "Texas";
            case 16:
                return "Brasilien";
            case 17:
                return "Österreich";
            case 18:
                return "Russland";
            case 19:
                return "Mexiko";
            case 20:
                return "Aserbaidschan";
            case 21:
                return "Sakhir Short";
            case 22:
                return "Silverstone Short";
            case 23:
                return "Texas Short";
            case 24:
                return "Suzuka Short";
            case 25:
                return "Hanoi";
            case 26:
                return "Zandvoort";
            case 27:
                return "Imola";
            case 28:
                return "Portugal";
            case 29:
                return "SaudiArabien";
            case 30:
                return "Miami";
            case 31:
                return "LasVegas";
            case 32:
                return "Katar";
            default:
                return "Unbekannte Strecke"; // Rückgabe eines Standardnamens, wenn die ID nicht erkannt wird
        }
    }

    const downloadJSON = async (strecke, setRennDaten) => {
    const data = RennErgebnis.slice(0, -2)
        .map((ergebnis, index) => ({
            fahrer: Fahrerliste[index],
            ergebnis,
            rundendaten: Rundendaten[index]
        }))
        .filter(item => item.ergebnis.m_position !== 0)
        .sort((a, b) => a.ergebnis.m_position - b.ergebnis.m_position)
        .map((item) => ({
            position: item.ergebnis.m_position,
            nationalitaet: item.fahrer.m_nationality,
            fahrername: item.fahrer.m_name,
            team: item.fahrer.m_teamId,
            gridPosition: item.ergebnis.m_gridPosition,
            bestePersoenlicheRunde: item.ergebnis.m_bestLapTimeInMS,
            rennzeit: item.ergebnis.m_totalRaceTime,
            punkte: item.ergebnis.m_points,
            ergebnisStatus: item.ergebnis.m_resultStatus,
            boxenstopps: item.rundendaten ? item.rundendaten.m_numPitStops : 'N/A',
            strafen: item.rundendaten ? item.rundendaten.m_penalties : 'N/A'
        }))
        .reduce((acc, item) => {
            acc[item.fahrername] = item; // Speichere jedes Objekt unter dem Schlüssel 'fahrername'
            return acc;
        }, {});

    // Speichere das transformierte Ergebnis in setRennDaten
    setRennDaten(data);
    console.log(`Renndaten:`, data);

    // Speichere alle Objekte zusammengefasst in einem Dokument in Firestore
    const docRef = doc(db, 'Ergebnisse', strecke);
    await setDoc(docRef, data, { merge: true });
    console.log(`Daten wurden erfolgreich im Dokument '${strecke}' in Firestore gespeichert.`);
};

    return (
        <button onClick={() => downloadJSON(strecke, setRennDaten)}>Upload Classification for {strecke}</button>
    );
}
export default DokumentErstellung;