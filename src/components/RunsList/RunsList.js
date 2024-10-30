// src/RunsList.js
import React, { useEffect, useState } from 'react';
import { getFirestore, doc, collection, onSnapshot } from 'firebase/firestore';
import app from '../../firebase';
import { Link } from 'react-router-dom';

const RunsList = () => {
  const [runs, setRuns] = useState([]);

  useEffect(() => {
    const db = getFirestore(app);
    const workflowRef = doc(db, 'workflows', 'test_workflow');
    const runsCollection = collection(workflowRef, 'runs');

    const unsubscribe = onSnapshot(runsCollection, (snapshot) => {
      const runsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRuns(runsData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="container">
      <h1>Runs</h1>
      <ul>
        {runs.map((run) => (
          <li key={run.id}>
            <Link to={`/runs/${run.id}`}>Run {run.id}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RunsList;
