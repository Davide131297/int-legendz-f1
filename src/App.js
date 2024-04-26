import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/charts/styles.css';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Router } from './Router';

function App() {
  return (
    <MantineProvider>
      <Notifications />
        <Router>

        </Router>
    </MantineProvider>
  );
}
export default App;