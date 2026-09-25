interface StatCardProps {
  label: string;
  value: string;
  description: string;
}

export function StatCard({ label, value, description }: StatCardProps) {
  return (
    <div className="rounded-[18px] border border-[#e1e6ee] bg-white px-5 py-5 shadow-[0_2px_8px_rgba(20,35,60,0.03)]">
      <p className="text-[12px] font-semibold tracking-[0.08em] text-[#91a0b8]">
        {label}
      </p>

      <p className="mt-3 text-[27px] font-semibold tracking-[-1px] text-[#111827]">
        {value}
      </p>

      <p className="mt-2 text-[12px] leading-5 text-[#8995aa]">{description}</p>
    </div>
  );
}
