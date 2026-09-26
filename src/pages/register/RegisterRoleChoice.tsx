import { ArrowRight, Building2, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

export function RegisterRoleChoice({
  onSelect,
}: {
  onSelect: (role: "creator" | "brand") => void;
}) {
  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-12">
        <div className="text-center">
          <div className="text-2xl font-bold tracking-[-.05em]">
            naano<span className="text-[#2864f0]">.</span>
          </div>
          <p className="mt-12 text-[11px] font-bold uppercase tracking-[.18em] text-[#2864f0]">
            Get started
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-.055em] text-[#171d2b] md:text-5xl">
            How will you use Naano?
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-7 text-[#737c8d]">
            Choose your path and we’ll ask only the questions relevant to your
            workspace.
          </p>
        </div>
        <div className="mx-auto mt-12 grid w-full max-w-3xl gap-5 md:grid-cols-2">
          <button
            type="button"
            onClick={() => onSelect("creator")}
            className="group cursor-pointer rounded-[28px] border border-[#e1e6ee] bg-white p-8 text-left shadow-[0_12px_40px_rgba(35,52,80,.06)] transition duration-200 hover:-translate-y-1 hover:border-[#cbd1da] hover:shadow-[0_22px_60px_rgba(35,52,80,.12)]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef4ff] text-[#2864f0]">
              <UserRound className="h-6 w-6" />
            </div>
            <div className="mt-9 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-[-.03em]">
                  I’m a creator
                </h2>
                <p className="mt-2 max-w-xs text-sm leading-6 text-[#737c8d]">
                  Build your creator card, connect your social presence and find
                  paid opportunities.
                </p>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-[#9aa2b0] transition group-hover:translate-x-1 group-hover:text-[#626a78]" />
            </div>
          </button>
          <button
            type="button"
            onClick={() => onSelect("brand")}
            className="group cursor-pointer rounded-[28px] border border-[#e1e6ee] bg-white p-8 text-left shadow-[0_12px_40px_rgba(35,52,80,.06)] transition duration-200 hover:-translate-y-1 hover:border-[#cbd1da] hover:shadow-[0_22px_60px_rgba(35,52,80,.12)]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef4ff] text-[#2864f0]">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="mt-9 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-[-.03em]">
                  I’m a brand
                </h2>
                <p className="mt-2 max-w-xs text-sm leading-6 text-[#737c8d]">
                  Create your company profile, define your ICP and launch
                  creator campaigns.
                </p>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-[#9aa2b0] transition group-hover:translate-x-1 group-hover:text-[#626a78]" />
            </div>
          </button>
        </div>
        <p className="mt-8 text-center text-sm text-[#8a92a0]">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-[#2864f0]">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
