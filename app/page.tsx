export default function LandingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-4xl font-bold">MentorIIT</h1>
        <p className="text-lg text-gray-600">
          Private, paid mentorship for JEE/IIT aspirants.
        </p>
        <a
          href="/checkout"
          className="inline-block bg-black text-white px-6 py-3 rounded"
        >
          Pay & Get Access — ₹14,999
        </a>
      </div>
    </main>
  );
}
