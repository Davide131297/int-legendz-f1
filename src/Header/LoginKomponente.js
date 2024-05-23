import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { notifications } from "@mantine/notifications";
import { Divider } from "@mantine/core";
import { useNavigate } from "react-router-dom";

const LoginKomponente = ({setOpenLogin, setAccessToken}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLogin, setIsLogin] = useState(true); // Umschalten zwischen Login und Registrierung
  const auth = getAuth();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault(); // Verhindert das automatische Neuladen der Seite

    if (isLogin) {
      // Anmelden
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          setOpenLogin(false);
          setAccessToken(user.email);
          console.log("Erfolgreich angemeldet:", user);
          notifications.show({
            title: 'Login erfolgreich! 🎉',
            message: 'Du hast dich erfolgreich eingeloggt!',
            color: 'green',
            autoClose: 2000,
          })
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
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Hinzufügen des Anzeigenamens zum Benutzerprofil
          return updateProfile(userCredential.user, {
            displayName: displayName,
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
              console.log("Authentifizierungs-E-Mail gesendet an:", email);
              notifications.show({
                title: 'Registrierung erfolgreich! 🎉',
                message: 'Du hast dich erfolgreich registriert! Bitte bestätige deine E-Mail-Adresse.',
                color: 'green',
                autoClose: 2000,
              })
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
    <h2>{isLogin ? "Anmelden" : "Registrieren"}</h2>
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', margin: '0 auto' }}>
      <label style={{ marginBottom: '10px' }}>
        E-Mail:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', fontSize: '16px' }}
        />
      </label>
      {!isLogin && (
        <label style={{ marginBottom: '10px' }}>
          Nutzername:
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
          />
        </label>
      )}
      <label style={{ marginBottom: '10px' }}>
        Passwort:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', fontSize: '16px' }}
        />
      </label>
      <button type="submit" style={{ padding: '10px', fontSize: '16px', cursor: 'pointer' }}>
        {isLogin ? "Anmelden" : "Registrieren"}
      </button>
    </form>

    <Divider />
    <button onClick={() => setIsLogin(!isLogin)}>
      {isLogin ? "Zur Registrierung wechseln" : "Zum Login wechseln"}
    </button>
  </div>
  );
};

export default LoginKomponente;