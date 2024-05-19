import React from 'react';
import { Card, Image, Text, Badge, Button, Group, Title , Modal} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import './Archiv.css';

const Archiv = () => {

    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <Title order={1} id='regelntitel'>Archiv</Title>

            <div className='archiv-card-1'>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Card.Section>
                        <Image
                        src="https://cdn1.epicgames.com/offer/b7773a08a6fa41e3a0fbc4c1e51c95a4/EGS_F123_Codemasters_S1_2560x1440-467b1cdd2c54eb2ecaa3d776351ca452"
                        height={160}
                        alt="Saison F1 23"
                        />
                    </Card.Section>

                    <Group justify="space-between" mt="md" mb="xs">
                        <Text fw={500}>F1 23 Aufwärm Saison </Text>
                        <Badge color="red">Läuft Aktuell</Badge>
                    </Group>

                    <Text size="sm" c="dimmed">
                        Hier ist das Archiv mit den Ergebnissen und den Statistiken der F1 23 Aufwärm Saison
                    </Text>

                    <Button color="black" fullWidth mt="md" radius="md" onClick={open}>
                        Ansehen
                    </Button>
                </Card>
            </div>

            <Modal opened={opened} onClose={close} title="F1 23 Aufwärm Saison" centered>
                Saison ist noch nicht beendet...
            </Modal>

        </>
    );
}
export default Archiv;