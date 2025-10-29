type CalloutProps = { type: "info" | "tip" | "warning"; text: string };

export const Callout = ({ type, text }: CalloutProps) => {
  let tone = "bg-sky-50/30 border-sky-200/40";
  if (type === "warning") {
    tone = "bg-amber-50/30 border-amber-200/40";
  } else if (type === "tip") {
    tone = "bg-emerald-50/30 border-emerald-200/40";
  }

  return (
    <div
      className={`rounded-xl backdrop-blur px-3 py-2 text-sm text-text-primary border ${tone}`}
    >
      {text}
    </div>
  );
};
