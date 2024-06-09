import react, { useState } from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import { MdHome } from "react-icons/md";
import { FaFlagCheckered } from "react-icons/fa";
import { GiFullMotorcycleHelmet } from "react-icons/gi";
import { FaChartBar } from "react-icons/fa";
import { FaArchive } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const [value, setValue] = useState(0);
    const navigate = useNavigate();

    function navigateto(page) {
        setValue(page);
        switch (page) {
            case 0:
                navigate('/');
                break;
            case 1:
                navigate('/teilnehmertabelle');
                break;
            case 2:
                navigate('/konstrukteurtabelle');
                break;
            case 3:
                navigate('/statistiken');
                break;
            case 4:
                navigate('/archiv');
                break;
            default:
                break;
        }
    }

    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: '9999' }} elevation={3}>
            <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                    navigateto(newValue);
                }}
            >
                <BottomNavigationAction label="Home" icon={<MdHome style={value === 0 ? { color: 'blue' } : {}} />} />
                <BottomNavigationAction label="Fahrer" icon={<FaFlagCheckered style={value === 1 ? { color: 'blue' } : {}} />} />
                <BottomNavigationAction label="Konstrukteur" icon={<GiFullMotorcycleHelmet style={value === 2 ? { color: 'blue' } : {}} />} />
                <BottomNavigationAction label="Statistiken" icon={<FaChartBar style={value === 3 ? { color: 'blue' } : {}} />} />
                <BottomNavigationAction label="Archiv" icon={<FaArchive style={value === 4 ? { color: 'blue' } : {}} />} />
            </BottomNavigation>
        </Paper>
    )
}
export default Footer;