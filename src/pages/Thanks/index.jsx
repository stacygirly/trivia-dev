import React, { useState, useContext, useEffect, useRef } from "react";
import './Thanks.css';
import icon from '../../assets/icon.jpg'
import {
  Box,
  // TextField,
  // InputLabel,
  // Input,
  // FormHelperText,
  // FormControl,
  Container,
  Typography,
  Button,
  Chip,
  // List,
  // ListItem,
  // ListItemButton,
} from "@mui/material";
// import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import { useNavigate, useMatch } from "react-router-dom";
import { SessionContext } from "contexts/Session";

function Home() {
  //   const navigate = useNavigate();
  const [status, setStatus] = useState(false);
  const str = new Date().toISOString().slice(0, 19).replace("T", "-");
  const { getSessionData, uploadDataToCloud } = useContext(SessionContext);
  const focusEl = useRef(null);
  useEffect(()=>{
    focusEl.current.focus();
  },[])

  useEffect(() => {
    const session = getSessionData();
    if (session.PID===""){ //no  
        return;
    }
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(session));
    uploadDataToCloud(`session/${session.PID}-report-${str}.json`, dataStr)
    .then((snapshot) => {
        console.log("Uploaded a data_url string!");
        setStatus(true)
    })
    .catch((error) => {
        setStatus(false);
    });

  }, []);
  function handleDownload() {
    const session = getSessionData();
    console.log("session", session);
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(session));
    const dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `${session.PID}-report-${str}.json`);
    dlAnchorElem.click();
  }
  return (
    <React.Fragment>
       <div className="lead6">
        <header className="header">
        <img src={icon} alt="Icon" className="header-icon" />
      <nav className="header-nav">
      </nav>
    </header>
        <Typography mt={3} variant="h3" ref={focusEl} tabIndex={-1} gutterBottom>
          Thank You!
        </Typography>
        <p>Thank you for taking part in this study. Next, we will schedule an interview with you to discuss further. We are looking forward to meeting you soon.</p>
        <p>Please feel free to ask any questions about the study. </p>
        {status ? (
          <Chip label="Data Upload Successful" color="success" />
        ) : (
          <Chip label="Data Upload Failed" color="error" />
        )}
        <p>
          Also, please click on the download button and email the study transcript to <a href="mailto:Gerry.chan@dal.ca">Gerry.chan@dal.ca</a>
        </p>

        <Box mt={5}>
          {/* <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText> */}

          <Box mt={5}>
            <Button variant="contained" fullWidth onClick={handleDownload} sx={{
          backgroundColor: '#f3bb68', // Custom background color
          color: '#fff',              // Custom text color
          '&:hover': {
              backgroundColor: '#287c5c', // Custom hover color
          },
      }}>
              Download
            </Button>
          </Box>
        </Box>

        {/* <InputLabel htmlFor="my-input">Participant Code</InputLabel> */}

        {/* <FormControl>
        <InputLabel htmlFor="my-input">Type Your Participant Code</InputLabel>
        <Input id="my-input" aria-describedby="my-helper-text" />
        <FormHelperText id="my-helper-text">If you don't know the code, please ask the experimenter.</FormHelperText>
      </FormControl> */}
      </div>
    </React.Fragment>
  );
}

export default Home;
