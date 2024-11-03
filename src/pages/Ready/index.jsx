import React, { useState, useContext, useRef, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Link,
  TextField,
} from "@mui/material";
import UAParser from "ua-parser-js";
import './Ready.css';
import icon from '../../assets/icon.jpg'
import hotkeys from "hotkeys-js";

import { Link as RouterLink, useNavigate } from "react-router-dom";
import { SessionContext } from "contexts/Session";
//  import {
//    getDefaults,
//   getKeyBinds,
//   getModifier,
//    getSettings,
//   generateTestInstruction,
//  } from "libs/speech/utils";
//import p5 from "p5";
//import "p5.js-speech/lib/p5.speech";

const os = new UAParser().getOS();
// const SETTINGS = getSettings();
// const listeningKeys = getModifier(SETTINGS, false, false);
// const defaults = getDefaults();

function Ready() {
  const navigate = useNavigate();
  function handleContinue(e) {
    console.log(_PID);

    if (!_PID) {
      e.preventDefault();
      setError("You have not entered the participant code.");
      setTimeout(function () {
        setError("");
      }, 5000);

      return;
    }
    setPID(_PID);
    navigate("/presurvey");
  }
  const ariaLiveEl = useRef(null);
  const [_PID, _setPID] = useState("");
  const [error, setError] = useState(""); // to show an error message
  const { setPID } = useContext(SessionContext);
  // const instruction = generateTestInstruction(defaults.triggers, SETTINGS);
  // console.log("instruction, ", instruction, defaults);
  function handleChange(event) {
    _setPID(event.target.value);
  }
  const echo = (text) => {
    if (!ariaLiveEl.current) {
      return;
    }
    if (!os.name.includes("Mac OS")) {
      ariaLiveEl.current.setAttribute("role", "alert");
    }
    ariaLiveEl.current.innerHTML = text;
  };
  useEffect(() => {
    const hotkeyScope = "practice";
    hotkeys.setScope(hotkeyScope);
    // console.log(
    //   "bind key",
    //   getKeyBinds(listeningKeys, defaults.triggers.mainKey)
    // );
    hotkeys(
      // getKeyBinds(listeningKeys, defaults.triggers.mainKey),
      hotkeyScope,
      (event) => {
        event.preventDefault();
        console.log("callback called");
      }
    );

    return () => {
      console.log("removing hotkeys:", hotkeyScope);
      hotkeys.deleteScope(hotkeyScope);
    };
  }, []);

  const focusEl = useRef(null);
  useEffect(() => {
    focusEl.current.focus();
  }, []);

  return (
    <div className="lead2">
        <header className="header">
        <img src={icon} alt="Icon" className="header-icon" />
      <nav className="header-nav">
      </nav>
    </header>
      <Typography mt={3} variant="h3" ref={focusEl} tabIndex={-1}>
        Getting Started!
      </Typography>
     

      <p>
To begin, please enter the participant code that was assigned to you in the text box below. This unique code helps us keep track of your progress and ensures that your scores are accurately recorded. If you have any trouble finding your participant code, please refer to the email or message you received prior to this event.
</p>
<Typography mt={3} variant="h3" ref={focusEl} tabIndex={-1}>
        Next Steps
      </Typography>

      <p>
Once you have entered your participant code, click the "Continue" button to proceed. You will then be prompted to populate your demographic information. This information is essential for us to tailor the game experience and analyze the results effectively. Rest assured, all demographic data will be kept confidential and used solely for the purpose of this game.
Why Demographic Information Matters
Collecting demographic information allows us to create a more inclusive and personalized trivia experience. It helps us understand the diverse backgrounds of our participants, which can enhance the relevance of the trivia questions and foster a sense of community among players. Additionally, this data will enable us to analyze trends and preferences in trivia topics, helping us improve future games.
</p>

<Typography mt={3} variant="h3" ref={focusEl} tabIndex={-1}>
      Ready to Play?
      </Typography>
      <p>

Once you've completed the demographic section, you'll be all set to dive into the trivia questions! Prepare for an exciting challenge that will test your knowledge on various subjects, from basic English Language and Mathematics to General Questions. Remember, this is all about having fun and learning something new along the way.
Thank you for participating, and we look forward to seeing how well you perform in this trivia challenge!
      </p>

      <TextField
        fullWidth
        label="Enter Your Participant Code Here to Begin"
        variant="outlined"
        value={_PID}
        onChange={handleChange}
      />

      <Typography variant="subtitle1" color="error" aria-live="assertive">
        {error}
      </Typography>

      <Box mt={5}>
        <Button variant="contained" fullWidth onClick={handleContinue} sx={{
          backgroundColor: '#f3bb68', // Custom background color
          color: '#fff',              // Custom text color
          '&:hover': {
              backgroundColor: '#287c5c', // Custom hover color
          },
      }}>
          Continue to Demographic Survey
        </Button>
      </Box>
    </div>
  );
}

export default Ready;
