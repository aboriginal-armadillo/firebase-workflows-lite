import React, { useState, useEffect } from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc, onSnapshot, collection } from 'firebase/firestore';
import app from '../../firebase';

const RunViewer = () => {
  const { runId } = useParams();
  const { workflowId } = useParams();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [nodeStatuses, setNodeStatuses] = useState({});

  useEffect(() => {
    const db = getFirestore(app);
    const workflowRef = doc(db, 'workflows', workflowId);
    const runRef = doc(workflowRef, 'runs', runId);
    console.log('workflowId', workflowId);
    console.log('runId', runId);
    // Fetch the graph
    getDoc(workflowRef).then((docSnap) => {
      const data = docSnap.data();
      console.log('data', data);
      const graph = data.graph;
      if (graph) {
        setNodes(graph.nodes);
        setEdges(graph.edges);
      }
    });

    // Subscribe to node statuses under the run document
    const nodesCollection = collection(runRef, 'nodes');
    const unsubscribe = onSnapshot(nodesCollection, (snapshot) => {
      const statuses = {};
      snapshot.forEach((doc) => {
        statuses[doc.id] = doc.data().status;
      });
      setNodeStatuses(statuses);
    });

    return () => unsubscribe();
  }, [runId, workflowId]);

  const updatedNodes = nodes.map((node) => {
    const status = nodeStatuses[node.id] || 'unknown';
    let backgroundColor = '#fff';
    switch (status) {
      case 'pending':
        backgroundColor = '#f0ad4e'; // yellow
        break;
      case 'running':
        backgroundColor = '#5bc0de'; // blue
        break;
      case 'completed':
        backgroundColor = '#5cb85c'; // green
        break;
      case 'failed':
        backgroundColor = '#d9534f'; // red
        break;
      default:
        backgroundColor = '#fff';
    }
    return {
     ...node,
      data: {
       ...node.data,
        label: `${node.data.label} (${status})`,
      },
      style: {...node.style, backgroundColor },
    };
  });

  return (
    <div className="container">
      <h1>Run {runId}</h1>
      <div style={{ height: '80vh', border: '1px solid #ddd' }}>
        <ReactFlow
          nodes={updatedNodes}
          edges={edges}
          nodesDraggable={false}
          elementsSelectable={false}
          fitView={true}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default RunViewer;
