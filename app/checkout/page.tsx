export default function CheckoutPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <p className="text-gray-600">
          Razorpay integration ships in Phase 2. This page exists so the landing
          CTA doesn&rsquo;t 404 during pre-launch.
        </p>
        <a href="/" className="text-blue-600 underline">
          Back to landing
        </a>
      </div>
    </main>
  );
}
