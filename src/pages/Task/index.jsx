import React, { useState, useContext, useRef, useEffect } from "react";
import { Box, Container, Typography, Tabs, Tab, Button } from "@mui/material";

import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { SessionContext } from "contexts/Session";

import Questionnaire from "components/Questionnaire";
import { taskQuestions } from "./questions.js";
import './Task.css';
import icon from '../../assets/icon.jpg';

import shuffleArray from "utils/shuffleArray";
import toTitleCase from "utils/toTitleCase.js";

// const SETTINGS = getSettings();
// const defaults = getDefaults();
const TOTAL_MAIN_TASK_TIME = 100; // 10 minutes

// Custom hook for managing the question timer
function useQuestionTimer(maxTime, handleTimerComplete) {
  const [remainingTime, setRemainingTime] = useState(maxTime);
  const [isTicking, setTicking] = useState(false);
  const timerIdRef = useRef(null);

  const startTimer = () => {
    timerIdRef.current = setInterval(() => {
      setRemainingTime(prevTime => {
        if (prevTime === 0) {
          clearInterval(timerIdRef.current);
          handleTimerComplete();
          return 0;
        } else if (prevTime <= maxTime * 0.3) {
          setTicking(true);
          setTimeout(() => setTicking(false), 200);
          return prevTime - 1;
        } else {
          setTicking(false);
          return prevTime - 1;
        }
      });
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerIdRef.current);
    timerIdRef.current = null;
  };

  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, []);

  return { remainingTime, isTicking, startTimer, stopTimer };
}



