import { useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpRight,
  Building2,
  CalendarDays,
  CreditCard,
  WalletCards,
} from "lucide-react";
import { earningsData } from "../data/dashboardData";

export default function Earnings() {
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [amount, setAmount] = useState("");
  const [activeTab, setActiveTab] = useState("earnings");

  return (
    <div className="min-h-[calc(100vh-72px)] w-full bg-[#f7f9fc] px-8 py-8">
      <div className="mx-auto max-w-[1380px]">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-[40px] font-semibold tracking-[-2px] text-[#141a29]">
              {earningsData.title}
            </h1>

            <p className="mt-1 text-[18px] text-[#74819a]">
              {earningsData.description}
            </p>
          </div>

          <div className="mt-1 flex items-center gap-2 rounded-full border border-[#d7e2f7] bg-[#f5f8ff] px-3.5 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#2864f0] shadow-[0_0_0_4px_#e5edff]" />
            <span className="text-[12px] font-semibold text-[#53627c]">
              {earningsData.badge}
            </span>
          </div>
        </div>

        <section className="mt-6 grid grid-cols-3 gap-4">
          {earningsData.summary.map((item) => (
            <div
              key={item.label}
              className={`relative min-h-[152px] overflow-hidden rounded-[18px] border border-[#dfe5ed] bg-white px-6 py-5 shadow-[0_4px_14px_rgba(32,52,82,0.035)] ${item.cloud ? "bg-gradient-to-br from-white via-white to-[#eef5ff]" : ""}`}
            >
              {item.cloud && (
                <div className="pointer-events-none absolute -bottom-20 -right-5 h-40 w-[340px] rounded-full bg-[radial-gradient(ellipse_at_center,#dceaff_0%,rgba(220,234,255,0.45)_35%,transparent_70%)]" />
              )}

              <div className="relative">
                <div className="flex items-center gap-2">
                  {item.icon === "earned" && (
                    <ArrowUpRight
                      className="h-4 w-4 text-[#2864f0]"
                      strokeWidth={1.7}
                    />
                  )}

                  {item.icon === "transit" && (
                    <ArrowDownToLine
                      className="h-4 w-4 text-[#64738e]"
                      strokeWidth={1.7}
                    />
                  )}

                  {item.icon === "available" && (
                    <WalletCards
                      className="h-4 w-4 text-[#64738e]"
                      strokeWidth={1.7}
                    />
                  )}

                  <span className="text-[12px] font-semibold text-[#65748f]">
                    {item.label}
                  </span>
                </div>

                <div className="mt-3 text-[30px] font-semibold tracking-[-1.4px] text-[#182033]">
                  {item.value}
                </div>

                <p className="mt-4 max-w-[430px] text-[11px] leading-4 text-[#7b89a2]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-4 grid grid-cols-[minmax(0,1.8fr)_minmax(400px,1fr)] gap-4">
          <div className="rounded-[18px] border border-[#dfe5ed] bg-white p-6 shadow-[0_4px_14px_rgba(32,52,82,0.035)]">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[16px] font-semibold text-[#171d2c]">
                  {earningsData.chart.title}
                </h2>

                <p className="mt-1 text-[12px] text-[#7c879d]">
                  {earningsData.chart.description}
                </p>
              </div>

              <span className="text-[12px] font-medium text-[#7c879d]">
                {earningsData.chart.total}
              </span>
            </div>

            <div className="mt-8 flex h-[235px] items-end gap-3 px-1">
              {earningsData.chart.months.map((month) => (
                <div
                  key={month.label}
                  className="flex h-full flex-1 flex-col justify-end"
                >
                  <div className="mb-2 text-center text-[11px] font-semibold text-[#5d6b85]">
                    {month.value}
                  </div>

                  <div
                    className={`h-[185px] rounded-t-[11px] border-b-[5px] border-[#2864f0] ${month.active ? "bg-[#e7efff]" : "bg-[#f0f2f7]"}`}
                  />

                  <div
                    className={`mt-4 text-center text-[11px] font-medium ${month.active ? "text-[#2864f0]" : "text-[#78859d]"}`}
                  >
                    {month.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[18px] border border-[#dfe5ed] bg-white p-6 shadow-[0_4px_14px_rgba(32,52,82,0.035)]">
            <h2 className="text-[16px] font-semibold text-[#171d2c]">
              {earningsData.withdrawal.title}
            </h2>

            <p className="mt-1 text-[12px] text-[#7c879d]">
              {earningsData.withdrawal.description}
            </p>

            <div className="mt-5 text-[10px] font-semibold tracking-[0.13em] text-[#8995aa]">
              {earningsData.withdrawal.label}
            </div>

            <div className="mt-2 space-y-2">
              {earningsData.withdrawal.methods.map((method) => {
                const selected = paymentMethod === method.id;

                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`w-full rounded-[14px] border p-3.5 text-left transition-colors ${selected ? "border-[#2864f0] bg-[#edf3ff]" : "border-[#d9e1ec] bg-white hover:bg-[#fafbfc]"}`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 flex h-[17px] w-[17px] items-center justify-center rounded-full border ${selected ? "border-[#2864f0]" : "border-[#aeb9ca]"}`}
                      >
                        {selected && (
                          <span className="h-2 w-2 rounded-full bg-[#2864f0]" />
                        )}
                      </span>

                      {method.id === "bank" ? (
                        <Building2
                          className="mt-0.5 h-4 w-4 text-[#69778f]"
                          strokeWidth={1.7}
                        />
                      ) : (
                        <CreditCard
                          className="mt-0.5 h-4 w-4 text-[#69778f]"
                          strokeWidth={1.7}
                        />
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="text-[15px] font-semibold text-[#202637]">
                          {method.name}
                        </div>

                        <p className="mt-2 text-[13px] text-[#273044]">
                          {method.description}
                        </p>

                        <p className="text-[12px] text-[#7c879d]">
                          {method.subDescription}
                        </p>

                        <span className="mt-2 inline-flex rounded-[10px] border border-[#d9e1ec] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#273044]">
                          {method.action}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] text-[#8793a8]">
                  €
                </span>

                <input
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder={earningsData.withdrawal.amountPlaceholder}
                  className="h-[42px] w-full rounded-[11px] border border-[#d9e1ec] bg-white pl-9 pr-3 text-[13px] outline-none placeholder:text-[#a1adbf] focus:border-[#2864f0] focus:ring-2 focus:ring-[#2864f0]/15"
                />
              </div>

              <button
                type="button"
                onClick={() => setAmount("0")}
                className="h-[42px] rounded-[11px] border border-[#d9e1ec] bg-white px-4 text-[12px] font-semibold text-[#273044] transition-colors hover:bg-[#f7f9fc]"
              >
                {earningsData.withdrawal.withdrawAll}
              </button>
            </div>

            <button
              type="button"
              disabled
              className="mt-2 h-[42px] w-full rounded-[11px] bg-[#7397ef] text-[13px] font-semibold text-white opacity-90"
            >
              {earningsData.withdrawal.confirm}
            </button>

            <div className="mt-3 flex items-center gap-2 rounded-[11px] border border-[#dce3ee] bg-[#fafbfc] px-3 py-3">
              <CalendarDays
                className="h-4 w-4 text-[#2864f0]"
                strokeWidth={1.7}
              />

              <span className="text-[11px] text-[#69778f]">
                {earningsData.withdrawal.emptyMessage}
              </span>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-[18px] border border-[#dfe5ed] bg-white p-6 shadow-[0_4px_14px_rgba(32,52,82,0.035)]">
          <h2 className="text-[16px] font-semibold text-[#171d2c]">
            {earningsData.activity.title}
          </h2>

          <p className="mt-1 text-[12px] text-[#7c879d]">
            {earningsData.activity.description}
          </p>

          <div className="mt-4 flex items-center gap-7 border-b border-[#e2e7ef]">
            {earningsData.activity.tabs.map((tab) => {
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative pb-3 text-[12px] font-semibold transition-colors ${active ? "text-[#2864f0]" : "text-[#78849a] hover:text-[#202637]"}`}
                >
                  {tab.label}

                  {tab.count !== null && (
                    <span className="ml-2 rounded-full border border-[#dce3ed] px-2 py-0.5 text-[10px]">
                      {tab.count}
                    </span>
                  )}

                  {active && (
                    <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#2864f0]" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 overflow-hidden">
            <div className="grid grid-cols-6 border-b border-[#e2e7ef] px-1 pb-3">
              {earningsData.activity.columns.map((column) => (
                <span
                  key={column}
                  className="text-[11px] font-semibold tracking-[0.03em] text-[#7a879e]"
                >
                  {column}
                </span>
              ))}
            </div>

            <div className="flex min-h-[68px] items-center justify-center">
              <p className="text-[14px] text-[#7b879e]">
                {earningsData.activity.emptyMessage}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}