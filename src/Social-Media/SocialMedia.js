import React, {useContext, useState, useEffect} from 'react';
import { Box, ScrollArea, Avatar, Paper, Text, Button, TextInput, Modal, Select, Timeline, Textarea} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { db } from './../utils/firebase';
import { collection, onSnapshot, updateDoc, doc, addDoc, arrayUnion } from 'firebase/firestore';
import { CiHeart } from "react-icons/ci";
import { IoChatbubbleOutline } from "react-icons/io5";
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
import RedBull from '../Teamlogos/RedBullIcon.png';
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
    const [commentsOpen, setCommentsOpen] = useState(false);
    const [selectedNachricht, setSelectedNachricht] = useState({});
    const [commentText, setCommentText] = useState('');
    const [showFeed, setShowFeed] = useState(false);

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
                    profil: data.ProfilName,
                    Kommentar: data.Kommentar || []
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
            src: RedBull
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
        },
        {
            name: 'Sky Sports F1',
            src: 'https://pbs.twimg.com/profile_images/1368604963832803334/SYowRps3_400x400.jpg'
        }
    ];

    const profiles = [
        'F1 Legenz Gaming',
        'Sky Sports F1',
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
        if (!message) {
            console.error('message ist undefined');
            return '';
        }

        return message.replace(/@(\w+)/g, (match, username) => {
            const person = Personen.find(p => p.spielerID === username);
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

    const speicherKommentar = async () => {
        console.log("Kommentar: ", commentText);
        console.log("Nachricht: ", selectedNachricht);
    
        if (selectedNachricht && selectedNachricht.id && commentText) {
            const nachrichtRef = doc(db, 'Nachrichten', selectedNachricht.id);
    
            const jetzt = new Date(); // Erzeugen Sie die aktuelle Zeit auf dem Client
    
            await updateDoc(nachrichtRef, {
                Kommentar: arrayUnion({text: commentText, zeit: jetzt}),
            });
    
            console.log("Dokument erfolgreich aktualisiert!");
        }
    };

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
                                <div className='paper-avatar' style={{cursor: 'pointer'}}>
                                    <Avatar
                                        size="md"
                                        src={Teamlogos.find(logo => logo.name === nachricht.profil)?.src || process.env.PUBLIC_URL + '/ligalogo.png'}
                                        radius="xl"
                                        onClick={() => {setSelectedNachricht(nachricht); setShowFeed(true)}}
                                    />
                                </div>
                                <div className='paper-content'>
                                    <div onClick={() => {setSelectedNachricht(nachricht); setShowFeed(true)}} style={{cursor: 'pointer'}}>
                                        <h4>{nachricht.profil}</h4>
                                    </div>
                                    <div onClick={() => {setSelectedNachricht(nachricht); setShowFeed(true)}} style={{cursor: 'pointer'}}>
                                        <div dangerouslySetInnerHTML={{ __html: renderMessageWithMentions(nachricht.message) }} />
                                    </div>
                                    <div className='paper-like-time' style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <div>
                                            <Button leftSection={<CiHeart size={14}/>} variant="transparent" style={{marginLeft: '-12px'}} onClick={() => clickedLikeButton(nachricht.id)}>
                                                {nachricht.like !== 0 ? nachricht.like : null}
                                            </Button>
                                            <Button 
                                                leftSection={<IoChatbubbleOutline size={14}/>} 
                                                variant="transparent" 
                                                style={{marginLeft: '-12px'}} 
                                                onClick={() => {
                                                    setCommentsOpen(true);
                                                    setSelectedNachricht(nachricht);
                                                    console.log("Nachricht: ", nachricht);
                                                }}
                                            >
                                                {nachricht.Kommentar ? nachricht.Kommentar.length : null}
                                            </Button>                                        
                                        </div>
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

            <Modal 
                opened={commentsOpen} 
                onClose={() => setCommentsOpen(false)}
                centered 
                withCloseButton={true} 
                radius={20} 
                size="lg"
            >
                <Timeline bulletSize={28}>
                    <Timeline.Item
                        title={selectedNachricht.profil}
                        bullet={
                            <Avatar
                                size={30}
                                radius="xl"
                                src={Teamlogos.find(logo => logo.name === selectedNachricht.profil)?.src || process.env.PUBLIC_URL + '/ligalogo.png'}
                            />
                        }
                    >
                        <div dangerouslySetInnerHTML={{ __html: renderMessageWithMentions(selectedNachricht.message) }} />
                    </Timeline.Item>
                    <Timeline.Item
                        bullet={
                            <Avatar
                                size={30}
                                radius="xl"
                            />
                        }
                    >
                        <Textarea
                            placeholder={accessToken === null ? "Zum Kommentieren anmelden" : "Schreiben Sie hier Ihren Kommentar..."}
                            variant='unstyled'
                            onChange={(event) => setCommentText(event.target.value)}
                            disabled={accessToken === null}
                        />
                    </Timeline.Item>
                </Timeline>
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Button 
                        variant="filled"
                        radius="xl" 
                        onClick={speicherKommentar}
                        disabled={accessToken === null}
                    >
                        {accessToken === null ? 'Zum Antworten anmelden' : 'Antworten'}
                    </Button>
                </div>
            </Modal>

            <Modal
                opened={showFeed}
                onClose={() => setShowFeed(false)}
                centered
                withCloseButton={true}
                radius={20}
                size="lg"
            >
                <Timeline bulletSize={28}>
                    <Timeline.Item
                        title={selectedNachricht.profil}
                        bullet={
                            <Avatar
                                size={30}
                                radius="xl"
                                src={Teamlogos.find(logo => logo.name === selectedNachricht.profil)?.src || process.env.PUBLIC_URL + '/ligalogo.png'}
                            />
                        }
                    >
                        <div dangerouslySetInnerHTML={{ __html: renderMessageWithMentions(selectedNachricht.message) }} />
                    </Timeline.Item>
                    {selectedNachricht?.Kommentar?.map((comment, index) => (
                        <Timeline.Item
                            key={index}
                            bullet={
                                <Avatar
                                    size={30}
                                    radius="xl"
                                />
                            }
                        >
                            <div dangerouslySetInnerHTML={{ __html: renderMessageWithMentions(comment.text) }} />
                        </Timeline.Item>
                    ))}
                    <Timeline.Item
                        bullet={
                            <Avatar
                                size={30}
                                radius="xl"
                            />
                        }
                    >
                        <Textarea
                            placeholder={accessToken === null ? "Zum Kommentieren anmelden" : "Schreiben Sie hier Ihren Kommentar..."}
                            variant='unstyled'
                            onChange={(event) => setCommentText(event.target.value)}
                        />
                    </Timeline.Item>
                </Timeline>
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Button 
                        variant="filled"
                        radius="xl" 
                        onClick={speicherKommentar}
                        disabled={accessToken === null}
                    >
                        {accessToken === null ? 'Zum Antworten anmelden' : 'Antworten'}
                    </Button>
                </div>
            </Modal>
        </>
    );
}
export default SocialMedia;