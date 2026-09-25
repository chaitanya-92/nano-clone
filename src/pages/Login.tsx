import { useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthSocialButton } from "@/components/auth/AuthSocialButton";
import GoogleIcon from "@/components/ui/icons/GoogleIcon";
import { LinkedinIcon } from "@/components/ui/icons/linkedin-icon";
import { authContent } from "@/data/data";
import { signIn } from "@/features/authSlice";
import { login } from "@/lib/auth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function Login() {
  const content = authContent.login;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(searchParams.get("error") === "google_not_configured" ? "Google sign-in has not been configured yet." : "");
  const [submitting, setSubmitting] = useState(false);
  const destination = (location.state as { from?: string } | null)?.from ?? "/dashboard";
  if (!isLoading && isAuthenticated) return <Navigate to={destination} replace />;
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setSubmitting(true);
    try { const { user } = await login(email, password); dispatch(signIn(user)); navigate(destination, { replace: true }); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to sign in."); }
    finally { setSubmitting(false); }

  }
  return <AuthShell panelTitle={content.panelTitle} panelDescription={content.panelDescription}><div><h1 className="text-[30px] font-semibold tracking-[-0.035em] text-[#171d2b]">{content.title}</h1><p className="mt-1 text-[16px] text-[#747c8d]">{content.subtitle}</p><div className="mt-7 space-y-3"><AuthSocialButton icon={<LinkedinIcon className="h-5 w-5" variant="brand" />} disabled>LinkedIn sign-in coming soon</AuthSocialButton><a  href={`${import.meta.env.VITE_API_URL ?? ""}/api/auth/google`}  className="block"><AuthSocialButton icon={<GoogleIcon className="h-5 w-5" />}>{content.social.google}</AuthSocialButton></a></div><div className="my-7 flex items-center gap-3"><div className="h-px flex-1 bg-[#e1e3e7]" /><span className="whitespace-nowrap text-[12px] font-medium text-[#a0a3a8]">{content.divider}</span><div className="h-px flex-1 bg-[#e1e3e7]" /></div><form className="space-y-4" onSubmit={handleSubmit} noValidate><label className="block"><span className="mb-2 block text-[12px] font-semibold tracking-wide text-[#62666d]">{content.emailLabel}</span><input required value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" type="email" placeholder={content.emailPlaceholder} className="auth-input" /></label><div><div className="mb-2 flex items-center justify-between"><span className="text-[12px] font-semibold tracking-wide text-[#62666d]">{content.passwordLabel}</span><button type="button" className="text-[13px] font-medium text-[#2864f0] hover:underline">{content.forgotPassword}</button></div><div className="relative"><input required value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" type={showPassword ? "text" : "password"} placeholder={content.passwordPlaceholder} className="auth-input pr-12" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ba0a8] transition hover:text-[#555b64]" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></div></div>{error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}<button disabled={submitting} type="submit" className="auth-submit">{submitting ? "Signing in…" : content.submit}</button></form><p className="mt-7 text-center text-[14px] text-[#747c8d]">{content.footerPrefix}{" "}<Link to={content.footerHref} className="font-medium text-[#2864f0] hover:underline">{content.footerAction}</Link></p></div></AuthShell>;
}
