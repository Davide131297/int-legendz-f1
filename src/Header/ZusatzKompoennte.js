import React, { useState, useEffect } from 'react';
import { Modal, Button, Paper, Input, Grid, Image, ActionIcon } from '@mantine/core';
import { getStorage, ref, listAll, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db } from './../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { FiSend } from "react-icons/fi";

const ZusatzKompoennte = ({openSettings, setOpenSettings}) => {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);
    const [uploadFile, setUploadFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const storage = getStorage();
    const [password, setPassword] = useState('');
    const [fileModal, setFileModal] = useState(false);

    const handleFileChange = (e) => {
        setUploadFile(e.target.files[0]);
    };

    const handleImageClick = (url) => {
        setSelectedImage(url);
    };

    const handleUpload = async () => {
        if (uploadFile) {
            setLoading(true);
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, uploadFile);

            uploadTask.on('state_changed', 
                (snapshot) => {
                    // Handle progress
                }, 
                (error) => {
                    // Handle error
                    setError(error.message);
                    setLoading(false);
                }, 
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setFiles(oldFiles => [...oldFiles, { name: fileName, url: downloadURL }]);
                        setLoading(false);
                    });
                }
            );
        }
    };

    const handlePasswordCheck = async () => {
        const docRef = doc(db, "Kennwort", "storage");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().Zugang === password) {
            setOpenSettings(true);
            setFileModal(true);
        } else {
            alert('Falsches Passwort');
        }
    };

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                // Referenz auf den Bucket
                const listRef = ref(storage, 'gs://f1-liga-int-legendz.appspot.com');

                // Findet alle Dateien im Bucket
                const res = await listAll(listRef);

                // Erstelle ein neues Array für die Dateien
                const newFiles = [];

                // Durchlaufe alle Dateien
                for (const itemRef of res.items) {
                    // All the items under listRef.
                    const url = await getDownloadURL(itemRef);
                    newFiles.push({ name: itemRef.name, url });
                }

                // Setze die Dateien
                setFiles(newFiles);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchFiles();
    }, [storage]);

    return (
        <>  
            <div>
                <Modal
                    opened={openSettings}
                    onClose={() => setOpenSettings(false)}
                    title="Check In"
                    centered
                    zIndex="1000"
                    size="xs"
                >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Input placeholder="Checkin Passwort" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <ActionIcon variant="outline" color="rgba(0, 0, 0, 1)" aria-label="Settings" size="lg" onClick={handlePasswordCheck} style={{marginLeft: '5px'}}>
                            <FiSend color='black'/>
                        </ActionIcon>
                    </div>
                </Modal>                   
            </div>

            <div>
                <Modal
                    opened={fileModal}
                    onClose={() => setOpenSettings(false)}
                    title="Dateien anzeigen"
                    centered
                    zIndex="2000"
                >
                    <div style={{padding: '10px'}}>
                        {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
                        <Grid gutter="md" style={{ marginBottom: '10px' }}>
                            <Input type="file" onChange={handleFileChange} />
                        </Grid>
                        <Grid gutter="md" style={{ marginBottom: '10px' }}>
                            <Input type="text" value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="Dateiname" />
                        </Grid>
                        <Grid gutter="md" style={{ marginBottom: '10px' }}>
                            <Button loading={loading} onClick={handleUpload}>Hochladen</Button>
                        </Grid>
                        {files.map((file, index) => (
                            <Paper padding="md" style={{ marginBottom: '10px', cursor: 'pointer' }} key={index} onClick={() => handleImageClick(file.url)}>
                                <img src={file.url} alt={file.name} width="100" height="100" />
                                <p>{file.name}</p>
                            </Paper>
                        ))}
                        {selectedImage && (
                            <Modal opened={true} onClose={() => setSelectedImage(null)} title="Selected Image" centered>
                                <Image src={selectedImage} alt="Selected" fit="cover" />
                            </Modal>
                        )}
                    </div>
                </Modal>
            </div>
            </>
    );
};

export default ZusatzKompoennte;