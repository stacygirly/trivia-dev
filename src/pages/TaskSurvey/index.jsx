import React, { useState, useContext,  useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
} from "@mui/material";
import './TaskSurvey.css';
import icon from '../../assets/icon.jpg';
import {
  Link as RouterLink,
  useNavigate,
  useParams,
} from "react-router-dom";
import { SessionContext } from "contexts/Session";
import Questionnaire from "components/Questionnaire";

function TaskSurvey() {
  const navigate = useNavigate();
  // const baseURL = process.env.PUBLIC_URL;
  const params = useParams();
  //   console.log(params);
  const { setup, setTaskSurveyResponse } = useContext(SessionContext);
  const config = setup.length === 0 ? null : setup[params.stage];
  console.log("config", config);
  const focusEl = useRef(null);
  useEffect(()=>{
    focusEl.current.focus();
  },[])
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
    setTaskSurveyResponse(questions, params.stage);

    if (params.stage == 2) {
      navigate("/postsurvey");
    } else {
      navigate(`/tutorial/${parseInt(params.stage) + 1}`);
    }
  }
  const [forceContinue, setForceContinue] = useState(false);
  const [error, setError] = useState(""); // to show an error message
  const [questions, setQuestions] = useState([
    {
      prompt: "Overall, how would you rate your experience with the session?",
      type: "radiogroup",
      response: "",
      options: [
        "Excellent",
        "Good",
        "Neutral",
        "Fair",
        "Poor",
      ],
    },
    {
      prompt: "How would you describe your emotional experience from the first session?",
      type: "radiogroup",
      response: "",
      options: [
        "Frustrating",
        "Confusing",
        "Neutral",
        "Enjoyable",
      ],
    },
    {
        prompt: "How would you rate the difficulty level of the questions?",
        type: "radiogroup",
        response: "",
        options: [
          "Very difficult",
          "Somewhat difficult",
          "Neutral",
          "Somewhat easy",
          "Very easy",
        ],
      },
      {
          prompt: "How would you rate your performance?",
          type: "radiogroup",
          response: "",
          options: [
            "Excellent",
            "Good",
            "Neutral",
            "Fair",
            "Poor",
          ],
        },
       
          {
            prompt: "How can we improve this session in the future, can you please share your thoughts?",
            type: "comment",
            minimum: 6,
            maximum: 150,
            response: "",
            answer: "",
          },
      
  ]);

  function handleChange(questions) {
    console.log("questions", questions);
    setQuestions(questions);
  }

  return (
    <React.Fragment>
       <div className="lead7">
        <header className="header">
        <img src={icon} alt="Icon" className="header-icon" />
      <nav className="header-nav">
      </nav>
    </header>
        <Typography mt={3} variant="h3"   ref={focusEl} tabIndex={-1} >
          Post Task Survey
        </Typography>
        <p style={{fontSize: '18px', fontWeight: 'bold'}}>
        Please rate your experience from the previous session
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
            Next
          </Button>
        </Box>
      </div>
    </React.Fragment>
  );
}

export default TaskSurvey;
