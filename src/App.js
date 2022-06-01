import './App.css';
import React, { useState, useEffect } from 'react';
import {Input, Button, FlexboxGrid, Content, Form, Panel, ButtonToolbar, Container, DatePicker, toaster, Notification, Modal } from 'rsuite'
import ReactDOM from "react-dom";
import LoveLocker from './LoveLocker';
import LoveLockerViewer from './LoveLockerViewer';
import Layout from './Layout';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "rsuite-color-picker/lib/styles.css"
import 'rsuite-color-picker/lib/styles.less'
import 'rsuite/dist/rsuite.min.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LoveLocker />} />
          <Route path='/viewer' element={<LoveLockerViewer/>}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
 
  
}

export default App;
