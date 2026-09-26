import { Eye, EyeOff } from "lucide-react";
import GoogleIcon from "@/components/ui/icons/GoogleIcon";
import { FieldError } from "@/auth/components/FieldError";
import { EmailField, Input } from "./RegisterFields";
import { useRegistrationForm } from "./registerContext";

export function RegisterAccountStep() {
  const {
    formik,
    role,
    emailStatus,
    setEmailStatus,
    emailVerified,
    setEmailVerified,
    handleExistingEmail,
    showPassword,
    setShowPassword,
  } = useRegistrationForm();

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[#e4e7ec] bg-[#fafbfc] p-4">
        <p className="text-sm font-semibold text-[#252a34]">
          {role === "creator" ? "Creator workspace" : "Brand workspace"}
        </p>
        <p className="mt-1 text-xs leading-5 text-[#747c8d]">
          You can refine these details later from your workspace.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <a
          href={`${import.meta.env.VITE_API_URL ?? "http://localhost:8787"}/api/auth/google?role=${role}&flow=signup`}
          className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#dfe3e8] bg-white text-sm font-semibold text-[#252a34] transition hover:bg-[#f7f8fa]"
        >
          <GoogleIcon className="h-5 w-5" />
          Continue with Google
        </a>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-[#e7e9ed]" />
        <span className="text-[11px] font-semibold uppercase tracking-[.14em] text-[#a0a6b0]">
          or continue with email
        </span>
        <div className="h-px flex-1 bg-[#e7e9ed]" />
      </div>
      <Input
        name="name"
        label="Full name"
        placeholder="Your full name"
        formik={formik}
      />
      <EmailField
        formik={formik}
        status={emailStatus}
        onStatus={setEmailStatus}
        verified={emailVerified}
        onVerified={setEmailVerified}
        onExistingEmail={handleExistingEmail}
      />
      <label className="block">
        <span className="mb-2 block text-xs font-semibold tracking-wide text-[#626a78]">
          Password
        </span>
        <div className="relative">
          <input
            name="password"
            value={formik.values.password}
            onChange={(event) => {
              formik.handleChange(event);
              formik.setFieldTouched("password", true, false);
              const value = event.target.value;
              if (value.length < 8)
                formik.setFieldError("password", "Use at least 8 characters.");
              else if (!/[A-Z]/.test(value))
                formik.setFieldError("password", "Add an uppercase letter.");
              else if (!/[0-9]/.test(value))
                formik.setFieldError("password", "Add a number.");
              else formik.setFieldError("password", undefined);
            }}
            onBlur={formik.handleBlur}
            type={showPassword ? "text" : "password"}
            placeholder="Use 8+ characters, a number and an uppercase letter"
            autoComplete="new-password"
            className="auth-input pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ba0a8]"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        <FieldError
          error={formik.errors.password}
          touched={formik.touched.password}
        />
        <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-[#747c8d]">
          <span
            className={
              formik.values.password.length >= 8
                ? "text-[#374151]"
                : "text-[#9aa1ad]"
            }
          >
            • 8+ characters
          </span>
          <span
            className={
              /[A-Z]/.test(formik.values.password)
                ? "text-[#374151]"
                : "text-[#9aa1ad]"
            }
          >
            • Uppercase letter
          </span>
          <span
            className={
              /[0-9]/.test(formik.values.password)
                ? "text-[#374151]"
                : "text-[#9aa1ad]"
            }
          >
            • Number
          </span>
          <span
            className={
              formik.values.confirmPassword &&
              formik.values.password === formik.values.confirmPassword
                ? "text-[#374151]"
                : "text-[#9aa1ad]"
            }
          >
            • Passwords match
          </span>
        </div>
      </label>
      <label className="block">
        <span className="mb-2 block text-xs font-semibold tracking-wide text-[#626a78]">
          Confirm password
        </span>
        <input
          name="confirmPassword"
          type="password"
          value={formik.values.confirmPassword}
          onChange={(event) => {
            formik.handleChange(event);
            formik.setFieldTouched("confirmPassword", true, false);
            formik.setFieldError(
              "confirmPassword",
              event.target.value !== formik.values.password
                ? "Passwords do not match."
                : undefined,
            );
          }}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          className="auth-input"
        />
        <FieldError
          error={formik.errors.confirmPassword}
          touched={formik.touched.confirmPassword}
        />
      </label>
    </div>
  );
}
