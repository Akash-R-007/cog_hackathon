from pymongo import MongoClient
from faker import Faker
import random

# Initialize Faker
fake = Faker()

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")  # Change if using Atlas or remote
db = client["bankDB"]   # Database
collection = db["accounts"]  # Store one doc per account

def generate_account_number():
    """Generate a unique 15-digit account number"""
    return str(random.randint(10**14, (10**15)-1))

def generate_transactions(acc_num, num_transactions, starting_balance):
    """Generate fake transactions for a given account number"""
    transactions = []
    balance = starting_balance
    
    for _ in range(num_transactions):
        amount = round(random.uniform(10, 2000), 2)
        transaction_type = random.choice(["Credit", "Debit"])
        
        # Update balance
        if transaction_type == "Debit":
            balance -= amount
        else:
            balance += amount
        
        transaction = {
            "transaction_id": fake.uuid4(),
            "timestamp": fake.date_time_this_year().isoformat(),
            "amount": amount,
            "currency": "INR",
            "merchant": fake.company(),
            "merchant_category": random.choice([
                "Grocery", "Electronics", "Travel", "Dining", "Entertainment", "Fuel", "Online Shopping"
            ]),
            "location": fake.city(),
            "payment_method": random.choice(["Credit Card", "Debit Card", "UPI", "Net Banking", "Wallet"]),
            "status": random.choice(["Success", "Failed", "Pending"]),
            "transaction_type": transaction_type,
            "balance_after_transaction": round(balance, 2),
            "ip_address": fake.ipv4_public()
        }
        transactions.append(transaction)
    return transactions, balance

def insert_fake_accounts(num_accounts=5):
    """Insert fake account docs into MongoDB"""
    accounts = []
    for _ in range(num_accounts):
        acc_num = generate_account_number()
        customer_name = fake.name()
        total_transactions = random.randint(8, 15)  # random count of txns
        starting_balance = random.randint(20000, 100000)  # random initial balance
        
        transactions, final_balance = generate_transactions(acc_num, total_transactions, starting_balance)
        
        account_doc = {
            "account_number": acc_num,
            "customer_name": customer_name,
            "total_transactions": total_transactions,
            "total_balance": round(final_balance, 2),
            "transactions": transactions
        }
        
        accounts.append(account_doc)
    
    collection.insert_many(accounts)
    print(f"✅ Inserted {num_accounts} accounts with transactions.")

if __name__ == "__main__":
    insert_fake_accounts(65)  # generates 5 account docs
