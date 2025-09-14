import joblib
loaded = joblib.load("../model/xgboost_fraud_model.joblib")
print(type(loaded))
print(loaded)

# import joblib

# obj = joblib.load("xgboost_fraud_model_selected.joblib")
# print("Type:", type(obj))
# if isinstance(obj, tuple):
#     for i, item in enumerate(obj):
#         print(f"Index {i} -> type {type(item)}")
