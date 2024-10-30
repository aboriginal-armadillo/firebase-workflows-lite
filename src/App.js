// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WorkflowBuilder from './components/WorkflowBuilder/WorkflowBuilder';
import RunsList from './components/RunsList/RunsList';
import RunViewer from './components/RunViewer/RunViewer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WorkflowBuilder />} />
        <Route path="/runs" element={<RunsList />} />
        <Route path="/runs/:runId" element={<RunViewer />} />
      </Routes>
    </Router>
  );
}

export default App;
