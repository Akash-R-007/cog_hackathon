import random
import string
from datetime import datetime, timedelta
from pymongo import MongoClient

# MongoDB connection
client = MongoClient("mongodb://127.0.0.1:27017/")
db = client["upcomingDB"]
accounts_col = db["accounts"]

def random_string(length=8):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

def random_account_number():
    return ''.join(random.choices(string.digits, k=15))

def random_name():
    first = random.choice(["Ravi", "Priya", "Amit", "Sneha", "Rahul", "Anjali"])
    last = random.choice(["Kumar", "Sharma", "Patel", "Singh", "Gupta", "Reddy"])
    return f"{first} {last}"

def random_merchant():
    return random.choice(["Amazon", "Flipkart", "Reliance", "Big Bazaar", "Apple Store", "Travel Agency"])

def random_category():
    return random.choice(["Online Shopping", "Grocery", "Electronics", "Travel", "Dining", "Fuel"])

def random_location():
    return random.choice(["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Kolkata"])

def random_payment_method():
    return random.choice(["UPI", "Credit Card", "Debit Card", "Net Banking"])

def random_transaction_type():
    return random.choice(["Debit", "Credit"])

def random_ip():
    return ".".join(str(random.randint(0, 255)) for _ in range(4))

def generate_transaction(fraud=False):
    amount = random.randint(100, 50000)
    if fraud:
        # Make it look suspicious (e.g., very high amount, odd hour, odd location)
        amount = random.randint(20000, 100000)
        location = "Nigeria"  # Unusual location for demo
        merchant = "Unknown Merchant"
        status = "Success"
    else:
        location = random_location()
        merchant = random_merchant()
        status = "Success"
    return {
        "transaction_id": random_string(12),
        "timestamp": (datetime.now() - timedelta(days=random.randint(0, 30))).isoformat(),
        "amount": amount,
        "currency": "INR",
        "merchant": merchant,
        "merchant_category": random_category(),
        "location": location,
        "payment_method": random_payment_method(),
        "status": status,
        "transaction_type": random_transaction_type(),
        "balance_after_transaction": random.randint(1000, 100000),
        "ip_address": random_ip()
    }

def generate_account(fraudulent=False):
    num_txns = random.randint(5, 15)
    txns = []
    fraud_included = False
    for _ in range(num_txns):
        # 20% chance to insert a fraudulent transaction in a fraudulent account
        if fraudulent and not fraud_included and random.random() < 0.2:
            txns.append(generate_transaction(fraud=True))
            fraud_included = True
        else:
            txns.append(generate_transaction(fraud=False))
    return {
        "account_number": random_account_number(),
        "customer_name": random_name(),
        "total_transactions": num_txns,
        "total_balance": random.randint(1000, 100000),
        "transactions": txns
    }

def main():
    accounts_col.delete_many({})  # Clear existing data
    num_accounts = 20
    fraud_ratio = 0.3  # 30% of accounts will have at least one fraudulent txn

    for i in range(num_accounts):
        is_fraud = random.random() < fraud_ratio
        acc = generate_account(fraudulent=is_fraud)
        accounts_col.insert_one(acc)
        print(f"Inserted account {acc['account_number']} (fraudulent: {is_fraud})")

if __name__ == "__main__":
    main()
