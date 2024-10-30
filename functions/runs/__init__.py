from firebase_functions import logger, https_fn
from firebase_admin import firestore

from uuid import uuid4
from .nodes import update_node_status

from .utils import log_to_run

db = firestore.client()


@https_fn.on_request()
def create_run(request):
    run_id = "test_run"
    logger.log(f"Creating run: {run_id}")
    nodes = ['start_node', 'process_node', 'end_node']
    edges = {
        'start_node': ['process_node'],
        'process_node': ['end_node']
    }

    run_ref = db.collection('runs').document(run_id)
    run_ref.set({
        'edges': edges,
        'status': 'running'
    })

    # Initialize nodes in Firestore
    for node_id in nodes:
        node_ref = run_ref.collection('nodes').document(node_id)
        node_ref.set({
            'status': 'pending',
            'input': {},
            'output': {},
        })

    log_to_run(run_id, 'Workflow Created')
    start_workflow(workflow_id)
    return {'workflow_id': workflow_id}

def start_workflow(workflow_id):
    logger.log(f"Starting workflow: {workflow_id}")
    log_to_workflow(workflow_id, 'Workflow Started')
    # Set initial input for start node
    start_input = {'counter': 0}
    node_ref = db.collection('workflows').document(workflow_id).collection('nodes').document('start_node')
    node_ref.update({'input': start_input})

    # Trigger start node
    update_node_status(workflow_id, 'start_node', 'Preparing to Run')



