export interface ReceiptData {
  orderId: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  discount?: number;
  shipping?: number;
  tax?: number;
  total: number;
  paymentMethod: string;
  date?: string;
  gstPercent?: number;
}

export interface DailyClosingReportData {
  reportId: string;
  date: string;
  totalOrders: number;
  grossSales: number;
  totalDiscount: number;
  taxableSales: number;
  gstAmount: number;
  gstPercent: number;
  deliveryFees: number;
  onlineUpiPaid: number;
  cashOnDeliveryCollected: number;
  cashOnDeliveryPending: number;
  netRevenue: number;
  orders: Array<{
    id: string;
    customerName: string;
    paymentMethod: string;
    paymentStatus: string;
    total: number;
    status: string;
    time: string;
  }>;
}

export const downloadOrderReceipt = (data: ReceiptData) => {
  if (typeof window === "undefined") return;

  const dateStr = data.date || new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const invoiceNo = `INV-${data.orderId.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase()}`;
  const subtotal = Number(data.subtotal) || 0;
  const discount = Number(data.discount) || 0;
  const taxableAmount = Math.max(0, subtotal - discount);
  const gstRate = data.gstPercent !== undefined ? data.gstPercent : 5;
  const totalTax = data.tax !== undefined ? Number(data.tax) : Math.round((taxableAmount * gstRate) / 100);
  const shippingFee = Number(data.shipping) || 0;
  const grandTotal = Number(data.total) || (taxableAmount + totalTax + shippingFee);

  const receiptHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Tax Invoice - ${invoiceNo}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    html, body {
      width: 100%;
      background: #f5f5f5;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 13px;
      color: #111;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    body {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px 12px 32px;
    }

    /* Download button bar */
    .bar {
      width: 100%;
      max-width: 420px;
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-bottom: 10px;
    }

    .btn-dl {
      background: #222;
      color: #fff;
      border: none;
      padding: 7px 16px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: bold;
      cursor: pointer;
      font-family: inherit;
    }

    /* Receipt card */
    .card {
      width: 100%;
      max-width: 420px;
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
    }

    /* Title block */
    .title-block {
      padding: 14px 16px 10px;
      border-bottom: 1px solid #ddd;
      text-align: center;
    }

    .title-block h1 {
      font-size: 15px;
      font-weight: bold;
      letter-spacing: 0.5px;
      color: #111;
    }

    .title-block p {
      font-size: 11px;
      color: #555;
      margin-top: 3px;
    }

    /* Info rows */
    .info-block {
      padding: 10px 16px;
      border-bottom: 1px solid #eee;
      display: flex;
      flex-direction: column;
      gap: 5px;
      font-size: 12px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      gap: 8px;
    }

    .info-row .lbl {
      color: #777;
      min-width: 85px;
    }

    .info-row .val {
      font-weight: bold;
      color: #111;
      text-align: right;
      word-break: break-word;
    }

    /* Items table */
    .items-block {
      padding: 10px 16px;
      border-bottom: 1px solid #eee;
    }

    .items-head {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      font-weight: bold;
      color: #888;
      text-transform: uppercase;
      padding-bottom: 5px;
      border-bottom: 1px solid #eee;
      margin-bottom: 4px;
    }

    .item-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 5px 0;
      font-size: 12px;
      border-bottom: 1px dashed #f0f0f0;
    }

    .item-row:last-child { border-bottom: none; }

    .item-name { font-weight: bold; color: #111; }
    .item-qty  { font-size: 11px; color: #666; }
    .item-amt  { font-weight: bold; text-align: right; white-space: nowrap; }

    /* Totals */
    .totals-block {
      padding: 10px 16px;
      border-bottom: 1px solid #eee;
      display: flex;
      flex-direction: column;
      gap: 5px;
      font-size: 12px;
    }

    .t-row {
      display: flex;
      justify-content: space-between;
      color: #555;
    }

    .t-row.grand {
      margin-top: 6px;
      padding-top: 8px;
      border-top: 1px solid #ccc;
      font-size: 14px;
      font-weight: bold;
      color: #111;
    }

    /* Footer */
    .card-footer {
      padding: 9px 16px;
      text-align: center;
      font-size: 10px;
      color: #999;
    }

    @media print {
      body { background: #fff; padding: 0; }
      .bar { display: none !important; }
      .card { border: none; border-radius: 0; max-width: 100%; }
    }
  </style>
</head>
<body>

  <div class="bar">
    <button class="btn-dl" onclick="window.print()">Save / Print</button>
    <button class="btn-dl" style="background:#555;" onclick="window.close()">Close</button>
  </div>

  <div class="card">

    <!-- Title -->
    <div class="title-block">
      <h1>Tax Invoice</h1>
      <p>FoodEat Rasoi &nbsp;|&nbsp; New Delhi</p>
    </div>

    <!-- Invoice Meta -->
    <div class="info-block">
      <div class="info-row">
        <span class="lbl">Invoice No</span>
        <span class="val">${invoiceNo}</span>
      </div>
      <div class="info-row">
        <span class="lbl">Order ID</span>
        <span class="val">#${data.orderId}</span>
      </div>
      <div class="info-row">
        <span class="lbl">Date</span>
        <span class="val">${dateStr}</span>
      </div>
      <div class="info-row">
        <span class="lbl">Payment</span>
        <span class="val" style="text-transform:uppercase">${data.paymentMethod}</span>
      </div>
      <div class="info-row">
        <span class="lbl">Billed To</span>
        <span class="val">${data.customerName} &nbsp;${data.phone}</span>
      </div>
      <div class="info-row">
        <span class="lbl">Address</span>
        <span class="val" style="font-weight:normal;color:#333">${data.address}</span>
      </div>
    </div>

    <!-- Items -->
    <div class="items-block">
      <div class="items-head">
        <span>Item</span>
        <span>Amount</span>
      </div>
      ${data.items.map(item => `
      <div class="item-row">
        <div>
          <div class="item-name">${item.name}</div>
          <div class="item-qty">${item.quantity} x &#8377;${item.price}</div>
        </div>
        <div class="item-amt">&#8377;${Math.round(item.price * item.quantity)}</div>
      </div>`).join("")}
    </div>

    <!-- Totals -->
    <div class="totals-block">
      <div class="t-row">
        <span>Subtotal</span>
        <span>&#8377;${subtotal.toFixed(2)}</span>
      </div>
      ${discount > 0 ? `
      <div class="t-row" style="color:#2e7d32">
        <span>Discount</span>
        <span>-&#8377;${discount.toFixed(2)}</span>
      </div>` : ""}
      <div class="t-row">
        <span>Delivery</span>
        <span>${shippingFee === 0 ? "Free" : "&#8377;" + shippingFee.toFixed(2)}</span>
      </div>
      <div class="t-row">
        <span>GST (${gstRate}%)</span>
        <span>&#8377;${totalTax.toFixed(2)}</span>
      </div>
      <div class="t-row grand">
        <span>Total</span>
        <span>&#8377;${Math.round(grandTotal)}</span>
      </div>
    </div>

    <!-- Footer -->
    <div class="card-footer">
      Computer generated invoice &nbsp;&bull;&nbsp; Thank you for your order!
    </div>

  </div>

</body>
</html>`;

  // Direct file download — no popup, no print dialog
  const blob = new Blob([receiptHtml], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Receipt_${invoiceNo}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const downloadDailyShiftClosingReport = (data: DailyClosingReportData) => {
  if (typeof window === "undefined") return;

  const reportHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Daily Shift Closing Report - ${data.reportId}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; color: #111; max-width: 600px; margin: 0 auto; }
    h1 { font-size: 18px; margin-bottom: 4px; }
    .meta { font-size: 12px; color: #666; margin-bottom: 16px; border-bottom: 1px dashed #ccc; padding-bottom: 8px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px; margin-bottom: 16px; }
    .grid div { background: #f8f8f8; padding: 8px 12px; border-radius: 6px; }
    .total { font-size: 16px; font-weight: bold; margin-top: 10px; }
    button { background: #222; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: bold; }
    @media print { button { display: none; } }
  </style>
</head>
<body>
  <div style="text-align:right;margin-bottom:10px;">
    <button onclick="window.print()">Print Report</button>
  </div>
  <h1>FoodEat Rasoi — Shift Report</h1>
  <div class="meta">
    Report: ${data.reportId} &nbsp;|&nbsp; Date: ${data.date} &nbsp;|&nbsp; Orders: ${data.totalOrders}
  </div>
  <div class="grid">
    <div><strong>Gross Sales:</strong> &#8377;${data.grossSales}</div>
    <div><strong>Discounts:</strong> &#8377;${data.totalDiscount}</div>
    <div><strong>Taxable:</strong> &#8377;${data.taxableSales}</div>
    <div><strong>GST (${data.gstPercent}%):</strong> &#8377;${data.gstAmount}</div>
    <div><strong>Online (UPI):</strong> &#8377;${data.onlineUpiPaid}</div>
    <div><strong>Cash Collected:</strong> &#8377;${data.cashOnDeliveryCollected}</div>
  </div>
  <div class="total">Net Revenue: &#8377;${data.netRevenue}</div>
</body>
</html>`;

  const w = window.open("", "_blank");
  if (w) {
    w.document.open();
    w.document.write(reportHtml);
    w.document.close();
  }
};
