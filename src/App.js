// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WorkflowsList from './components/WorkflowsList/WorkflowsList';
import WorkflowBuilder from './components/WorkflowBuilder/WorkflowBuilder';
import RunsList from './components/RunsList/RunsList';
import RunViewer from './components/RunViewer/RunViewer';
import WorkflowRuns from "./components/WorkflowRuns/WorkflowRuns";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WorkflowsList />} />
        <Route path="/workflow/:workflowId" element={<WorkflowBuilder />} />
        <Route path="/workflow/:workflowId/runs" element={<WorkflowRuns />} />
        <Route path="/runs" element={<RunsList />} />
        <Route path="/workflow/:workflowId/runs/:runId" element={<RunViewer />} />
      </Routes>
    </Router>
  );
}

export default App;
