import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAuth } from '../context/AuthContext'; // 👈 IMPORTED AUTH

interface SaleItem {
  name: string;
  batchId?: string;
  quantity: number;
  price: number;
}

interface Sale {
  _id: string;
  customerName?: string;
  customerMobile?: string;
  items: SaleItem[];
  totalAmount: number;
  createdAt: string;
}

interface ViewDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Sale | null; 
}

const ViewDetailsModal: React.FC<ViewDetailsModalProps> = ({ isOpen, onClose, data }) => {
  const { user } = useAuth(); // 👈 GET LOGGED IN USER DATA

  if (!isOpen || !data) return null;

  // 🖨️ PDF GENERATION LOGIC
  const downloadPDF = () => {
    const doc = new jsPDF();

    // 1. Header (DYNAMIC DATA) 🟢
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    // Use user's pharmacy name or fallback to "Smart Pharmacy"
    const pharmacyName = user?.pharmacyName || "SMART PHARMACY";
    doc.text(pharmacyName.toUpperCase(), 14, 22);
    
    doc.setFontSize(10);
    // Construct Address
    const addressLine = `${user?.address || ''}, ${user?.city || ''}, ${user?.state || ''} - ${user?.pincode || ''}`;
    // Wrap text if it's too long
    const splitAddress = doc.splitTextToSize(addressLine.replace(/^, /, '').replace(/, ,/g, ','), 100);
    doc.text(splitAddress, 14, 28);
    
    // License
    const licenseY = 28 + (splitAddress.length * 5); // Adjust Y based on address lines
    doc.text(`Lic No: ${user?.drugLicense || 'N/A'}`, 14, licenseY);
    
    if (user?.pharmacyContact) {
        doc.text(`Ph: ${user.pharmacyContact}`, 14, licenseY + 5);
    }

    // 2. Invoice Details (Right Side)
    doc.setFontSize(10);
    const date = new Date(data.createdAt).toLocaleDateString();
    doc.text(`Invoice #: ${data._id.slice(-6).toUpperCase()}`, 140, 22);
    doc.text(`Date: ${date}`, 140, 28);

    // 3. Customer Details (Left Side below header)
    doc.setFontSize(12);
    doc.text("Bill To:", 14, licenseY + 15);
    doc.setFontSize(10);
    doc.text(`Name: ${data.customerName || 'Guest'}`, 14, licenseY + 21);
    if (data.customerMobile) {
        doc.text(`Mobile: ${data.customerMobile}`, 14, licenseY + 26);
    }

    // 4. Items Table
    const tableRows = data.items.map((item) => [
      item.name,
      item.batchId || 'N/A',
      item.quantity,
      `$${item.price}`,
      `$${(item.quantity * item.price).toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: licenseY + 35, // Dynamic start position
      head: [['Medicine', 'Batch', 'Qty', 'Price', 'Total']],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [22, 163, 74] },
      styles: { fontSize: 10, cellPadding: 3 },
    });

    // 5. Grand Total
    // @ts-ignore
    const finalY = doc.lastAutoTable.finalY + 10;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Grand Total: $${data.totalAmount.toFixed(2)}`, 140, finalY);

    // 6. Footer
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Thank you for your business!", 105, 280, { align: "center" });

    doc.save(`Invoice_${data._id.slice(-6)}.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-fadeIn">
        {/* Header */}
        <div className="bg-gray-100 dark:bg-slate-900 p-6 border-b dark:border-slate-700 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-wider">
              🧾 Sale Receipt
            </h2>
            <p className="text-xs text-gray-500 mt-1 font-mono">ID: {data._id}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 font-bold text-2xl transition-colors">&times;</button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {/* Customer & Date Info */}
          <div className="flex justify-between mb-6 text-sm bg-blue-50 dark:bg-slate-700/30 p-4 rounded-lg border border-blue-100 dark:border-slate-700">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold mb-1">Customer</p>
              <p className="font-bold dark:text-white text-lg">{data.customerName || 'Guest'}</p>
              {data.customerMobile && (
                <p className="text-xs text-blue-600 dark:text-blue-400 font-mono mt-1">📞 {data.customerMobile}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold mb-1">Date</p>
              <p className="font-bold dark:text-white">{new Date(data.createdAt).toLocaleDateString()}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-mono">{new Date(data.createdAt).toLocaleTimeString()}</p>
            </div>
          </div>

          {/* Items List */}
          <div className="border rounded-xl overflow-hidden dark:border-slate-700 mb-6">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-slate-700 text-gray-500 dark:text-gray-400 uppercase text-xs font-bold">
                <tr>
                  <th className="p-3 text-left">Item</th>
                  <th className="p-3 text-center">Batch</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700 bg-white dark:bg-slate-800">
                {data.items.map((item, idx) => (
                  <tr key={idx} className="dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                    <td className="p-3 font-medium">{item.name}</td>
                    <td className="p-3 text-center text-xs font-mono text-gray-500">{item.batchId || '-'}</td>
                    <td className="p-3 text-center">{item.quantity}</td>
                    <td className="p-3 text-right">${item.price}</td>
                    <td className="p-3 text-right font-bold">${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800">
            <span className="font-bold text-emerald-800 dark:text-emerald-300 uppercase text-xs tracking-wider">Total Amount</span>
            <span className="font-black text-2xl text-emerald-600 dark:text-white">${data.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-slate-900 p-4 border-t dark:border-slate-700 flex justify-end gap-2">
          <button 
            onClick={downloadPDF} 
            className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-sm font-bold flex items-center gap-2 shadow-lg"
          >
            📄 Download Invoice
          </button>
          <button onClick={onClose} className="px-6 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg text-sm">Close</button>
        </div>
      </div>
    </div>
  );
};

export default ViewDetailsModal;