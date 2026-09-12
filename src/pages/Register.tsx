import { useState } from "react";
import { Check } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { authContent } from "@/data/data";

export default function Register() {
  const content = authContent.register;
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  return (
    <AuthShell panelTitle={content.panelTitle} panelDescription={content.panelDescription}>
      <div>
        <h1 className="text-[30px] font-semibold tracking-[-0.035em] text-[#171d2b]">{content.title}</h1>
        <p className="mt-1 text-[16px] text-[#747c8d]">{content.subtitle}</p>

        <div className="mt-8 space-y-3">
          {content.roles.map((role) => {
            const selected = selectedRole === role.id;

            return (
              <button key={role.id} type="button" onClick={() => setSelectedRole(role.id)} className={`relative w-full rounded-[14px] border p-5 text-left transition ${selected ? "border-[#2864f0] bg-[#f4f8ff] shadow-[0_4px_14px_rgba(40,100,240,0.08)]" : "border-[#dfe2e8] bg-white hover:border-[#cbd0d8] hover:bg-[#fafbfc]"}`}>
                <div className="pr-8">
                  <h2 className="text-[16px] font-semibold text-[#202124]">{role.title}</h2>
                  <p className="mt-1 text-[14px] leading-5 text-[#747c8d]">{role.description}</p>
                </div>

                <span className={`absolute right-5 top-5 flex h-5 w-5 items-center justify-center rounded-full border ${selected ? "border-[#2864f0] bg-[#2864f0] text-white" : "border-[#cdd1d8]"}`}>
                  {selected && <Check className="h-3 w-3" strokeWidth={3} />}
                </span>
              </button>
            );
          })}
        </div>

        <button type="button" disabled={!selectedRole} className="mt-5 h-[50px] w-full rounded-[12px] bg-[#2864f0] text-[16px] font-semibold text-white shadow-[0_6px_14px_rgba(40,100,240,0.22)] transition hover:bg-[#2059dd] disabled:cursor-not-allowed disabled:opacity-45">
          Continue
        </button>

        <p className="mt-7 text-center text-[14px] text-[#747c8d]">
          {content.footerPrefix}{" "}
          <a href={content.footerHref} className="font-medium text-[#2864f0] hover:underline">{content.footerAction}</a>
        </p>
      </div>
    </AuthShell>
  );
}