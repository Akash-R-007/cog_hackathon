import joblib
loaded = joblib.load("fraud_model.joblib")
print(type(loaded))
print(loaded)

