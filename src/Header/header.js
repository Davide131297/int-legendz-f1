import React, {useEffect, useState, useContext} from "react";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import LigaLogo from './LigaLogo.png';
import './header.css';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { Burger } from '@mantine/core';
import { Button } from '@mantine/core';
import { Drawer, Modal } from '@mantine/core';
import { GrAdd } from "react-icons/gr";
import ErgebnisEintragen from "../ErgebnisEintragen/ErgebnisEintragen";
import ZusatzKompoennte from "./ZusatzKompoennte";
import LoginKomponente from "./LoginKomponente";
import { signOut, getAuth } from "firebase/auth";
import { notifications } from "@mantine/notifications";
import { AccessTokenContext } from "../utils/AccesTokenContext";
import SideNavBar from "./SideNavBar";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { set } from "firebase/database";

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

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const ITEM_HEIGHT = 48;
    
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = (option) => {
        setAnchorEl(null);
        if (option === 'Admin Dashboard') {
            setOpenLogin(true);
        }
        if (option === 'Eintragen') {
            setDrawerOpen(true);
        }
        if (option === 'Archiv') {
            navigate('/archiv');
        }
        if (option === 'Rennergebnisse') {
            navigate('/rennergebnisse');
        }
    };

    const options = [
        'Eintragen',
        'Archiv',
        'Rennergebnisse',
        'Admin Dashboard',
    ];

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

    const navigateAdminDashboard = () => {
        toggle();
        navigate('/adminDashboard');
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
                    {window.innerWidth > 767 && (
                    <Burger opened={opened} onClick={toggle} color="white" />
                    )}
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
                        <span className="title" onClick={() => navigate('/f1league')}>Int-Legendz F1 Liga</span>
                    </Navbar.Brand>
                    <Navbar.Collapse className="justify-content-end">
                        {window.innerWidth < 767 && (
                        <div>
                            <IconButton
                                aria-label="more"
                                id="long-button"
                                aria-controls={open ? 'long-menu' : undefined}
                                aria-expanded={open ? 'true' : undefined}
                                aria-haspopup="true"
                                onClick={handleClick}
                            >
                                <MoreVertIcon style={{ color: 'white'}}/>
                            </IconButton>
                            <Menu
                                id="long-menu"
                                MenuListProps={{
                                'aria-labelledby': 'long-button',
                                }}
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleCloseMenu}
                                PaperProps={{
                                style: {
                                    maxHeight: ITEM_HEIGHT * 4.5,
                                    width: '20ch',
                                },
                                }}
                            >
                                {options.map((option) => (
                                <MenuItem key={option} selected={option === 'Pyxis'} onClick={() => handleCloseMenu(option)}>
                                    {option}
                                </MenuItem>
                                ))}
                            </Menu>
                        </div>
                        )}
                        {window.innerWidth > 767 && (
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
                        )}
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {window.innerWidth > 767 && (
            <SideNavBar
                opened={opened}
                toggle={toggle}
                navigateHome={navigateHome}
                navigateFahrertabelle={navigateFahrertabelle}
                navigateKonstrukteurstabelle={navigateKonstrukteurstabelle}
                navigateStatistiken={navigateStatistiken}
                navigateSocialMedia={navigateSocialMedia}
                navigateRegeln={navigateRegeln}
                handleRennergebnisse={handleRennergebnisse}
                ArchivWeiterleitung={ArchivWeiterleitung}
                navigateAdminDashboard={navigateAdminDashboard}
                openTheSettings={openTheSettings}
                openTheLogin={openTheLogin}
                logout={logout}
                accessToken={accessToken}
            />
            )}

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