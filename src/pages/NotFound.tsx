import { ArrowLeft, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f9fc] px-6">
      <div className="flex max-w-[620px] flex-col items-center text-center">
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#eef4ff] text-[#2864f0]">
          <span className="text-[28px] font-bold">404</span>
        </div>

        <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#2864f0]">
          Page not found
        </p>

        <h1 className="text-[clamp(42px,6vw,64px)] font-semibold leading-[1] tracking-[-2.5px] text-[#111318]">
          Looks like you're lost.
        </h1>

        <p className="mt-5 max-w-[480px] text-[16px] leading-7 text-[#68748a]">
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back to somewhere useful.
        </p>

        <div className="mt-8 flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="h-11 rounded-xl border-[#dfe4eb] px-5 text-[14px] font-medium text-[#526078] hover:bg-white hover:text-[#202124]"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </Button>

          <Button
            render={<Link to="/" />}
            className="h-11 rounded-xl bg-[#202124] px-5 text-[14px] font-medium text-white hover:bg-[#111318]"
          >
            <Home className="h-4 w-4" />
            Back to home
          </Button>
        </div>

        <p className="mt-10 text-[12px] text-[#9aa4b5]">
          Error 404
        </p>
      </div>
    </main>
  );
}