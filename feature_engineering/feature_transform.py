import datetime

def transaction_to_features(transaction):
    """
    Convert a transaction dict to the required feature vector for the model.
    Features: ['Time', 'V14', 'V11', 'V17', 'V12', 'V10', 'V16']
    """
    # Example: 'Time' as seconds since midnight
    timestamp = transaction.get('timestamp')
    if timestamp:
        dt = datetime.datetime.fromisoformat(timestamp)
        time_feature = dt.hour * 3600 + dt.minute * 60 + dt.second
    else:
        time_feature = 0

    # Dummy values for V* features (replace with real feature engineering as needed)
    V14 = float(transaction.get('amount', 0)) / 10000  # Example scaling
    V11 = 1.0 if transaction.get('status') == 'Success' else 0.0
    V17 = len(transaction.get('merchant', ''))
    V12 = float(transaction.get('balance_after_transaction', 0)) / 100000
    V10 = 1.0 if transaction.get('payment_method') == 'Net Banking' else 0.0
    V16 = len(transaction.get('location', ''))

    return [time_feature, V14, V11, V17, V12, V10, V16]

# Example usage:
# features = transaction_to_features(transaction_dict)
