import React, { useContext, useState } from 'react';
import Img  from "../img/img.png";
import Attach from "../img/attach.png";
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { doc, updateDoc, arrayUnion, arrayRemove, Timestamp, serverTimestamp } from "firebase/firestore";
import { db, storage } from '../firebase';
import {v4 as uuid} from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const Input = () => {

  const {currentUser} = useContext(AuthContext)
  const {data} = useContext(ChatContext)
  const [text,setText] = useState("")
  const [img,setImg] = useState(null);

  const handleSend = async()=>
  {
    if(text){
        if(img){
          const storageRef = ref(storage, uuid());
         const uploadTask = uploadBytesResumable(storageRef, img);
         
         
         uploadTask.on('state_changed', 
  
         (snapshot) => {
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
             //error handler
        
          }, 
          () => {
            console.log(currentUser.uid);
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                  id: uuid(),
                  text,
                  senderId: currentUser.uid,
                  date: Timestamp.now(),
                  img: downloadURL,
                }),
              });
            });
          }


         );//upload task on
        
        
        }
        else{
          // appending the message to the messages array of the database
          await updateDoc(doc(db, "chats", data.chatId), {
            messages: arrayUnion({
              id: uuid(),
              text,
              senderId: currentUser.uid,
              date: Timestamp.now(),
            }),
          });
        }


  // adding the lastMessage and updating the data for the currentUser
  await updateDoc(doc(db, "userChats", currentUser.uid), {
    [data.chatId + ".lastMessage"]: {
      text,
    },
    [data.chatId + ".date"]: serverTimestamp(),
  });

// adding the lastMessage and updating the date in userChats
await updateDoc(doc(db, "userChats", data.user.uid), {
  [data.chatId + ".lastMessage"]: {
    text,
  },
  [data.chatId + ".date"]: serverTimestamp(),
});

    }
setText("");
setImg(null);


}


  return (
    <div className="input">
    <input
      type="text"
      placeholder="Type something..."
      onChange={(e) => setText(e.target.value)}
      value={text}
    />
    <div className="send">
      <img src={Attach} alt="" />
      <input
        type="file"
        style={{ display: "none" }}
        id="file"
        onChange={(e) => setImg(e.target.files[0])}
      />
      <label htmlFor="file">
        <img src={Img} alt="" />
      </label>
      <button onClick={handleSend}>Send</button>
    </div>
  </div>
  )
}

export default Input