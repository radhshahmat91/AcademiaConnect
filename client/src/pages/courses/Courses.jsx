import { useEffect, useRef, useState } from 'react';
import { Search, BookOpen } from 'lucide-react';
import api from '../../services/api';
import CourseCard from '../../components/cards/CourseCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import usePageTitle from '../../hooks/usePageTitle';
import useHotkey from '../../hooks/useHotkey';

const CATEGORIES = [
  'All',
  'Data Structures',
  'Algorithms',
  'Artificial Intelligence',
  'Theory of Computation',
  'Database Systems',
  'Computer Networks',
  'Operating Systems',
  'Web Development',
  'Software Engineering',
  'Other',
];

export default function Courses() {
  usePageTitle('Courses');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const searchRef = useRef(null);
  useHotkey('/', () => searchRef.current?.focus());

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search.trim()) params.search = search.trim();
    if (category !== 'All') params.category = category;

    const handle = setTimeout(() => {
      api.get('/courses', { params }).then((res) => setCourses(res.data)).finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(handle);
  }, [search, category]);

  return (
    <div>
      <h1 className="page-heading">Courses</h1>
      <div className="ledger-rule my-3" />
      <p className="text-sm text-ink-muted">Lecture videos and notes for every course on record.</p>

      <div className="mt-6">
        <div className="search-box max-w-md">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            ref={searchRef}
            placeholder="Search by title or course code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {!search && (
            <kbd className="kbd pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 sm:inline-flex">/</kbd>
          )}
        </div>
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((c) => (
            <button key={c} type="button" className="chip" aria-pressed={category === c} onClick={() => setCategory(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <LoadingSpinner />
        ) : courses.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No courses found"
            description="Try a different search term or category."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, i) => (
              <CourseCard key={course._id} course={course} entryNo={i + 1} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
