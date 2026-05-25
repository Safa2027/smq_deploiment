export default function ProcessCard({ process, onClick }) {
  const hasFiche = process.ficheStatus === "deposee";

  const categoryStyles = {
    Management: { bg: "#E8F5F0", text: "#0F6E56", border: "#5DCAA5" },
    Réalisation: { bg: "#E6F1FB", text: "#185FA5", border: "#85B7EB" },
    Support: { bg: "#FFF3E8", text: "#854F0B", border: "#EF9F27" },
  };

  const cat = categoryStyles[process.category] || {
    bg: "#F1EFE8",
    text: "#5F5E5A",
    border: "#B4B2A9",
  };

  const scoreLevel =
    process.score >= 70
      ? "good"
      : process.score >= 50
      ? "mid"
      : "bad";

  const config = {
    good: {
      color: "#0F6E56",
      bg: "#E1F5EE",
      label: "Conforme",
    },
    mid: {
      color: "#854F0B",
      bg: "#FAEEDA",
      label: "À surveiller",
    },
    bad: {
      color: "#A32D2D",
      bg: "#FCEBEB",
      label: "Critique",
    },
  }[scoreLevel];

  return (
    <div
      onClick={() => onClick(process)}
      className="
        group cursor-pointer
        rounded-xl border
        bg-white
        p-4
        transition-all
        duration-200
        hover:shadow-md
        hover:-translate-y-0.5
      "
      style={{
        borderColor: hasFiche ? "#E2E8F0" : "#F09595",
      }}
    >
      {/* HEADER */}
      <div className="flex items-start justify-between gap-3">

        {/* LEFT: CATEGORY + TITLE */}
        <div className="flex flex-col gap-1">
          <span
            className="inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium"
            style={{
              background: cat.bg,
              color: cat.text,
              border: `1px solid ${cat.border}`,
            }}
          >
            {process.category}
          </span>

          <h3 className="text-[14px] font-semibold text-[#2F4157] leading-snug">
            {process.name}
          </h3>

          <p className="text-[11px] text-[#567C8E]">
            {process.resp}
          </p>
        </div>

        {/* RIGHT: SCORE */}
        {hasFiche ? (
          <div className="text-right">
            <div className="text-lg font-semibold" style={{ color: config.color }}>
              {process.score}%
            </div>

            <div className="text-[10px] text-[#567C8E]">
              score
            </div>
          </div>
        ) : (
          <span className="text-[11px] px-2 py-1 rounded-full bg-[#FCEBEB] text-[#A32D2D]">
            Sans fiche
          </span>
        )}
      </div>

      {/* PROGRESS */}
      {hasFiche && (
        <div className="mt-3">
          <div className="h-1.5 w-full rounded-full bg-[#E2E8F0] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${process.score}%`,
                background: config.color,
              }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] text-[#567C8E]">
              {config.label}
            </span>

            <span
              className="text-[11px] font-medium opacity-0 group-hover:opacity-100 transition"
              style={{ color: "#567C8E" }}
            >
              Ouvrir 
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
