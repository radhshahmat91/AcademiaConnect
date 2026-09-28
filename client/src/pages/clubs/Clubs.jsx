import { useEffect, useRef, useState } from 'react';
import { Search, Users } from 'lucide-react';
import api from '../../services/api';
import ClubCard from '../../components/cards/ClubCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import usePageTitle from '../../hooks/usePageTitle';
import useHotkey from '../../hooks/useHotkey';

export default function Clubs() {
  usePageTitle('Clubs');
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const searchRef = useRef(null);
  useHotkey('/', () => searchRef.current?.focus());

  useEffect(() => {
    setLoading(true);
    const handle = setTimeout(() => {
      api
        .get('/clubs', { params: search.trim() ? { search: search.trim() } : {} })
        .then((res) => setClubs(res.data))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(handle);
  }, [search]);

  return (
    <div>
      <h1 className="page-heading">Clubs</h1>
      <div className="ledger-rule my-3" />
      <p className="text-sm text-ink-muted">Find your people. Join a club and follow their updates.</p>

      <div className="search-box mt-6 max-w-md">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input
          ref={searchRef}
          placeholder="Search clubs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {!search && (
          <kbd className="kbd pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 sm:inline-flex">/</kbd>
        )}
      </div>

      <div className="mt-6">
        {loading ? (
          <LoadingSpinner />
        ) : clubs.length === 0 ? (
          <EmptyState icon={Users} title="No clubs found" description="Try a different search term." />
        ) : (
          <div className="grid gap-5 pt-4 sm:grid-cols-2 lg:grid-cols-3">
            {clubs.map((club, i) => <ClubCard key={club._id} club={club} entryNo={i + 1} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}