function Task() {

  // const baseURL = process.env.PUBLIC_URL;
  const params = useParams();
  const navigate = useNavigate();
  console.log(params);
  const { setup, setTaskResponse, setLog } = useContext(SessionContext);
  console.log("setup", setup);
  const config = setup.length === 0 ? null : setup[params.stage];
  console.log("config", config);
  const [status, setStatus] = useState("preview");

  const questions = !config ? null : taskQuestions[config.chart];
  console.log("task questions", questions);

  const [curResp, setCurResp] = useState("");
  const [responses, setResponses] = useState([]);
  const [curQIdx, setCurrQIdx] = useState(0);
  const [currQuestion, setCurrQuestion] = useState([]);

  const [startTime, setStartTime] = useState();
  const [error, setError] = useState("");
  const [isRadioGroupFrozen, setRadioGroupFrozen] = useState(false);

  const focusEl = useRef(null);
  const chartEl = useRef(null);
  const taskEl = useRef(null);
  const btnEl = useRef(null);
  const MAX_QUESTION_TIME = TOTAL_MAIN_TASK_TIME;
  const { remainingTime, isTicking, startTimer, stopTimer } = useQuestionTimer(
    MAX_QUESTION_TIME,
    handleTimerComplete
  );
  const timespan = new Date().getTime() - startTime;


  useEffect(() => {
    // console.log("focus:", focusEl.current);
    if (focusEl.current) {
      focusEl.current.focus();
    }
  }, [config]);

  useEffect(() => {
    if (status === "question" && chartEl.current) {
      chartEl.current.focus();
      startTimer();
      return () => {
        stopTimer();
      };
    }
    if (status === "complete" && btnEl.current) {
      btnEl.current.focus();
    }
  }, [status]);

  useEffect(() => {
    // Check if params.stage is equal to 1
    if (params.stage === '1') {
      setRadioGroupFrozen(true);
      setTimeout(() => {
        setRadioGroupFrozen(false);
      }, 50000);
    } else {
      setRadioGroupFrozen(false);
    }
  }, [params.stage]);
  

  useEffect(() => {
    if (curQIdx > 0 && taskEl.current) {
      taskEl.current.focus();
    }
  }, [curQIdx]);
  

  function nextQuestion() {

    console.log("after validate response - current response", curResp);
    const incomplete =
      !curResp ||
      [curResp].some((q) =>
        q.type === "checkbox"
          ? q.response.every((r) => r === false)
          : q.response === ""
      );
    console.log(" after incomplete logic - current response", curResp);
    console.log("incomplete: ", incomplete);
    if (incomplete) {
      setError("You have unanswered questions.");
      setTimeout(() => {
        setError("");
      }, "3000");
      return;
    }
    if (
      curResp &&
      curResp.minimum &&
      curResp.response.replace(" ", "").length < curResp.minimum
    ) {
      setError(
        `Your response should be a minimum of 150 characters. Your response currently have ${curResp.response.replace(" ", "").length
        } characters.`
      );
      setTimeout(() => {
        setError("");
      }, "3000");
      return;
    }
    // compute the response time and update
    const newIdx = curQIdx + 1;
    // compute time span
    // const timespan = new Date().getTime() - startTime;
    console.log("response, timespan", curResp, timespan);
    setResponses(responses.concat({ response: curResp, timespan }));

    setTimeout(function () {
      setError("");
    }, 3000);


    if (newIdx >= questions.length) {
      setStatus("complete");

    } else {
      // start a new question
      console.log("move to next question, ", newIdx, [questions[newIdx]]);
      setCurrQIdx(newIdx);
      setCurrQuestion([questions[newIdx]]);
      setCurResp(null);
      // timer reset
      setStartTime(new Date().getTime());
    }
  }

  function calculateCorrectness() {
    let correctCount = 0;
    let wrongCount = 0;
    let answeredCount = 0;
    let unansweredCount = 0;

    responses.forEach((responseObj, index) => {
      // Assuming each response object contains 'response' and 'timespan' properties
      const isCorrect = validateResponse(responseObj.response, questions[index].answer);
      if (isCorrect) {
        correctCount++;
      } else {
        wrongCount++;
      }
      answeredCount++;
    });

    return {
      correctCount,
      wrongCount,
      answeredCount,
      unansweredCount: questions.length - answeredCount,
      totalQuestions: questions.length
    };
  }

  // Function to validate response
  function validateResponse(curResp, answer) {
    const incorrect =
      !curResp ||
      [curResp].some((q) =>
        q.type === "checkbox"
          ? q.response.every((r) => !q.answer.includes(r))
          : q.response !== answer
      );
    if (incorrect) {
      return false; // Return false if response is incorrect
    } else {
      return true; // Return true if response is correct
    }
  }


  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  function calculateColor() {
    const percentage = (remainingTime / MAX_QUESTION_TIME) * 100;

    if (percentage <= 30) {
      return '#fc5d3d';
    } else if (percentage <= 70) {
      return 'yellow';
    } else {
      return '#a2f5ae';
    }
  }

  function startTask() {
    console.log("This is the one");
    setStatus("question");
    console.log("startTask question", curQIdx, [questions[0]]);
    setCurrQIdx(0);
    setCurrQuestion([questions[0]]);
    // start timer
    console.log("start timing");
    setStartTime(new Date().getTime());
  }

  function handleResponse(responses) {
    const response = responses[0]; // save this
    console.log("response", response);
    setCurResp(response);
  }
  function handleContinue() {
    const correctness = calculateCorrectness();

    // Include correctness in the responses object
    const responsesWithCorrectness = {
        responses: responses,
        correctness: correctness
    };

    // Send the responses object with correctness included
    setTaskResponse(responsesWithCorrectness, params.stage);
    localStorage.setItem("responseCorrectness", JSON.stringify(correctness));
    console.log("responseCorrectness", JSON.stringify(correctness));
  // setTaskResponse(responses, params.stage);
    navigate(`/results/${params.stage}`);
  }

  function handleTimerComplete() {
    setStatus("complete");
  }

  function renderMethodName(config) {
    switch (config.method) {
      case "table":
        return "";
      case "structured":
        return "";
      case "speech":
        return "";
    }
  }
  function handleLog(name, data, datetime) {
    setLog({
      stage: params.stage,
      chart: config.chart,
      method: config.method,
      name,
      data,
      datetime,
    });
  }
  function renderStimuli(config) {
    switch (config.method) {
      case "table":
        switch (config.chart) {
          case "bar":
            // return <BasicBar onLog={handleLog} />;
          case "line":
            // return <BasicLine onLog={handleLog} />;
          case "map":
            // return <BasicMap onLog={handleLog} />;
          default:
            return;
        }
      case "structured":
        switch (config.chart) {
          case "bar":
            // return <StructuredBar onLog={handleLog} />;
          case "line":
            // return <StructuredLine onLog={handleLog} />;
          case "map":
            // return <StructuredMap onLog={handleLog} />;
          default:
            return;
        }
      case "speech":
        switch (config.chart) {
          case "bar":
            // return <SpeechBar onLog={handleLog} />;
          case "line":
            // return <SpeechLine onLog={handleLog} />;
          case "map":
            // return <SpeechMap onLog={handleLog} />;
          default:
            return;
        }
      default:
        return;
    }
  }

  return (
    config && (
      <React.Fragment>
        <div className="lead5">
        <header className="header">
        <img src={icon} alt="Icon" className="header-icon" />
      <nav className="header-nav">
      </nav>
    </header>
          <Typography mt={3} variant="h3" ref={focusEl} tabIndex={-1}>
            Main Game
          </Typography>
          {status === "preview" && (
            <p>Great job on completing the tutorial! You're now ready to move on to the main experiment. Here's what you need to know:
            In the main experiment, you are expected to answer all questions within the specified time limit.
          <ul>
            <li> Duration: 2 minutes</li>
            <li> Total number of qestions: 7</li>
            </ul>
           <h1> Key Points to Remember:</h1>
           <ul>
<li><strong>Time Management:</strong> With 2 minutes to answer 7 questions, you'll have approximately 17 seconds per question on average. However, some questions may be quicker to answer than others, so manage your time wisely.</li>
<li><strong>Answer All Questions: </strong>Make sure to attempt every question. Even if you're unsure, it's better to make an educated guess than to leave a question unanswered. </li>
<li><strong>Stay Focused:</strong> The main experiment is more challenging than the tutorial. Stay alert and concentrate on each question as it comes. </li>
<li><strong>Read Carefully:</strong> Take the time to read each question thoroughly. In a timed environment, it's easy to misread or overlook crucial details.</li>
<li><strong>Pace Yourself:</strong> While it's important to be mindful of the time, don't rush. A steady, focused approach is often more effective than hurrying through questions.</li>
<li><strong>Use Your Knowledge: </strong>Draw upon what you learned in the tutorial and your own background knowledge to tackle these questions.</li>
<li><strong>Enjoy the Challenge: </strong> Remember, this is an opportunity to test your knowledge and learn new things. Enjoy the experience!</li>
</ul>
<h1>Ready to Begin?</h1>
When you're ready to start the main experiment, click the 'Begin' button below. The 2-minute timer will start as soon as you begin. Good luck!!!
            </p>
            
          )}
          {status === "complete" && (
            <p>
              You are done with the first session! Fantastic job on completing this part of the experiment. Your participation and effort have been invaluable, and we hope you enjoyed the challenge.
<h1>Want to know how well this session went?</h1>
Click the 'Continue' button below to view results.
            </p>
          )}
          {status === "question" && (
            <React.Fragment>
              <Box
                position="fixed"
                top={0}
                right={0}
                p={2}
                borderRadius="5px"
                zIndex={1000}
                // bgcolor={calculateColor()}
                bgcolor={isTicking ? 'white' : calculateColor()}
              >
                <Typography variant="body1">
                  Time remaining: {formatTime(remainingTime)}
                </Typography>
              </Box>
              <Typography variant="h4" gutterBottom ref={chartEl} tabIndex={-1}>
                {toTitleCase(renderMethodName(config))}
              </Typography>
              {renderStimuli(config)}
              <Box mt={5} aria-live="polite">
                <Typography
                  variant="h4"
                  gutterBottom
                  ref={taskEl}
                  tabIndex={-1}
                >
                  {`Main Question (${curQIdx + 1} of ${questions.length})`}
                </Typography>

                <Questionnaire
                  ariaLive={"polite"}
                  questions={currQuestion}
                  onChange={handleResponse}
                  isFrozen={isRadioGroupFrozen}  // To make the radio group froze
                />
              </Box>
            </React.Fragment>
          )}
          <Box p={3}>
            <Typography variant="subtitle1" color="error" aria-live="polite">
              {error}
            </Typography>
          </Box>
          <Box mt={5} mb={5}>
            {status === "question" && (
              <Button variant="contained" fullWidth onClick={nextQuestion} sx={{
                backgroundColor: '#f3bb68', // Custom background color
                color: '#fff',              // Custom text color
                '&:hover': {
                    backgroundColor: '#287c5c', // Custom hover color
                },
            }}>
                {curQIdx === questions.length - 1
                  ? "Complete Session"
                  : "Next Question"}
              </Button>
            )}
            {status === "preview" && (
              <Button variant="contained" fullWidth onClick={startTask} sx={{
                backgroundColor: '#f3bb68', // Custom background color
                color: '#fff',              // Custom text color
                '&:hover': {
                    backgroundColor: '#287c5c', // Custom hover color
                },
            }}>
                Begin Task
              </Button>
            )}
            {status === "complete" && (
              <Button
                variant="contained"
                fullWidth
                onClick={handleContinue}
                ref={btnEl}
                tabIndex={-1}
                sx={{
                  backgroundColor: '#f3bb68', // Custom background color
                  color: '#fff',              // Custom text color
                  '&:hover': {
                      backgroundColor: '#287c5c', // Custom hover color
                  },
              }}>
                Continue to Result
              </Button>
            )}
          </Box>
        </div>
      </React.Fragment>
    )
  );
}

export default Task;
