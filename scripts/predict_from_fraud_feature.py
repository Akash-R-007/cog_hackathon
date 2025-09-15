import joblib
import pymongo
import numpy as np
import json
import socketio

# MongoDB connection
client = pymongo.MongoClient('mongodb://127.0.0.1:27017/')
db = client['featureDB']
collection = db['fraud_feature']

# Load model
model = joblib.load('../main_,model/xgb_model_recent.joblib')

# List of features in order expected by the model
FEATURE_ORDER = ['V14', 'V12', 'V17', 'V10', 'V4', 'V11', 'V18', 'V27', 'V8', 'Amount']

# Socket.IO setup
def send_fraud_alert(account_number, amount=None, transaction_id=None, customer_name=None):
    try:
        print(f"🚨 FRAUD DETECTED! Sending alert for account: {account_number}")
        sio = socketio.Client()
        sio.connect('http://localhost:5050', transports=['websocket'])
        msg = {
            'account_number': account_number,
            'amount': amount,
            'transaction_id': transaction_id,
            'customer_name': customer_name
        }
        sio.emit('fraud_alert', msg)
        print(f"✅ Fraud alert sent successfully: {msg}")
        sio.disconnect()
    except Exception as e:
        print(f"❌ Socket.IO error: {e}")

print("🔍 Starting fraud detection on feature database...")
fraud_count = 0
total_count = 0

# Fetch all feature docs
for doc in collection.find({}):
    total_count += 1
    # Prepare input in correct order
    X = np.array([[doc.get(f, 0) for f in FEATURE_ORDER]])
    pred = model.predict(X)[0]
    print(f"Account: {doc.get('account_number')}, Prediction: {'FRAUD' if pred == 1 else 'SAFE'}")
    if pred == 1:
        fraud_count += 1
        send_fraud_alert(
            doc.get('account_number'),
            doc.get('Amount'),
            doc.get('transaction_id', f"TXN_{doc.get('account_number', 'UNKNOWN')}"),
            doc.get('customer_name', f"Customer_{doc.get('account_number', 'UNKNOWN')}")
        )

print(f"\n📊 Fraud Detection Summary:")
print(f"Total accounts analyzed: {total_count}")
print(f"Fraud cases detected: {fraud_count}")
print(f"Safe transactions: {total_count - fraud_count}")

client.close()
