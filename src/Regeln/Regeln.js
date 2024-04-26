import React from 'react';
import { Title, Divider, List, ScrollArea } from '@mantine/core';
import './Regeln.css';

const Regeln = () => {
    return (
        <div className='regelnseite'>
        <Title order={1} id='regelntitel'>Reglement</Title>
        <Divider margins="md" label="Allgemeines" className='regelnDivider' />
        <List withPadding>
            <List.Item className='list-item'>
                Im folgenden Regelwerk sind die Regeln und Strafen der Liga festgehalten, unter Stewards, Liga- und Rennleitung sind alle an der Liga teilnehmenden Personen zu verstehen, ausgenommen sind Fahrer, die in einem Vorfall involviert sind
            </List.Item>
            <List.Item className='list-item'>
                Wer innerhalb einer Saison 8 Strafpunkte erhält, bekommt eine Qualifikationssperre, 
                bei 11 Strafpunkten wird eine Rennsperre ausgesprochen
            </List.Item>
            <List.Item className='list-item'>
                Ein Fahrer kann WM – Punkte erhalten, sobald er eine Renndistanz von 90% zurückgelegt hat
            </List.Item>
                <Divider margins="md" label="Vor dem Rennen" className='regelnDivider' />
            <List.Item className='list-item'>
                Das Training und Qualifying findet immer am Freitag vor dem Rennen statt
            </List.Item>
            <List.Item className='list-item'>
                Die Qualifikation wird als ein kurzes Qualifying ausgetragen
            </List.Item>
            <List.Item className='list-item'>
                Die Startaufstellung wird nach dem Qualifying erstellt und unter Berücksichtigung der Strafen
            </List.Item>
            <List.Item className='list-item'>
                Fahrer dürfen ausschließlich ihrem eigenen Teamkollegen für die Qualifikation Windschatten geben.
            </List.Item>
                <Divider margins="md" label="Während des Rennens" className='regelnDivider' />
            <List.Item className='list-item'>
                Während der Qualifikation und des Rennens sind die Fahrer dazu angehalten, ein Video aufzunehmen, 
                um eigene Vorfälle einschicken oder Gegenvideos für die Stewards bereitstellen zu können
            </List.Item>
            <List.Item className='list-item'>
                Innerhalb der ersten 5 Runden kann ein Neustart des Rennens durchgeführt werden, falls ein Bug auftritt oder ein Disconnect eines Fahrers.
            </List.Item>
            <List.Item className='list-item'>
                Absichtliches hinauszögern der SC-Phase (2 SP)
            </List.Item>
            <List.Item className='list-item'>
                Während eines SC muss das Delta vom Spiel beachtet werden, es darf nicht überholt werden und der Abstand zum Vordermann muss groß genug sein, 
                um auf Zwischenfälle reagieren zu können
            </List.Item>
            <List.Item className='list-item'>
                Bei Beendigung des SC muss bis zur Start-/Ziellinie mit Überholmanövern gewartet werden, die Abstände zum Vordermann sollten 
                im Sinne des Racing klein gehalten werden
            </List.Item>
            <List.Item className='list-item'>
                Sollte ein Fahrer einen Schaden erlitten haben und dadurch die Box aufsuchen, ist er dazu angehalten, schnellere Fahrer passieren zu lassen
            </List.Item>
            <List.Item className='list-item'>
                Während einer Safetycar-Phase sind die überundeten Fahrer dazu angehalten, sich ausserhalb der Strecke zu halten und sich auf seine Position zurückzufinden
            </List.Item>
            <List.Item className='list-item'>
                Wie in der echten Formel 1, ist es verboten mehr als einmal die Richtung zu wechseln, um den Hintermann zu blockieren
            </List.Item>
            <List.Item className='list-item'>
                Bei einem Rennabbruch wird das Rennen nicht wiederholt, es wird das Ergebnis der letzten Runde vor dem Abbruch gewertet
            </List.Item>
                <Divider margins="md" label="Bestrafungen" className='regelnDivider' />
            <List.Item className='list-item'>
                Während der Out- und Inlap darf ein Fahrer keinen Fahrer auf eine Hotlap behindern (1 SP), bei schwerwiegendem Kontakt höher (2 SP + 10 Plätze Grid Strafe)
            </List.Item>
            <List.Item className='list-item'>
                Abkürzen während der Out- und Inlap ist verboten, außer es dient der Sicherheit (1 SP)
            </List.Item>
            <List.Item className='list-item'>
                Überholen anderer Fahrzeuge durch Fehlstart (1 SP)
            </List.Item>
            <List.Item className='list-item'>
                Im Grid den Startcountdown initiieren ohne Freigabe durch Ligaleiter (1 SP)
            </List.Item>
            <List.Item className='list-item'>
                Abdrängen eines Fahrers von der Strecke (1 SP + 10 Sekunden)
            </List.Item>
            <List.Item className='list-item'>
                Mehrfaches ändern der Linie vor der Bremszone um den Hintermann zu verwirren/blockieren (5s)
            </List.Item>
            <List.Item className='list-item'>
                Mehrfaches ändern der Linie in der Bremszone (1 SP)
            </List.Item>
            <List.Item className='list-item'>
                Gefährliches oder unkorrektes Ein- oder Ausfahren der Boxengasse (1 SP + 10s)
            </List.Item>
            <List.Item className='list-item'>
                Gefährliches Zurückkehren auf die Strecke (1 SP), bei Konsequenzen für andere Fahrer (bis zu 3 SP + bis zu 30s)
            </List.Item>
            <List.Item className='list-item'>
                Absichtliches Aufgeben der Session außerhalb der Boxengasse (Qualifikationssperre), bei Wiederholung Rennsperre möglich
            </List.Item>
            <List.Item className='list-item'>
                Verursachen einer Kollision:
                <List className='list-item'>
                    <List.Item>
                        Ohne Schaden beim Gegner (1 SP + 3 Sekunden)
                    </List.Item>
                    <List.Item>
                        Mit Schaden beim Gegner (2 SP + 5 Sekunden)
                    </List.Item>
                    <List.Item>
                        Mit DNF des Gegners (3 SP + 15 Sekunden)
                    </List.Item>
                </List>
            </List.Item>
            <List.Item className='list-item'>
                Keine Bereitstellung eines angeforderten Videos zu einem Vorfall (1 SP)
            </List.Item>
            <List.Item className='list-item'>
                Für Rennunfälle werden keine Strafen vergeben
            </List.Item>
                <Divider margins="md" label="Nach dem Rennen" className='regelnDivider' />
            <List.Item className='list-item'>
                Nach dem Rennen können Videos zur Untersuchung bis zur Startzeit am Folgetag an die Ligaleiter (unsere Whatsapp Gruppe) gesendet werden. Die Stewards können Verwarnungen, Strafen oder Strafpunkte aussprechen
            </List.Item>
            <List.Item className='list-item'>
                Ausgesprochene Zeitstrafen werden am Ende auf das Rennergebnis aufgerechnet
            </List.Item>
            <List.Item className='list-item'>
                Durch Bugs oder Spielfehler aufgerechnete Zeitstrafen können mit Beweisvideo und Dokumentation der persönlichen Rennleitung zurückgenommen werden, jedoch nur solange sie nicht bereits in der Box abgehalten wurden.
            </List.Item>
            <List.Item className='list-item'>
                Für das Beweismaterial ist der Fahrer selbst verantwortlich
                <List className='list-item'>
                    <List.Item>
                        Videosequenz des Vorfalls mindestens 30 Sekunden vor und nach dem Vorfall
                    </List.Item>
                    <List.Item>
                        Beweisvideos müssen mindestens 24 Stunden nach dem Rennen bereitgestellt werden
                    </List.Item>
                    <List.Item>
                        Beweisvideos müssen in einer angemessenen Qualität bereitgestellt werden
                    </List.Item>
                </List> 
            </List.Item>
        </List>
        </div>
    );
};
export default Regeln;