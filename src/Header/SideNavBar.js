import React from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { CiLogin, CiSettings, CiLogout } from "react-icons/ci";
import { ActionIcon } from '@mantine/core';
import { LuSmartphone } from "react-icons/lu";

const SideNavBar = ({
    opened,
    toggle,
    navigateHome,
    navigateFahrertabelle,
    navigateKonstrukteurstabelle,
    navigateStatistiken,
    navigateSocialMedia,
    navigateRegeln,
    handleRennergebnisse,
    ArchivWeiterleitung,
    navigateAdminDashboard,
    openTheSettings,
    openTheLogin,
    logout,
    accessToken
}) => {
    return (
            <Offcanvas show={opened} onHide={toggle} className="offcanvas-custom">
                <Offcanvas.Body className="offcanvas-body">
                    <div className="tab-custom" onClick={navigateHome}>Home</div>
                    <div className="tab-custom" onClick={navigateFahrertabelle}>Fahrertabelle</div>
                    <div className="tab-custom" onClick={navigateKonstrukteurstabelle}>Konstrukteurstabelle</div>
                    <div className="tab-custom" onClick={navigateStatistiken}>Statistiken</div>
                    <div className="tab-custom" onClick={navigateSocialMedia} style={{display: 'flex', alignItems: 'center'}}>
                        <LuSmartphone />
                        Social Media
                    </div>
                   {/*} <div className="tab-custom" onClick={navigateRegeln}>Regeln</div> */}
                    <div className="tab-custom" onClick={handleRennergebnisse}>Rennergebnisse</div>
                    <div className="tab-custom" onClick={ArchivWeiterleitung}>Archiv</div>
                    {(accessToken === "davide.chiffi@gmx.de") && (
                        <div className="tab-custom" onClick={navigateAdminDashboard}>Admin Dashboard</div>
                    )}
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
                        <div>Int.League V1.5</div>
                        <div>Releasedatum 25.04.2024</div>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
    )
}
export default SideNavBar;
