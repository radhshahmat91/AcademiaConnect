import { Link } from 'react-router-dom';
import { PlayCircle, FileText, Users } from 'lucide-react';
import { fileUrl } from '../../services/api';

export default function CourseCard({ course, entryNo, index = 0 }) {
  return (
    <Link
      to={`/courses/${course._id}`}
      className="group card card-hover spotlight reveal flex flex-col overflow-hidden"
      style={{ '--i': index }}
    >
      <div className="relative h-36 shrink-0 overflow-hidden">
        {course.thumbnail ? (
          <img
            src={fileUrl(course.thumbnail)}
            alt=""
            className="h-full w-full object-cover opacity-90 transition duration-500 ease-out-expo group-hover:scale-[1.05]"
          />
        ) : (
          <div className="thumb-fallback h-full w-full transition duration-500 ease-out-expo group-hover:scale-[1.05]">
            <span className="font-display text-4xl font-semibold text-parchment/25">
              {course.category?.[0] || 'C'}
            </span>
          </div>
        )}
        {entryNo != null && (
          <span className="entry-tag">No. {String(entryNo).padStart(3, '0')}</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="badge-forest w-fit">{course.category}</span>
        <h3 className="font-display text-base font-semibold leading-snug text-forest-ink">
          <span className="link-draw">{course.title}</span>
        </h3>
        {course.code && <p className="text-xs text-ink-muted">{course.code}</p>}
        {course.instructor && <p className="text-sm text-ink-muted">{course.instructor}</p>}
        <div className="mt-auto flex items-center gap-4 pt-2 text-xs text-ink-muted">
          <span className="flex items-center gap-1"><PlayCircle size={14} /> {course.videos?.length ?? 0}</span>
          <span className="flex items-center gap-1"><FileText size={14} /> {course.notes?.length ?? 0}</span>
          <span className="flex items-center gap-1"><Users size={14} /> {course.enrolledStudents?.length ?? 0}</span>
        </div>
      </div>
    </Link>
  );
}
