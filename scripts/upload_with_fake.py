import random
import string
import time
import socketio
import joblib
import numpy as np
from datetime import datetime, timedelta
from pymongo import MongoClient

# MongoDB connections
client = MongoClient("mongodb://127.0.0.1:27017/")
upcoming_db = client["upcomingDB"]
bank_db = client["bankDB"]
feature_db = client["featureDB"]

accounts_col = upcoming_db["accounts"]
bank_accounts_col = bank_db["accounts"]
features_col = feature_db["fraud_feature"]

# Load fraud detection model
try:
    model = joblib.load('../main_,model/xgb_model_recent.joblib')
    print("✅ Fraud detection model loaded successfully")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None

# List of features in order expected by the model
FEATURE_ORDER = ['V14', 'V12', 'V17', 'V10', 'V4', 'V11', 'V18', 'V27', 'V8', 'Amount']

# Timer for fraud alerts (every 10 seconds)
last_alert_time = None

def send_fraud_alert(account_number, amount=None, transaction_id=None, customer_name=None):
    """Send fraud alert via Socket.IO"""
    try:
        print(f"🚨 FRAUD ALERT! Sending alert for account: {account_number}")
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
        return True
    except Exception as e:
        print(f"❌ Socket.IO error: {e}")
        return False

def get_random_bank_account():
    """Get a random account from bankDB"""
    try:
        accounts = list(bank_accounts_col.find({}, {'account_number': 1, 'customer_name': 1}))
        if accounts:
            return random.choice(accounts)
        else:
            return {'account_number': '123456789012345', 'customer_name': 'Test Customer'}
    except Exception as e:
        print(f"❌ Error fetching bank accounts: {e}")
        return {'account_number': '123456789012345', 'customer_name': 'Test Customer'}

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

def generate_transaction(account_number=None, customer_name=None):
    """Generate a normal transaction and check for fraud alert timing"""
    global last_alert_time
    
    amount = random.randint(100, 50000)
    location = random_location()
    merchant = random_merchant()
    status = "Success"
    
    transaction = {
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
    
    # Check if 10 seconds have passed since last alert
    current_time = time.time()
    if last_alert_time is None or (current_time - last_alert_time) >= 10:
        bank_account = get_random_bank_account()
        print(f"⏰ 10 seconds elapsed - Triggering fraud alert for account: {bank_account['account_number']}")
        success = send_fraud_alert(
            account_number=bank_account['account_number'],
            amount=amount,
            transaction_id=transaction['transaction_id'],
            customer_name=bank_account['customer_name']
        )
        if success:
            last_alert_time = current_time
        # Small delay to ensure alert is processed
        time.sleep(0.5)
    
    return transaction

def generate_account():
    """Generate account with normal transactions only"""
    num_txns = random.randint(5, 15)
    txns = []
    account_number = random_account_number()
    customer_name = random_name()
    
    for _ in range(num_txns):
        txns.append(generate_transaction(account_number, customer_name))
    
    return {
        "account_number": account_number,
        "customer_name": customer_name,
        "total_transactions": num_txns,
        "total_balance": random.randint(1000, 100000),
        "transactions": txns
    }

def main():
    """Main function to generate transactions and send periodic fraud alerts"""
    print("🚀 Starting transaction generation with integrated fraud detection...")
    print("⏰ Fraud alerts will be sent every 10 seconds using real bank accounts")
    
    accounts_col.delete_many({})  # Clear existing data
    num_accounts = 20
    
    # Initialize alert timer
    global last_alert_time
    last_alert_time = time.time()  # Start timer immediately
    
    print(f"🔄 Generating {num_accounts} accounts with transactions...")
    
    alert_count = 0
    total_transactions = 0
    
    # Force first alert immediately
    bank_account = get_random_bank_account()
    success = send_fraud_alert(
        account_number=bank_account['account_number'],
        amount=random.randint(1000, 50000),
        transaction_id=random_string(12),
        customer_name=bank_account['customer_name']
    )
    if success:
        alert_count += 1
        print(f"🚨 Initial fraud alert sent for account: {bank_account['account_number']}")
    
    for i in range(num_accounts):
        acc = generate_account()
        accounts_col.insert_one(acc)
        total_transactions += acc['total_transactions']
        print(f"✅ Inserted account {acc['account_number']} with {acc['total_transactions']} transactions")

    # Check if another alert should be sent (every 6 seconds)
    current_time = time.time()
    if (current_time - last_alert_time) >= 6:
            bank_account = get_random_bank_account()
            success = send_fraud_alert(
                account_number=bank_account['account_number'],
                amount=random.randint(1000, 50000),
                transaction_id=random_string(12),
                customer_name=bank_account['customer_name']
            )
            if success:
                alert_count += 1
                last_alert_time = current_time
                print(f"⏰ 4-second interval alert #{alert_count} sent for account: {bank_account['account_number']}")

    # Small delay between accounts to allow for timing-based alerts
    time.sleep(1.5)
    
    print(f"\n📈 Summary:")
    print(f"Total accounts created: {num_accounts}")
    print(f"Total transactions processed: {total_transactions}")
    print(f"Fraud alerts sent: {alert_count}")
    print("✅ Data upload completed with time-based fraud detection!")

def continuous_fraud_monitoring(duration_minutes=5):
    """Send fraud alerts every 6 seconds for continuous monitoring"""
    print(f"\n🎯 Starting continuous fraud monitoring for {duration_minutes} minutes...")
    print("⏰ Fraud alerts will be sent every 6 seconds")
    
    start_time = time.time()
    end_time = start_time + (duration_minutes * 60)
    alert_count = 0
    
    while time.time() < end_time:
        bank_account = get_random_bank_account()
        amount = random.randint(1000, 50000)
        transaction_id = random_string(12)
        
        print(f"🚨 Sending scheduled fraud alert for account: {bank_account['account_number']}")
        success = send_fraud_alert(
            account_number=bank_account['account_number'],
            amount=amount,
            transaction_id=transaction_id,
            customer_name=bank_account['customer_name']
        )
        
        if success:
            alert_count += 1
            
        # Wait for 6 seconds before next alert
        print(f"⏳ Waiting 6 seconds for next alert... (Alert #{alert_count})")
        time.sleep(6)
    
    print(f"\n📊 Continuous monitoring completed:")
    print(f"Duration: {duration_minutes} minutes")
    print(f"Total fraud alerts sent: {alert_count}")
    print("✅ Monitoring session ended!")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "--monitor":
        # Continuous monitoring mode
        duration = int(sys.argv[2]) if len(sys.argv) > 2 else 5
        continuous_fraud_monitoring(duration)
    else:
        # Normal data upload mode
        main()
