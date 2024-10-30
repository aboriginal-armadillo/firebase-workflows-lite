from ..utils import log_to_run, db


def store_node_output(run_id, node_id, output_data):
    log_to_run(run_id, f"Storing output for node {node_id}")
    doc_ref = db.collection('runs').document(run_id).collection('nodes').document(node_id)
    doc_ref.update({'output': output_data})

def get_node_input(run_id, node_id):
    log_to_run(run_id, f"Getting input for node {node_id}")
    doc_ref = db.collection('runs').document(run_id).collection('nodes').document(node_id)
    doc = doc_ref.get()
    if doc.exists:
        node_data = doc.to_dict()
        return node_data.get('input', {})
    else:
        return {}

def update_next_node_input(run_id, next_node_id, prev_node_id):
    log_to_run(run_id, f"Updating input for node {next_node_id} from node {prev_node_id}")
    # Get the output of the previous node
    prev_node_ref = db.collection('runs').document(run_id).collection('nodes').document(prev_node_id)
    prev_output = prev_node_ref.get().to_dict().get('output', {})

    # Update the input of the next node
    next_node_ref = db.collection('runs').document(run_id).collection('nodes').document(next_node_id)
    next_node_ref.update({'input': prev_output})


def update_node_status(run_id, node_id, status):
    log_to_run(run_id, f"Updating status for node {node_id} to {status}")
    doc_ref = db.collection('runs').document(run_id).collection('nodes').document(node_id)
    doc_ref.update({'status': status})
