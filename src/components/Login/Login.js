import React, { useState, useContext } from 'react';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router-dom';
import {createUserWithEmailAndPassword, handleFbSignIn, handleGoogleSignIn, handleSignOut, initializeLoginFramwork, signInWithEmailAndPassword } from './LoginManager';


function Login() {
  const[newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password:'',
    photo: ''
  });

  initializeLoginFramwork();

  const [loggedInUser, setLoggedInUser] = useContext(UserContext) 
  const history = useHistory();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };
  
  const googleSignIn = () => {
    handleGoogleSignIn()
    .then(res => {
      handleResponse(res, true);
    })
  }

  const fBSignIn = () => {
    handleFbSignIn()
    .then(res => {
      handleResponse(res, true);
   })
  }

  const signOut = () => {
    handleSignOut()
    .then(res => {
      handleResponse(res, false);
    })
  }
  
  const handleResponse = (res, redirect ) => {
    setUser(res);
    setLoggedInUser(res);
    if( redirect){
      history.replace(from); 
    }
  }
  
  const handleBlur = (event) => {
    let isFormValid = true;
    if(event.target.name === 'email'){
      isFormValid = /\S+@\S+\.\S+/.test(event.target.value);
      
    }
    if(event.target.name === 'password'){
      const isPasswordValid = event.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(event.target.value);
      isFormValid = isPasswordValid && passwordHasNumber;
    }
    if(isFormValid){
     const newUserInfo = {...user}
     newUserInfo[event.target.name] = event.target.value;
     setUser(newUserInfo);
    }
  }
  const handleSubmit = (event) => {
    if(newUser && user.email && user.password){
      createUserWithEmailAndPassword(user.name, user.email, user.password)
      .then(res => {
        handleResponse(res, true);
      })
    }

    if(!newUser && user.email && user.password){
      signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        handleResponse(res, true);
      })
    }
    event.preventDefault();

  }

  return (
    <div style={{textAlign: 'center'}}>
      {user.isSignedIn ? <button onClick={signOut}>Sing out</button> :
        <button onClick={googleSignIn}>Sing in</button>
      }
      <br/>
      <button onClick={fBSignIn}>Sign in using Feacbook</button>
      {
        user.isSignedIn && <div>
          <p> welcome, {user.name}</p>
          <p>Your Email: {user.email}</p>
          <img src={user.photo} alt=""/>
        </div>
      }
      
      <h1>Our own Authentication</h1>
      <input type="checkbox" onChange={ () => setNewUser(!newUser)} name="newUser" id=""/>
      <label htmlFor="newUser">New Usew Sign up</label>
      <form onSubmit={handleSubmit}>
        {newUser && <input name="name" type="text" onBlur={handleBlur} placeholder="Your Name"/>}
        <br/>
      <input type="text" name="email" onBlur={handleBlur} placeholder="Your Email address" required/>
      <br/>
      <input type="password" name="password" onBlur={handleBlur} placeholder="Your Password" required/>
      <br/>
      <input type="submit" value={newUser ? 'Sign Up' : 'Sign In'}/>
      </form>
      <p style={{color: 'red'}}>{user.error}</p>
      { user.success &&  <p style={{color: 'green'}}>User {newUser ? 'created' : 'Logged In'} successfully</p>}
    </div>
  );
}

export default Login;
