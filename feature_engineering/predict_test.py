import joblib
import numpy as np

# Load the model (update path if needed)
loaded = joblib.load('../model/xgboost_fraud_model_selected.joblib')
if isinstance(loaded, tuple):
	model = loaded[0]
else:
	model = loaded


# Feature vector with extreme values to try to trigger fraud prediction
features = np.array([[99999, 10000.0, 0.0, 1, 0.00001, 0.0, 50]])

# Predict class and probabilities (if available)
pred = model.predict(features)
print('Predicted class:', pred[0])

if hasattr(model, 'predict_proba'):
	proba = model.predict_proba(features)
	print('Predicted probabilities:', proba[0])
