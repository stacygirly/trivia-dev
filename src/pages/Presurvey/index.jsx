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
import './Presurvey.css';
import icon from '../../assets/icon.jpg'
function Presurvey() {
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
      "successfully saving the background survey response",
      questions
    );
    setBackground(questions);
    navigate('/tutorial/0');
  }
  const focusEl = useRef(null);
  useEffect(()=>{
    focusEl.current.focus();
  },[])

  const { PID, setBackground } = useContext(SessionContext);
  // console.log(PID);
  // const baseURL = process.env.PUBLIC_URL;
  const [forceContinue, setForceContinue] = useState(false);
  const [error, setError] = useState(""); // to show an error message
  const [questions, setQuestions] = useState([
    {
      prompt: "Please select your gender.",
      type: "radiogroup",
      response: "",
      options: [
        "Female",
        "Male",
        "Other",
        "Prefer not to answer"
      ],
    },
    {
      prompt: "Select your age group.",
      type: "radiogroup",
      response: "",
      options: [
        "9-14",
        "15-19",
        "Prefer not to answer"
      ],
    },
    {
      prompt: "Which one of the following best describes your current educational level?",
      type: "radiogroup",
      response: "",
      options: [
        "Grade 9",
        "Grade 8",
        "Grade 7",
        "Other",
      ],
    },
    // {
    //   prompt: "Question 2",
    //   type: "checkbox",
    //   response: [false, false, false, false, false],
    //   options: ["Option1", "Option2", "Option3", "Option4", "Option5"],
    // },
    {
      prompt:
        "Other",
      type: "comment",
      response: "N/A",
    },
    {
      prompt:
        "If you have played a trivia game before, how would you rate your level of experience?",
      type: "radiogroup",
      response: "",
      options: [
        "Basic",
        "Intermediate",
        "Advanced",
        "Expert",
      ],
    },
    {
      prompt:
        "On a scale of 5 (low - 1 and high - 5), how would you rate your knowledge of mathematics?",
      type: "radiogroup",
      response: "",
      options: [
        "Not applicable",
        "1",
        "2",
        "3",
        "4",
        "5",
      ],
    },
    {
      prompt:
        "On a scale of 5 (low - 1 and high - 5), how would you rate your knowledge of English?",
      type: "radiogroup",
      response: "",
      options: [
        "Not applicable",
        "1",
        "2",
        "3",
        "4",
        "5",
      ],
    },
    {
      prompt:
        "On a scale of 5 (low - 1 and high - 5), how would you rate your General Knowledge?",
      type: "radiogroup",
      response: "",
      options: [
        "Not applicable",
        "1",
        "2",
        "3",
        "4",
        "5",
      ],
    },
    {
      prompt: "How would you describe your experience with trivia games if you had played them before?",
      type: "radiogroup",
      response:"",
      options: ["Excellent", "Good", "Average", "Fair", "Poor", "Not applicable"]
    },
    {
      prompt:
        "On average how many trivia games have you attempted?",
      type: "radiogroup",
      response: "",
      options: [
        "Not applicable",
        "1-5",
        "6-10",
        "10+",
      ],
    },

    {
      prompt:
        "Mention the names of the trivia games you have played in the past",
      type: "comment",
      response: "",
      options: [
        "",
      ],
    },

    {
      prompt:
        "What did you find difficult while playing trivia game in the past?",
      type: "comment",
      response: "",
      options: [
        "",
      ],
    },
  ]);

  function handleChange(questions) {
    console.log("questions", questions);
    setQuestions(questions);
  }

  return (
    <React.Fragment>
      {/* {PID === '' && <Navigate to={baseURL} replace={true} />} */}
      <div className="lead3">
        <header className="header">
      <img src={icon} alt="Icon" className="header-icon" />
      <nav className="header-nav">
      </nav>
    </header>
        <Typography mt={3} variant="h3"  ref={focusEl} tabIndex={-1} gutterBottom>
          Background Survey
        </Typography>
        <p>This background survey will help us to collect basic data about our participants. Please fill in your details to continue to the game setup.</p>
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
            Next
          </Button>
        </Box>
      </div>
    </React.Fragment>
  );
}

export default Presurvey;
