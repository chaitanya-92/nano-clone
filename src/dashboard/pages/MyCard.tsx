import { useRef, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  Pencil,
  Send,
  Share2,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import { myCardData } from "../data/dashboardData";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function MyCard() {
  const [photoOpen, setPhotoOpen] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setPhoto(imageUrl);
  };

  const removePhoto = () => {
    setPhoto(null);
  };

  return (
    <>
      <div className="mx-auto w-full max-w-[1180px] pb-20">
        <section className="rounded-[28px] border border-[#e0e6ef] bg-[radial-gradient(circle_at_50%_35%,#ffffff_0%,#fdfefe_55%,#f7fbfd_100%)] p-8 shadow-[0_10px_40px_rgba(37,74,120,0.03)]">
          <div className="flex items-start justify-between gap-6">
            <div className="max-w-[760px]">
              <p className="text-[12px] font-semibold tracking-[0.14em] text-[#2864f0]">
                {myCardData.eyebrow}
              </p>

              <h1 className="mt-4 text-[36px] font-semibold tracking-[-1.8px] text-[#151b2a]">
                {myCardData.title}
              </h1>

              <p className="mt-3 text-[16px] leading-7 text-[#78869e]">
                {myCardData.description}
              </p>
            </div>

            <div className="flex shrink-0 overflow-hidden rounded-[12px] border border-[#dfe5ed] bg-white shadow-[0_3px_10px_rgba(20,40,80,0.04)]">
              <Button
                variant="ghost"
                className="h-11 rounded-none px-6 text-[14px] font-medium text-[#65738a] hover:bg-[#f7f9fc]"
              >
                Edit
              </Button>

              <Button
                variant="ghost"
                className="h-11 rounded-none border-l border-[#e5e9ef] px-6 text-[14px] font-medium text-[#65738a] hover:bg-[#f7f9fc]"
              >
                Preview
              </Button>
            </div>
          </div>

          <div className="mt-10 rounded-[25px] border border-[#d5e5ee] bg-[radial-gradient(circle_at_10%_50%,#eefaff_0%,#ffffff_52%,#ffffff_100%)] p-9">
            <div className="flex items-start justify-between gap-10">
              <div className="max-w-[760px]">
                <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.13em] text-[#6e819d]">
                  <span className="h-2 w-2 rounded-full bg-[#82c9e5]" />
                  {myCardData.share.eyebrow}
                </div>

                <h2 className="mt-5 max-w-[700px] text-[31px] font-medium leading-[1.08] tracking-[-1.4px] text-[#151b2a]">
                  {myCardData.share.title}
                </h2>

                <p className="mt-4 max-w-[760px] text-[15px] leading-7 text-[#74839b]">
                  {myCardData.share.description}
                </p>

                <div className="mt-7 grid grid-cols-2 gap-4">
                  {myCardData.share.items.map((item, index) => (
                    <div
                      key={item.title}
                      className="rounded-[18px] bg-white/85 p-6 shadow-[0_5px_20px_rgba(45,80,120,0.03)]"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#eef4ff] text-[#2864f0]">
                          {index === 0 ? (
                            <BriefcaseBusiness
                              className="h-[18px] w-[18px]"
                              strokeWidth={1.7}
                            />
                          ) : (
                            <Send
                              className="h-[18px] w-[18px]"
                              strokeWidth={1.7}
                            />
                          )}
                        </div>

                        <div>
                          <h3 className="text-[15px] font-medium text-[#252d3d]">
                            {item.title}
                          </h3>

                          <p className="mt-1.5 text-[13px] leading-5 text-[#7e8ba0]">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="mt-7 h-12 rounded-[13px] bg-[#17191d] px-6 text-[14px] font-medium text-white hover:bg-[#292c31]">
                  <Share2
                    className="mr-2 h-[16px] w-[16px]"
                    strokeWidth={1.8}
                  />
                  Copy or share my Deal Link
                </Button>
              </div>

              <div className="w-[210px] shrink-0 pt-24">
                <p className="text-[11px] font-semibold tracking-[0.12em] text-[#8b98aa]">
                  YOUR SHARE
                </p>

                <p className="mt-2 text-[38px] font-medium tracking-[-1.5px] text-[#151b2a]">
                  {myCardData.share.sharePercent}
                </p>

                <div className="my-5 h-px bg-[#e1e6eb]" />

                <p className="text-[11px] font-semibold tracking-[0.12em] text-[#8b98aa]">
                  REWARD PERIOD
                </p>

                <p className="mt-3 text-[18px] font-medium text-[#252d3d]">
                  {myCardData.share.rewardPeriod}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <div className="relative w-[520px] overflow-hidden rounded-[34px] border border-[#8bb1ff] bg-white shadow-[0_25px_70px_rgba(45,96,200,0.16)]">
              <div className="relative h-[130px] bg-gradient-to-br from-[#2159df] via-[#316df0] to-[#6389f4]">
                <div className="absolute left-7 top-6 flex h-11 w-11 items-center justify-center rounded-[13px] bg-white/90 text-[14px] font-bold text-[#2864f0]">
                  in
                </div>

                <div className="absolute left-1/2 top-7 -translate-x-1/2 text-[27px] font-bold tracking-[-1px] text-white">
                  naano
                </div>

                <button
                  type="button"
                  onClick={() => setPhotoOpen(true)}
                  className="absolute -bottom-10 left-1/2 flex h-20 w-20 -translate-x-1/2 items-center justify-center overflow-hidden rounded-full border-[3px] border-[#2864f0] bg-[#5969c9] text-[32px] text-white shadow-lg"
                >
                  {photo ? (
                    <img
                      src={photo}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    "L"
                  )}
                </button>

                <div className="absolute right-7 top-6 flex h-11 w-11 items-center justify-center rounded-[13px] bg-white/90 text-[#2864f0]">
                  <Share2 className="h-[18px] w-[18px]" strokeWidth={1.8} />
                </div>
              </div>

              <div className="px-8 pb-7 pt-16 text-center">
                <h3 className="text-[29px] font-semibold tracking-[-1px] text-[#171d2b]">
                  {myCardData.profile.name}
                </h3>

                <p className="mt-1 text-[16px] text-[#8490a4]">
                  {myCardData.profile.category}
                </p>

                <p className="mt-7 text-[15px] text-[#7d899d]">
                  {myCardData.profile.headline}
                </p>

                <div className="mt-7 flex justify-center">
                  <span className="flex items-center gap-2 rounded-full border border-[#e0e5ec] bg-[#fafbfc] px-4 py-2 text-[12px] text-[#78869b]">
                    <CalendarDays
                      className="h-[14px] w-[14px]"
                      strokeWidth={1.7}
                    />
                    No post data available
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-3 px-4">
                  <span className="text-[12px] text-[#7d899c]">Data</span>
                  <div className="h-1.5 flex-1 rounded-full bg-[#e4e8ee]" />
                  <span className="text-[12px] text-[#7d899c]">Pending</span>
                </div>

                <div className="mt-7 grid grid-cols-3 border-t border-[#e7eaf0] pt-6">
                  <div>
                    <p className="text-[25px] font-medium text-[#172033]">
                      {myCardData.profile.followers}
                    </p>
                    <p className="mt-1 text-[12px] text-[#8a95a8]">Followers</p>
                  </div>

                  <div className="border-x border-[#e7eaf0]">
                    <p className="text-[25px] font-medium text-[#172033]">
                      {myCardData.profile.impressions}
                    </p>
                    <p className="mt-1 text-[12px] text-[#8a95a8]">
                      Est. impressions
                    </p>
                  </div>

                  <div>
                    <p className="text-[25px] font-medium text-[#172033]">
                      {myCardData.profile.cost}
                    </p>
                    <p className="mt-1 text-[12px] text-[#8a95a8]">
                      Chosen cost
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="absolute bottom-[-1px] left-1/2 flex h-10 -translate-x-1/2 translate-y-1/2 items-center gap-2 rounded-full border border-[#a7c2ff] bg-white px-6 text-[13px] font-medium text-[#46536a] shadow-sm"
              >
                <ArrowRight className="h-4 w-4 rounded-full bg-[#2864f0] p-0.5 text-white" />
                View profile
              </button>
            </div>
          </div>

          <div className="mt-16 rounded-[24px] border border-[#e0e6ef] bg-white p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#eef4ff] text-[#2864f0]">
                <UserRound className="h-[18px] w-[18px]" strokeWidth={1.7} />
              </div>

              <div>
                <h2 className="text-[17px] font-semibold text-[#20283a]">
                  About
                </h2>

                <p className="mt-1 text-[14px] text-[#8995a9]">
                  No LinkedIn bio yet.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-[24px] border border-[#e0e6ef] bg-white p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#eef4ff] text-[#2864f0]">
                <UserRound className="h-[18px] w-[18px]" strokeWidth={1.7} />
              </div>

              <div>
                <h2 className="text-[17px] font-semibold text-[#20283a]">
                  Who you target (est.)
                </h2>

                <p className="mt-1 text-[13px] text-[#8995a9]">
                  Estimated from your public posts + bio (dominant themes).
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-[18px] border border-dashed border-[#d5dde8] px-6 py-8 text-center">
              <p className="text-[15px] font-medium text-[#737f94]">
                Target pending
              </p>

              <p className="mt-2 text-[13px] text-[#9aa4b5]">
                Re-import LinkedIn to estimate your target from public posts.
              </p>
            </div>
          </div>
        </section>
      </div>

      <Dialog open={photoOpen} onOpenChange={setPhotoOpen}>
        <DialogContent className="max-w-[560px] overflow-hidden rounded-[18px] p-0">
          <DialogHeader className="border-b border-[#e5e8ed] px-6 py-5">
            <DialogTitle className="text-[18px] font-medium text-[#202124]">
              {myCardData.photoModal.title}
            </DialogTitle>
          </DialogHeader>

          <div className="px-8 py-7">
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="relative flex h-[122px] w-[122px] items-center justify-center overflow-hidden rounded-full bg-[#5969c9] text-[55px] text-white"
              >
                {photo ? (
                  <img
                    src={photo}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  "L"
                )}

                <span className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#4d5c76] shadow-md">
                  <Pencil className="h-4 w-4" />
                </span>
              </button>
            </div>

            <div className="mt-5 flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="h-10 rounded-[10px] px-5 text-[13px]"
              >
                <Upload className="mr-2 h-4 w-4" />
                Change
              </Button>

              <Button
                variant="ghost"
                onClick={removePhoto}
                className="h-10 rounded-[10px] bg-[#fff1f1] px-5 text-[13px] text-[#ef5350] hover:bg-[#ffe7e7] hover:text-[#ef5350]"
              >
                <X className="mr-2 h-4 w-4" />
                Remove photo
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handlePhotoChange}
              className="hidden"
            />

            <p className="mt-5 text-center text-[12px] text-[#b0b5bd]">
              {myCardData.photoModal.description}
            </p>
          </div>

          <div className="flex justify-end gap-3 border-t border-[#e5e8ed] px-6 py-4">
            <Button
              variant="outline"
              onClick={() => setPhotoOpen(false)}
              className="h-10 rounded-[10px] px-6 text-[13px]"
            >
              Cancel
            </Button>

            <Button
              onClick={() => setPhotoOpen(false)}
              className="h-10 rounded-[10px] bg-[#292925] px-7 text-[13px] text-white hover:bg-[#171716]"
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
