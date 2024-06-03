import React, { useEffect, useState} from 'react';
import { Box, Anchor, Modal, Divider, Select, NumberInput, Button} from "@mantine/core";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from '@mantine/hooks';
import { db } from './../utils/firebase';
import { collection, onSnapshot, setDoc, doc, getDoc } from 'firebase/firestore';
import './Tippspiel.css';
import moment from 'moment';
import TippspielPC from './TippspielPC';
import TippspielHandy from './TippspielHandy';
import { set } from 'firebase/database';

const Tippspiel = () => {

    const [opened, { open, close }] = useDisclosure(false);
    const auth = getAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        displayName: '',
    });
    const [OpenLogin, setOpenLogin] = useState(true);
    const [accessToken, setAccessToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [tippSpielBestätigt, setTippSpielBestätigt] = useState(false);
    const [tippSpielTeilnehmer, setTippSpielTeilnehmer] = useState([]);
    const [Strecken, setStrecken] = useState([]);
    const [nextRace, setNextRace] = useState(null);
    const [timeLeft, setTimeLeft] = useState({});
    const [seasonEnded, setSeasonEnded] = useState(false);
    const [Personen, setPersonen] = useState([]);
    const [bereitsGetippt, setBereitsGetippt] = useState(false);
    const [tippSpielData, setTippSpielData] = useState({
        Pole: {
            Fahrer: '',
            Coins: 0,
        },
        SchnellsteRunde: {
            Fahrer: '',
            Coins: 0,
        },
        Rennesieger: {
            Fahrer: '',
            Coins: 0,
        },
        AnzahlDerDNF: {
            Anzahl: 0,
            Coins: 0,
        },
    });

    useEffect(() => {
        if (!accessToken) {
          const user = JSON.parse(localStorage.getItem('user'));
          setAccessToken(user);
          setIsLoading(false);
        }

        if (!accessToken) {
          setIsLoading(false);
        }

        if (accessToken) {
            console.log("Benutzer angemeldet:", accessToken);
        }

    }, [accessToken]);

    {/*

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'Tippspiel'), (snapshot) => {
            setTippSpielTeilnehmer(snapshot.docs.map(doc => {
                const data = doc.data();
                if (doc.id === accessToken?.displayName) {
                    setTippSpielBestätigt(true);
                    if (data[nextRace?.id] === true) {
                        setBereitsGetippt(true);
                    }
                    return data;
                }
            }).filter(Boolean));
        });
        return () => unsubscribe();
    }, [accessToken, nextRace]); 

    */}

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'Tippspiel'), (snapshot) => {
            let tippSpielBestätigt = false;
            let bereitsGetippt = false;

            const docs = snapshot.docs.map(doc => {
                const data = doc.data();
                if (doc.id === accessToken?.displayName) {
                    tippSpielBestätigt = true;
                    if (data[nextRace?.id] === true) {
                        bereitsGetippt = true;
                    }
                    return data;
                }
                return null;
            }).filter(Boolean);

            setTippSpielBestätigt(tippSpielBestätigt);
            setBereitsGetippt(bereitsGetippt);


            const teilnehmer = snapshot.docs
            .map(doc => doc.data())
            .filter(data => data.displayName);
            console.log("Teilnehmer:", teilnehmer);
            setTippSpielTeilnehmer(teilnehmer);
        });

        return () => unsubscribe();
    }, [accessToken, nextRace]);

    useEffect(() => {
        const streckenRef = collection(db, 'Strecken');
        const unsubscribe = onSnapshot(streckenRef, (snapshot) => {
          let tempStrecken = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.Datum) {
              const datum = data.Datum.toDate();
              tempStrecken.push({
                id: doc.id,
                datum: datum,
                flagge: data.Flagge,
                layout: data.Layout,
              });
            } else {
              console.warn(`Document with id ${doc.id} does not have a Datum field.`);
            }
          });
          tempStrecken.sort((a, b) => a.datum - b.datum);
          setStrecken(tempStrecken);
    
          const lastRace = tempStrecken[tempStrecken.length - 1];
          if (lastRace && moment(lastRace.datum).isBefore(moment())) {
            setSeasonEnded(true);
          }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const findNextRace = () => {
            const now = moment();
            for (let race of Strecken) {
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
                setIsLoading(false);
            }
        };

        setNextRace(findNextRace());
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [Strecken, nextRace]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'personen'), (snapshot) => {
            setPersonen(snapshot.docs.map(doc => doc.data().spielerID));
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        console.log("Teilnehmer:", tippSpielTeilnehmer);
        console.log("Strecken:", Strecken);
        console.log("Perosnen:", Personen);
        console.log("Bereits getippt:", bereitsGetippt);
    }, [tippSpielTeilnehmer, Strecken, Personen, bereitsGetippt]);

    const handleSubmit = (event) => {
        event.preventDefault(); // Verhindert das automatische Neuladen der Seite
    
        if (OpenLogin) {
          // Anmelden
          signInWithEmailAndPassword(auth, formData.email, formData.password)
            .then((userCredential) => {
              const user = userCredential.user;
              setOpenLogin(false);
              localStorage.setItem('user', JSON.stringify(user));
              setAccessToken(user);
              console.log("Erfolgreich angemeldet:", user);
              notifications.show({
                title: 'Login erfolgreich! 🎉',
                message: 'Du hast dich erfolgreich eingeloggt!',
                color: 'green',
                autoClose: 2000,
              })
                setFormData({
                    email: '',
                    password: '',
                    displayName: '',
                });
            })
            .catch((error) => {
              console.error("Fehler bei der Anmeldung:", error.message);
              notifications.show({
                title: 'Login fehlgeschlagen! 😞',
                message: 'Fehler bei der Anmeldung: ' + error.message,
                color: 'red',
                autoClose: 4000,
              })
            });
        } else {
          // Registrieren
          createUserWithEmailAndPassword(auth, formData.email, formData.password)
            .then((userCredential) => {
              // Hinzufügen des Anzeigenamens zum Benutzerprofil
              return updateProfile(userCredential.user, {
                displayName: formData.displayName,
              }).then(() => {
                // Nach dem Hinzufügen des Anzeigenamens, zurückgeben des userCredential für die weitere Verarbeitung
                return userCredential;
              });
            })
            .then((userCredential) => {
              const user = userCredential.user;
              console.log("Erfolgreich registriert:", user);
              // Senden der Authentifizierungs-E-Mail
              sendEmailVerification(user)
                .then(() => {
                  setOpenLogin(false);
                  console.log("Authentifizierungs-E-Mail gesendet an:", formData.email);
                  notifications.show({
                    title: 'Registrierung erfolgreich! 🎉',
                    message: 'Du hast dich erfolgreich registriert! Bitte bestätige deine E-Mail-Adresse.',
                    color: 'green',
                    autoClose: 2000,
                  })
                    setFormData({
                        email: '',
                        password: '',
                        displayName: '',
                    });
                })
                .catch((error) => {
                  console.error("Fehler beim Senden der Authentifizierungs-E-Mail:", error.message);
                });
            })
            .catch((error) => {
              console.error("Fehler bei der Registrierung:", error.message);
              notifications.show({
                title: 'Registrierung fehlgeschlagen! 😞',
                message: 'Fehler bei der Registrierung: ' + error.message,
                color: 'red',
                autoClose: 4000,
              })
            });
        };
    };

    function handleOpenModal() {
        open();
        setOpenLogin(true);
    }

    function handlePasswortVergessen() {
        const email = formData.email;
        if (email) {
            sendPasswordResetEmail(auth, email)
                .then(() => {
                    console.log("Passwort zurücksetzen E-Mail gesendet an:", email);
                    notifications.show({
                        title: 'Passwort zurücksetzen E-Mail gesendet! 📧',
                        message: 'Eine E-Mail zum Zurücksetzen des Passworts wurde an ' + email + ' gesendet.',
                        color: 'green',
                        autoClose: 4000,
                    })
                    setFormData({
                        email: '',
                        password: '',
                        displayName: '',
                    });
                })
                .catch((error) => {
                    console.error("Fehler beim Senden der Passwort zurücksetzen E-Mail:", error.message);
                    notifications.show({
                        title: 'Fehler beim Senden der Passwort zurücksetzen E-Mail! 😞',
                        message: 'Fehler beim Senden der Passwort zurücksetzen E-Mail: ' + error.message,
                        color: 'red',
                        autoClose: 4000,
                    })
                });
        } else {
            notifications.show({
                title: 'E-Mail-Adresse fehlt! 😞',
                message: 'Bitte gebe deine E-Mail-Adresse ein, um das Passwort zurückzusetzen.',
                color: 'red',
                autoClose: 4000,
            })
        }
    }

    function logOut() {
        localStorage.removeItem('user');
        setAccessToken(null);
        notifications.show({
            title: 'Logout erfolgreich! 🎉',
            message: 'Du hast dich erfolgreich ausgeloggt!',
            color: 'green',
            autoClose: 2000,
        })
    }

    async function handleTippspielCheck() {
        const docRef = doc(db, "Tippspiel", accessToken.displayName);
    
        await setDoc(docRef, {
            displayName: accessToken.displayName,
            coins: 1000
            // Fügen Sie hier weitere Felder hinzu, die Sie speichern möchten
        });
    
        notifications.show({
            title: 'Teilnahme bestätigt! 🎉',
            message: 'Du nimmst am Tippspiel teil ' + accessToken.displayName + '  ! Viel Erfolg',
            color: 'green',
            autoClose: 2000,
        })
        setTippSpielBestätigt(true);
    }

    async function hanldeSetTipp() {
        console.log("Tipp abgeben von: ", accessToken.displayName);
        console.log("Tipp: ", tippSpielData);
        console.log("Strecke: ", nextRace.id);

        const docRef = doc(db, "Tippspiel", nextRace.id);
        setDoc
            (docRef, {
            [accessToken.displayName]: tippSpielData
        }, { merge: true });
        notifications.show({
            title: 'Tipp abgegeben! 🎉',
            message: 'Dein Tipp wurde erfolgreich abgegeben! Du kannst wieder zum nächsten Rennen teilnehmen.',
            color: 'green',
            autoClose: 4000,
        })

        const gesetzteCoins = tippSpielData.Pole.Coins + tippSpielData.SchnellsteRunde.Coins + tippSpielData.Rennesieger.Coins + tippSpielData.AnzahlDerDNF.Coins;

        const docRef2 = doc(db, "Tippspiel", accessToken.displayName);
        const docSnap = await getDoc(docRef2);
        
        if (docSnap.exists()) {
            const coins = docSnap.data().coins;
          
            await setDoc(docRef2, {
              [nextRace.id]: true,
              coins:  coins - gesetzteCoins
            }, { merge: true });
          } else {
            console.log("No such document!");
        }

        setTippSpielData({
            Pole: {
                Fahrer: '',
                Coins: 0,
            },
            SchnellsteRunde: {
                Fahrer: '',
                Coins: 0,
            },
            Rennesieger: {
                Fahrer: '',
                Coins: 0,
            },
            AnzahlDerDNF: {
                Anzahl: 0,
                Coins: 0,
            },
        });


    }

    return (
        <>
            {window.innerWidth > 1000 &&
                <TippspielPC
                    isLoading={isLoading}
                    accessToken={accessToken}
                    tippSpielTeilnehmer={tippSpielTeilnehmer}
                    nextRace={nextRace}
                    tippSpielData={tippSpielData}
                    setTippSpielData={setTippSpielData}
                    handleOpenModal={handleOpenModal}
                    logOut={logOut}
                    Personen={Personen}
                    hanldeSetTipp={hanldeSetTipp}
                    bereitsGetippt={bereitsGetippt}
                    handleTippspielCheck={handleTippspielCheck}
                    tippSpielBestätigt={tippSpielBestätigt}
                />
            }

            {window.innerWidth <= 1000 &&
                <TippspielHandy
                    tippSpielTeilnehmer={tippSpielTeilnehmer}
                    nextRace={nextRace}
                    tippSpielData={tippSpielData}
                    setTippSpielData={setTippSpielData}
                    Personen={Personen}
                    hanldeSetTipp={hanldeSetTipp}
                    bereitsGetippt={bereitsGetippt}
                    handleOpenModal={handleOpenModal}
                    accessToken={accessToken}
                    logOut={logOut}
                    handleTippspielCheck={handleTippspielCheck}
                    tippSpielBestätigt={tippSpielBestätigt}
                    isLoading={isLoading}
                />
            }

            <Modal 
                    opened={opened} 
                    onClose={() => {
                        setFormData({
                            email: '',
                            password: '',
                            displayName: '',
                        });
                        close();
                    }} 
                    title="Anmelden/Registrieren" 
                    centered
                >
                    {OpenLogin && 
                    <Box style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
                        <h1 style={{ color: '#333', fontSize: '24px' }}>Anmelden</h1>
                        <p style={{ color: '#666', fontSize: '16px' }}>Bitte melde dich an, um deine Tipps abzugeben.</p>
                        <Divider />
                        <form onSubmit={handleSubmit}>
                        <input 
                                type="email" 
                                placeholder="E-Mail" 
                                style={{ width: '100%', padding: '10px', marginBottom: '10px' }} 
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                            <input 
                                type="password" 
                                placeholder="Passwort" 
                                style={{ width: '100%', padding: '10px', marginBottom: '10px' }} 
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button type='submit' onClick={close} style={{ width: '100%', padding: '10px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '5px' }}>Anmelden</button>
                        </form>
                        <div style={{marginTop: '10px', marginBottom: '10px'}}>
                        <Divider color='black' size="sm"/>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'between'}}>
                            <Anchor onClick={() => setOpenLogin(false)}>Hier drücken um sich zu Registrieren.</Anchor>
                            <Anchor onClick={handlePasswortVergessen}>Passwort vergessen?</Anchor>
                        </div>
                    </Box>
                    }

                    {!OpenLogin &&
                    <Box style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
                        <h1 style={{ color: '#333', fontSize: '24px' }}>Registrieren</h1>
                        <p style={{ color: '#666', fontSize: '16px' }}>Bitte registriere dich, um deine Tipps abzugeben.</p>
                        <Divider />
                        <form onSubmit={handleSubmit}>
                            <input 
                                type="text" 
                                placeholder="Anzeigename" 
                                style={{ width: '100%', padding: '10px', marginBottom: '10px' }} 
                                onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                            />
                            <input 
                                type="email" 
                                placeholder="E-Mail" 
                                style={{ width: '100%', padding: '10px', marginBottom: '10px' }} 
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                            <input 
                                type="password" 
                                placeholder="Passwort" 
                                style={{ width: '100%', padding: '10px', marginBottom: '10px' }} 
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button onClick={close} type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '5px' }}>Registrieren</button>
                        </form>
                        <div style={{marginTop: '10px', marginBottom: '10px'}}>
                        <Divider color='black' size="sm"/>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center'}}>
                        <Anchor onClick={() => setOpenLogin(true)}>Hier drücken um sich Anzumelden.</Anchor>
                        </div>
                    </Box>
                    }
            </Modal>
        </>
    );
}
export default Tippspiel;