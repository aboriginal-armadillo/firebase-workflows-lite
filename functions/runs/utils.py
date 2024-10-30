from firebase_functions import logger
from firebase_admin import firestore

db = firestore.client()

def log_to_run(run_id, message):
    logger.log(message)
    run_ref = db.collection('runs').document(run_id)
    run_ref.update({
        'logs': firestore.ArrayUnion([message])
    })
