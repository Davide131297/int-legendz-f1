import react, { useState, useEffect } from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import { MdHome } from "react-icons/md";
import { FaFlagCheckered } from "react-icons/fa";
import { GiFullMotorcycleHelmet } from "react-icons/gi";
import { FaChartBar } from "react-icons/fa";
import { FaArchive } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { VscFeedback } from "react-icons/vsc";

const Footer = () => {
    const [value, setValue] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        switch (location.pathname) {
            case '/':
                setValue(0);
                break;
            case '/teilnehmertabelle':
                setValue(1);
                break;
            case '/konstrukteurtabelle':
                setValue(2);
                break;
            case '/statistiken':
                setValue(3);
                break;
            case '/archiv':
                setValue(4);
                break;
            default:
                break;
        }
    }, [location.pathname]);

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
                navigate('/socialmedia');
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
                <BottomNavigationAction label="Fahrer" icon={<GiFullMotorcycleHelmet style={value === 1 ? { color: 'blue' } : {}} />} />
                <BottomNavigationAction label="Konstrukteur" icon={<FaFlagCheckered style={value === 2 ? { color: 'blue' } : {}} />} />
                <BottomNavigationAction label="Statistiken" icon={<FaChartBar style={value === 3 ? { color: 'blue' } : {}} />} />
                <BottomNavigationAction label="Feed" icon={<VscFeedback style={value === 4 ? { color: 'blue' } : {}} />} />
            </BottomNavigation>
        </Paper>
    )
}
export default Footer;