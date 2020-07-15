import React, { useState, useEffect } from 'react';
import './App.css';
import Post from "./Post";
import { db, auth } from "./firebase";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from "./ImageUpload";
import {Helmet} from "react-helmet";

function getModalStyle() {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  }
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
}));

function App() {

  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubcribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // * User has logged in
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    })

    return () => {
      unsubcribe();
    }

  }, [user, username]);

  useEffect(() => {
    db.collection('posts').orderBy("timestamp", "desc").onSnapshot(snapshot => {
      setPosts(
        snapshot.docs.map(doc => ({
          id: doc.id,
          post: doc.data()
        }))
      )
    })
  }, [])

  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message));
  }

  const signIn = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
      .catch(error => alert(error));

    setOpenSignIn(false);
  }

  return (
    <div className="app">
      <Helmet>
        <title>Instagram Clone</title>
      </Helmet>
      <Modal
        open={open}
        onClose={() => setOpen(false)} >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup" >
            <center>
              <img
                className="app__header__image"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="" />
            </center>
            <Input
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp} variant="outlined" color="primary">SignUp</Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)} >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup" >
            <center>
              <img
                className="app__header__image"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="" />
            </center>
            <Input
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn} variant="outlined" color="secondary">Login</Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img className="app__header__image"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="Instagram Logo" />
        {user ? (
          <div>
            <h4>Hello {user.displayName}</h4>
            <Button
              onClick={() => auth.signOut()}
              variant="contained"
              color="primary">
              Logout
          </Button>
          </div>
        ) : <div className="app__login__container">
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpen(true)}>SignUp</Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setOpenSignIn(true)}>Login</Button>
          </div>
        }
      </div>
      <div className="app__posts">
        {
          posts.map(({ id, post }) => (
            <Post key={id} postId={id} user={user} imageUrl={post.imageUrl} username={post.username} caption={post.caption} />
          ))
        }
      </div>
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : <h3 className="app__no_login"> You need to Login to Upload</h3>}
    </div>
  );
}

export default App;
