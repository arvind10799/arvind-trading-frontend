export default function AIExplanation({ explanation }) {
  if (!explanation) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl h-full">
      <h2 className="text-lg font-semibold mb-4">AI Market Reasoning</h2>

      <div className="space-y-2 text-sm text-slate-300">
        {explanation.map((text, i) => (
          <p key={i} className="flex gap-2">
            <span className="text-blue-400">•</span>
            {text}
          </p>
        ))}
      </div>
    </div>
  );
}
