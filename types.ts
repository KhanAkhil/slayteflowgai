import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Invoice, ProformaInvoice, Quotation } from './types';

export const generateInvoicePDF = (invoice: Invoice | Quotation) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const isQuotation = invoice.docType === 'quotation';
  const isCredit = invoice.docType === 'credit';
  const isProforma = invoice.docType === 'proforma';

  // Header Bar (Black)
  doc.setFillColor(13, 16, 24);
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(invoice.supplierName.toUpperCase(), 10, 15);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`GSTIN: ${invoice.supplierGstin}`, 10, 22);
  doc.text(`Email: ${invoice.supplierEmail} | Phone: ${invoice.supplierPhone}`, 10, 27);
  doc.text(invoice.supplierAddr, 10, 32, { maxWidth: 120 });

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const title = isQuotation ? 'QUOTATION' : isCredit ? 'CREDIT NOTE' : isProforma ? 'PROFORMA INVOICE' : 'TAX INVOICE';
  doc.text(title, pageWidth - 10, 15, { align: 'right' });
  doc.setFontSize(12);
  doc.text(invoice.number, pageWidth - 10, 25, { align: 'right' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Status: ${invoice.status.toUpperCase()}`, pageWidth - 10, 32, { align: 'right' });

  // Meta Info Bar
  doc.setFillColor(245, 247, 250);
  doc.rect(0, 40, pageWidth, 15, 'F');
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(`DATE: ${invoice.date}`, 10, 49);
  doc.text(`DUE DATE: ${invoice.dueDate}`, 45, 49);
  doc.text(`REF NO: ${invoice.refNumber || '-'}`, 85, 49);
  doc.text(`TAX TYPE: ${invoice.taxType.toUpperCase()}`, 125, 49);
  doc.text(`PLACE OF SUPPLY: ${invoice.placeOfSupply}`, 160, 49);

  // Party Table
  autoTable(doc, {
    startY: 60,
    head: [['BILL TO', 'SHIP TO']],
    body: [[
      `${invoice.customerName}\n${invoice.billingAddr.line1}\n${invoice.billingAddr.line2}\n${invoice.billingAddr.city}, ${invoice.billingAddr.state} - ${invoice.billingAddr.pin}\nGSTIN: ${invoice.customerGstin}\nPhone: ${invoice.customerPhone}`,
      `${invoice.customerName}\n${invoice.shippingAddr.line1}\n${invoice.shippingAddr.line2}\n${invoice.shippingAddr.city}, ${invoice.shippingAddr.state} - ${invoice.shippingAddr.pin}`
    ]],
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 4, lineColor: [230, 230, 230] },
    headStyles: { fillColor: [60, 60, 60], textColor: 255, fontStyle: 'bold' }
  });

  // Items Table
  const hasDiscount = invoice.items.some(item => item.disc > 0);
  const head = [['#', 'Item & Description', 'HSN/SAC', 'Qty', 'Unit', 'Rate', 'Tax', ...(hasDiscount ? ['Disc%'] : []), 'Amount']];
  const body = invoice.items.map((item, i) => [
    i + 1,
    { content: `${item.name}\n${item.desc || ''}`, styles: { fontStyle: 'bold' as const } },
    item.hsn,
    item.qty,
    item.unit,
    `Rs. ${item.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
    `${item.tax}%`,
    ...(hasDiscount ? [`${item.disc}%`] : []),
    `Rs. ${((item.qty * item.rate * (1 - item.disc / 100)) * (1 + item.tax / 100)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
  ]);

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 8,
    head: head,
    body: body,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [108, 99, 255], textColor: 255 },
    columnStyles: {
      1: { cellWidth: hasDiscount ? 60 : 75 },
      2: { cellWidth: 20 },
      [hasDiscount ? 8 : 7]: { halign: 'right' }
    }
  });

  // Totals
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  const totalsX = pageWidth - 80;
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`Subtotal:`, totalsX, finalY);
  doc.setTextColor(0, 0, 0);
  doc.text(`Rs. ${invoice.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, pageWidth - 10, finalY, { align: 'right' });
  
  let currentY = finalY + 6;
  if (invoice.discTotal > 0) {
    doc.setTextColor(100, 100, 100);
    doc.text(`Discount:`, totalsX, currentY);
    doc.setTextColor(220, 0, 0);
    doc.text(`- Rs. ${invoice.discTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, pageWidth - 10, currentY, { align: 'right' });
    currentY += 6;
  }

  doc.setTextColor(100, 100, 100);
  doc.text(`Taxable Amount:`, totalsX, currentY);
  doc.setTextColor(0, 0, 0);
  doc.text(`Rs. ${(invoice.subtotal - invoice.discTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, pageWidth - 10, currentY, { align: 'right' });
  currentY += 6;

  if (invoice.taxType === 'gst') {
    doc.setTextColor(100, 100, 100);
    doc.text(`CGST:`, totalsX, currentY);
    doc.setTextColor(0, 0, 0);
    doc.text(`Rs. ${(invoice.taxTotal / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, pageWidth - 10, currentY, { align: 'right' });
    currentY += 6;
    doc.setTextColor(100, 100, 100);
    doc.text(`SGST:`, totalsX, currentY);
    doc.setTextColor(0, 0, 0);
    doc.text(`Rs. ${(invoice.taxTotal / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, pageWidth - 10, currentY, { align: 'right' });
    currentY += 6;
  } else {
    doc.setTextColor(100, 100, 100);
    doc.text(`IGST:`, totalsX, currentY);
    doc.setTextColor(0, 0, 0);
    doc.text(`Rs. ${invoice.taxTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, pageWidth - 10, currentY, { align: 'right' });
    currentY += 6;
  }

  doc.setFillColor(108, 99, 255);
  doc.rect(totalsX - 5, currentY - 4, 85, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`GRAND TOTAL:`, totalsX, currentY + 2.5);
  doc.text(`Rs. ${invoice.grand.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, pageWidth - 10, currentY + 2.5, { align: 'right' });

  // Notes & Terms
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  let noteY = currentY + 20;
  
  if (invoice.notes) {
    doc.setFont('helvetica', 'bold');
    doc.text('Notes:', 10, noteY);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.notes, 10, noteY + 4, { maxWidth: 90 });
  }
  
  if (invoice.terms) {
    doc.setFont('helvetica', 'bold');
    doc.text('Terms & Conditions:', 110, noteY);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.terms, 110, noteY + 4, { maxWidth: 90 });
  }

  // Signature
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('For ' + invoice.supplierName.toUpperCase(), pageWidth - 10, noteY + 30, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.text('Authorised Signatory', pageWidth - 10, noteY + 45, { align: 'right' });
  doc.line(pageWidth - 60, noteY + 42, pageWidth - 10, noteY + 42);

  // Footer
  doc.setFillColor(13, 16, 24);
  doc.rect(0, 287, pageWidth, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.text('Generated by SlayteFlow · This is a computer-generated document', pageWidth / 2, 293, { align: 'center' });

  const fileName = isQuotation ? `Quotation_${invoice.number}` : isCredit ? `CreditNote_${invoice.number}` : `Invoice_${invoice.number}`;
  doc.save(`${fileName}.pdf`);
};

export const generateProformaPDF = (pi: ProformaInvoice) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Outer Border
  doc.setDrawColor(0);
  doc.rect(5, 5, pageWidth - 10, 287);

  // Company Header
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(pi.supplierName.toUpperCase(), pageWidth / 2, 15, { align: 'center' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(pi.supplierAddr, pageWidth / 2, 20, { align: 'center', maxWidth: 150 });
  doc.text(`Mobile: ${pi.supplierPhone} | Email: ${pi.supplierEmail}`, pageWidth / 2, 28, { align: 'center' });
  doc.text(`GSTIN: ${pi.supplierGstin}`, pageWidth / 2, 33, { align: 'center' });

  // Dividers
  doc.line(10, 38, pageWidth - 10, 38);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('PROFORMA INVOICE', pageWidth / 2, 44, { align: 'center' });
  doc.line(10, 48, pageWidth - 10, 48);

  // Meta
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Ref No: ${pi.number}`, 15, 55);
  doc.text(`Date: ${pi.date}`, pageWidth - 15, 55, { align: 'right' });

  // To Block
  doc.text('To,', 15, 65);
  doc.setFont('helvetica', 'bold');
  doc.text(pi.customerName, 15, 70);
  doc.text(pi.customerCity.toUpperCase(), 15, 75);
  doc.setFont('helvetica', 'normal');
  doc.text(`Site: ${pi.siteName}`, 15, 82);
  doc.text(pi.salutation || 'Dear Sir,', 15, 90);

  // Items Table
  autoTable(doc, {
    startY: 95,
    head: [['SL no', 'Description', 'HSN code', 'QTY', 'Rate', 'Total']],
    body: pi.items.map((item, i) => [
      i + 1,
      item.name,
      item.hsn,
      `${item.qty} ${item.unit === 'Nos' ? '' : item.unit}`,
      `Rs. ${item.rate.toFixed(2)}`,
      `Rs. ${(item.qty * item.rate).toFixed(2)}`
    ]),
    theme: 'grid',
    styles: { fontSize: 9 },
    headStyles: { fillColor: [255, 255, 255], textColor: 0, lineWidth: 0.1, lineColor: 0 }
  });

  // Totals
  const finalY = (doc as any).lastAutoTable.finalY;
  doc.rect(15, finalY, pageWidth - 30, 25);
  doc.text('Total', 140, finalY + 7);
  doc.text(`Rs. ${pi.subtotal.toFixed(2)}`, pageWidth - 20, finalY + 7, { align: 'right' });
  
  doc.text('CGST 9%', 140, finalY + 13);
  doc.text(`Rs. ${(pi.taxTotal / 2).toFixed(2)}`, pageWidth - 20, finalY + 13, { align: 'right' });
  
  doc.text('SGST 9%', 140, finalY + 19);
  doc.text(`Rs. ${(pi.taxTotal / 2).toFixed(2)}`, pageWidth - 20, finalY + 19, { align: 'right' });

  doc.setFillColor(220, 220, 220);
  doc.rect(15, finalY + 25, pageWidth - 30, 10, 'F');
  doc.rect(15, finalY + 25, pageWidth - 30, 10, 'S');
  doc.setFont('helvetica', 'bold');
  doc.text('Grand Total', 140, finalY + 32);
  doc.text(`Rs. ${pi.grand.toFixed(2)}`, pageWidth - 20, finalY + 32, { align: 'right' });

  // Signature
  doc.setFont('helvetica', 'normal');
  doc.text('Yours Faithfully', 15, finalY + 50);
  doc.text('From', 15, finalY + 55);
  doc.setFont('helvetica', 'bold');
  doc.text(pi.supplierName, 15, finalY + 62);

  doc.save(`PI_${pi.number}.pdf`);
};
