import React, { useState, useContext,  useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import { Link as RouterLink, Navigate, useNavigate } from "react-router-dom";
import { SessionContext } from "contexts/Session";
import Questionnaire from "components/Questionnaire";
import './Postsurvey.css';
import icon from '../../assets/icon.jpg'
function Postsurvey() {
  const navigate = useNavigate();
  function handleContinue(e) {
    const incomplete = questions.some((q) =>
      q.type === "checkbox"
        ? q.response.every((r) => r === false)
        : q.response === ""
    );

    console.log("moving ", incomplete, forceContinue);
    if (incomplete && !forceContinue) {
      setError("You have unanswered questions.");
      setForceContinue(true);
      return;
    }
    setTimeout(function () {
      setError("");
    }, 5000);

    console.log(
      "successfully saving the post study survey response",
      questions
    );
    setPostSurvey(questions);
    navigate("/thanks");
  }
  const focusEl = useRef(null);
  useEffect(()=>{
    focusEl.current.focus();
  },[])
  const { PID, setPostSurvey } = useContext(SessionContext);
  // console.log(PID);
  // const baseURL = process.env.PUBLIC_URL;
  const [forceContinue, setForceContinue] = useState(false);
  const [error, setError] = useState(""); // to show an error message
  const [questions, setQuestions] = useState([
    {
      prompt: "Overall, how do you feel about the trivia game sessions?",
      type: "radiogroup",
      response: "",
      options: [
        "Confused",
        "Frustrated",
        "Neutral",
        "Happy",
      ],
    },
    {
      prompt: "What do you like about this trivia game?",
      type: "comment",
      response: "",
    },
    {
      prompt: "What do you not like about this trivia game?",
      type: "comment",
      response: "",
    },
    {
      prompt: "Is there anything you would like to improve?",
      type: "comment",
      response: "",
    },
  ]);


  function handleChange(questions) {
    console.log("questions", questions);
    setQuestions(questions);
  }

  return (
    <React.Fragment>
      <div className="lead9">
        <header className="header">
        <img src={icon} alt="Icon" className="header-icon" />
      <nav className="header-nav">
      </nav>
    </header>
        <Typography mt={3} variant="h3"  ref={focusEl} tabIndex={-1} gutterBottom>
          Post Study Survey
        </Typography>
        <p>You have completed three sessions of the trivia game! Congratulations on reaching this milestone! Your participation and engagement have contributed to a dynamic and enjoyable experience for everyone involved.
        <h1>Your Feedback Counts!</h1>
        Your insights will help us refine the trivia game and make it even more enjoyable for future participants. Please take a few moments to complete the survey, as your feedback is crucial in shaping our approach.
        </p>
        <Questionnaire questions={questions} onChange={handleChange} />
        <Box p={3}>
          <Typography variant="subtitle1" color="error" aria-live="assertive">
            {error}
          </Typography>
        </Box>
        <Box mb={5}>
          <Button variant="contained" fullWidth onClick={handleContinue} sx={{
          backgroundColor: '#f3bb68', // Custom background color
          color: '#fff',              // Custom text color
          '&:hover': {
              backgroundColor: '#287c5c', // Custom hover color
          },
      }}>
            Submit my Feedback
          </Button>
        </Box>
      </div>
    </React.Fragment>
  );
}

export default Postsurvey;
