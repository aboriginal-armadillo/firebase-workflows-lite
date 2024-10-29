from firebase_functions import logger
from firebase_admin import firestore

db = firestore.client()

def log_to_workflow(workflow_id, message):
    logger.log(message)
    workflow_ref = db.collection('workflows').document(workflow_id)
    workflow_ref.update({
        'logs': firestore.ArrayUnion([message])
    })
