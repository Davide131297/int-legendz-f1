import React, {useContext, useState, useEffect} from 'react';
import { Box, ScrollArea, Avatar, Paper, Text, Button, TextInput, Modal, Select } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { db } from './../utils/firebase';
import { collection, onSnapshot, updateDoc, doc, addDoc } from 'firebase/firestore';
import { CiHeart } from "react-icons/ci";
import Cookies from 'js-cookie';
import './SocialMedia.css';
import RichText from '../RichTextComponent/RichTextEditor';
import { notifications } from '@mantine/notifications';
import {useNavigate} from 'react-router-dom';
import { AccessTokenContext } from "../utils/AccesTokenContext";

import { Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import Placeholder from '@tiptap/extension-placeholder';
import Mention from '@tiptap/extension-mention';
import CharacterCount from '@tiptap/extension-character-count';

import Ferrari from '../Teamlogos/Ferrari.png';
import Merceds from '../Teamlogos/MercedesIcon.png';
import RedBull from '../Teamlogos/RedBullIcon.svg';
import Williams from '../Teamlogos/Williams.png';
import McLaren from '../Teamlogos/MclarenIcon.png';
import Alpine from '../Teamlogos/Alpine.png';
import KickSauber from '../Teamlogos/KickSauber.png';
import RBVisa from '../Teamlogos/RBVisaCashApp.svg';
import F1LegendzGaming from '../Teamlogos/IntLegendzGaming.png';

const SocialMedia = () => {

    const [Nachrichten, setNachrichten] = useState([]);
    const [updateStatus, setUpdateStatus] = useState(false);
    const [openNewMessage, setOpenNewMessage] = useState(false);
    const [opened, { open, close }] = useDisclosure(false);
    const [editorContent, setEditorContent] = useState('');
    const [profileValue, setProfileValue] = useState('');
    const [error, setError] = useState('');
    const [characterCount, setCharacterCount] = useState(0);
    const [Personen, setPersonen] = useState([]);
    const navigate = useNavigate();
    const { accessToken } = useContext(AccessTokenContext);

    useEffect(() => {
        const NachrichtenRef = collection(db, 'Nachrichten');
        let tempListe = [];
        const unsubscribe = onSnapshot(NachrichtenRef, (snapshot) => {
            tempListe = []; // Leeren Sie das Array, bevor Sie die Daten abrufen
            snapshot.forEach((doc) => {
                let data = doc.data();
                tempListe.push({
                    id: doc.id,
                    message: data.Nachricht,
                    zeit: data.Zeit.toDate(), // Speichern Sie das Datum direkt als Date-Objekt
                    like: data.Like,
                    profil: data.ProfilName
                });
            })
            tempListe.sort((a, b) => b.zeit - a.zeit); // Verwenden Sie das Date-Objekt für die Sortierung
            setNachrichten(tempListe);
            console.log("Zeige Nachrichten: ", tempListe);
        });
        return () => unsubscribe();
    }, [updateStatus]);

    useEffect(() => {
        const personenRef = collection(db, 'personen');
        let tempListe = [];
        const unsubscribe = onSnapshot(personenRef, (snapshot) => {
            tempListe = []; // Leeren Sie das Array, bevor Sie die Daten abrufen
            snapshot.forEach((doc) => {
                let data = doc.data();
                tempListe.push({
                    id: doc.id,
                    name: data.spielerID
                });
            })
            setPersonen(tempListe);
        });
        return () => unsubscribe();
    }, []);

    const clickedLikeButton = async (id) => {
        const nachrichtRef = doc(db, 'Nachrichten', id);
        const nachricht = Nachrichten.find(nachricht => nachricht.id === id);

        // Überprüfen, ob ein Cookie für diese Nachricht existiert
        const likeCookie = Cookies.get(`like-${id}`);

        let newLikeValue;
        if (likeCookie) {
            // Wenn ein Cookie existiert, verringern Sie den "Like"-Wert um 1 und entfernen Sie das Cookie
            newLikeValue = nachricht.like - 1;
            Cookies.remove(`like-${id}`);
        } else {
            // Wenn kein Cookie existiert, erhöhen Sie den "Like"-Wert um 1 und setzen Sie ein Cookie
            newLikeValue = nachricht.like + 1;
            Cookies.set(`like-${id}`, newLikeValue, { expires: 30 }); // Der Cookie läuft nach 30 Tagen ab
        }

        await updateDoc(nachrichtRef, {
            Like: newLikeValue
        });
        setUpdateStatus(!updateStatus);
    }

    const Teamlogos = [
        {
            name: 'Ferrari',
            src: 'https://pbs.twimg.com/profile_images/947659786555940865/P5eYYYIx_400x400.jpg'
        },
        {
            name: 'Aston Martin',
            src: 'https://media.astonmartin.com/wp-content/uploads/2021/01/588489-scaled.jpg'
        },
        {
            name: 'Mercedes',
            src: Merceds
        },
        {
            name: 'RedBull',
            src: 'https://pbs.twimg.com/profile_images/1788139372723765248/Oqxg1aY7_400x400.jpg'
        },
        {
            name: 'Williams',
            src: Williams
        },
        {
            name: 'McLaren',
            src: McLaren
        },
        {
            name: 'Alpine',
            src: Alpine
        },
        {
            name: 'Kick Sauber',
            src: 'https://pbs.twimg.com/profile_images/1760033883473805312/xd3tAg8y_400x400.jpg'
        },
        {
            name: 'RB Visa Cash App',
            src: RBVisa
        },
        {
            name: 'Haas',
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Logo_Haas_F1.png/800px-Logo_Haas_F1.png'
        },
        {
            name: 'F1 Legenz Gaming',
            src: F1LegendzGaming
        }
    ];

    const profiles = [
        'F1 Legenz Gaming',
        'RedBull',
        'Ferrari',
        'Mercedes',
        'McLaren',
        'Williams',
        'Alpine',
        'Aston Martin',
        'RB Visa Cash App',
        'Haas',
        'Kick Sauber',
        ...Personen.map(person => person.name)
    ];

    const editor = useEditor({
        extensions: [
          StarterKit,
          Underline,
          Link,
          Superscript,
          Subscript,
          Highlight,
          TextAlign.configure({ types: ['heading', 'paragraph'] }),
          Placeholder.configure({ placeholder: 'Schreibe hier deine Nachricht..' }),
          Mention.configure({
            HTMLAttributes: {
              class: 'mention',
            },
            suggestion: {
              items: ({ query }) => {
                return profiles.filter(profile => profile.toLowerCase().includes(query.toLowerCase()));
              },
              render: () => {
                let component;
                return {
                  onStart: props => {
                    component = document.createElement('div');
                    component.classList.add('mention-suggestion');
                    document.body.appendChild(component);
                    props.items.forEach(item => {
                      const div = document.createElement('div');
                      div.classList.add('mention-item');
                      div.textContent = item;
                      div.addEventListener('click', () => {
                        props.command({ id: item });
                      });
                      component.appendChild(div);
                    });
                    const { left, bottom } = props.clientRect();
                    component.style.position = 'absolute';
                    component.style.left = `${left}px`;
                    component.style.top = `${bottom + window.scrollY}px`;
                    component.style.zIndex = '10000';  // Höherer z-index-Wert
                  },
                  onUpdate: props => {
                    while (component.firstChild) {
                      component.firstChild.remove();
                    }
                    props.items.forEach(item => {
                      const div = document.createElement('div');
                      div.classList.add('mention-item');
                      div.textContent = item;
                      div.addEventListener('click', () => {
                        props.command({ id: item });
                      });
                      component.appendChild(div);
                    });
                    const { left, bottom } = props.clientRect();
                    component.style.position = 'absolute';
                    component.style.left = `${left}px`;
                    component.style.top = `${bottom + window.scrollY}px`;
                    component.style.zIndex = '10000';  // Höherer z-index-Wert
                  },
                  onExit: () => {
                    component.remove();
                  }
                }
              },
              command: ({ editor, range, props }) => {
                editor.chain().focus().insertContentAt(range, `@${props.id}`).run();
              }
            }
          }),
          CharacterCount.configure({
            limit: 280,
          })
        ],
        onUpdate: ({ editor }) => {
          const count = editor.storage.characterCount.characters();
          setCharacterCount(count);
          if (count > 280) {
            notifications.show({
                title: 'Zu viele Zeichen!',
                message: 'Du hast mehr ala 200 Zeichen eingegeben. Bitte kürze deine Nachricht.',
                color: 'red',
                autoClose: 2000,
            });
          } else {
            setError('');
          }
        },
    });
    
    const handleSave = async () => {
        const html = editor.getHTML();
        setEditorContent(html);
        console.log("HTML:", html)

        const nachrichtenRef = collection(db, 'Nachrichten');
        const newNachricht = {
            Like: 0,
            Nachricht: html,
            ProfilName: profileValue,
            Zeit: new Date()
        };
        await addDoc(nachrichtenRef, newNachricht);
        editor.commands.clearContent();
        close();
        setUpdateStatus(!updateStatus);
    };

    const handleMentionClick = (id) => {
        navigate(`/profil/${id}`);
    };

    const renderMessageWithMentions = (message) => {
        return message.replace(/@(\w+)/g, (match, username) => {
            const person = Personen.find(p => p.name === username);
            if (person) {
                return `<a href="#" class="mention-link" data-id="${person.id}">@${username}</a>`;
            }
            return match;
        });
    };

    useEffect(() => {
        const handleLinkClick = (event) => {
            if (event.target.matches('.mention-link')) {
                event.preventDefault();
                const id = event.target.getAttribute('data-id');
                handleMentionClick(id);
            }
        };

        document.addEventListener('click', handleLinkClick);

        return () => {
            document.removeEventListener('click', handleLinkClick);
        };
    }, []);

    return (
        <>
            <div className='socialMedia'>
                <Box bg="#F2F2F2" className='myFeedBox'>
                    <ScrollArea style={{ height: '100%'}}>
                    <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70px', borderBottom: '1px solid #ccc' }}>
                        <h2>International Gaming Feed</h2>
                    </Box>
                    <Paper shadow="xs" padding="xl" className='paper'>
                        <div className='paper-avatar'>
                            <Avatar
                                size="md"
                                radius="xl"
                            />
                        </div>
                        <div className='paper-content'>
                            {accessToken === null ? (
                                <div>
                                <TextInput 
                                    variant='unstyled' 
                                    placeholder='Melde dich an um eine Nachricht zu schreiben'
                                    disabled
                                />
                            </div>
                            ) : (
                            <div>
                                <TextInput 
                                    variant='unstyled' 
                                    placeholder='Schreibe eine Nachricht...'
                                    onClick={open}
                                />
                            </div>
                            )}
                        </div>
                    </Paper>
                        {Nachrichten.map((nachricht) => (
                            <Paper key={nachricht.id} shadow="xs" padding="xl" className='paper'>
                                <div className='paper-avatar'>
                                    <Avatar
                                        size="md"
                                        src={Teamlogos.find(logo => logo.name === nachricht.profil)?.src || process.env.PUBLIC_URL + '/ligalogo.png'}
                                        radius="xl"
                                    />
                                </div>
                                <div className='paper-content'>
                                    <div>
                                        <h4>{nachricht.profil}</h4>
                                    </div>
                                    <div>
                                        <div dangerouslySetInnerHTML={{ __html: renderMessageWithMentions(nachricht.message) }} />
                                    </div>
                                    <div className='paper-like-time'>
                                        <Button leftSection={<CiHeart size={14}/>} variant="transparent" style={{marginLeft: '-12px'}} onClick={() => clickedLikeButton(nachricht.id)}>
                                            {nachricht.like !== 0 ? nachricht.like : null}
                                        </Button>
                                        <Text c="dimmed" size='12px'>{nachricht.zeit.toLocaleString()}</Text>
                                    </div>
                                </div>
                            </Paper>
                        ))}
                    </ScrollArea>
                </Box>
            </div>

            <Modal 
                opened={opened} 
                onClose={() => {
                    if (window.confirm('Nachricht verwerfen?')) {
                        close();
                        editor.commands.clearContent();
                    }
                }}
                centered 
                withCloseButton={false} 
                radius={20} 
                size="lg"
            >
                <div className='modal-select'>
                    <Select
                        label="Wähle das Profil"
                        placeholder="Profil auswählen"
                        data={profiles}
                        withAsterisk
                        w={180}
                        onChange={(value) => setProfileValue(value)}
                        searchable
                    />
                </div>
                <RichText 
                    handleSave={handleSave} 
                    editor={editor} 
                />
                <div style={{ color: characterCount > 280 ? 'red' : 'black' }}>
                    Zeichen: {characterCount} von max. 280
                </div>
            </Modal>
        </>
    );
}
export default SocialMedia;