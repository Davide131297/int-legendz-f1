const DokumentErstellung = ({Fahrerliste, Rundendaten, RennErgebnis}) => {

    const downloadJSON = () => {
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
            }));

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'Rennergebnis.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <button onClick={downloadJSON}>Download JSON</button>
    );
    }
export default DokumentErstellung;