import React, {useState} from 'react';
import { Card, Image, Text, Badge, Button, Group, Title , Modal} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import './Archiv.css';
import Carousel from 'react-bootstrap/Carousel';

import Constructor_23 from './Constructor_23.jpeg';
import Driver_23 from './Driver_23.jpeg';
import Statistics from './Statistics_23.jpeg';

const Archiv = () => {

    const [opened, { open, close }] = useDisclosure(false);

    const [index, setIndex] = useState(0);
    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

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
                        <Badge color="red">Beendet am 24.05.2024</Badge>
                    </Group>

                    <Text size="sm" c="dimmed">
                        Hier ist das Archiv mit den Ergebnissen und den Statistiken der F1 23 Aufwärm Saison
                    </Text>

                    <Button color="black" fullWidth mt="md" radius="md" onClick={open}>
                        Ansehen
                    </Button>
                </Card>
            </div>

            <Modal opened={opened} onClose={close} title="F1 23 Aufwärm Saison" centered size="90rem">
                <Carousel activeIndex={index} onSelect={handleSelect} fade>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src={Constructor_23}
                            alt="Constructor 23"
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src={Driver_23}
                            alt="Driver 23"
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src={Statistics}
                            alt="Statistics"
                        />
                    </Carousel.Item>
                </Carousel>
            </Modal>

        </>
    );
}
export default Archiv;