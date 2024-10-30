from firebase_functions import logger, firestore_fn
from firebase_admin import firestore

from .io import store_node_output, \
    update_next_node_input, \
    update_node_status, \
    get_node_input

from ..utils import log_to_run, db

def trigger_next_nodes(workflow_id, run_id, node_id):
    log_to_run(workflow_id, run_id, f"Triggering next nodes for node {node_id}")
    # Fetch run edges from Firestore
    run_ref = db.collection('workflows').document(workflow_id).collection('runs').document(run_id)
    run_doc = run_ref.get()
    if run_doc.exists:
        run_data = run_doc.to_dict()
        edges = run_data.get('edges', {})
        next_nodes = edges.get(node_id, [])

        if len(next_nodes) == 0:
            log_to_run(workflow_id, run_id, f"No next nodes for node {node_id}")
            # todo this isn't right, it could just be a terminal node, but other paths are still active.
            run_ref.update({'status': 'completed'})
        else:
            for next_node_id in next_nodes:
                log_to_run(workflow_id, run_id, f"Triggering node {next_node_id}")
                # Update input for next node
                update_next_node_input(workflow_id, run_id, next_node_id, node_id)
                # Trigger the next node's Cloud Function
                next_node_ref = db.collection('workflows').document(workflow_id).collection('runs').document(run_id).collection('nodes').document(next_node_id)
                next_node_ref.update({
                    'status': 'Preparing to Run'
                })


@firestore_fn.on_document_updated(document='workflows/{workflow_id}/runs/{run_id}/nodes/{node_id}')
def node_status_changed(event):
    log_to_run(event.params['workflow_id'], event.params['run_id'], f"Node {event.params['node_id']} status changed.")
    # Get the updated document
    node_data = event.data.after.to_dict()

    # Check if the status is 'Preparing to Run'
    if node_data.get('status') == 'Preparing to Run':
        workflow_id = event.params['workflow_id']
        run_id = event.params['run_id']
        node_id = event.params['node_id']
        execute_node_function(workflow_id, run_id, node_id, node_data)

def execute_node_function(workflow_id, run_id, node_id, node_data):
    log_to_run(workflow_id, run_id, f"Executing node function for node {node_id}")
    # Update node status to 'Running'
    update_node_status(workflow_id, run_id, node_id, 'running')

    try:
        # Extract the function name and input data
        # function_name = node_data.get('fn')
        function_name = "dummy_fn"
        input_data = node_data.get('input', {})

        # Call the function by name
        if function_name in globals():
            input_data['workflow_id'] = workflow_id
            input_data['run_id'] = run_id
            input_data['node_id'] = node_id
            log_to_run(workflow_id, run_id, f"Executing function: {function_name} with input data {input_data}")
            output_data = globals()[function_name](input_data)
            # Store the output and update status to 'Completed'
            log_to_run(workflow_id, run_id, f"Function {function_name} executed successfully.")
            store_node_output(workflow_id, run_id, node_id, output_data)
            update_node_status(workflow_id, run_id, node_id, 'completed')
            # Trigger subsequent nodes
            trigger_next_nodes(workflow_id, run_id, node_id)
        else:
            raise Exception(f"Function {function_name} not defined!")

    except Exception as e:
        update_node_status(workflow_id, run_id, node_id, 'failed')
        print(f"Node {node_id} failed with error: {e}")


def dummy_fn(input_data):
    workflow_id = input_data.get('workflow_id')
    run_id = input_data.get('run_id')
    node_id = input_data.get('node_id')
    logger.log(f"Executing node {node_id} for workflow: {workflow_id}")
    log_to_run(workflow_id, run_id, f"Executing Start Node {node_id}")

    update_node_status(workflow_id, run_id, node_id, 'running')

    # Start node logic
    output_data = {'message': 'Run started'}
    store_node_output(workflow_id,  run_id, node_id, output_data)
    update_node_status(workflow_id, run_id, node_id, 'completed')

    # Trigger next node
    trigger_next_nodes(workflow_id, run_id, node_id)

    return {'status': 'dummy_node_executed'}
