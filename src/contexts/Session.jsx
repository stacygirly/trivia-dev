import React, { useState, useEffect, createContext } from "react";
import localforage from "localforage";
import shuffleArray from "utils/shuffleArray";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import { getStorage, ref, listAll, getDownloadURL, uploadString } from "firebase/storage";


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  // console.log("Google API:", gapi);
  const initialState = {
    progress: "",
    PID: "",
    setup: [],
    // agreement:false,
    background: {},
    tutorials: [],
    tasks: [],
    tasksurveys: [],
    postsurvey: [],
    logs: [],
  };

  useEffect(() => {
    localforage.getItem("session").then((state) => {
      console.log("initializing from local store", state);
      setSession(state);
    });
  }, []);
  const [session, setSession] = useState(initialState);

  const setPID = (PID) => {
    //ref? https://www.dcode.fr/partial-k-permutations
    const methods = shuffleArray(["table", "structured", "speech"]);
    const charts = shuffleArray(["bar", "line", "map"]).slice(0, 3);
    const setup = methods.map((m, i) => ({ chart: charts[i], method: m }));
    const updated = {
      ...initialState, // start from scratch
      PID,
      setup,
      progress: "pid-provided",
      date: new Date().toISOString()
    };
    localforage.setItem("session", updated);
    console.log("session log", updated);
    setSession(updated);
  };
  const setBackground = (background) => {
    const updated = {
      ...session,
      background,
      progress: "background-survey-done",
      date: new Date().toISOString()
    };
    console.log("session log", updated);
    localforage.setItem("session", updated);
    setSession(updated);
  };

  const setStart = () => {
    const updated = {
      ...session,
      progress: "main-phase-started",
      date: new Date().toISOString()
    };
    console.log("session log", updated);
    localforage.setItem("session", updated);
    setSession(updated);
  };
  const setTutorialResponse = (responses) => {
    const updated = {
      ...session,
      // tutorials: session.tutorials.responses.concat([responses]),
      tutorials: {
        ...session.tutorials,
        responses: session.tutorials && session.tutorials.responses ? session.tutorials.responses.concat([responses]) : [responses]
      },
      progress: "tutorial-done",
      date: new Date().toISOString()
    };
    console.log("session log", updated);
    localforage.setItem("session", updated);
    setSession(updated);
  };
  const setTaskResponse = (responses) => {
    const updated = {
      ...session,
      // tasks: session.tasks.concat([responses]),
      tasks: session.tasks.concat([{ responses: responses.responses, correctness: responses.correctness }]),
      progress: "task-done",
      date: new Date().toISOString()
    };
    console.log("session log", updated);
    localforage.setItem("session", updated);
    setSession(updated);
  };
  const setTaskSurveyResponse = (responses) => {
    const updated = {
      ...session,
      tasksurveys: session.tasksurveys.concat([responses]),
      progress: "task-survey-done",
      date: new Date().toISOString()
    };
    console.log("session log", updated);
    localforage.setItem("session", updated);
    setSession(updated);
  };
  const setPostSurvey = async (postsurvey) => {
    const updated = {
      ...session,
      postsurvey,
      progress: "post-survey-done",
      date: new Date().toISOString()
    };
    console.log("session log", updated);
    localforage.setItem("session", updated);

    //save data to firestore database
    try {
      const docRef = await addDoc(collection(db, "sessions"), updated);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    uploadDataToCloud();
    setSession(updated);
  };
  const setLog = (log) => {
    setSession((session) => {
      const updated = {
        ...session,
        logs: session.logs.concat(log),
      };
      console.log("session log", updated);
      localforage.setItem("session", updated);
      return updated;
    });
  };
  const getSessionData = () => {
    return session;
  };
  const uploadDataToCloud = async (filename, jsonDataStr) => {
    try {
      const storageRef = ref(storage, filename); // Create a reference to the file path
      console.log(storageRef);
      console.log(filename);
      console.log(jsonDataStr);
  
      // Upload the string data to the specified path
      await uploadString(storageRef, jsonDataStr, 'data_url');
  
      console.log('File uploaded successfully.');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  const downloadDataFromCloud =  ()=>{
    const listRef = ref(storage, 'session');

    const promise = new Promise((resolve, reject)=>{
      listAll(listRef).then(async (res)=>{
          // resolve(res.items);
          const all = res.items.map(ref=>getDownloadURL(ref));
          const urls = await Promise.all(all);
          
          const responses = await Promise.all(urls.map(url=>fetch(url)));
          // console.log("responses", responses);
          const data = await Promise.all(responses.map(d=>d.json()));
          // console.log("data", data);
          resolve(data);            
          
      }).catch((error) => {
        // error!
        reject(error);
      });
    });
    return promise;
    
  }
  const context = {
    ...session,
    setPID,
    setBackground,
    setStart,
    setTutorialResponse,
    setTaskResponse,
    setTaskSurveyResponse,
    setPostSurvey,
    getSessionData,
    setLog,
    uploadDataToCloud,
    downloadDataFromCloud
  };

  return (
    <SessionContext.Provider value={context}>
      {children}
    </SessionContext.Provider>
  );
};
