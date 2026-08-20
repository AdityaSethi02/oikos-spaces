import PDFDocument from "pdfkit";
import { brand } from "@/lib/brand";
import type { GuestBookingDto } from "@/server/dto/public.dto";
import { formatCurrency } from "@/lib/utils";

function formatRupeeFromPaise(paise: number): string {
  return formatCurrency(Math.round(paise / 100));
}

export async function generateBookingInvoicePdf(booking: GuestBookingDto): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const snapshot = booking.quote.snapshot;

    doc.fontSize(22).text(brand.name, { continued: false });
    doc.fontSize(10).fillColor("#78716C").text(brand.tagline);
    doc.moveDown(0.5);
    doc.fillColor("#1C1917").fontSize(10).text(brand.contact.email);
    doc.text(brand.contact.phone);
    doc.text(brand.contact.address);

    doc.moveDown(1.5);
    doc.fontSize(16).text("Tax Invoice / Receipt");
    doc.moveDown(0.5);
    doc.fontSize(10);
    doc.text(`Invoice for booking #${booking.id}`);
    doc.text(`Issue date: ${new Date().toISOString().slice(0, 10)}`);
    doc.text(`Stay dates: ${booking.checkIn} → ${booking.checkOut}`);

    doc.moveDown(1);
    doc.fontSize(12).text("Guest");
    doc.fontSize(10).fillColor("#78716C");
    doc.text(booking.guestName || "Guest");
    if (booking.guestEmail) doc.text(booking.guestEmail);
    if (booking.guestPhone) doc.text(booking.guestPhone);

    doc.moveDown(1);
    doc.fillColor("#1C1917").fontSize(12).text("Property");
    doc.fontSize(10).fillColor("#78716C");
    doc.text(booking.property.name);
    doc.text(booking.property.location);
    if (booking.property.address) doc.text(booking.property.address);

    doc.moveDown(1.5);
    doc.fillColor("#1C1917").fontSize(12).text("Charges");
    doc.moveDown(0.5);

    snapshot.lineItems.forEach((item) => {
      const y = doc.y;
      doc.text(item.label, 50, y, { width: 350 });
      doc.text(formatRupeeFromPaise(item.amountPaise), 420, y, {
        width: 120,
        align: "right",
      });
      doc.moveDown(0.8);
    });

    doc.moveDown(0.5);
    doc.strokeColor("#E7E5E4").moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(0.5);

    doc.fontSize(11).fillColor("#1C1917");
    doc.text("Total", 50, doc.y, { width: 350, continued: false });
    doc.text(formatRupeeFromPaise(snapshot.totalPaise), 420, doc.y - 14, {
      width: 120,
      align: "right",
    });

    doc.moveDown(2);
    doc.fontSize(9).fillColor("#78716C");
    doc.text(
      `Payment method: ${booking.paymentMethod}. Status: ${booking.paymentStatus}. Currency: ${snapshot.currency}.`,
    );
    doc.text("This document is generated electronically and does not require a signature.");

    doc.end();
  });
}
