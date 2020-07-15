import React, { useState } from 'react'
import { Button } from '@material-ui/core';
import { storage, db } from "./firebase";
import firebase from "firebase";
import "./ImageUpload.css";

function ImageUpload({ username }) {
    const [caption, setCaption] = useState("");
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState("");

    const handleChange = (event) => {
        if (event.target.files[0]) {
            setImage(event.target.files[0]);
        }
    }

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`)
            .put(image);

        uploadTask.on(
            "state_changed",
            (snapShot) => {
                const progress = Math.round(
                    (snapShot.bytesTransferred / snapShot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                alert(error.message);
                console.log(error);
            },
            () => {
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        });
                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    })
                    .catch(error => console.log(error));
            }
        )
    }

    return (
        <div className="image__upload">
            <progress className="image__upload__progress" value={progress} max="100" />
            <input
            className="image__upload__caption"
                type="text"
                placeholder="Enter a Caption..."
                value={caption}
                onChange={event => setCaption(event.target.value)} />
            <input className="image__upload__button" type="file" onChange={handleChange} />
            <Button variant="contained" color="secondary" onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload
