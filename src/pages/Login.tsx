import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthSocialButton } from "@/components/auth/AuthSocialButton";
import GoogleIcon  from "@/components/ui/icons/GoogleIcon";
import { LinkedinIcon } from "@/components/ui/icons/linkedin-icon";
import { authContent } from "@/data/data";

export default function Login() {
  const content = authContent.login;
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthShell panelTitle={content.panelTitle} panelDescription={content.panelDescription}>
      <div>
        <h1 className="text-[30px] font-semibold tracking-[-0.035em] text-[#171d2b]">{content.title}</h1>
        <p className="mt-1 text-[16px] text-[#747c8d]">{content.subtitle}</p>

        <div className="mt-7 space-y-3">
          <AuthSocialButton icon={<LinkedinIcon className="h-5 w-5" variant="brand" />}>{content.social.linkedin}</AuthSocialButton>
          <AuthSocialButton icon={<GoogleIcon className="h-5 w-5" />}>{content.social.google}</AuthSocialButton>
        </div>

        <div className="my-7 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#e1e3e7]" />
          <span className="whitespace-nowrap text-[12px] font-medium text-[#a0a3a8]">{content.divider}</span>
          <div className="h-px flex-1 bg-[#e1e3e7]" />
        </div>

        <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
          <label className="block">
            <span className="mb-2 block text-[12px] font-semibold tracking-wide text-[#62666d]">{content.emailLabel}</span>
            <input type="email" placeholder={content.emailPlaceholder} className="h-[54px] w-full rounded-[12px] border border-[#d5d9df] px-4 text-[16px] text-[#202124] outline-none transition placeholder:text-[#a5adbc] focus:border-[#2864f0] focus:ring-2 focus:ring-[#2864f0]/10" />
          </label>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[12px] font-semibold tracking-wide text-[#62666d]">{content.passwordLabel}</span>
              <a href="#" className="text-[13px] font-medium text-[#2864f0] hover:underline">{content.forgotPassword}</a>
            </div>

            <div className="relative">
              <input type={showPassword ? "text" : "password"} placeholder={content.passwordPlaceholder} className="h-[54px] w-full rounded-[12px] border border-[#d5d9df] px-4 pr-12 text-[16px] text-[#202124] outline-none transition placeholder:text-[#a5adbc] focus:border-[#2864f0] focus:ring-2 focus:ring-[#2864f0]/10" />
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ba0a8] transition hover:text-[#555b64]" aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button type="submit" className="mt-1 h-[50px] w-full rounded-[12px] bg-[#2864f0] text-[16px] font-semibold text-white shadow-[0_6px_14px_rgba(40,100,240,0.22)] transition hover:bg-[#2059dd]">
            {content.submit}
          </button>
        </form>

        <p className="mt-7 text-center text-[14px] text-[#747c8d]">
          {content.footerPrefix}{" "}
          <a href={content.footerHref} className="font-medium text-[#2864f0] hover:underline">{content.footerAction}</a>
        </p>
      </div>
    </AuthShell>
  );
}