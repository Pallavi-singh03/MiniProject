"use client";

export default function CheckoutForm() {
  return (
    <form className="bg-white shadow-lg rounded-2xl p-4 space-y-4">
      {/* Name */}
      <div>
        <label className="block mb-1 font-medium">Full Name</label>
        <input
          type="text"
          placeholder="Enter your name"
          className="w-full p-2 border rounded-lg"
        />
      </div>

      {/* Address */}
      <div>
        <label className="block mb-1 font-medium">Delivery Address</label>
        <textarea
          placeholder="Enter your address"
          className="w-full p-2 border rounded-lg"
          rows={3}
        ></textarea>
      </div>

      {/* Payment */}
      <div>
        <label className="block mb-1 font-medium">Payment Method</label>
        <select className="w-full p-2 border rounded-lg">
          <option>Cash on Delivery</option>
          <option>UPI</option>
          <option>Card Payment</option>
        </select>
      </div>

      {/* Place Order Button */}
      <button
        type="submit"
        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
      >
        Place Order
      </button>
    </form>
  );
}
