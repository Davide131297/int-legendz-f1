import React from "react";
import { LineChart } from '@mantine/charts';
import { saveAs } from 'file-saver';

const KonstrukteurLineChart = (props) => {

    const teams = props.teams;

    const downloadTeams = () => {
        let xmlData = '<teams>\n';
        for(let team of teams) {
            xmlData += `<team>\n<name>${team.team}</name>\n<gesamtpunkte>${team.gesamtPunkte}</gesamtpunkte>\n<wertung>\n`;
            for(let ort in team.wertung) {
                xmlData += `<${ort} wert="${team.wertung[ort]}"/>\n`;
            }
            xmlData += `</wertung>\n</team>\n`;
        }
        xmlData += '</teams>';
        const blob = new Blob([xmlData], {type: "application/xml"});
        saveAs(blob, 'teams.xml');
    }

    const strecken = [
        { value: 'bahrain', label: 'Bahrain' },
        { value: 'saudiarabien', label: 'Saudi Arabien' },
        { value: 'australien', label: 'Australien' },
        { value: 'aserbaidschan_Sprint', label: 'Aserbaidschan Sprint' },
        { value: 'aserbaidschan_Rennen', label: 'Aserbaidschan Rennen' },
        { value: 'miami', label: 'Miami' },
        { value: 'italien', label: 'Italien' },
        { value: 'monaco', label: 'Monaco' },
        { value: 'spanien', label: 'Spanien' },
        { value: 'kanada', label: 'Kanada' },
        { value: 'österreich_Sprint', label: 'Österreich Sprint' },
        { value: 'österreich_Rennen', label: 'Österreich Rennen' },
        { value: 'england', label: 'England' },
        { value: 'ungarn', label: 'Ungarn' },
        { value: 'belgien_Sprint', label: 'Belgien Sprint' },
        { value: 'belgien_Rennen', label: 'Belgien Rennen' },
        { value: 'niederlande', label: 'Niederlande' },
        { value: 'singapur', label: 'Singapur' },
        { value: 'japan', label: 'Japan' },
        { value: 'katar_Sprint', label: 'Katar Sprint' },
        { value: 'katar_Rennen', label: 'Katar Rennen' },
        { value: 'usa_Sprint', label: 'USA Sprint' },
        { value: 'usa_Rennen', label: 'USA Rennen' },
        { value: 'mexiko', label: 'Mexiko' },
        { value: 'brasilien_Sprint', label: 'Brasilien Sprint' },
        { value: 'brasilien_Rennen', label: 'Brasilien Rennen' },
        { value: 'lasvegas', label: 'Las Vegas' },
        { value: 'abudhabi', label: 'Abu Dhabi'}
    ];

    const createChartData = (teams) => {
        const chartData = [];
        const teamTotalPoints = {};

        // Initialisiere die Gesamtpunkte für jedes Team
        for(let team of teams) {
            teamTotalPoints[team.team] = 0;
        }

        // Verarbeite die Rennen in der Reihenfolge ihrer Erscheinung in der strecken-Konstante
        for(let strecke of strecken) {
            let hasPoints = false;

            for(let team of teams) {
                if(team.wertung[strecke.value]) {
                    teamTotalPoints[team.team] += team.wertung[strecke.value]; // Addiere die Punkte zum Gesamtpunktestand
                    hasPoints = true;
                }
            }

            // Füge die Strecke nur hinzu, wenn sie Punkte für mindestens ein Team hat
            if(hasPoints) {
                for(let team of teams) {
                    let existingData = chartData.find(data => data.date === strecke.label);
                    if(existingData) {
                        existingData[team.team] = teamTotalPoints[team.team]; // Setze die Gesamtpunkte statt der Punkte für dieses Rennen
                    } else {
                        chartData.push({
                            date: strecke.label,
                            [team.team]: teamTotalPoints[team.team] // Setze die Gesamtpunkte statt der Punkte für dieses Rennen
                        });
                    }
                }
            }
        }

        console.log("Die Chartdaten",chartData);
        return chartData;
    }

    const data = createChartData(teams);

  {/* const data = [
        {
          date: 'Bahrain',
          McLaren: 27,
          Ferrari: 20,
          Williams: 0,
          Mercedes: 33,
          AstonMartin: 10,
          RedBull: 2,
          Alpine: 0,
          AlfaRomeo: 0 
        },
        {
            date: 'Saudi Arabien',
            McLaren: 56,
            Ferrari: 54,
            Williams: 12,
            Mercedes: 33,
            AstonMartin: 20,
            RedBull: 14,
            Alpine: 2,
            AlfaRomeo: 0
        },
        {
            date: 'Australien',
            McLaren: 90,
            Ferrari: 56,
            Williams: 34,
            Mercedes: 48,
            AstonMartin: 20,
            RedBull: 20,
            Alpine: 20,
            AlfaRomeo: 11
        },
        {
            date: 'Aserbaidschan',
            McLaren: 123,
            Ferrari: 62,
            Williams: 60,
            Mercedes: 51,
            AstonMartin: 25,
            RedBull: 35,
            Alpine: 33,
            AlfaRomeo: 21
        },
        {
            date: 'Miami',
            McLaren: 150,
            Ferrari: 77,
            Williams: 78,
            Mercedes: 63,
            AstonMartin: 45,
            RedBull: 43,
            Alpine: 35,
            AlfaRomeo: 27
        }
    ]; */}

    return (
        <>
            <LineChart
                h={300}
                data={data}
                dataKey="date"
                withLegend
                series={[
                    { name: 'McLaren', color: '#fc8404' },
                    { name: 'Ferrari', color: '#FF0000' },
                    { name: 'Williams', color: '#049cdc' },
                    { name: 'Mercedes', color: '#788086' },
                    { name: 'Aston Martin', color: '#008B00' },
                    { name: 'Red Bull', color: 'darkblue' },
                    { name: 'Alpine', color: '#ff82ab' },
                    { name: 'Alfa Romeo', color: '#CD0000' },
                    { name: 'Haas', color: 'red' },
                    { name: 'Alpha Tauri', color: '#040505' }
                ]}
                curveType="linear"
            />
            {/*<button onClick={downloadTeams}>Teams als XML herunterladen</button>*/}
        </>
    );
};

export default KonstrukteurLineChart;