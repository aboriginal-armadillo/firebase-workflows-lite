import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';

const WorkflowBuilderModal = ({ node, onHide, onSave }) => {
  const [nodeName, setNodeName] = useState(node.data.label);
  const [editorValue, setEditorValue] = useState(node.data.code || '');

  const handleNodeNameChange = (e) => {
    setNodeName(e.target.value);
  };

  const handleEditorChange = (newValue) => {
    setEditorValue(newValue);
  };

  const handleSave = () => {
    const updatedNode = {
     ...node,
      data: {
       ...node.data,
        label: nodeName,
        code: editorValue,
      },
    };
    onSave(updatedNode);
    onHide();
  };

  return (
    <Modal show={true} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          {nodeName}{' '}
          <input
            type="text"
            value={nodeName}
            onChange={handleNodeNameChange}
            style={{ width: '100%' }}
          />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AceEditor
          mode="python"
          theme="monokai"
          value={editorValue}
          onChange={handleEditorChange}
          height="200px"
          width="100%"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WorkflowBuilderModal;
