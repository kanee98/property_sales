import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { NewInquiry } from "../types/index";
import { useMessage } from "../components/MessageBox";
import Footer from "../components/Footer";
import LoaderLayout from "../components/loader/LoaderLayout";
import Logo from "../src/img/Propwise Logo No BG.png";

const WHY_US = [
  {
    title: "Reliable Service",
    text: "We keep each transaction transparent and responsive so your property process stays predictable and low-stress.",
  },
  {
    title: "Competitive Pricing",
    text: "Our team tracks market movement and validates listings so you can make confident decisions within budget.",
  },
  {
    title: "Seamless Process",
    text: "From inquiry to follow-up, we simplify communication and documentation to reduce delays and back-and-forth.",
  },
  {
    title: "Expert Advisors",
    text: "You work with experienced specialists who understand Sri Lankan residential and commercial real estate trends.",
  },
  {
    title: "Customer-First Support",
    text: "We tailor recommendations to your goals, whether you are leasing, buying, selling, or scouting opportunities.",
  },
  {
    title: "Secure Handling",
    text: "Your information and submitted files are managed with careful handling and clear operational workflows.",
  },
];

export default function InquiriesPage() {
  const { showMessage } = useMessage();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [newInquiry, setNewInquiry] = useState<NewInquiry>({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    budget: null,
    requirements: "",
    attachments: [],
    status: 1,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newInquiry.email.trim());
    const phoneIsValid = /^[0-9+\-\s()]{7,20}$/.test(newInquiry.phone.trim());

    setEmailError(emailIsValid ? "" : "Enter a valid email address.");
    setPhoneError(phoneIsValid ? "" : "Enter a valid phone number.");
    if (!emailIsValid || !phoneIsValid) return;

    setIsSubmitting(true);

    try {
      let uploadedImagePath = "";

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("inquiryId", "new");

        const uploadRes = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("Image upload failed");

        const uploadData = await uploadRes.json();
        uploadedImagePath = uploadData.newImagePath;
      }

      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newInquiry,
          attachments: uploadedImagePath ? [uploadedImagePath] : [],
        }),
      });

      if (res.ok) {
        showMessage("Inquiry submitted successfully");
        setNewInquiry({
          companyName: "",
          contactPerson: "",
          email: "",
          phone: "",
          budget: null,
          requirements: "",
          attachments: [],
          status: 1,
        });

        if (fileInputRef.current) fileInputRef.current.value = "";
        setImageFile(null);
      } else {
        const err = await res.json();
        showMessage("Failed to create inquiry: " + err.message);
      }
    } catch (err) {
      console.error(err);
      showMessage("Something went wrong while adding the inquiry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LoaderLayout>
      <main className="min-h-screen bg-[#f3f6f2] text-slate-900">
        <header className="sticky top-0 z-40 border-b border-[#7ea174]/30 bg-white/95 backdrop-blur">
          <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
            <div className="flex items-center gap-3">
              <Image src={Logo} width={56} height={56} alt="Propwise logo" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1f2937]">Propwise</p>
                <h1 className="text-xl font-bold">Submit Inquiry</h1>
              </div>
            </div>
            <Link href="/" className="rounded-lg border border-[#1f2937]/40 px-4 py-2 text-sm font-semibold hover:bg-[#7ea174]/10">
              Back to Listings
            </Link>
          </div>
        </header>

        <section className="mx-auto w-full max-w-[1500px] px-4 py-10 pb-16 sm:px-6 lg:px-10 lg:pb-20">
          <div className="mb-8 rounded-3xl bg-gradient-to-r from-[#0b0f19] via-[#111827] to-[#1f2937] p-7 text-white shadow-xl sm:p-10">
            <p className="text-xs uppercase tracking-[0.22em] text-[#a9c9a0]">Property Advisory Desk</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">Tell Us What You Need</h2>
            <p className="mt-3 max-w-3xl text-sm text-slate-200 sm:text-base">Share your requirement once and our consultants will shortlist matching properties with location, budget, and timeline in mind.</p>
          </div>

          <div className="grid items-start gap-6 xl:grid-cols-12 xl:gap-8">
            <div className="rounded-3xl border border-[#7ea174]/30 bg-white p-6 shadow-[0_18px_48px_rgba(17,24,39,0.08)] sm:p-8 xl:col-span-8">
              <div className="mb-6 border-b border-slate-200 pb-5">
                <h3 className="text-2xl font-semibold text-[#111827]">Inquiry Form</h3>
                <p className="mt-1 text-sm text-slate-600">Fields marked below help us match properties faster.</p>
              </div>

              <form onSubmit={handleFormSubmit} encType="multipart/form-data" className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Company Name</label>
                    <input type="text" placeholder="ABC Holdings" value={newInquiry.companyName} onChange={(e) => setNewInquiry({ ...newInquiry, companyName: e.target.value })} required className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-[15px] outline-none ring-[#7ea174] transition placeholder:text-slate-400 focus:border-[#7ea174] focus:ring-2" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Contact Person</label>
                    <input type="text" placeholder="John Perera" value={newInquiry.contactPerson} onChange={(e) => setNewInquiry({ ...newInquiry, contactPerson: e.target.value })} required className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-[15px] outline-none ring-[#7ea174] transition placeholder:text-slate-400 focus:border-[#7ea174] focus:ring-2" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Email Address</label>
                    <input type="email" placeholder="you@company.com" value={newInquiry.email} onChange={(e) => { setNewInquiry({ ...newInquiry, email: e.target.value }); setEmailError(""); }} required className={`w-full rounded-xl border bg-white px-4 py-3.5 text-[15px] outline-none ring-[#7ea174] transition placeholder:text-slate-400 focus:ring-2 ${emailError ? "border-rose-300 focus:border-rose-400" : "border-slate-300 focus:border-[#7ea174]"}`} />
                    {emailError ? <p className="mt-1 text-xs text-rose-600">{emailError}</p> : null}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Phone Number</label>
                    <input type="text" placeholder="+94 77 123 4567" value={newInquiry.phone} onChange={(e) => { setNewInquiry({ ...newInquiry, phone: e.target.value }); setPhoneError(""); }} required className={`w-full rounded-xl border bg-white px-4 py-3.5 text-[15px] outline-none ring-[#7ea174] transition placeholder:text-slate-400 focus:ring-2 ${phoneError ? "border-rose-300 focus:border-rose-400" : "border-slate-300 focus:border-[#7ea174]"}`} />
                    {phoneError ? <p className="mt-1 text-xs text-rose-600">{phoneError}</p> : null}
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-medium text-slate-700">Budget (LKR)</label>
                    <input type="number" placeholder="25,000,000" value={newInquiry.budget ?? ""} onChange={(e) => setNewInquiry({ ...newInquiry, budget: e.target.value ? Number(e.target.value) : null })} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-[15px] outline-none ring-[#7ea174] transition placeholder:text-slate-400 focus:border-[#7ea174] focus:ring-2" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Requirements</label>
                  <textarea placeholder="Mention preferred location, property type, approximate area, and expected move-in timeline." value={newInquiry.requirements ?? ""} onChange={(e) => setNewInquiry({ ...newInquiry, requirements: e.target.value })} rows={6} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-[15px] outline-none ring-[#7ea174] transition placeholder:text-slate-400 focus:border-[#7ea174] focus:ring-2" />
                </div>

                <div className="rounded-xl border border-slate-300 bg-slate-50 p-4">
                  <label className="mb-2 block text-sm font-medium text-slate-700">Supporting Image (Optional)</label>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="block w-full text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-[#1f2937] file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-white hover:file:bg-[#2c3b4d]" />
                </div>

                <button type="submit" disabled={isSubmitting} className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#1f2937] px-7 py-3.5 text-[15px] font-semibold text-white transition hover:bg-[#7ea174] hover:text-[#111827] disabled:cursor-not-allowed disabled:opacity-60">
                  {isSubmitting ? "Submitting..." : "Submit Inquiry"}
                </button>
              </form>
            </div>

            <aside className="space-y-5 xl:sticky xl:top-24 xl:col-span-4">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(2,6,23,0.06)]">
                <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                  <h3 className="text-lg font-semibold tracking-tight text-slate-900">Contact Us</h3>
                </div>
                <div className="space-y-4 px-5 py-5 text-sm">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Phone</p>
                    <p className="mt-1 font-medium text-slate-900">+94 77 362 8282 / +94 77 736 6597</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Email</p>
                    <p className="mt-1 font-medium text-slate-900">padmapriya@propwise.lk</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Office Hours</p>
                    <p className="mt-1 font-medium text-slate-900">Mon - Sat, 9am - 5pm</p>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(2,6,23,0.06)]">
                <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                  <h3 className="text-lg font-semibold tracking-tight text-slate-900">Why Propwise</h3>
                </div>
                <ul className="space-y-4 px-5 py-5 text-sm">
                  {WHY_US.slice(0, 3).map((item) => (
                    <li key={item.title} className="flex items-start gap-3">
                      <span className="mt-1.5 size-2 rounded-full bg-[#7ea174]" />
                      <div>
                        <p className="font-semibold text-slate-900">{item.title}</p>
                        <p className="mt-1 leading-6 text-slate-600">{item.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(2,6,23,0.06)]">
                <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                  <h3 className="text-lg font-semibold tracking-tight text-slate-900">What Happens Next</h3>
                </div>
                <ol className="space-y-3 px-5 py-5 text-sm text-slate-700">
                  <li className="flex items-start gap-3"><span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[#7ea174]/20 text-xs font-semibold text-slate-900">1</span><span className="pt-0.5">We review your requirement and budget.</span></li>
                  <li className="flex items-start gap-3"><span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[#7ea174]/20 text-xs font-semibold text-slate-900">2</span><span className="pt-0.5">Our team shortlists matching properties.</span></li>
                  <li className="flex items-start gap-3"><span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[#7ea174]/20 text-xs font-semibold text-slate-900">3</span><span className="pt-0.5">You receive options and follow-up support quickly.</span></li>
                </ol>
              </div>
            </aside>
          </div>
        </section>
        <Footer />
      </main>
    </LoaderLayout>
  );
}


