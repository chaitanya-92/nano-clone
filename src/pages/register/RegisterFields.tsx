import { useState, type ChangeEvent } from "react";
import type { FormikProps } from "formik";
import { CheckCircle2 } from "lucide-react";
import { FieldError } from "@/auth/components/FieldError";
import { checkEmail, requestEmailOtp, verifyEmailOtp } from "@/lib/auth";
import type { RegistrationValues } from "./registerTypes";

export function Input({
  name,
  label,
  placeholder,
  type = "text",
  formik,
  disabled = false,
}: {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  formik: FormikProps<RegistrationValues>;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold tracking-wide text-[#626a78]">
        {label}
      </span>
      <input
        name={name}
        type={type}
        value={formik.values[name]}
        onChange={(event) => {
          formik.handleChange(event);
          formik.setFieldTouched(name, true, false);
        }}
        onBlur={formik.handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={
          disabled
            ? "auth-input cursor-not-allowed bg-[#f5f6f8] text-[#8b93a2]"
            : "auth-input"
        }
      />
      <FieldError error={formik.errors[name]} touched={formik.touched[name]} />
    </label>
  );
}



export function EmailField({
  formik,
  status,
  onStatus,
  verified,
  onVerified,
  onExistingEmail,
}: {
  formik: FormikProps<RegistrationValues>;
  status: "idle" | "checking" | "available" | "taken";
  onStatus: (status: "idle" | "checking" | "available" | "taken") => void;
  verified: boolean;
  onVerified: (value: boolean) => void;
  onExistingEmail: () => void;
}) {
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const email = formik.values.email;

  const validateEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(event);
    formik.setFieldTouched("email", false, false);
    formik.setFieldError("email", undefined);
    onStatus("idle");
    onVerified(false);
    setOtp("");
    setOtpRequested(false);
    setMessage("");
  };

  const handleEmailBlur = async () => {
    formik.setFieldTouched("email", true, true);

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      formik.setFieldError("email", "Email is required.");
      onStatus("idle");
      return;
    }

    if (!validateEmail(normalizedEmail)) {
      formik.setFieldError("email", "Enter a valid email address.");
      onStatus("idle");
      return;
    }

    formik.setFieldError("email", undefined);
    onStatus("available");

    try {
      const result = await checkEmail(normalizedEmail);

      if (!result.available) {
        onStatus("taken");
        onExistingEmail();
      }
    } catch {
      onStatus("available");
    }
  };

  const handleRequestOtp = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!validateEmail(normalizedEmail)) {
      formik.setFieldError("email", "Enter a valid email address.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await requestEmailOtp(email);
      setOtpRequested(true);
      setMessage("We sent a 6-digit verification code to your email.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to send verification code.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!/^\d{6}$/.test(otp) || !email) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await verifyEmailOtp(email, otp);
      onVerified(true);
      setOtpRequested(false);
      setMessage("");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Incorrect verification code.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="block">
      <span className="mb-2 block text-xs font-semibold tracking-wide text-[#626a78]">
        Email
      </span>

      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <input
            name="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            placeholder="you@company.com"
            autoComplete="email"
            className="auth-input"
          />
        </div>

        {verified ? (
          <div className="flex h-12 shrink-0 items-center gap-2 rounded-xl border border-[#d7e6dc] bg-[#f5faf7] px-3 text-xs font-semibold text-[#3f6148]">
            <CheckCircle2 className="h-4 w-4" />
            Verified
          </div>
        ) : validateEmail(email) ? (
          <button
            type="button"
            onClick={handleRequestOtp}
            disabled={loading}
            className="h-12 shrink-0 cursor-pointer rounded-xl border border-[#dfe3e8] bg-white px-4 text-xs font-semibold text-[#303744] transition hover:bg-[#f7f8fa] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Sending..."
              : otpRequested
                ? "Resend code"
                : "Verify email"}
          </button>
        ) : null}
      </div>

      {status === "checking" && (
        <p className="mt-1.5 text-xs text-[#8a92a0]">Checking email...</p>
      )}

      {otpRequested && !verified && (
        <div className="mt-3 rounded-2xl border border-[#e4e8ee] bg-[#fafbfc] p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#252a34]">
                Verify your email
              </p>
              <p className="mt-1 text-xs leading-5 text-[#737c8d]">
                Enter the 6-digit code we sent to {email}.
              </p>
            </div>

            <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[.12em] text-[#8a92a0]">
              10 min
            </span>
          </div>

          <div className="mt-4 flex gap-2">
            <input
              value={otp}
              onChange={(event) => {
                setOtp(event.target.value.replace(/\D/g, "").slice(0, 6));
              }}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="000000"
              aria-label="Email verification code"
              className="auth-input flex-1 text-center tracking-[.45em]"
            />

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={loading || otp.length !== 6}
              className="h-12 shrink-0 cursor-pointer rounded-xl bg-[#171d2b] px-5 text-xs font-semibold text-white transition hover:bg-[#111827] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Confirm"}
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-xs text-[#687386]">Didn't receive the code?</p>

            <button
              type="button"
              onClick={handleRequestOtp}
              disabled={loading}
              className="cursor-pointer text-xs font-semibold text-[#3b4350] hover:text-[#171d2b] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Resend code
            </button>
          </div>
        </div>
      )}

      {message && !verified && (
        <p className="mt-2 text-xs text-[#687386]">{message}</p>
      )}

      <FieldError error={formik.errors.email} touched={formik.touched.email} />
    </div>
  );
}


