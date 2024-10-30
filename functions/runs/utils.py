from firebase_functions import logger
from firebase_admin import firestore

db = firestore.client()


# functions/runs/utils.py
def log_to_run(workflow_id, run_id, message):
    logger.log(message)
    run_ref = db.collection('workflows').document(workflow_id).collection('runs').document(run_id)
    run_ref.update({
        'logs': firestore.ArrayUnion([message])
    })
