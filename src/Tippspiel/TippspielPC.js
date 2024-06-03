import React from 'react';
import './Tippspiel.css';
import Table from 'react-bootstrap/Table';
import { Box, Anchor, Select, NumberInput, Button } from "@mantine/core";

const TippspielPC = ({
    isLoading,
    accessToken,
    tippSpielTeilnehmer,
    nextRace,
    tippSpielData,
    setTippSpielData,
    handleOpenModal,
    logOut,
    Personen,
    hanldeSetTipp,
    bereitsGetippt,
    handleTippspielCheck,
    tippSpielBestätigt,
}) => {
    return (
        <>
            {isLoading ? (
                <div>Laden...</div>
            ) : (
                <>
                {!accessToken &&
                <Box style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
                    <h1 style={{ color: '#333', fontSize: '24px' }}>Tippspiel</h1>
                    <p style={{ color: '#666', fontSize: '16px' }}>Willkommen im Tippspiel! Hier kannst du deine Tipps für die nächsten Rennen abgeben.</p>
                    <p style={{ color: '#666', fontSize: '16px' }}>Bitte melde dich an, um deine Tipps abzugeben.</p>
                    <Anchor onClick={handleOpenModal}>Hier drücken um sich Anzumelden/Registrieren.</Anchor>
                </Box>
                }

                {accessToken &&
                <Box style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
                    <h1 style={{ color: '#333', fontSize: '24px' }}>Tippspiel</h1>
                    <p style={{ color: '#666', fontSize: '16px' }}>Willkommen im Tippspiel! Hier kannst du deine Tipps für die nächsten Rennen abgeben.</p>
                    <p style={{ color: '#666', fontSize: '16px' }}>Du bist angemeldet als: {accessToken.displayName}</p>
                    <Anchor onClick={logOut}>Hier drücken um sich Abzumelden.</Anchor>
                    {!tippSpielBestätigt &&
                        <div style={{marginTop: '20px'}}>
                            <p style={{ color: '#666', fontSize: '16px' }}> Möchtest du am Tippspiel Teilnehmen?</p>
                            <Anchor onClick={handleTippspielCheck}>Hier klicken um zu bestätigen.</Anchor>
                        </div>
                    }
                </Box>
                }

                <div className='tippSpiel-Container'>

                    <div className='tippSpiel-Teilnehmer'>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Teilnehmer</th>
                                    <th>Coins</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tippSpielTeilnehmer.map((teilnehmer, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{teilnehmer.displayName}</td>
                                        <td>{teilnehmer.coins}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>

                    <div className='tippSpiel-Tippfeld'>
                        <h5>Hier Tipps abgeben!</h5>

                        <div className='tippSpiel-Tippfeld-Form'>
                            <div id='Pole'>
                                <Select
                                    label="Pole Position"
                                    placeholder="Wähle den Fahrer aus"
                                    data={Personen}
                                    searchable
                                    onChange={(value) => {
                                        setTippSpielData({
                                            ...tippSpielData,
                                            Pole: {
                                                Fahrer: value,
                                                Coins: tippSpielData.Pole.Coins,
                                            },
                                        });
                                    }}
                                    disabled={bereitsGetippt}
                                />
                                <div style={{marginLeft: '10px', marginBottom: '20px'}}>
                                    <NumberInput
                                        label="Coins setzten"
                                        placeholder="Zahl eingeben"
                                        description="Faktor x2"
                                        allowNegative={false}
                                        allowDecimal={false}
                                        onChange={(value) => {
                                            setTippSpielData({
                                                ...tippSpielData,
                                                Pole: {
                                                    Fahrer: tippSpielData.Pole.Fahrer,
                                                    Coins: value,
                                                },
                                            });
                                        }}
                                        disabled={bereitsGetippt}
                                    />
                                </div>
                            </div>

                            <div id='SchnellsteRunde'>
                                <Select
                                    label="Schnellste Runde"
                                    placeholder="Wähle den Fahrer aus"
                                    data={Personen}
                                    searchable
                                    onChange={(value) => {
                                        setTippSpielData({
                                            ...tippSpielData,
                                            SchnellsteRunde: {
                                                Fahrer: value,
                                                Coins: tippSpielData.SchnellsteRunde.Coins,
                                            },
                                        });
                                    }}
                                    disabled={bereitsGetippt}
                                />
                                <div style={{marginLeft: '10px', marginBottom: '20px'}}>
                                    <NumberInput
                                        label="Coins setzten"
                                        placeholder="Zahl eingeben"
                                        description="Faktor x2"
                                        allowNegative={false}
                                        allowDecimal={false}
                                        onChange={(value) => {
                                            setTippSpielData({
                                                ...tippSpielData,
                                                SchnellsteRunde: {
                                                    Fahrer: tippSpielData.SchnellsteRunde.Fahrer,
                                                    Coins: value,
                                                },
                                            });
                                        }}
                                        disabled={bereitsGetippt}
                                    />
                                </div>
                            </div>

                            <div id='Rennesieger'>
                                <Select
                                    label="Rennsieger"
                                    placeholder="Wähle den Fahrer aus"
                                    data={Personen}
                                    searchable
                                    onChange={(value) => {
                                        setTippSpielData({
                                            ...tippSpielData,
                                            Rennesieger: {
                                                Fahrer: value,
                                                Coins: tippSpielData.Rennesieger.Coins,
                                            },
                                        });
                                    }}
                                    disabled={bereitsGetippt}
                                />
                                <div style={{marginLeft: '10px', marginBottom: '20px'}}>
                                    <NumberInput
                                        label="Coins setzten"
                                        placeholder="Zahl eingeben"
                                        description="Faktor x1,5"
                                        allowNegative={false}
                                        allowDecimal={false}
                                        onChange={(value) => {
                                            setTippSpielData({
                                                ...tippSpielData,
                                                Rennesieger: {
                                                    Fahrer: tippSpielData.Rennesieger.Fahrer,
                                                    Coins: value,
                                                },
                                            });
                                        }}
                                        disabled={bereitsGetippt}
                                    />
                                </div>
                            </div>

                            <div id='AnzahlDerDNF'>
                                <NumberInput
                                    label="Anzahl der DNF"
                                    placeholder="Zahl eingeben der DNF"
                                    allowNegative={false}
                                    allowDecimal={false}
                                    min={0}
                                    max={20}
                                    onChange={(value) => {
                                        setTippSpielData({
                                            ...tippSpielData,
                                            AnzahlDerDNF: {
                                                Anzahl: value,
                                                Coins: tippSpielData.AnzahlDerDNF.Coins,
                                            },
                                        });
                                    }}
                                    disabled={bereitsGetippt}
                                />
                                <div style={{marginLeft: '20px', marginBottom: '20px'}}>
                                    <NumberInput
                                        label="Coins setzten"
                                        placeholder="Zahl eingeben"
                                        description="Faktor x3"
                                        allowNegative={false}
                                        allowDecimal={false}
                                        onChange={(value) => {
                                            setTippSpielData({
                                                ...tippSpielData,
                                                AnzahlDerDNF: {
                                                    Anzahl: tippSpielData.AnzahlDerDNF.Anzahl,
                                                    Coins: value,
                                                },
                                            });
                                        }}
                                        disabled={bereitsGetippt}
                                    />
                                </div>
                            </div>

                            <div id='BestätigungsButton'>
                                <Button 
                                    onClick={hanldeSetTipp}
                                    disabled={bereitsGetippt}
                                >Tipps abgeben    
                                </Button>
                            </div>

                        </div>
            
                    </div>

                    <div className='tippSpiel-Countdown'>
                        <h5>Aktuelle Tippabgabe für das Rennen in:</h5>
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <h5 style={{marginBottom: '0px'}}>{nextRace?.id}</h5>
                            <img src={nextRace?.flagge} alt={nextRace?.id} style={{width: '30px'}}/>
                        </div>
                    </div>

                </div>
            </>
            )}
        </>
    );
}
export default TippspielPC;