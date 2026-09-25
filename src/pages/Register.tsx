import { useState, type ChangeEvent } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ArrowRight, Building2, CheckCircle2, Eye, EyeOff, Globe2, Linkedin, UserRound } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { OnboardingShell } from "@/auth/components/OnboardingShell";
import { FieldError } from "@/auth/components/FieldError";
import { accountSchema, creatorDetailsSchema, creatorPositioningSchema, creatorPricingSchema, creatorSocialSchema, professionalSchema, brandCompanySchema } from "@/auth/schemas";
import { analyzeCompanyWebsite, connectSocial, saveBrandOnboarding, saveCreatorCard, saveCreatorDetails, saveCreatorProfessional, saveCreatorProfile, saveCreatorSocial } from "@/lib/onboarding";
import { checkEmail, register, requestEmailOtp, verifyEmailOtp } from "@/lib/auth";
import GoogleIcon from "@/components/ui/icons/GoogleIcon";
import { LinkedinIcon } from "@/components/ui/icons/linkedin-icon";
import { signIn } from "@/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toast } from "@/components/ui/toast";

const industries=["AI","SaaS","Software","Developer Tools","Fintech","Cybersecurity","Marketing","Sales","Productivity","Data / Analytics","E-commerce","EdTech"];
const countries=["India","United States","United Kingdom","Germany","France","Canada","Australia","Singapore","Other"];
const creatorSteps=["Account","Social profiles","Creator card","Professional"];
const brandSteps=["Account","Company","Value prop & ICP","Review"];
const initialValues={name:"",email:"",password:"",confirmPassword:"",role:"" as "creator"|"brand"|"",linkedinUrl:"",xProfileUrl:"",country:"",industries:[] as string[],headline:"",bio:"",priceCents:24000,registrationCountry:"",registeredBusiness:false,legalStatus:"individual",legalName:"",tradeName:"",panGstin:"",legalAddress:"",taxResponsibilityConfirmed:false,selfBillingMandateAccepted:false,certificationAccepted:false,website:"",companyName:"",description:"",valueProposition:"",icps:[{title:"",description:""},{title:"",description:""},{title:"",description:""}],brief:""};

function Input({name,label,placeholder,type="text",formik}:{name:string;label:string;placeholder?:string;type?:string;formik:any}){return <label className="block"><span className="mb-2 block text-xs font-semibold tracking-wide text-[#626a78]">{label}</span><input name={name} type={type} value={formik.values[name]} onChange={(event)=>{formik.handleChange(event);formik.setFieldTouched(name,true,false)}} onBlur={formik.handleBlur} placeholder={placeholder} className="auth-input"/><FieldError error={formik.errors[name]} touched={formik.touched[name]}/></label>}

function EmailField({
  formik,
  status,
  onStatus,
  verified,
  onVerified,
  onExistingEmail,
}: {
  formik: any;
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
    return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value);
  };

  const handleEmailChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
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

    onStatus("checking");

    try {
      const result = await checkEmail(normalizedEmail);

      if (!result.available) {
        onStatus("taken");
        onExistingEmail();
        return;
      }

      formik.setFieldError("email", undefined);
      onStatus("available");
    } catch {
      onStatus("idle");
    }
  };

  const handleRequestOtp = async () => {
    if (status !== "available" || !validateEmail(email)) {
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
    if (!/^\\d{6}$/.test(otp) || !email) {
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
        error instanceof Error
          ? error.message
          : "Incorrect verification code.",
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
        ) : status === "available" ? (
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
        <p className="mt-1.5 text-xs text-[#8a92a0]">
          Checking email...
        </p>
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
                setOtp(
                  event.target.value
                    .replace(/\\D/g, "")
                    .slice(0, 6),
                );
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
            <p className="text-xs text-[#687386]">
              Didn't receive the code?
            </p>

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
        <p className="mt-2 text-xs text-[#687386]">
          {message}
        </p>
      )}

      <FieldError
        error={formik.errors.email}
        touched={formik.touched.email}
      />
    </div>
  );
}

