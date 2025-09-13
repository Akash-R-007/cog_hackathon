// Alternative PDF generator using HTML content
export const generateHTMLToPDF = async (accountData) => {
  try {
    // Create a temporary container
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '210mm'; // A4 width
    container.style.backgroundColor = 'white';
    container.style.padding = '20px';
    container.style.fontFamily = 'Arial, sans-serif';
    
    // Generate HTML content
    const fraudulentTransactions = accountData.transactions.filter(txn => 
      txn.amount > 50000 || (txn.transaction_type === 'Debit' && txn.amount > 25000)
    );

    container.innerHTML = `
      <div style="max-width: 100%;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-size: 24px; color: #333; margin-bottom: 10px;">Bank Transaction Report</h1>
          <p style="color: #666; font-size: 12px;">Generated on ${new Date().toLocaleDateString()}</p>
        </div>

        <!-- Account Information -->
        <div style="background: #f8f9fa; padding: 20px; margin-bottom: 30px; border: 1px solid #dee2e6;">
          <h2 style="font-size: 18px; color: #333; margin-bottom: 15px;">Account Information</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div><strong>Customer Name:</strong> ${accountData.customer_name}</div>
            <div><strong>Account Number:</strong> ${accountData.account_number}</div>
            <div><strong>Total Transactions:</strong> ${accountData.total_transactions}</div>
            <div><strong>Total Balance:</strong> ₹${accountData.total_balance?.toLocaleString('en-IN')}</div>
          </div>
        </div>

        <!-- Transaction Table -->
        <div style="margin-bottom: 30px;">
          <h2 style="font-size: 18px; color: #333; margin-bottom: 15px;">Transaction History</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
            <thead>
              <tr style="background: #428bca; color: white;">
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">#</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Date</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Merchant</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Category</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Type</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Amount</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Method</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Status</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Balance</th>
              </tr>
            </thead>
            <tbody>
              ${accountData.transactions.map((txn, index) => `
                <tr style="background: ${index % 2 === 0 ? '#fff' : '#f5f5f5'};">
                  <td style="border: 1px solid #ddd; padding: 6px; text-align: center;">${index + 1}</td>
                  <td style="border: 1px solid #ddd; padding: 6px;">${new Date(txn.timestamp).toLocaleDateString('en-IN')}</td>
                  <td style="border: 1px solid #ddd; padding: 6px;">${txn.merchant}</td>
                  <td style="border: 1px solid #ddd; padding: 6px;">${txn.merchant_category}</td>
                  <td style="border: 1px solid #ddd; padding: 6px;">${txn.transaction_type}</td>
                  <td style="border: 1px solid #ddd; padding: 6px; text-align: right; color: ${txn.transaction_type === 'Debit' ? '#dc3545' : '#28a745'};">
                    ${txn.transaction_type === 'Debit' ? '-' : '+'}₹${txn.amount.toLocaleString('en-IN')}
                  </td>
                  <td style="border: 1px solid #ddd; padding: 6px;">${txn.payment_method}</td>
                  <td style="border: 1px solid #ddd; padding: 6px;">${txn.status}</td>
                  <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">₹${txn.balance_after_transaction.toLocaleString('en-IN')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Fraud Detection Summary -->
        <div style="background: #f8f9fa; padding: 20px; border: 1px solid #dee2e6;">
          <h2 style="font-size: 18px; color: #333; margin-bottom: 15px;">Fraud Detection Summary</h2>
          ${fraudulentTransactions.length > 0 ? `
            <p style="color: #dc3545; font-weight: bold; margin-bottom: 15px;">
              ⚠️ ${fraudulentTransactions.length} potentially fraudulent transaction(s) detected
            </p>
            <ul style="list-style: disc; margin-left: 20px;">
              ${fraudulentTransactions.map(txn => `
                <li style="margin-bottom: 5px; color: #dc3545;">
                  ₹${txn.amount.toLocaleString('en-IN')} at ${txn.merchant} on ${new Date(txn.timestamp).toLocaleDateString('en-IN')}
                </li>
              `).join('')}
            </ul>
          ` : `
            <p style="color: #28a745; font-weight: bold;">✓ No fraudulent activity detected</p>
          `}
        </div>

        <!-- Footer -->
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; text-align: center; font-size: 10px; color: #666;">
          <p>Generated by Bank Fraud Detection System</p>
          <p>Report generated on ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `;

    document.body.appendChild(container);

    // Use browser's print functionality
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Transaction Report - ${accountData.account_number}</title>
          <style>
            @media print {
              @page { margin: 0.5in; size: A4; }
              body { margin: 0; font-family: Arial, sans-serif; }
            }
            body { font-family: Arial, sans-serif; margin: 20px; }
          </style>
        </head>
        <body>
          ${container.innerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    // Trigger print dialog
    setTimeout(() => {
      printWindow.print();
    }, 500);

    // Clean up
    document.body.removeChild(container);

    return { success: true, method: 'browser-print' };
  } catch (error) {
    console.error('HTML-to-PDF Error:', error);
    return { success: false, error: error.message };
  }
};