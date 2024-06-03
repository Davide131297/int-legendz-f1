import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './Header/header';
import Teilnehmertabelle from './Tabelle/TeilnehmerTabelle';
import Konstrukteurtabelle from './Tabelle/Konstrukteurtabelle';
import Statistiken from './Statistiken/statistiken';
import Profil from './Profil/Profil';
import Home from './Home/Home';
import Regeln from './Regeln/Regeln';
import AdminDashboard from './AdminDashboard/AdminDashboard';
import Archiv from './Archiv/Archiv';
import SocialMedia from './Social-Media/SocialMedia';
import Rennergebnise from './RennErgebnisse/Rennergebnise';
import Tippspiel from './Tippspiel/Tippspiel';

export function Router() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/teilnehmertabelle" element={<Teilnehmertabelle />} />
                <Route path="/konstrukteurtabelle" element={<Konstrukteurtabelle />} />
                <Route path="/statistiken" element={<Statistiken />} />
                <Route path="/profil/:id" element={<Profil />} />
                <Route path="/regeln" element={<Regeln />} />
                <Route path="/adminDashboard" element={<AdminDashboard />} />
                <Route path="/archiv" element={<Archiv />} />
                <Route path="/socialmedia" element={<SocialMedia />} />
                <Route path="/rennergebnisse" element={<Rennergebnise />} />
                <Route path="/tippspiel" element={<Tippspiel />} />
            </Routes>
        </BrowserRouter>
    );
}