function RoleChoice({onSelect}:{onSelect:(role:"creator"|"brand")=>void}){return <div className="min-h-screen bg-[#f5f7fb]"><div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-12"><div className="text-center"><div className="text-2xl font-bold tracking-[-.05em]">naano<span className="text-[#2864f0]">.</span></div><p className="mt-12 text-[11px] font-bold uppercase tracking-[.18em] text-[#2864f0]">Get started</p><h1 className="mt-3 text-4xl font-semibold tracking-[-.055em] text-[#171d2b] md:text-5xl">How will you use Naano?</h1><p className="mx-auto mt-4 max-w-lg text-[15px] leading-7 text-[#737c8d]">Choose your path and we’ll ask only the questions relevant to your workspace.</p></div><div className="mx-auto mt-12 grid w-full max-w-3xl gap-5 md:grid-cols-2"><button type="button" onClick={()=>onSelect("creator")} className="group cursor-pointer rounded-[28px] border border-[#e1e6ee] bg-white p-8 text-left shadow-[0_12px_40px_rgba(35,52,80,.06)] transition duration-200 hover:-translate-y-1 hover:border-[#cbd1da] hover:shadow-[0_22px_60px_rgba(35,52,80,.12)]"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef4ff] text-[#2864f0]"><UserRound className="h-6 w-6"/></div><div className="mt-9 flex items-end justify-between gap-4"><div><h2 className="text-xl font-semibold tracking-[-.03em]">I’m a creator</h2><p className="mt-2 max-w-xs text-sm leading-6 text-[#737c8d]">Build your creator card, connect your social presence and find paid opportunities.</p></div><ArrowRight className="h-5 w-5 shrink-0 text-[#9aa2b0] transition group-hover:translate-x-1 group-hover:text-[#626a78]"/></div></button><button type="button" onClick={()=>onSelect("brand")} className="group cursor-pointer rounded-[28px] border border-[#e1e6ee] bg-white p-8 text-left shadow-[0_12px_40px_rgba(35,52,80,.06)] transition duration-200 hover:-translate-y-1 hover:border-[#cbd1da] hover:shadow-[0_22px_60px_rgba(35,52,80,.12)]"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef4ff] text-[#2864f0]"><Building2 className="h-6 w-6"/></div><div className="mt-9 flex items-end justify-between gap-4"><div><h2 className="text-xl font-semibold tracking-[-.03em]">I’m a brand</h2><p className="mt-2 max-w-xs text-sm leading-6 text-[#737c8d]">Create your company profile, define your ICP and launch creator campaigns.</p></div><ArrowRight className="h-5 w-5 shrink-0 text-[#9aa2b0] transition group-hover:translate-x-1 group-hover:text-[#626a78]"/></div></button></div><p className="mt-8 text-center text-sm text-[#8a92a0]">Already have an account? <Link to="/login" className="font-semibold text-[#2864f0]">Sign in</Link></p></div></div>}

export default function Register(){
 const dispatch=useAppDispatch();const navigate=useNavigate();const {isAuthenticated,isLoading}=useAppSelector(state=>state.auth);const [role,setRole]=useState<"creator"|"brand"|null>(null);const [step,setStep]=useState(0);const [error,setError]=useState("");const [saving,setSaving]=useState(false);const [showPassword,setShowPassword]=useState(false);const [socialStatus,setSocialStatus]=useState<Record<string,string>>({});const [analysis,setAnalysis]=useState<any>(null);const [emailStatus,setEmailStatus]=useState<"idle"|"checking"|"available"|"taken">("idle");const [emailVerified,setEmailVerified]=useState(false);

 const handleExistingEmail=()=>{
  toast.add({
   title:"Account already exists",
   description:"We’ll redirect you to sign in.",
   type:"loading",
   timeout:1800,
  });
  window.setTimeout(()=>navigate("/login"),1400);
 };
 if(!isLoading&&isAuthenticated)return <Navigate to="/dashboard" replace/>;
 if(!role)return <RoleChoice onSelect={value=>{setRole(value);setStep(0);setError("");setAnalysis(null);setSocialStatus({});setEmailStatus("idle");setEmailVerified(false)}}/>;

 return <Formik enableReinitialize initialValues={{...initialValues,role}} onSubmit={()=>navigate("/dashboard",{replace:true})} validateOnBlur validateOnChange={false}>{formik=>{
 const steps=role==="creator"?creatorSteps:brandSteps;
 const validateStep=async()=>{setError("");let schema:any;if(step===0)schema=accountSchema;else if(role==="creator"&&step===1)schema=creatorSocialSchema;else if(role==="creator"&&step===2)schema=creatorPositioningSchema.concat(creatorPricingSchema).concat(creatorDetailsSchema);else if(role==="creator"&&step===3)schema=professionalSchema;else if(role==="brand"&&step===1)schema=brandCompanySchema;else if(role==="brand"&&step===2)schema=Yup.object({companyName:Yup.string().trim().min(2).required("Company name is required."),description:Yup.string().trim().min(20).required("Add a company description."),valueProposition:Yup.string().trim().min(40).required("Add your value proposition."),country:Yup.string().required("Country is required."),industries:Yup.array().of(Yup.string()).min(1).max(3).required("Choose at least one industry.")});else schema=Yup.object();try{await schema.validate(formik.values,{abortEarly:false});if(step===0&&!emailVerified){formik.setFieldError("email","Verify your email before continuing.");formik.setFieldTouched("email",true,false);setError("Verify your email address with the 6-digit code before continuing.");return false}return true}catch(e:any){const errors:Record<string,string>={};(e.inner??[]).forEach((item:any)=>{if(item.path&&!errors[item.path])errors[item.path]=item.message});formik.setErrors(errors);Object.keys(errors).forEach(key=>formik.setFieldTouched(key,true,false));return false}};
 const next=async()=>{if(!(await validateStep()))return;setSaving(true);try{if(step===0){const result=await register(formik.values.name,formik.values.email,formik.values.password,role);dispatch(signIn(result.user));}else if(role==="creator"&&step===1)await saveCreatorSocial({linkedinUrl:formik.values.linkedinUrl,xProfileUrl:formik.values.xProfileUrl});else if(role==="creator"&&step===2){await saveCreatorProfile({headline:formik.values.headline,bio:formik.values.bio});await saveCreatorDetails({country:formik.values.country,industries:formik.values.industries});await saveCreatorCard({priceCents:formik.values.priceCents});}else if(role==="creator"&&step===3)await saveCreatorProfessional(formik.values);else if(role==="brand")await saveBrandOnboarding({...formik.values,step:step+1,icps:formik.values.icps.filter(item=>item.title)});if(step<steps.length-1)setStep(value=>value+1);else navigate("/dashboard",{replace:true})}catch(e){setError(e instanceof Error?e.message:"Unable to save this step.")}finally{setSaving(false)}};
 const title=step===0?"Create your Naano account":role==="creator"?["Connect your professional profiles","Build your creator card","Complete professional information"][step-1]??"Your creator profile":["Tell us about your company","Define your value proposition and ICP","Review your brand profile"][step-1]??"Your brand profile";
 const description=step===0?"Start with your account, then we’ll build your marketplace profile with you.":role==="creator"?"Connect your presence, shape your card and complete the information needed for paid work.":"Give us the context creators need to understand your company and campaign goals.";
 return <Form><OnboardingShell modal onClose={()=>{setRole(null);setStep(0);setError("");setAnalysis(null);setEmailStatus("idle");setEmailVerified(false)}} statusLabel={role==="creator"?"Registering as Creator":"Registering as Company"} title={title} description={description} steps={steps} current={step} canBack={step>0} canNext={!saving} nextLabel={step===steps.length-1?"Finish setup":"Continue"} onBack={()=>{setError("");setStep(value=>Math.max(0,value-1))}} onNext={next} saving={saving}>
 {step===0&&<div className="space-y-5"><div className="rounded-2xl border border-[#e4e7ec] bg-[#fafbfc] p-4"><p className="text-sm font-semibold text-[#252a34]">{role==="creator"?"Creator workspace":"Brand workspace"}</p><p className="mt-1 text-xs leading-5 text-[#747c8d]">You can refine these details later from your workspace.</p></div><div className="grid gap-3 sm:grid-cols-2"><a href={`${import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8787"}/api/auth/google?role=${role}`} className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#dfe3e8] bg-white text-sm font-semibold text-[#252a34] transition hover:bg-[#f7f8fa]"><GoogleIcon className="h-5 w-5"/>Continue with Google</a><a href={`${import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8787"}/api/auth/linkedin?role=${role}`} className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#dfe3e8] bg-white text-sm font-semibold text-[#252a34] transition hover:bg-[#f7f8fa]"><LinkedinIcon className="h-5 w-5" variant="brand"/>Continue with LinkedIn</a></div><div className="flex items-center gap-3"><div className="h-px flex-1 bg-[#e7e9ed]"/><span className="text-[11px] font-semibold uppercase tracking-[.14em] text-[#a0a6b0]">or continue with email</span><div className="h-px flex-1 bg-[#e7e9ed]"/></div><Input name="name" label="Full name" placeholder="Your full name" formik={formik}/><EmailField formik={formik} status={emailStatus} onStatus={setEmailStatus} verified={emailVerified} onVerified={setEmailVerified} onExistingEmail={handleExistingEmail}/><label className="block"><span className="mb-2 block text-xs font-semibold tracking-wide text-[#626a78]">Password</span><div className="relative"><input name="password" value={formik.values.password} onChange={(event)=>{formik.handleChange(event);formik.setFieldTouched("password",true,false);const value=event.target.value;if(value.length<8)formik.setFieldError("password","Use at least 8 characters.");else if(!/[A-Z]/.test(value))formik.setFieldError("password","Add an uppercase letter.");else if(!/[0-9]/.test(value))formik.setFieldError("password","Add a number.");else formik.setFieldError("password",undefined)}} onBlur={formik.handleBlur} type={showPassword?"text":"password"} placeholder="Use 8+ characters, a number and an uppercase letter" autoComplete="new-password" className="auth-input pr-12"/><button type="button" onClick={()=>setShowPassword(v=>!v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ba0a8]">{showPassword?<EyeOff className="h-5 w-5"/>:<Eye className="h-5 w-5" />}</button></div><FieldError error={formik.errors.password} touched={formik.touched.password}/><div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-[#747c8d]"><span className={formik.values.password.length>=8?"text-[#374151]":"text-[#9aa1ad]"}>• 8+ characters</span><span className={/[A-Z]/.test(formik.values.password)?"text-[#374151]":"text-[#9aa1ad]"}>• Uppercase letter</span><span className={/[0-9]/.test(formik.values.password)?"text-[#374151]":"text-[#9aa1ad]"}>• Number</span><span className={formik.values.confirmPassword&&formik.values.password===formik.values.confirmPassword?"text-[#374151]":"text-[#9aa1ad]"}>• Passwords match</span></div></label><label className="block"><span className="mb-2 block text-xs font-semibold tracking-wide text-[#626a78]">Confirm password</span><input name="confirmPassword" type="password" value={formik.values.confirmPassword} onChange={(event)=>{formik.handleChange(event);formik.setFieldTouched("confirmPassword",true,false);formik.setFieldError("confirmPassword",event.target.value!==formik.values.password?"Passwords do not match.":undefined)}} placeholder="Re-enter your password" autoComplete="new-password" className="auth-input"/><FieldError error={formik.errors.confirmPassword} touched={formik.touched.confirmPassword}/></label></div>}
 {role==="creator"&&step===1&&<div className="space-y-5"><div className="rounded-2xl border border-[#dbe7ff] bg-[#f5f8ff] p-5"><p className="font-semibold">Connect your professional presence</p><p className="mt-2 text-sm leading-6 text-[#687387]">Add your public profiles. Real provider OAuth can be enabled when LinkedIn and X credentials are configured.</p></div><div className="grid gap-4 md:grid-cols-2"><div><Input name="linkedinUrl" label="LinkedIn profile" placeholder="https://linkedin.com/in/your-profile" formik={formik}/><button type="button" onClick={async()=>{try{await connectSocial("linkedin",formik.values.linkedinUrl);setSocialStatus(v=>({...v,linkedin:"Connected"}))}catch(e){setError(e instanceof Error?e.message:"Unable to connect LinkedIn.")}}} disabled={!formik.values.linkedinUrl||saving} className="mt-3 inline-flex items-center gap-2 rounded-xl border border-[#0a66c2]/20 bg-[#f2f8fc] px-4 py-2.5 text-sm font-semibold text-[#0a66c2]"><Linkedin className="h-4 w-4"/>{socialStatus.linkedin??"Connect LinkedIn"}</button></div><div><Input name="xProfileUrl" label="X profile" placeholder="https://x.com/your-handle" formik={formik}/><button type="button" onClick={async()=>{try{await connectSocial("x",formik.values.xProfileUrl);setSocialStatus(v=>({...v,x:"Connected"}))}catch(e){setError(e instanceof Error?e.message:"Unable to connect X.")}}} disabled={!formik.values.xProfileUrl||saving} className="mt-3 inline-flex items-center gap-2 rounded-xl border border-[#e4e8ee] bg-white px-4 py-2.5 text-sm font-semibold text-[#202124]"><Globe2 className="h-4 w-4"/>{socialStatus.x??"Connect X"}</button></div></div><div className="flex items-start gap-3 rounded-xl border border-[#e4e8ee] p-4 text-xs leading-5 text-[#737c8d]"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2864f0]"/>Only information you submit or authorize is connected to your account.</div></div>}
 {role==="creator"&&step===2&&<div className="grid gap-5 md:grid-cols-2"><Input name="headline" label="Professional headline" placeholder="e.g. Developer, designer or industry creator" formik={formik}/><label className="block"><span className="mb-2 block text-xs font-semibold text-[#626a78]">Country</span><select name="country" value={formik.values.country} onChange={formik.handleChange} className="auth-input"><option value="">Select your country</option>{countries.map(item=><option key={item}>{item}</option>)}</select><FieldError error={formik.errors.country} touched={formik.touched.country}/></label><label className="block md:col-span-2"><span className="mb-2 block text-xs font-semibold text-[#626a78]">About you</span><textarea name="bio" value={formik.values.bio} onChange={formik.handleChange} onBlur={formik.handleBlur} rows={4} placeholder="Tell brands what you build, who you help and what you can credibly talk about." className="w-full resize-none rounded-xl border border-[#d5d9df] p-4 text-[15px] outline-none focus:border-[#2864f0] focus:ring-2 focus:ring-[#2864f0]/10"/><FieldError error={formik.errors.bio} touched={formik.touched.bio}/></label><div className="md:col-span-2"><p className="mb-2 text-xs font-semibold text-[#626a78]">Industries <span className="font-normal text-[#9aa1af]">(up to 3)</span></p><div className="flex flex-wrap gap-2">{industries.map(item=>{const selected=formik.values.industries.includes(item);return <button key={item} type="button" onClick={()=>formik.setFieldValue("industries",selected?formik.values.industries.filter(x=>x!==item):formik.values.industries.length<3?[...formik.values.industries,item]:formik.values.industries)} className={`rounded-full border px-3 py-2 text-xs font-medium ${selected?"border-[#2864f0] bg-[#eef4ff] text-[#245bdc]":"border-[#dfe3e9] text-[#737c8d]"}`}>{item}</button>})}</div><FieldError error={formik.errors.industries} touched={formik.touched.industries}/></div><div className="md:col-span-2 rounded-2xl border border-[#e2e7ef] bg-[#fafbfe] p-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#2864f0]">Price per post</p><div className="mt-2 flex items-center gap-2"><span className="text-lg text-[#7d8491]">€</span><input name="priceCents" type="number" min="0" value={formik.values.priceCents/100} onChange={e=>formik.setFieldValue("priceCents",Math.round(Number(e.target.value)*100))} className="w-32 bg-transparent text-3xl font-semibold tracking-[-.04em] outline-none"/></div></div></div>}
 {role==="creator"&&step===3&&<div className="space-y-4"><Input name="registrationCountry" label="Registration country" placeholder="e.g. Your country" formik={formik}/><Input name="legalName" label="Legal name" placeholder="Your legal name" formik={formik}/><Input name="legalAddress" label="Legal address" placeholder="Your billing address" formik={formik}/><label className="block"><span className="mb-2 block text-xs font-semibold text-[#626a78]">Legal status</span><select name="legalStatus" value={formik.values.legalStatus} onChange={formik.handleChange} className="auth-input"><option value="individual">Individual</option><option value="company">Company</option><option value="sole_proprietorship">Sole proprietorship</option></select></label>{[["taxResponsibilityConfirmed","I confirm I am responsible for applicable taxes."],["selfBillingMandateAccepted","I accept the self-billing mandate."],["certificationAccepted","I certify this information is accurate."]].map(([name,text])=><label key={name} className="flex gap-3 rounded-xl border border-[#e4e8ee] p-4 text-sm text-[#555e6e]"><input type="checkbox" name={name} checked={Boolean(formik.values[name])} onChange={formik.handleChange} className="mt-1 h-4 w-4"/><span>{text}<FieldError error={formik.errors[name]} touched={formik.touched[name]}/></span></label>)}</div>}
 {role==="brand"&&step===1&&<div className="space-y-5"><Input name="website" label="Company website" placeholder="https://yourcompany.com" formik={formik}/><button type="button" onClick={async()=>{setError("");try{const result=await analyzeCompanyWebsite(formik.values.website);setAnalysis(result.data);if(result.data?.company_name)formik.setFieldValue("companyName",result.data.company_name);if(result.data?.description)formik.setFieldValue("description",result.data.description)}catch(e){setError(e instanceof Error?e.message:"Unable to analyze the website.")}}} disabled={!formik.values.website||saving} className="rounded-xl bg-[#2864f0] px-5 py-3 text-sm font-semibold text-white">Analyze company website</button>{analysis&&<div className="rounded-2xl border border-[#dbe7ff] bg-[#f5f8ff] p-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#2864f0]">Website analysis complete</p><p className="mt-2 font-semibold">{analysis.company_name||"Company detected"}</p><p className="mt-1 text-sm leading-6 text-[#687386]">{analysis.description||"Review the extracted company information in the next step."}</p></div>}</div>}
 {role==="brand"&&step===2&&<div className="space-y-5"><div><label className="mb-2 block text-xs font-semibold text-[#626a78]">Company name</label><input name="companyName" value={formik.values.companyName} onChange={formik.handleChange} className="auth-input"/></div><div><label className="mb-2 block text-xs font-semibold text-[#626a78]">Description</label><textarea name="description" value={formik.values.description} onChange={formik.handleChange} rows={3} className="w-full rounded-xl border border-[#d5d9df] p-4 outline-none focus:border-[#2864f0]"/></div><div><label className="mb-2 block text-xs font-semibold text-[#626a78]">Value proposition</label><textarea name="valueProposition" value={formik.values.valueProposition} onChange={formik.handleChange} rows={4} className="w-full rounded-xl border border-[#d5d9df] p-4 outline-none focus:border-[#2864f0]"/></div><Input name="country" label="Country" placeholder="India" formik={formik}/><div><p className="mb-2 text-xs font-semibold text-[#626a78]">Industries</p><div className="flex flex-wrap gap-2">{industries.map(item=>{const selected=formik.values.industries.includes(item);return <button key={item} type="button" onClick={()=>formik.setFieldValue("industries",selected?formik.values.industries.filter(x=>x!==item):formik.values.industries.length<3?[...formik.values.industries,item]:formik.values.industries)} className={`rounded-full border px-3 py-2 text-xs font-medium ${selected?"border-[#2864f0] bg-[#eef4ff] text-[#245bdc]":"border-[#dfe3e9] text-[#737c8d]"}`}>{item}</button>})}</div><FieldError error={formik.errors.industries} touched={formik.touched.industries}/></div><div className="grid gap-4 md:grid-cols-3">{formik.values.icps.map((item,index)=><div key={index} className="rounded-2xl border border-[#e3e7ed] p-4"><input value={item.title} onChange={e=>{const next=[...formik.values.icps];next[index]={...next[index],title:e.target.value};formik.setFieldValue("icps",next)}} placeholder={`ICP ${index+1}`} className="w-full border-0 p-1 font-semibold outline-none"/><textarea value={item.description} onChange={e=>{const next=[...formik.values.icps];next[index]={...next[index],description:e.target.value};formik.setFieldValue("icps",next)}} placeholder="Who are they?" rows={3} className="mt-2 w-full resize-none border-0 p-1 text-sm outline-none"/></div>)}</div></div>}
 {role==="brand"&&step===3&&<div className="space-y-5"><div className="rounded-2xl bg-[#f5f8ff] p-6"><p className="text-xs font-bold uppercase tracking-[.15em] text-[#2864f0]">Ready to launch</p><p className="mt-3 text-2xl font-semibold tracking-[-.03em]">{formik.values.companyName||"Your company"}</p><p className="mt-2 text-sm leading-6 text-[#687386]">{formik.values.valueProposition||"Your value proposition will appear here."}</p></div><div className="grid gap-3 md:grid-cols-3">{formik.values.icps.filter(item=>item.title).map(item=><div key={item.title} className="rounded-xl border border-[#e4e8ee] p-4"><p className="text-sm font-semibold">{item.title}</p><p className="mt-1 text-xs leading-5 text-[#737c8d]">{item.description}</p></div>)}</div><p className="text-sm text-[#737c8d]">Your profile will be saved to your workspace and can be refined later.</p></div>}
 {error&&<p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}
 </OnboardingShell></Form>}}</Formik>
}