import React, { useState } from "react";
import Add from "../img/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc, collection, addDoc } from "firebase/firestore"; 
import { useNavigate, Link } from "react-router-dom";


const Register = () => {

  const [err,setError] = useState(false)
  const navigate = useNavigate();

const handleSubmit= async(e)=>{


  e.preventDefault()

  const displayName = e.target[0].value;
  const email = e.target[1].value;
  const password = e.target[2].value;
  const file = e.target[3].files[0];

  try{
    const res = await createUserWithEmailAndPassword(auth, email, password);//creating 
      console.log(res);
      const storageRef = ref(storage, displayName);
      const uploadTask = uploadBytesResumable(storageRef, file);

 uploadTask.on('state_changed', 
  
 (snapshot) => {
  // Observe state change events such as progress, pause, and resume
  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  console.log('Upload is ' + progress + '% done');
  switch (snapshot.state) {
    case 'paused':
      console.log('Upload is paused');
      break;
    case 'running':
      console.log('Upload is running');
      break;
  }
},
  (error) => {
      setError(true);
      console.log(error);

  }, 
  () => { 
      getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
           
        //update profile
           await updateProfile(res.user,{
               displayName,
               photoURL: downloadURL,
            });

          //storing the users 
          await setDoc(doc(db, "users", res.user.uid), {
           uid: res.user.uid,
           displayName,
           email,
           photoURL: downloadURL,
          });
          await setDoc(doc(db, "userChats", res.user.uid), {});
          navigate("/");

    });
    


       }
     );//uploading and updating



  }
  catch(err){
    setError(true)

  }

}

  return (
    <div className='formContainer'>
        <div className="formWrapper">
            <span className='logo'>MERC</span>
            <span className='title'>Register</span>

            <form onSubmit={handleSubmit}>
                <input type="text" placeholder='Username' required maxLength="30"/>
                <input type="email" placeholder='email' required maxLength="50"/>
                <input type="password" placeholder='password' pattern=".{8,}" required title="6 characters minimum" maxLength="50"/>
                <input style={{display:'none'}} type="file" id="file"/>
                <label htmlFor="file">
                  <img src={Add} alt="" />
                  <span>Add an avatar</span>
                </label>
                <button>Sign up</button>
                {err && <span>Error occured...(Email already exists)</span>}
            </form>
            <p>Already have an account? <Link to="/login">Login</Link></p>

        </div>
    </div>
  )
}

export default Register