# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn, logger, firestore_fn
from firebase_admin import initialize_app, firestore, functions

initialize_app()
db = firestore.client()

from workflows.nodes import  trigger_next_nodes, \
    update_node_status, \
    get_node_input, \
    store_node_output, \
    node_status_changed



from workflows import create_workflow

