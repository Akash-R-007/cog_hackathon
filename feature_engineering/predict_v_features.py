import joblib
import numpy as np


# Provided feature values
Time = 472
Amount = 529
V = {
    'V1': -3.0435406239976,
    'V2': -3.15730712090228,
    'V3': 1.08846277997285,
    'V4': 2.2886436183814,
    'V5': 1.35980512966107,
    'V6': -1.06482252298131,
    'V7': 0.325574266158614,
    'V8': -0.0677936531906277,
    'V9': -0.270952836226548,
    'V10': -0.838586564582682,
    'V11': -0.414575448285725,
    'V12': -0.503140859566824,
    'V13': 0.676501544635863,
    'V14': -1.69202893305906,
    'V15': 2.00063483909015,
    'V16': 0.666779695901966,
    'V17': 0.599717413841732,
    'V18': 1.72532100745514,
    'V19': 0.283344830149495,
    'V20': 2.10233879259444,
    'V21': 0.661695924845707,
    'V22': 0.435477208966341,
    'V23': 1.37596574254306,
    'V24': -0.293803152734021,
    'V25': 0.279798031841214,
    'V26': -0.145361714815161,
    'V27': -0.252773122530705,
    'V28': 0.0357642251788156
}

features = np.array([[Time] + [
    V['V1'], V['V2'], V['V3'], V['V4'], V['V5'], V['V6'], V['V7'], V['V8'], V['V9'],
    V['V10'], V['V11'], V['V12'], V['V13'], V['V14'], V['V15'], V['V16'], V['V17'], V['V18'], V['V19'], V['V20'],
    V['V21'], V['V22'], V['V23'], V['V24'], V['V25'], V['V26'], V['V27'], V['V28'], Amount
]])



# Load the model
loaded = joblib.load('../model/fraud_model.joblib')
if isinstance(loaded, tuple):
    model = loaded[0]
else:
    model = loaded

# Predict class and probabilities (if available)
pred = model.predict(features)
print('Predicted class:', pred[0])

if hasattr(model, 'predict_proba'):
    proba = model.predict_proba(features)
    print('Predicted probabilities:', proba[0])
