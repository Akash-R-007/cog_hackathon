
import sys
import json
import joblib
import numpy as np

# Load the new XGBoost model
model = joblib.load("../model/xgboost_fraud_model_selected.joblib")

def predict(transaction):
    # Example: expects transaction as dict, returns 1 if fraud, 0 if not
    # You must update this to match your model's expected input features
    features = [
        transaction.get("amount", 0),
        transaction.get("merchant_category", 0),
        transaction.get("location", 0),
        transaction.get("payment_method", 0),
        transaction.get("transaction_type", 0),
        # ... add all required features in correct order ...
    ]
    # Convert categorical features as needed (one-hot, label encoding, etc.)
    # This is a placeholder; update as per your model's requirements
    X = np.array([features])
    pred = model.predict(X)[0]
    return int(pred)

if __name__ == "__main__":
    # Read transaction JSON from stdin
    transaction = json.loads(sys.stdin.read())
    result = predict(transaction)
    print(result)
