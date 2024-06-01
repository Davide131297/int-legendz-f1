import React from "react";
import { Card, getSafeId } from '@mantine/core';

const LiveRennStatus = ({SessionData}) => {

    function getBackgroundCloor(status) {
        switch(status) {
            case 0:
                return "white";
            case 1:
            case 2:
            case 3:
                return "yellow";
            default:
                return "";
        }
    }

    function getSassionDuration(time)
    {
        const minutes = Math.floor(time / 60);
        const seconds = time - minutes * 60;
        return `Aktuelle Sessionlänge: ${minutes} Minuten und ${seconds} Sekunden`;
    }

    function getTrackLength(length) {
        const kilometers = Math.floor(length / 1000);
        const meters = length % 1000;
        return `Streckenlänge: ${kilometers} km ${meters} m`;
    }


    return (
        <>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '15px'}}>
                <Card 
                    shadow='sm' 
                    padding="lg" 
                    radius="lg" 
                    withBorder 
                    style={{
                        backgroundColor: getBackgroundCloor(SessionData.m_safteyCarStatus),
                        width: '400px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    {getBackgroundCloor(SessionData.m_safteyCarStatus) === 'yellow' ? <h1>SafetyCar</h1> : null}
                    <span style={{whiteSpace: 'nowrap'}}>{getSassionDuration(SessionData.m_sessionDuration)}</span>
                    <span style={{whiteSpace: 'nowrap'}}>{getTrackLength(SessionData.m_trackLength)}</span>

                </Card>
            </div>
        </>
    );
}
export default LiveRennStatus;