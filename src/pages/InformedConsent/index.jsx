import React, { useEffect, useRef } from "react";
import './Header.css';
import icon from '../../assets/icon.jpg'
import { Box, Container, Typography, Button, Link } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";

function InformedConsent() {
  // const baseURL = process.env.PUBLIC_URL;
  const navigate = useNavigate();
  const containerStyle = {
    maxWidth: '1200px', // Set your desired max width
    margin: '0 auto',   // Center the container
    padding: '20px',    // Optional padding
};
  function handleContinue(event) {
    navigate("/ready");
  }
  const focusEl = useRef(null);
  useEffect(()=>{
    console.log("setting new focus to header", focusEl.current);
    focusEl.current.focus();
  },[])
  return <div className="lead">
    
        <header className="header">
    <img src={icon} alt="Icon" className="header-icon" />
      <nav className="header-nav">
      </nav>
    </header>
    <Typography mt={3} variant="h3" ref={focusEl} tabIndex="-1">
      Informed Consent
    </Typography>
    <p>
    The purpose of the study is to evaluate the usability of an Afrocentric e-learning system for enhancing the learning experience. In particular, 
    the study will evaluate how easy it is to navigate through the e-learning system and the clarity of the menus and icons. The evaluation also aims 
    to better understand how the design of the system can be improved and more engaging. We have provided a consent form prior to this study.  Please, 
    you can take out time to review the consent again if you have not done so before. 
    </p>
    <p>
      If you have questions about this form, please feel free to contact Gerry.chan@dal.ca before you proceed to consent to the study. Otherwise, you can register your consent by clicking on the button below.
    </p>
    <Box mt={5}>
      <Button
        variant="contained"
        fullWidth
        sx={{
          backgroundColor: '#f3bb68', // Custom background color
          color: '#fff',              // Custom text color
          '&:hover': {
              backgroundColor: '#287c5c', // Custom hover color
          },
      }}
        onClick={handleContinue}
      >
        I consent, and I agree to participate.
      </Button>
    </Box>
    </div>
}

export default InformedConsent;
