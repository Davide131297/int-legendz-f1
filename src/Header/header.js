import React, {useEffect, useState, useContext} from "react";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import LigaLogo from './LigaLogo.png';
import './header.css';
import { redirect, useNavigate } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { Burger } from '@mantine/core';
import { Button } from '@mantine/core';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { ActionIcon, Drawer, Modal } from '@mantine/core';
import { GrAdd } from "react-icons/gr";
import ErgebnisEintragen from "../ErgebnisEintragen/ErgebnisEintragen";
import ZusatzKompoennte from "./ZusatzKompoennte";
import { CiLogin, CiSettings, CiLogout } from "react-icons/ci";
import LoginKomponente from "./LoginKomponente";
import { signOut, getAuth } from "firebase/auth";
import { notifications } from "@mantine/notifications";
import { AccessTokenContext } from "../utils/AccesTokenContext";
import { LuSmartphone } from "react-icons/lu";

const getCookie = (name) => {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
}

const Header = () => {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [isAuthenticated, setIsAuthenticated] = useState(getCookie('userID') ? true : false);
    const navigate = useNavigate();
    const [opened, { toggle }] = useDisclosure();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [openSettings, setOpenSettings] = useState(false);
    const [openLogin, setOpenLogin] = useState(false);
    const { accessToken, setAccessToken } = useContext(AccessTokenContext);
    const auth = getAuth();
    const [logoWidth, setLogoWidth] = useState(70);
    const [logoHeight, setLogoHeight] = useState(70);

    useEffect(() => {
        if (window.innerWidth < 767) {
            setLogoWidth(50);
            setLogoHeight(50);
        }
    }, []);

    const navigateKonstrukteurstabelle = () => {
        toggle();
        navigate('/konstrukteurtabelle');
    };

    const navigateFahrertabelle = () => {
        toggle();
        navigate('/teilnehmertabelle');
    };

    const navigateRegeln = () => {
        toggle();
        navigate('/regeln');
    }

    const openTheSettings = () => {
        setOpenSettings(true);
        toggle();
    }

    const navigateStatistiken = () => {
        toggle();
        navigate('/statistiken');
    }

    const navigateSocialMedia = () => {
        toggle();
        navigate('/socialmedia');
    }

    const ArchivWeiterleitung = () => {
        toggle();
        navigate('/archiv');
    }

    const navigateHome = () => {
        toggle();
        navigate('/');
    }

    const handleRennergebnisse = () => {
        toggle();
        navigate('/rennergebnisse');
    }

    const openTheLogin = () => {
        toggle();
        setOpenLogin(true);
    }


    const logout = () => {
        toggle();
        signOut(auth).then(() => {
            console.log("Logout erfolgreich");
            navigate('/');
            notifications.show({
                title: 'Logout erfolgreich! 🎉',
                message: 'Du hast dich erfolgreich ausgeloggt!',
                color: 'green',
                autoClose: 2000,
            });
            setAccessToken(null);
        }).catch((error) => {
            console.error("Fehler beim Logout:", error.message);
        });
    }

    return (
        <>
            <Navbar className="navbar">
                <Container>
                    <Burger opened={opened} onClick={toggle} color="white" />
                    <Navbar.Brand className="navbar-brand">
                        <img
                            alt=""
                            src={LigaLogo}
                            width={logoWidth}
                            height={logoHeight}
                            className="d-inline-block align-top logo"
                            style={{marginRight: '5px'}}
                            onClick={() => navigate('/')}
                        />{' '}
                        <span className="title" onClick={() => navigate('/f1league')}>Virtual Racing League</span>
                    </Navbar.Brand>
                    <Navbar.Collapse className="justify-content-end">
                            <Button 
                                leftSection={<GrAdd size={20} color="white" />} 
                                variant="transparent"
                                color="white"
                                onClick={() => {
                                    setDrawerOpen(Prev => !Prev);
                                    console.log("+ Gedrückt");
                                }}
                            >
                                Eintragen
                            </Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Offcanvas show={opened} onHide={toggle} className="offcanvas-custom">
                <Offcanvas.Body className="offcanvas-body">
                    <div className="tab-custom" onClick={navigateHome}>Home</div>
                    <div className="tab-custom" onClick={navigateFahrertabelle}>Fahrertabelle</div>
                    <div className="tab-custom" onClick={navigateKonstrukteurstabelle}>Konstrukteurstabelle</div>
                    <div className="tab-custom" onClick={navigateStatistiken}>Statistiken</div>
                    {/*
                    <div className="tab-custom" onClick={navigateSocialMedia} style={{display: 'flex', alignItems: 'center'}}>
                        <LuSmartphone />
                        Social Media
                    </div>
                    */}
                   {/*} <div className="tab-custom" onClick={navigateRegeln}>Regeln</div> */}
                    <div className="tab-custom" onClick={handleRennergebnisse}>Rennergebnisse</div>

                    {/*
                    <div className="tab-custom" onClick={ArchivWeiterleitung}>Archiv</div>
                    */}

                    <div className="footer">
                    <ActionIcon variant='transparent' size="xs" onClick={openTheSettings}>
                        <CiSettings color="black" size={20} />
                    </ActionIcon>
                    {accessToken === null ? (
                    <ActionIcon variant='transparent' size="xs" onClick={openTheLogin}>
                        <CiLogin color="black" size={20} />
                    </ActionIcon>
                    ) :(
                        <ActionIcon variant='transparent' size="xs" onClick={logout}>
                            <CiLogout color="black" size={20} />
                        </ActionIcon>
                    )}
                        <div>VRL V2.0</div>
                        <div>Releasedatum 16.07.2024</div>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>

            {window.innerWidth < 767 && (
                <Drawer 
                    opened={drawerOpen == true}
                    onClose={() => {
                        setDrawerOpen(false);
                        setShowForm(false);
                    }}
                    position="bottom" 
                    title={showForm ? "Registrieren" : "Ergebnis eintragen"}
                    overlayProps={{ backgroundOpacity: 0.5, blur: 1 }}
                    style={{ borderRadius: '10px' }}
                    radius={10}
                >
                    <ErgebnisEintragen setDrawerOpen={setDrawerOpen} showForm={showForm} setShowForm={setShowForm}/>
                </Drawer>
            )}

            {window.innerWidth > 767 && (
                <Modal
                    opened={drawerOpen == true}
                    onClose={() => {
                        setDrawerOpen(false);
                        setShowForm(false);
                    }}
                    title={showForm ? "Registrieren" : "Ergebnis eintragen"}
                    size="xl"
                    centered
                >
                    <ErgebnisEintragen setDrawerOpen={setDrawerOpen} showForm={showForm} setShowForm={setShowForm}/>
                </Modal>
            )}

           <Modal // Login Modal
                opened={openLogin}
                onClose={() => setOpenLogin(false)}
                title="Login"
                size="sm"
                centered
            >
                <LoginKomponente setOpenLogin={setOpenLogin} setAccessToken={setAccessToken}/>
            </Modal>

           {/* <Zufallsgenerator /> wird nicht mehr benötigt */}

            {openSettings && (
                <ZusatzKompoennte openSettings={openSettings} setOpenSettings={setOpenSettings} />
            )}
        </>
    );
};
export default Header;