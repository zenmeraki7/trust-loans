export default function StopSharingMoreDataCard() {
  const items = [
    "OTP",
    "Password",
    "Aadhaar/PAN again through WhatsApp",
    "Selfie/private photos",
    "Bank statement",
    "Contact list",
    "UPI PIN",
    "Remote access app permissions",
  ];

  return (
    <section className="rounded-2xl border border-rose-200 bg-rose-50 p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-rose-900">Stop Sharing More Data</h2>
      <p className="mt-1 text-sm text-rose-900">This is extremely important in harassment situations.</p>
      <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 text-sm text-rose-900">
        {items.map((item) => (
          <li key={item} className="rounded-lg border border-rose-200 bg-white/80 p-2">Do not share: {item}</li>
        ))}
      </ul>
    </section>
  );
}
