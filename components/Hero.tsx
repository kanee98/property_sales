"use client";

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  stats: {
    totalProperties: number;
    corporate: number;
    retail: number;
    residential: number;
    for_sale: number;
    for_rent: number;
    for_lease: number;
    wanted: number;
  };
}

export default function Hero({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  stats,
}: HeroProps) {
  return (
    <section className="landing">
      <div className="landing-bg"></div>

      <div className="landing-message text-center p-6">
        <h3 className="text-2xl font-semibold">Relax, Finding Properties Just Got Easier</h3>
        <p className="text-lg mt-2">Discover the best properties for sale or rent</p>
          <form className="search-form">
            <input
              type="text"
              placeholder="Search properties..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="search-select"
            >
              <option value="">All Types</option>
              <option value="Corporate">Corporate</option>
              <option value="Retail">Retail</option>
              <option value="Residential">Residential</option>
            </select>
          </form>

          <div className="stats grid grid-cols-4 gap-4 px-6 mt-6">
            <div className="stat text-center p-4 bg-gray-100 rounded shadow">
              <h2 className="text-3xl font-bold">{stats.totalProperties}</h2>
              <p>Total Properties</p>
            </div>
            <div className="stat text-center p-4 bg-gray-100 rounded shadow">
              <h2 className="text-3xl font-bold">{stats.corporate}</h2>
              <p>Corporate</p>
            </div>
            <div className="stat text-center p-4 bg-gray-100 rounded shadow">
              <h2 className="text-3xl font-bold">{stats.retail}</h2>
              <p>Retail</p>
            </div>
            <div className="stat text-center p-4 bg-gray-100 rounded shadow">
              <h2 className="text-3xl font-bold">{stats.residential}</h2>
              <p>Residential</p>
            </div>
            <div className="stat text-center p-4 bg-gray-100 rounded shadow">
              <h2 className="text-3xl font-bold">{stats.for_rent}</h2>
              <p>For Rent</p>
            </div>
            <div className="stat text-center p-4 bg-gray-100 rounded shadow">
              <h2 className="text-3xl font-bold">{stats.for_lease}</h2>
              <p>For Lease</p>
            </div>
            <div className="stat text-center p-4 bg-gray-100 rounded shadow">
              <h2 className="text-3xl font-bold">{stats.for_sale}</h2>
              <p>For Sale</p>
            </div>
            <div className="stat text-center p-4 bg-gray-100 rounded shadow">
              <h2 className="text-3xl font-bold">{stats.wanted}</h2>
              <p>Wanted</p>
            </div>
          </div>
      </div>
    </section>
  );
}