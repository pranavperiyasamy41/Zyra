import React from 'react';
import { createPortal } from 'react-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAuth } from '../context/AuthContext';
import { X, Download, ShoppingBag, User, Calendar, Hash, IndianRupee, Printer } from 'lucide-react';

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

const formatRupee = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
};

const ViewDetailsModal: React.FC<ViewDetailsModalProps> = ({ isOpen, onClose, data }) => {
  const { user } = useAuth();

  if (!isOpen || !data) return null;

  // 🖨️ PDF GENERATION LOGIC (Modern, Compact & Dynamic Height)
  const downloadPDF = () => {
    // Calculate required height: Header(30) + Info(40) + Items(N*7) + Total(20) + Footer(15)
    const rowHeight = 7;
    const baseHeight = 95;
    const dynamicHeight = Math.max(120, baseHeight + (data.items.length * rowHeight));

    const doc = new jsPDF({
        unit: 'mm',
        format: [80, dynamicHeight]
    });

    const brandPrimary = [11, 94, 74]; // #0B5E4A
    const textDark = [30, 41, 59];
    const textGray = [100, 116, 139];

    // 1. Header Banner
    doc.setFillColor(brandPrimary[0], brandPrimary[1], brandPrimary[2]);
    doc.rect(0, 0, 80, 25, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    const pharmacyName = user?.pharmacyName || "PHARMACY";
    doc.text(pharmacyName.toUpperCase(), 40, 12, { align: 'center' });
    
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    const addressLine = `${user?.city || ''}, ${user?.state || ''} ${user?.pincode || ''}`;
    doc.text(addressLine, 40, 17, { align: 'center' });
    doc.text(`Lic: ${user?.drugLicense || 'N/A'} | Ph: ${user?.pharmacyContact || 'N/A'}`, 40, 21, { align: 'center' });

    // 2. Invoice Meta Info
    let currentY = 32;
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE RECEIPT", 5, currentY);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(textGray[0], textGray[1], textGray[2]);
    const invId = data._id.slice(-8).toUpperCase();
    const dateStr = new Date(data.createdAt).toLocaleDateString();
    doc.text(`ID: #${invId}`, 5, currentY + 4);
    doc.text(`Date: ${dateStr}`, 80 - 5, currentY + 4, { align: 'right' });

    // 3. Customer Info
    currentY += 12;
    doc.setFillColor(248, 250, 252);
    doc.rect(5, currentY, 70, 12, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(5, currentY, 70, 12, 'S');
    
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.setFont("helvetica", "bold");
    doc.text("BILL TO:", 8, currentY + 4.5);
    doc.setFont("helvetica", "normal");
    doc.text(data.customerName || 'Guest Customer', 8, currentY + 8.5);
    if (data.customerMobile) {
        doc.setFontSize(6);
        doc.text(data.customerMobile, 72, currentY + 8.5, { align: 'right' });
    }

    // 4. Items Table
    const tableRows = data.items.map((item) => [
      { content: item.name, styles: { fontStyle: 'bold' } },
      item.quantity,
      `Rs.${(item.quantity * item.price).toFixed(0)}`
    ]);

    autoTable(doc, {
      startY: currentY + 16,
      margin: { left: 5, right: 5 },
      head: [['Item', 'Qty', 'Total']],
      body: tableRows,
      theme: 'striped',
      headStyles: { 
        fillColor: brandPrimary, 
        fontSize: 7, 
        halign: 'left',
        textColor: [255, 255, 255]
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 10, halign: 'center' },
        2: { cellWidth: 15, halign: 'right' }
      },
      styles: { 
        fontSize: 7, 
        cellPadding: 2,
        valign: 'middle'
      },
      didDrawPage: (d) => {
        // @ts-ignore
        currentY = d.cursor.y;
      }
    });

    // 5. Total Section
    currentY += 8;
    doc.setDrawColor(brandPrimary[0], brandPrimary[1], brandPrimary[2]);
    doc.setLineWidth(0.5);
    doc.line(40, currentY, 75, currentY);
    
    currentY += 5;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(brandPrimary[0], brandPrimary[1], brandPrimary[2]);
    doc.text("GRAND TOTAL:", 40, currentY);
    doc.text(`Rs.${data.totalAmount.toLocaleString('en-IN')}`, 75, currentY, { align: 'right' });

    // 6. Footer
    doc.setFontSize(6);
    doc.setTextColor(textGray[0], textGray[1], textGray[2]);
    doc.setFont("helvetica", "normal");
    doc.text("Thank you for choosing us!", 40, currentY + 12, { align: 'center' });

    // Save
    doc.save(`Receipt_${invId}.pdf`);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-950 w-full max-w-xl rounded-2xl md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[90vh]">
        
        {/* Header */}
        <div 
            style={{ background: 'linear-gradient(90deg, #0E5A4E 0%, #1E7F4F 50%, #25A756 100%)' }}
            className="p-5 md:p-6 flex justify-between items-center shadow-lg relative overflow-hidden flex-shrink-0"
        >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            
            <div className="relative z-10 text-white flex items-center gap-3 md:gap-4">
                <div className="p-2 md:p-2.5 bg-white/20 rounded-xl backdrop-blur-md border border-white/10 shadow-inner">
                    <Printer className="w-5 h-5 md:w-6 md:h-6 text-brand-highlight" />
                </div>
                <div>
                    <h2 className="text-lg md:text-xl font-black uppercase tracking-tight">Sale Receipt</h2>
                    <p className="text-[9px] md:text-[10px] font-bold text-emerald-100 uppercase tracking-[0.2em] opacity-80">Ref: #{data._id.slice(-8).toUpperCase()}</p>
                </div>
            </div>
            
            <button 
                onClick={onClose}
                className="relative z-10 p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all hover:rotate-90 active:scale-95"
            >
                <X className="w-5 h-5" />
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 md:p-8 bg-slate-50 dark:bg-slate-900 space-y-6 scrollbar-hide">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-1.5 bg-teal-50 dark:bg-teal-900/30 text-teal-600 rounded-lg">
                        <User className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</span>
                </div>
                <p className="text-sm font-black text-slate-900 dark:text-white truncate">{data.customerName || 'Guest Sale'}</p>
                {data.customerMobile && <p className="text-[10px] font-mono text-teal-500 mt-0.5">{data.customerMobile}</p>}
            </div>

            <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm text-right">
                <div className="flex items-center gap-3 mb-2 justify-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Date</span>
                    <div className="p-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                        <Calendar className="w-3.5 h-3.5" />
                    </div>
                </div>
                <p className="text-sm font-black text-slate-900 dark:text-white">{new Date(data.createdAt).toLocaleDateString()}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">{new Date(data.createdAt).toLocaleTimeString()}</p>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                <ShoppingBag className="w-3 h-3" /> Purchased Items
            </h3>
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            <tr>
                                <th className="px-4 py-3">Item</th>
                                <th className="px-4 py-3 text-center">Qty</th>
                                <th className="px-4 py-3 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                            {data.items.map((item, idx) => (
                                <tr key={idx} className="group hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                    <td className="px-4 py-3">
                                        <p className="text-xs font-bold text-slate-900 dark:text-white">{item.name}</p>
                                        <p className="text-[9px] font-mono text-slate-400 mt-0.5">{item.batchId || 'No Batch'}</p>
                                    </td>
                                    <td className="px-4 py-3 text-center text-xs font-black text-slate-600 dark:text-slate-400">{item.quantity}</td>
                                    <td className="px-4 py-3 text-right text-xs font-bold text-slate-900 dark:text-white">{formatRupee(item.price * item.quantity)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          </div>

          {/* Grand Total */}
          <div className="bg-gradient-to-r from-brand-primary to-brand-dark p-6 rounded-2xl md:rounded-3xl text-white flex justify-between items-center shadow-xl shadow-brand-primary/20">
            <div>
                <p className="text-[10px] font-black text-brand-highlight uppercase tracking-[0.2em] mb-1">Total Amount Payable</p>
                <div className="flex items-center gap-2">
                    <IndianRupee className="w-5 h-5 text-brand-highlight" />
                    <span className="text-2xl md:text-3xl font-black">{data.totalAmount.toLocaleString('en-IN')}</span>
                </div>
            </div>
            <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold text-emerald-100/60 uppercase">Method</p>
                <p className="text-xs font-black uppercase tracking-widest">Cash / UPI</p>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-5 md:p-6 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex gap-3 md:gap-4 flex-shrink-0">
            <button 
                onClick={onClose} 
                className="flex-1 py-3 md:py-3.5 rounded-xl md:rounded-2xl font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-xs md:text-sm uppercase tracking-widest"
            >
                Dismiss
            </button>
            <button 
                onClick={downloadPDF} 
                className="flex-[2] group relative overflow-hidden bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] hover:shadow-[#1FAE63]/40 text-white py-3 md:py-3.5 rounded-xl md:rounded-2xl font-black shadow-xl shadow-[#0B5E4A]/30 transition-all active:scale-95 flex items-center justify-center gap-2 text-xs md:text-sm uppercase tracking-wide"
            >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <Download className="w-4 h-4 md:w-5 md:h-5 relative z-10" /> 
                <span className="relative z-10">Export Invoice</span>
            </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ViewDetailsModal;