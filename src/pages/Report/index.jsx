import React, { useState, useContext, useEffect, useRef } from "react";
import { Box, Container, Typography, Tabs, Tab, Button, Grid } from "@mui/material";

import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { SessionContext } from "contexts/Session";
import './Report.css';
import icon from '../../assets/icon.jpg'

function Report() {
    const focusEl = useRef(null);
    const { stage } = useParams();
    console.log(stage);
    const params = useParams();
    const navigate = useNavigate();
    console.log(params);
    const { setup, setLog } = useContext(SessionContext);
    console.log("setup", setup);
    const config = setup.length === 0 ? null : setup[params.stage];
    console.log("config", config);

    // Retrieve data from local storage
    const responseCorrectness = JSON.parse(localStorage.getItem('responseCorrectness'));

    function skipPractice() {
        console.log(`/tasksurvey/${params.stage}`);
        console.log(params.stage);
        navigate(`/tasksurvey/${params.stage}`);
    }
    // Calculate feedback color based on correct answers count
    let feedbackColor;
    if (responseCorrectness.correctCount / 7 >= 0.70) {
        feedbackColor = "green";
    } else if (responseCorrectness.correctCount / 7 >= 0.40) {
        feedbackColor = "blue";
    } else {
        feedbackColor = "red";
    }

    return (
        <React.Fragment>
            <div className="lead6">
        <header className="header">
        <img src={icon} alt="Icon" className="header-icon" />
      <nav className="header-nav">
      </nav>
    </header>
                <Typography mt={3} variant="h3" ref={focusEl} style={{}} tabIndex={-1}>
                    Performance Report
                </Typography>
                           <ul style={{fontSize: '25px'}}>
                    <li>
                        <strong> Number of questions answered: {responseCorrectness.answeredCount} </strong>
                    </li>
                    <li>
                        <strong> Number of questions unasnwered: {responseCorrectness.unansweredCount} </strong>
                    </li>
                    <li>
                        <strong> Number of questions wrong: {responseCorrectness.wrongCount} </strong>
                    </li>
                    <li>
                        <strong> Number of questions right: {responseCorrectness.correctCount} </strong>
                    </li>
                    <li>
                        <strong> Feedback: </strong>
                        <span style={{ color: feedbackColor }}>
                            {feedbackColor === "green" && <strong>Good</strong>}
                            {feedbackColor === "yellow" && <strong>Average</strong>}
                            {feedbackColor === "red" && <strong>Poor</strong>}
                        </span>
                    </li>
                </ul>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '50%' }} >
                    <Button style={{ width: '25%', }} variant="contained" fullWidth onClick={skipPractice} sx={{
          backgroundColor: '#f3bb68', // Custom background color
          color: '#fff',              // Custom text color
          '&:hover': {
              backgroundColor: '#287c5c', // Custom hover color
          },
      }}>
                        Continue
                    </Button>
                                   </div>
            </div>
        </React.Fragment>
    )
}

export default Report;
