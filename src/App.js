import React from 'react';
import './App.css';
import Header from "components/Header";
import Home from 'pages/Home';
import { SessionProvider } from 'contexts/Session';
import { Box, Container, Typography, Button } from '@mui/material';
import { HashRouter, Link as RouterLink, Routes, Route } from 'react-router-dom';
import InformedConsent from 'pages/InformedConsent';
import Presurvey from 'pages/Presurvey';
import Ready from 'pages/Ready';
import Postsurvey from 'pages/Postsurvey';
import TaskSurvey from 'pages/TaskSurvey';
import Tutorial from 'pages/Tutorial';
import Task from 'pages/Task';
import Thanks from 'pages/Thanks';
import Dashboard from 'pages/Dashboard';
import Report from 'pages/Report/index';

function App() {
  return (
    <HashRouter>
      <SessionProvider>
        <Container maxWidth="md">
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path={`informedconsent`} element={<InformedConsent />}></Route>
            <Route path={`ready`} element={<Ready />}></Route>
            <Route path={`presurvey`} element={<Presurvey />}></Route>
            <Route path={`tutorial/:stage`} element={<Tutorial />}></Route>
            <Route path={`task/:stage`} element={<Task />}></Route>
            <Route path={`tasksurvey/:stage`} element={<TaskSurvey />}></Route>
            <Route path={`results/:stage`} element={<Report/>}></Route>
            <Route path={`postsurvey`} element={<Postsurvey/>}></Route>
            <Route path={`thanks`} element={<Thanks/>}></Route>
            <Route path={`dashboard`} element={<Dashboard/>}></Route>
          </Routes>

        </Container>
      </SessionProvider>
    </HashRouter>
  );
}

export default App;