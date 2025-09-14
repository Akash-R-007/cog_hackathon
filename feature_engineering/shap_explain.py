import joblib
import numpy as np
import shap

loaded = joblib.load('../model/xgboost_fraud_model_selected.joblib')
if isinstance(loaded, tuple):
    model = loaded[0]
else:
    model = loaded

V_features = {
    'V10': -0.838586564582682,
    'V11': -0.414575448285725,
    'V12': -0.503140859566824,
    'V14': -1.69202893305906,
    'V16': 0.666779695901966,
    'V17': 0.599717413841732,
}
# For 'Time', use 0 as a placeholder (since not provided)
features = np.array([[0, V_features['V14'], V_features['V11'], V_features['V17'], V_features['V12'], V_features['V10'], V_features['V16']]])


# Predict class
pred = model.predict(features)
print('Predicted class:', pred[0])

# SHAP explanation
explainer = shap.Explainer(model)
shap_values = explainer(features)

# Print SHAP values for the first prediction
print('SHAP values:', shap_values.values[0])
print('Base value:', shap_values.base_values[0])
print('Feature impact:')
feature_names = ['Time', 'V14', 'V11', 'V17', 'V12', 'V10', 'V16']
for name, value in zip(feature_names, shap_values.values[0]):
    print(f'{name}: {value}')

# User-friendly summary of top contributing features
import numpy as np
shap_arr = np.array(shap_values.values[0])
top_idx = np.argsort(np.abs(shap_arr))[::-1][:3]
print('\nTop contributing features:')
for idx in top_idx:
    direction = 'toward FRAUD' if shap_arr[idx] > 0 else 'toward NON-FRAUD'
    print(f"{feature_names[idx]}: {shap_arr[idx]:.3f} ({direction})")

# Overall direction
total = shap_arr.sum() + shap_values.base_values[0]
if total < 0:
    print('Overall, the features pushed the prediction toward NON-FRAUD.')
else:
    print('Overall, the features pushed the prediction toward FRAUD.')

# Optionally, save a SHAP summary plot
shap.plots.waterfall(shap_values[0], show=False)
import matplotlib.pyplot as plt
plt.savefig('shap_explanation.png')
print('SHAP waterfall plot saved as shap_explanation.png')
