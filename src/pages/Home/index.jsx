import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate, useMatch } from "react-router-dom";
import './Home.css';
import icon from '../../assets/icon.jpg';
function Home() {
  const navigate = useNavigate();
  const focusEl = useRef(null);
  function handleContinue(){
    console.log("navigate to /informedconsent")
    navigate("/informedconsent", { replace: true });
  }
  useEffect(()=>{
    focusEl.current.focus();
  },[])
  return (
    <React.Fragment>
       <div className="lead14">  
       <img src={icon} alt="Icon" className="header-icon" /> 
      <nav className="header-nav">    
      </nav>
        <Typography mt={3} variant="h4" color={"white"} gutterBottom ref={focusEl} tabIndex={-1}>
        Ready for a Trivia Challenge?
        </Typography>
       <div>
        <img src={icon} alt="Icon" className="header-icon2" /> 
        </div>
        <Box mt={5}>
          
      

          <Box mt={5}>
         
            <Button
              variant="contained"
              fullWidth
              onClick={handleContinue}
              style = {{ width: '35%'}}
              sx={{
                backgroundColor: '#f3bb68', // Custom background color
                color: '#fff',              // Custom text color
                '&:hover': {
                    backgroundColor: '#F1D5B3', // Custom hover color
                },
            }}>
              Begin
            </Button>
          </Box>
        </Box>

      </div>
    </React.Fragment>
  );
}

export default Home;
