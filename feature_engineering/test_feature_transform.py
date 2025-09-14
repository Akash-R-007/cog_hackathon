from feature_transform import transaction_to_features

# Example transaction dict from your data
transaction = {
    'transaction_id': 'xQc1faCcdi6u',
    'timestamp': '2025-08-15T21:27:32.521960',
    'amount': 10901,
    'currency': 'INR',
    'merchant': 'Reliance',
    'merchant_category': 'Fuel',
    'location': 'Chennai',
    'payment_method': 'Net Banking',
    'status': 'Success',
    'transaction_type': 'Debit',
    'balance_after_transaction': 86012,
    'ip_address': '98.240.53.117',
    '_id': '68c6e62b06b34b5e778061c3'
}

features = transaction_to_features(transaction)
print('Feature vector:', features)
