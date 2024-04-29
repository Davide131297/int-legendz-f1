import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/charts/styles.css';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Router } from './Router';
import { AccessTokenContext } from './utils/AccesTokenContext';

function App() {
  const [accessToken, setAccessToken] = React.useState(null);
  
  return (
    <AccessTokenContext.Provider value={{ accessToken, setAccessToken }}>
      <MantineProvider>
        <Notifications />
          <Router>
          </Router>
      </MantineProvider>
    </AccessTokenContext.Provider>
  );
}
export default App;