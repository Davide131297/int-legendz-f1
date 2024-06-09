import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import { MdHome } from "react-icons/md";
import { FaFlagCheckered } from "react-icons/fa";
import { GiFullMotorcycleHelmet } from "react-icons/gi";
import { FaChartBar } from "react-icons/fa";
import { FaArchive } from "react-icons/fa";

const Footer = () => {
    const [value, setValue] = React.useState(0);

    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
            <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
            >
                <BottomNavigationAction label="Home" icon={<MdHome style={value === 0 ? { color: 'blue' } : {}} />} />
                <BottomNavigationAction label="Rennen" icon={<FaFlagCheckered style={value === 1 ? { color: 'blue' } : {}} />} />
                <BottomNavigationAction label="Tabellen" icon={<GiFullMotorcycleHelmet style={value === 2 ? { color: 'blue' } : {}} />} />
                <BottomNavigationAction label="Statistiken" icon={<FaChartBar style={value === 3 ? { color: 'blue' } : {}} />} />
                <BottomNavigationAction label="Archiv" icon={<FaArchive style={value === 4 ? { color: 'blue' } : {}} />} />
            </BottomNavigation>
        </Paper>
    )
}
export default Footer;