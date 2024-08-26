import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import EvacuationCentersVerticalTableComponent from './MapSelectionComponents/EvacuationCentersVerticalTableComponent';
import ZonesVerticalTableComponent from './MapSelectionComponents/ZonesVerticalTableComponent';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import HomeIcon from '@mui/icons-material/Home';
import FmdBadIcon from '@mui/icons-material/FmdBad';

const MapTabsComponent = ({ userLatitude, userLongitude, onDestinationSelect }) => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Tabs value={activeTab} onChange={handleTabChange} centered>
                <Tab label={<HomeIcon />} />
                <Tab label={<FmdBadIcon />} />
            </Tabs>
            <Box sx={{ padding: 2 }}>
                {activeTab === 0 && (
                    <EvacuationCentersVerticalTableComponent
                        userLatitude={userLatitude}
                        userLongitude={userLongitude}
                        onCenterSelect={onDestinationSelect}
                    />
                )}
                {activeTab === 1 && (
                    <ZonesVerticalTableComponent
                        userLatitude={userLatitude}
                        userLongitude={userLongitude}
                        onZoneSelect={onDestinationSelect}
                    />
                )}
            </Box>
        </Box>
    );
};

export default MapTabsComponent;
