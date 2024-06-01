import React, {useEffect, useState} from "react";
import { Card } from '@mantine/core';
import { Loader } from '@mantine/core';

const WeatherWidget = ({WetterDaten}) => {

    const [Lufttemperatur, setLufttemperatur] = useState(null);
    const [ÄnderungDerLufttemperatur, setÄnderungDerLufttemperatur] = useState(null);
    const [Regenwahrscheinlichkeit, setRegenwahrscheinlichkeit] = useState(null);
    const [Sitzungstyp, setSitzungstyp] = useState(null);
    const [Zeitversatz, setZeitversatz] = useState(null);
    const [Streckentemperatur, setStreckentemperatur] = useState(null);
    const [ÄnderungDerStreckentemperatur, setÄnderungDerStreckentemperatur] = useState(null);
    const [Wetter, setWetter] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (WetterDaten.length > 0) {
            const {
                m_airTemperature,
                m_airTemperatureChange,
                m_rainPercentage,
                m_sessionType,
                m_timeOffset,
                m_trackTemperature,
                m_trackTemperatureChange,
                m_weather
            } = WetterDaten[0];

            setLufttemperatur(m_airTemperature);
            setÄnderungDerLufttemperatur(m_airTemperatureChange);
            setRegenwahrscheinlichkeit(m_rainPercentage);
            setSitzungstyp(m_sessionType);
            setZeitversatz(m_timeOffset);
            setStreckentemperatur(m_trackTemperature);
            setÄnderungDerStreckentemperatur(m_trackTemperatureChange);
            setWetter(m_weather);
            setIsLoading(false);
        }
    }, [WetterDaten]);

    function renderWeatherImage(weather) {
        switch(weather) {
            case 0:
                return <img src="https://cdn.icon-icons.com/icons2/1370/PNG/512/if-weather-3-2682848_90785.png" alt="Klar" height="40" width="40" />;
            case 1:
                return <img src="https://cdn.icon-icons.com/icons2/3349/PNG/256/cloudy_weather_sun_cloud_icon_210228.png" alt="Leicht Wolkig" height="40" width="40" />;
            case 2:
                return <img src="https://cdn.icon-icons.com/icons2/2453/PNG/512/cloud_cloudy_overcast_clouds_weather_icon_148923.png" alt="Bedeckt" height="40" width="60" />;
            case 3:
                return <img src="https://cdn.icon-icons.com/icons2/2035/PNG/512/weather_rain_raining_cloud_cloudy_icon_124154.png" alt="Leichter Regen" height="40" width="40"/>;
            case 4:
                return <img src="https://cdn.icon-icons.com/icons2/3000/PNG/512/rain_weather_cloud_flood_icon_187696.png" alt="Stark Regen" height="40" width="40" />;
            case 5:
                return <img src="https://cdn.icon-icons.com/icons2/33/PNG/256/weather_storms_storm_rain_thunder_2783.png" alt="Stürmisch" height="40" width="40" />;
            default:
                return null;
        }
    }

    function getBackgroundImage(weather) {
        switch(weather) {
            case 0:
                return "https://img.freepik.com/free-vector/blue-sky-clouds_1017-30892.jpg?w=826&t=st=1716812648~exp=1716813248~hmac=2ebd580d70cd3b8fad69a54f0a72bac196b463b7be0509803f4bd46c5723e3ba";
            case 1:
                return "https://img.freepik.com/free-photo/cloud-background_1137-330.jpg?w=826&t=st=1716813112~exp=1716813712~hmac=1e0df1c2b35aca44ffcf977978c284bd9fbd23f0aae9f927a14ac3fa9ad9d14f";
            case 2:
                return "https://img.freepik.com/free-photo/black-rain-abstract-dark-power_1127-2380.jpg?t=st=1716813273~exp=1716816873~hmac=5ab719acb6691fd1555d951f4a1a0f295aac5d9819ed5ba879dacf429ba47584&w=826";
            case 3:
                return "https://cdn.pixabay.com/photo/2015/06/19/20/14/water-815271_1280.jpg";
            case 4:
                return "https://cdn.pixabay.com/animation/2023/02/15/02/20/02-20-04-915_512.gif";
            case 5:
                return "https://cdn.pixabay.com/animation/2024/04/03/23/48/23-48-16-122_512.gif"
            default:
                return "";
        }
    }

    return (
        <>
        {isLoading ? <Loader  color="blue"/> : (
            <Card 
                shadow='sm' 
                padding="lg" 
                radius="lg" 
                withBorder 
                style={{
                    backgroundImage: `url(${getBackgroundImage(WetterDaten[WetterDaten.length - 1].m_weather)})`,
                    width: '400px'
                }}
            >
                <>
                    <div style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}}>
                        <p>{renderWeatherImage(Wetter)}</p>
                        <h5>{Lufttemperatur} °C Lufttemperatur</h5>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                        <h5>{Streckentemperatur} °C Streckentemperatur</h5>
                        <h5>{Regenwahrscheinlichkeit}% Regenwahrscheinlichkeit</h5>
                    </div>
                </>
            </Card>
        )}
        </>
    );
}
export default WeatherWidget;