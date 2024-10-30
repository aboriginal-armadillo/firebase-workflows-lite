// src/WorkflowBuilder.js
import React, { useState, useCallback } from 'react';
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Background,
  Controls,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { getFirestore, doc, setDoc, collection, addDoc } from 'firebase/firestore';
import app from '../../firebase';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { v4 as uuidv4 } from 'uuid';

const WorkflowBuilder = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const navigate = useNavigate();

  const db = getFirestore(app);

  const onAddNode = useCallback(() => {
    setNodes((nds) =>
      nds.concat({
        id: `node-${nds.length}`,
        data: { label: `Node ${nds.length}` },
        position: { x: Math.random() * 250, y: Math.random() * 250 },
      })
    );
  }, []);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onRun = async () => {
    try {
      const db = getFirestore(app);
    const functions = getFunctions(app);
    const createWorkflow = httpsCallable(functions, 'create_workflow');

    // Save the workflow definition
    const graphData = { nodes, edges };
    const workflowRef = doc(db, 'workflows', 'test_workflow');
    await setDoc(workflowRef, { graph: graphData }, { merge: true });

    // Generate run_id
    const run_id = uuidv4();

    // Create run document
    const runRef = doc(workflowRef, 'runs', run_id);
    await setDoc(runRef, { startedAt: new Date(), status: 'pending' });

    // Call the cloud function with workflow_id and run_id
    const result = await createWorkflow({ workflow_id: 'test_workflow', run_id });
    console.log('Cloud Function result:', result.data);

    alert('Workflow saved and run started!');
    navigate('/runs');
    } catch (error) {
      console.error('Error calling cloud function:', error);
      alert('Error starting run.');
    }
  };

  return (
    <div className="container">
      <h1>Workflow Builder</h1>
      <div className="mb-2">
        <Button variant="primary" onClick={onAddNode}>
          Add Node
        </Button>{' '}
        <Button variant="success" onClick={onRun}>
          Run
        </Button>
      </div>
      <div style={{ height: '80vh', border: '1px solid #ddd' }}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default WorkflowBuilder;
