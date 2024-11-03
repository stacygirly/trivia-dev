import React, { useState, useContext, useEffect, useRef } from "react";
import { Box, Container, Typography, Tabs, Tab, Button, Grid} from "@mui/material";
import Questionnaire from "components/Questionnaire";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { SessionContext } from "contexts/Session";
import './Tutorial.css';
import icon from '../../assets/icon.jpg';
// import {
//   generateExplanation,
//   getDefaults,
//   getSettings,
// } from "libs/speech/utils";
import toTitleCase from "utils/toTitleCase.js";

// const SETTINGS = getSettings();
// const defaults = getDefaults();

function Tutorial() {
  // const baseURL = process.env.PUBLIC_URL;
  const params = useParams();
  const navigate = useNavigate();
    console.log(params);
  const { setup, setTutorialResponse, setLog } = useContext(SessionContext);
    console.log("setup", setup);
  const config = !setup ? null : setup[params.stage];
    console.log("config", config);
  const [status, setStatus] = useState("preview");

  const taskEl = useRef(null);
  const focusEl = useRef(null);
  const btnEl = useRef(null);


  useEffect(() => {
    // console.log("focus:", focusEl.current);
    if (focusEl.current) {
      focusEl.current.focus();
    }
  }, [config]);

  useEffect(() => {
    console.log("status", status);
    if (status === "question" && taskEl.current) {
      taskEl.current.focus();
    }
    if (status === "complete" && btnEl.current) {
      btnEl.current.focus();
    }
  }, [status]);

  const table = [
 
    {
      prompt: "Adam is 10 years younger than Hope. Currently, Adam is 16 years old. How old is Hope?",
      type: "radiogroup",
      response: "",
      answer: "26",
      options: [
        "26",
        "16",
        "12",
        "None of the above is the correct answer"
      ],
    },
    {
      prompt:
        "How many sides are there in a triangle?",
      type: "radiogroup",
      response: "",
      answer: "3",
      options: [
        "1",
        "4",
        "2",
        "3",
        "None of the above is the correct answer"
      ],
    },
    {
      prompt: "How much money does Fred need to buy the 3rd item if the total cost of three  items is $30 and he has paid for two items with $20?",
      type: "radiogroup",
      response: "",
      answer: "$10",
      options: [
        "$1",
        "&5",
        "$10",
        "None of the above is the correct answer"
      ],
    },
  ];
  const structured = [
      
    {
      prompt: "Spell contraindications backwards; remove the first three letters and the last two letters. Add the letter e after the 8th word. What is the final word?",
      type: "radiogroup",
      response: "",
      answer: "itacidnieartn",
      options: [
        "itacidnieartn",
        "snoitacidniartnoc",
        "itacidnieartn",
        "itacidnieartn",
        "None of the above is the correct answer",
      ],
    },
    {
      prompt:
        "How many layers are there in total? If the first layer contains triple the second layer, the second layer contains quadruple the third layer, the third layer contains double the fourth layer, and the fourth layer contains 120 layers?",
      type: "radiogroup",
      response: "",
      answer: "4200",
      options: [
        "4000",
        "3600",
        "2500",
        "4200",
        "None of the above is the correct answer",
      ],
    },
    {
      prompt:
        "A basket contains 500 apples. How many apples are left in the basket if two-thirds of the apples go bad and 14 are sold out?",
      type: "radiogroup",
      response: "",
      answer: "153",
      options: [
        "33",
        "12",
        "133",
        "153",
        "None of the above is the correct answer",
      ],
    },
  ];

  const speech = [
       {
      prompt:
        "What is the first letter in the word “Patience”?",
      type: "radiogroup",
      response: "",
      answer: "P",
      options: [
        "A",
        "P",
        "T",
        "I",
        "None of the above is the correct answer",
      ],
    },
    {
      prompt:
        "What is the sum of two numbers 2 and 3?",
      type: "radiogroup",
      response: "",
      answer: "5",
      options: [
        "5",
        "1",
        "2",
        "3",
        "None of the above is the correct answer",
      ],
    },
    {
      prompt:
        "How many words are in the sentence: “I am very happy?",
      type: "radiogroup",
      response: "",
      answer: "4",
      options: [
        "1",
        "2",
        "3",
        "4",
        "None of the above is the correct answer",
      ],
    },
  ];
  const questionPool = {
    table,
    structured,
    speech,
  };
  const questions = config ? questionPool[config.method] : []; //[params.stage];
  const [curResp, setCurResp] = useState();
  const [responses, setResponses] = useState([]);
  const [curQIdx, setCurrQIdx] = useState(0);
  const [currQuestion, setCurrQuestion] = useState([]);
  const [startTime, setStartTime] = useState();
  const [error, setError] = useState("");

  function nextQuestion() {
    // console.log("nextQuestion", curResp);
    const incomplete =
      !curResp ||
      [curResp].some((q) =>
        q.type === "checkbox"
          ? q.response.every((r) => r === false)
          : q.response === ""
      );

    if (incomplete) {
      setError("You have unanswered questions.");
      setTimeout(() => {
        setError("");
      }, "3000");
      return;
    }
    const incorrect =
      !curResp ||
      [curResp].some((q) =>
        q.type === "checkbox"
          ? q.response.every((r) => !q.answer.includes(r))
          : q.response !== q.answer
      );
    if (incorrect) {
      setError(
        "You have incorrect response. You need to choose the right answer in this tutorial before moving onto the actual task."
      );
      setTimeout(() => {
        setError("");
      }, "3000");
      return;
    }
    // compute the response time and update
    const newIdx = curQIdx + 1;
    // compute time span
    const timespan = new Date().getTime() - startTime;
    console.log("response, timespan", curResp, timespan);
    setResponses(responses.concat({ response: curResp, timespan }));

    setTimeout(function () {
      setError("");
    }, 3000);

    if (newIdx >= questions.length) {
      setStatus("complete");
    } else {
      // start a new question
      setCurrQIdx(newIdx);
      setCurrQuestion([questions[newIdx]]);
      setCurResp(null);
      // timer reset
      setStartTime(new Date().getTime());
    }
  }
  function startPractice() {
    setStatus("question");
    setCurrQIdx(0);
    setCurrQuestion([questions[0]]);
    // start timer
    console.log("start timing");
    setStartTime(new Date().getTime());
    //set focus to task question
  }

  function skipPractice() {
    console.log(`/task/${params.stage}`);
    navigate(`/task/${params.stage}`);
  }

  function handleResponse(responses) {
    const response = responses[0]; // save this
    console.log("response", response);
    setCurResp(response);
  }
  function handleContinue() {
    setTutorialResponse(responses, params.stage);
    navigate(`/task/${params.stage}`);
  }
  function handleLog(name, data, datetime) {
    setLog({
      stage: params.stage,
      chart: "tutorial",
      method: config.method,
      name,
      data,
      datetime,
    });
  }
  function renderStimuli(config) {
    switch (config.method) {
      case "table":
        // return <BasicTutorial onLog={handleLog} />;
      case "structured":
        // return <StructuredTutorial onLog={handleLog} />;
      case "speech":
        // return <SpeechTutorial onLog={handleLog} />;
      default:
        return;
    }
  }
  function renderMethodName(config) {
    switch (config.method) {
      case "table":
        return "data table";
      case "structured":
        return "structured navigation";
      case "speech":
        return "speech interaction";
    }
  }
  function renderExplanation(config) {
    switch (config.method) {
      case "table":
        return (
          <p>
            For the data table method, you can use your screen reader to read a
            text alternative to the chart (alt text) when your tab-focus is on
            the chart image. To navigate through the underlying data of the
            chart, a corresponding data table is provided below the chart. You
            can use your screen reader to browse through the data table. You can
            sort the table by clicking the headers.
          </p>
        );
      case "structured":
        return (
          <div>
            <p>
              For the structured navigation method, you use the arrow keys of
              your keyboard to navigate through different layers of the chart.
              Each layer has a different level of detail and you can move
              between the levels using "up" and "down" arrow keys. At the top
              layer, you have the chart summary. When you press "down", you will
              have a chart encoding layer such as a horizontal axis, vertical
              axis, or color legend. Below, you have data groups and individual
              data values.
            </p>
            <p>
              At each layer, you can press "left" and "right" to navigate across
              the same level, such as switching between different axes and
              legend or moving between data groups and individual data points.
            </p>
            <p>
              Press the tab key to navigate to the chart where you hear the
              following prompt: "Please use the arrow keys or WASD keys to
              navigate this chart object."
            </p>
            <p>
              To use arrow keys without conflict, you may need to turn on/off a
              certain mode in your screen reader, and you may not use trackpad
              navigation. Here is a way to configure the setting depending on
              your screen reader:
            </p>
            <ul>
              <li>
                VoiceOver: Quick nav toggle (press left/right at the same time).
              </li>
              <li>
                Trackpad commander: hold VO keys and rotate two fingers on the
                trackpad
              </li>
              <li>Windows Narrator: Scan mode off (CapsLock + Spacebar)</li>
              <li>
                NVDA: Focus mode (Insert + Spacebar). Sometimes CapsLock instead
                of Insert!
              </li>
              <li>
                JAWS: Forms mode (press enter on the application element;
                exiting forms mode: esc and numpad plus)
              </li>
            </ul>
            <p>
              If the arrow keys still do not work, you can try WASD keys
              instead. Please ask for help from the researcher if you run into
              issues.
            </p>
          </div>
        );
      case "speech":
        return (
          <div>
            <p>
              For the speech interaction method, you may use your microphone to
              ask questions about the chart. If a pop up window appears, asking
              for permission to use your microphone, please allow access. Please
              also keep in mind that the system might still has some
              limitations.
            </p>

            <ol>
              <li>
                The system can look up specific values, it can find the highest
                or lowest values, it can provide average, median, or total sum
                of values, and it can give you a summary of the chart.
              </li>
              <li>
                Your questions must contain keywords which the system can
                understand. The keywords include the charts category labels and
                numeric variable names.
              </li>
            </ol>

            {/* For the speech interaction method, you can press a key-combination
              to ask questions about the chart. First, try to listen to the
              summary of the chart to understand what is presented and then ask
              more specific questions. The speech method is quite limited at
              this point. It can only answer simple value look up, extrema
              questions such as maximum and minimum, and aggregate operations
              such as average, median, and total sum. */}

            <p>
              You can ask <i>"What is the summary of the chart?"</i>, to hear
              all category labels and variable names.
            </p>
            <Typography id="possible-questions" variant="h5" gutterBottom>
              Examples of possible questions
            </Typography>
            <ul aria-labelledby="possible-questions">
              <li>What is the summary of the chart?</li>
              <li>
                <i>What is the case value of the United state?</i>
              </li>
              <li>
                <i>Which country has the lowest covid case?</i>
              </li>
              <li>
                <i>What is the average case in Asia?</i>
              </li>
              <li>
                <i>What is the total case of Europe?</i>
              </li>
            </ul>
            <Typography id="unsupported-questions" variant="h5" gutterBottom>
              Examples of unsupported questions
            </Typography>
            <ul aria-labelledby="unsupported-questions">
              <li>
                <i>"What countries are depicted in the chart?"</i> : This
                contextual question currently does not work but you may ask for
                the summary containing the same information.
              </li>
              <li>
                <i>"Are there more cases in the United States or in Canada?"</i>
                : This comparative query currently does not work as it requests
                multiple queries at once.
              </li>
              <li>
                <i>"What is the covid case of America?"</i>: This value lookup
                does not work as there are multiple countries in America.
                Instead, use the keyword "total" and ask{" "}
                <i>"what is the total covid case of America?</i>"
              </li>
            </ul>
            {/* <p>{generateExplanation(defaults.triggers, SETTINGS)}</p> */}
          </div>
        );
      default:
        return;
    }
  }
  return (
    config && (
      <React.Fragment>
            <div className="lead4">
        <header className="header">
        <img src={icon} alt="Icon" className="header-icon" />
      <nav className="header-nav">
      </nav>
    </header>
            <Typography mt={3} variant="h3" ref={focusEl} tabIndex={-1}>
            Begin Tutorial
            </Typography>
            {status === "preview" && (
              <p>
                This tutorial is designed to help you become familiar with trivia games and the specific mechanics of our trivia experience. Whether you're a seasoned trivia enthusiast or a newcomer to this type of game, this guide will provide you with the information you need to navigate the game effectively and enjoyably.
                In this tutorial, you will engage with a series of sample questions that mimic the actual trivia game format. These questions will cover a variety of topics, giving you a taste of what to expect during the main experiment. As you interact with each question, pay attention to the structure, timing, and response options available. This will help you understand how to approach the real trivia challenges you'll face later on.
                Take your time as you go through the tutorial questions. Each question is an opportunity to practice your answering skills and familiarize yourself with the interface. Here are some key aspects to focus on:
                <ul>
                <li> <strong> Question Format: </strong> Notice how questions are presented. Some may be multiple-choice, while others might require you to type in your answer. Understanding these formats will help you respond more confidently during the actual game </li>
                <li> <strong>Time Limits: </strong> Be aware of any time constraints associated with each question. The main experiment will have a timer that adds an element of excitement and challenge. Practicing under these conditions will help you manage your time effectively </li>
                <li><strong>Feedback Mechanism: </strong> After answering each question, you'll receive immediate feedback on whether your answer was correct or incorrect. This feature is designed to enhance your learning experience by reinforcing correct knowledge and addressing any misconceptions</li>
                </ul>
            </p>
            )}
           
            <Typography mt={3} variant="h3" ref={focusEl} tabIndex={-1}>
            
            </Typography>
            {status === "preview" && (
              <p>
                Once you've completed the tutorial and feel comfortable with the format and mechanics of the trivia game, you'll be ready to dive into the main game! We hope this experience enhances your enjoyment of trivia games and helps you achieve great success in the upcoming challenges. Happy playing!
              </p>
              
            )}
            {status === "complete" && (
              <p>
                You are done with the tutorial! Great job on completing this introductory session and familiarizing yourself with the trivia game mechanics. Your engagement and practice will undoubtedly enhance your performance in the main experiment.
                Now that you have a solid understanding of how the trivia game works, it's time to put your skills to the test in the main experiment. Here’s what you can expect as you transition:
                <ul>
                <li> <strong> New Challenges:: </strong>  The main experiment will feature a fresh set of questions that may vary in difficulty and topics. Be prepared to think critically and apply what you’ve learned during the tutorial. </li>
                <li> <strong>Scoring and Competition: </strong> Your performance will be tracked, and you’ll compete against other participants. Keep an eye on your score as well as the leaderboard, if applicable, to see how you stack up against others </li>
                <li><strong>Time Limits: </strong> Remember to manage your time wisely. Some questions may have stricter time constraints than those in the tutorial, so stay focused and pace yourself.</li>
                <li><strong>Engagement: </strong> Stay engaged throughout the experiment! Each question is an opportunity not just to score points but also to learn something new.</li>
                </ul>
              <h1>Ready to Start?</h1>
              If you're ready, click the button below to begin the main experiment. We can't wait to see how well you do! Good luck!
              </p>
            )}
            {status === "question" && (
              <>
                <Typography ref={taskEl} tabIndex={-1} variant="h4" gutterBottom>
                  {/* How to Use {toTitleCase(renderMethodName(config))} */}
                </Typography>
                {/* {renderExplanation(config)} */}
                <Typography variant="h4" gutterBottom>
                  {/* {toTitleCase(renderMethodName(config))} */}
                </Typography>
                {/* {renderStimuli(config)} */}
              </>
            )}
            {status === "question" && (
              <Box mt={5} aria-live="polite">
                <Typography variant="h4">
                  {`Tutorial Question (${curQIdx + 1} of ${questions.length})`}
                </Typography>

                <Questionnaire
                  ariaLive={"polite"}
                  questions={currQuestion}
                  onChange={handleResponse}
                />
              </Box>
            )}
            <Box p={3}>
              <Typography variant="subtitle1" color="error" aria-live="assertive">
                {error}
              </Typography>
            </Box>
            <Box mt={5} mb={5}>
              {status === "question" && (
                <Button style={{ width: '25%', alignItems: 'center'}} variant="contained" fullWidth onClick={nextQuestion} sx={{
                  backgroundColor: '#f3bb68', // Custom background color
                  color: '#fff',              // Custom text color
                  '&:hover': {
                      backgroundColor: '#287c5c', // Custom hover color
                  },
              }}>
                  {curQIdx === questions.length - 1
                    ? "Complete Task"
                    : "Next Question"}
                </Button>
              )}
              {status === "preview" && (
                <div style={{ display: 'flex', flexDirection: 'row', gap: '50%' }} >
                  <Button style={{ width: '25%', }} variant="contained" fullWidth onClick={skipPractice} sx={{
          backgroundColor: '#f3bb68', // Custom background color
          color: '#fff',              // Custom text color
          '&:hover': {
              backgroundColor: '#287c5c', // Custom hover color
          },
      }}>
                    Skip Tutorial
                  </Button>

                  <Button style={{ width: '25%' }} variant="contained" fullWidth onClick={startPractice} sx={{
          backgroundColor: '#f3bb68', // Custom background color
          color: '#fff',              // Custom text color
          '&:hover': {
              backgroundColor: '#287c5c', // Custom hover color
          },
      }}>
                    Start Turotial
                  </Button>
                </div>

              )}
              {status === "complete" && (
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleContinue}
                  ref={btnEl}
                  tabIndex={-1}
                  style={{ width: '25%', }}
                  sx={{
                    backgroundColor: '#f3bb68', // Custom background color
                    color: '#fff',              // Custom text color
                    '&:hover': {
                        backgroundColor: '#287c5c', // Custom hover color
                    },
                }}
                >
                  Start the Main Game
                </Button>
              )}
            </Box>
          </div>
      </React.Fragment>
    )
  );
}

export default Tutorial;
