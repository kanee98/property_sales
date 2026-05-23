"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Footer from "../components/Footer";
import LoaderLayout from "../components/loader/LoaderLayout";
import Logo from "../src/img/Propwise Logo No BG.png";

type Property = {
  id: number;
  title: string;
  description: string;
  price: number | null;
  area: number | null;
  images: string;
  latitude: number;
  longitude: number;
  district: string;
  category: string;
  type: string;
  manager: string;
  contact: string | number;
  status: number;
};

const formatCurrency = (value: number | null) => {
  if (value == null) return "Price on request";
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(value);
};

const parseImages = (raw: string): string[] => {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((url) => typeof url === "string" && url.trim().length > 0);
    }
  } catch {
    // ignore malformed JSON
  }
  return [];
};

const safeCategory = (category: string) => {
  if (category === "Corporate") return "Office";
  if (category === "Retail") return "Retail";
  if (category === "Residential") return "Residential";
  return category;
};

export default function HomePage() {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("All Districts");
  const [category, setCategory] = useState("All Categories");
  const [type, setType] = useState("All Types");
  const [sortBy, setSortBy] = useState("Newest");
  const [maxBudget, setMaxBudget] = useState(0);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);

    fetch(`/api/properties?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data: Property[]) => {
        setAllProperties(data.filter((p) => p.status === 1));
        setIsLoading(false);
      })
      .catch(() => {
        setAllProperties([]);
        setHasError(true);
        setIsLoading(false);
      });
  }, []);

  const availableDistricts = useMemo(() => {
    const set = new Set(allProperties.map((p) => p.district).filter(Boolean));
    return ["All Districts", ...Array.from(set).sort()];
  }, [allProperties]);

  const filtered = useMemo(() => {
    const results = allProperties.filter((property) => {
      const haystack = `${property.title} ${property.description} ${property.district}`.toLowerCase();
      const bySearch = !search || haystack.includes(search.toLowerCase());
      const byDistrict = district === "All Districts" || property.district === district;
      const byCategory = category === "All Categories" || property.category === category;
      const byType = type === "All Types" || property.type === type;
      const byBudget = !maxBudget || (property.price != null && property.price <= maxBudget);
      return bySearch && byDistrict && byCategory && byType && byBudget;
    });

    return results.sort((a, b) => {
      if (sortBy === "Price: Low to High") {
        return (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER);
      }
      if (sortBy === "Price: High to Low") {
        return (b.price ?? 0) - (a.price ?? 0);
      }
      return b.id - a.id;
    });
  }, [allProperties, search, district, category, type, maxBudget, sortBy]);

  useEffect(() => {
    setVisibleCount(9);
  }, [search, district, category, type, maxBudget, sortBy]);

  const visibleProperties = filtered.slice(0, visibleCount);

  const stats = useMemo(() => {
    const total = allProperties.length;
    const forSale = allProperties.filter((p) => p.type === "For Sale").length;
    const forRent = allProperties.filter((p) => p.type === "For Rent").length;
    const districts = new Set(allProperties.map((p) => p.district)).size;
    return { total, forSale, forRent, districts };
  }, [allProperties]);

  const clearFilters = () => {
    setSearch("");
    setDistrict("All Districts");
    setCategory("All Categories");
    setType("All Types");
    setSortBy("Newest");
    setMaxBudget(0);
  };

  const openDetails = (property: Property) => {
    const images = parseImages(property.images);
    setSelectedProperty(property);
    setSelectedImages(images.length > 0 ? images : ["/img/default.jpg"]);
    setSelectedImageIndex(0);
  };

  const closeDetails = () => {
    setSelectedProperty(null);
    setSelectedImages([]);
    setSelectedImageIndex(0);
  };

  return (
    <LoaderLayout>
      <main className="min-h-screen bg-[#f4f6f2] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-[#2f8a5b]/30 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Image src={Logo} width={52} height={52} alt="Propwise logo" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1f6b45]">Propwise</p>
              <p className="text-lg font-bold text-slate-900">Commercial & Residential</p>
            </div>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-700 md:flex">
            <a href="#listings" className="transition hover:text-[#1f6b45]">Listings</a>
            <a href="#about" className="transition hover:text-[#1f6b45]">About</a>
            <Link href="/inquiries" className="transition hover:text-[#1f6b45]">Inquiries</Link>
            <Link href="/login" className="rounded-lg bg-[#1f6b45] px-4 py-2 text-white transition hover:bg-[#2f8a5b] hover:text-black">Admin</Link>
          </nav>
          <button
            onClick={() => setMobileFilterOpen((s) => !s)}
            className="rounded-lg border border-[#1f6b45]/40 px-3 py-2 text-sm font-semibold md:hidden"
            type="button"
          >
            {mobileFilterOpen ? "Close" : "Filters"}
          </button>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#0c1310] via-[#13241d] to-[#1f6b45] text-white">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div className={`transition-all duration-700 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#2f8a5b]">Real Estate Advisory</p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              Find premium Sri Lankan properties with confidence
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-200">
              Discover offices, retail, residential and investment opportunities across Sri Lanka with verified details and direct property manager contacts.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#listings" className="rounded-lg bg-[#2f8a5b] px-6 py-3 text-sm font-bold text-black transition hover:bg-[#277a53]">Explore Listings</a>
              <Link href="/inquiries" className="rounded-lg border border-white/30 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10">Submit Inquiry</Link>
            </div>
          </div>
          <div className={`grid grid-cols-2 gap-4 transition-all delay-100 duration-700 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-6 transition duration-300 hover:-translate-y-1">
              <p className="text-4xl font-black">{stats.total}</p>
              <p className="mt-2 text-sm uppercase tracking-widest text-[#2f8a5b]">Active Listings</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-6 transition duration-300 hover:-translate-y-1">
              <p className="text-4xl font-black">{stats.districts}</p>
              <p className="mt-2 text-sm uppercase tracking-widest text-[#2f8a5b]">Districts</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-6 transition duration-300 hover:-translate-y-1">
              <p className="text-4xl font-black">{stats.forSale}</p>
              <p className="mt-2 text-sm uppercase tracking-widest text-[#2f8a5b]">For Sale</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-6 transition duration-300 hover:-translate-y-1">
              <p className="text-4xl font-black">{stats.forRent}</p>
              <p className="mt-2 text-sm uppercase tracking-widest text-[#2f8a5b]">For Rent</p>
            </div>
          </div>
        </div>
      </section>

      <section id="listings" className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[#2f8a5b]/30 bg-white p-5 shadow-sm sm:p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, district or keyword"
              className="rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none ring-[#2f8a5b] transition focus:border-[#2f8a5b] focus:ring-2 lg:col-span-2"
            />
            <select value={district} onChange={(e) => setDistrict(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none ring-[#2f8a5b] transition focus:border-[#2f8a5b] focus:ring-2">
              {availableDistricts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none ring-[#2f8a5b] transition focus:border-[#2f8a5b] focus:ring-2">
              <option>All Categories</option>
              <option>Corporate</option>
              <option>Retail</option>
              <option>Residential</option>
            </select>
            <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none ring-[#2f8a5b] transition focus:border-[#2f8a5b] focus:ring-2">
              <option>All Types</option>
              <option>For Sale</option>
              <option>For Rent</option>
              <option>For Lease</option>
              <option>Wanted</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none ring-[#2f8a5b] transition focus:border-[#2f8a5b] focus:ring-2">
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-600">Budget up to</label>
              <input
                type="range"
                min={0}
                max={200000000}
                step={1000000}
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full"
              />
              <span className="min-w-24 text-sm font-semibold text-slate-800">{maxBudget ? formatCurrency(maxBudget) : "No cap"}</span>
            </div>
            <div className="flex items-center justify-end text-sm text-slate-500">
              Showing <span className="mx-1 font-bold text-slate-900">{visibleProperties.length}</span> of {filtered.length} matching properties
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className={`mt-8 ${mobileFilterOpen ? "block" : "hidden"} rounded-xl border border-slate-200 bg-white p-4 md:hidden`}>
          <p className="mb-2 text-sm font-semibold text-slate-700">Quick Filters</p>
          <div className="flex flex-wrap gap-2">
            {["Corporate", "Retail", "Residential", "For Sale", "For Rent", "For Lease"].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  if (tag.startsWith("For ")) setType(tag);
                  else setCategory(tag);
                  setMobileFilterOpen(false);
                }}
                className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="h-56 animate-pulse bg-slate-200" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-3/4 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : hasError ? (
          <div className="mt-12 rounded-xl border border-rose-200 bg-rose-50 p-10 text-center">
            <p className="text-lg font-semibold text-rose-900">Couldn&apos;t load properties right now.</p>
            <p className="mt-2 text-sm text-rose-700">Please refresh and try again.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleProperties.map((property) => {
              const images = parseImages(property.images);
              const cover = images[0] || "/img/default.jpg";

              return (
                <article key={property.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={cover}
                      alt={property.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      unoptimized={cover.startsWith("/api/images/")}
                    />
                    <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-700">
                      {safeCategory(property.category)}
                    </div>
                    <button
                      type="button"
                      onClick={() => openDetails(property)}
                      className="absolute bottom-3 right-3 rounded-lg bg-black/70 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-black/85"
                    >
                      View Details
                    </button>
                  </div>
                  <div className="space-y-3 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="line-clamp-2 text-lg font-bold text-slate-900">{property.title}</h3>
                      <span className="rounded-lg bg-[#2f8a5b]/15 px-2 py-1 text-xs font-bold text-[#1f6b45]">{property.type}</span>
                    </div>
                    <p className="line-clamp-2 text-sm text-slate-600">{property.description}</p>
                    <p className="text-xl font-black text-slate-900">{formatCurrency(property.price)}</p>
                    <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                      <p><span className="font-semibold text-slate-800">District:</span> {property.district}</p>
                      <p><span className="font-semibold text-slate-800">Area:</span> {property.area ?? "N/A"} sq ft</p>
                      <p><span className="font-semibold text-slate-800">Manager:</span> {property.manager}</p>
                      <p><span className="font-semibold text-slate-800">Contact:</span> {property.contact}</p>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => openDetails(property)}
                        className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        Details
                      </button>
                      <a
                        href={`https://maps.google.com/maps?q=${property.latitude},${property.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        Map
                      </a>
                      <Link
                        href="/inquiries"
                        className="flex-1 rounded-lg bg-[#1f6b45] px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-[#2f8a5b] hover:text-black"
                      >
                        Inquire
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {!isLoading && !hasError && visibleProperties.length === 0 ? (
          <div className="mt-12 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-lg font-semibold text-slate-700">No properties match your filters.</p>
            <p className="mt-2 text-sm text-slate-500">Try resetting search or category filters to view more listings.</p>
          </div>
        ) : null}

        {!isLoading && !hasError && visibleCount < filtered.length ? (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + 9)}
              className="rounded-lg bg-[#1f6b45] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2f8a5b] hover:text-black"
            >
              Load More Properties
            </button>
          </div>
        ) : null}
      </section>

      <section id="about" className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1f6b45]">Why Propwise</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">Industrial-grade real estate experience</h2>
          </div>
          <div className="rounded-xl border border-slate-200 p-5">
            <h3 className="text-lg font-bold text-slate-900">Verified Inventory</h3>
            <p className="mt-2 text-sm text-slate-600">All listings are mapped to direct property managers with clear location and type information.</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-5">
            <h3 className="text-lg font-bold text-slate-900">Fast Inquiry Workflow</h3>
            <p className="mt-2 text-sm text-slate-600">Submit structured requirements and track response-ready opportunities without friction.</p>
          </div>
        </div>
      </section>

      <Footer />

      {selectedProperty ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={closeDetails}>
          <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#1f6b45]">{safeCategory(selectedProperty.category)}</p>
                <h3 className="mt-1 text-2xl font-bold text-slate-900">{selectedProperty.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{selectedProperty.district} • {selectedProperty.type}</p>
              </div>
              <button type="button" onClick={closeDetails} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                Close
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <div className="relative h-72 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 sm:h-80">
                  <Image
                    src={selectedImages[selectedImageIndex]}
                    alt={selectedProperty.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    unoptimized={selectedImages[selectedImageIndex]?.startsWith("/api/images/")}
                  />
                </div>
                {selectedImages.length > 1 ? (
                  <>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                        onClick={() => setSelectedImageIndex((idx) => (idx - 1 + selectedImages.length) % selectedImages.length)}
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                        onClick={() => setSelectedImageIndex((idx) => (idx + 1) % selectedImages.length)}
                      >
                        Next
                      </button>
                    </div>
                    <div className="mt-3 grid grid-cols-5 gap-2">
                      {selectedImages.map((img, idx) => (
                        <button
                          key={`${img}-${idx}`}
                          type="button"
                          onClick={() => setSelectedImageIndex(idx)}
                          className={`relative h-16 overflow-hidden rounded-md border ${idx === selectedImageIndex ? "border-[#1f6b45]" : "border-slate-300"}`}
                        >
                          <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" unoptimized={img.startsWith("/api/images/")} />
                        </button>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>

              <div className="space-y-4">
                <p className="text-3xl font-black text-slate-900">{formatCurrency(selectedProperty.price)}</p>
                <p className="text-sm leading-7 text-slate-700">{selectedProperty.description || "No description provided."}</p>
                <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  <p><span className="font-semibold text-slate-900">Area:</span> {selectedProperty.area ?? "N/A"} sq ft</p>
                  <p><span className="font-semibold text-slate-900">Manager:</span> {selectedProperty.manager}</p>
                  <p><span className="font-semibold text-slate-900">Contact:</span> {selectedProperty.contact}</p>
                  <p><span className="font-semibold text-slate-900">Coordinates:</span> {selectedProperty.latitude}, {selectedProperty.longitude}</p>
                </div>
                <div className="flex flex-wrap gap-3 pt-1">
                  <a
                    href={`https://maps.google.com/maps?q=${selectedProperty.latitude},${selectedProperty.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Open in Maps
                  </a>
                  <Link href="/inquiries" className="rounded-lg bg-[#1f6b45] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2f8a5b]">
                    Send Inquiry
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      </main>
    </LoaderLayout>
  );
}






