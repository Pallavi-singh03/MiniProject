"use client";

export default function CheckoutSummary() {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-4">
      {/* Placeholder for cart items */}
      <div className="border-b pb-4 mb-4">
        <p className="font-medium">Vadapav × 1 — ₹20</p>
        <p className="font-medium">Masala Maggie × 1 — ₹30</p>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center font-bold text-lg">
        <span>Total</span>
        <span>₹50</span>
      </div>
    </div>
  );
}
