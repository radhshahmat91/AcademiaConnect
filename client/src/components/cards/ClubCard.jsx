import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { fileUrl } from '../../services/api';

export default function ClubCard({ club, entryNo, index = 0 }) {
  return (
    <Link
      to={`/clubs/${club._id}`}
      className="group card card-hover spotlight reveal flex flex-col overflow-hidden"
      style={{ '--i': index }}
    >
      <div className={`relative h-24 shrink-0 overflow-hidden ${club.coverImage ? '' : 'cover-fallback'}`}>
        {club.coverImage && (
          <img
            src={fileUrl(club.coverImage)}
            alt=""
            className="h-full w-full object-cover opacity-90 transition duration-500 ease-out-expo group-hover:scale-[1.05]"
          />
        )}
        {entryNo != null && (
          <span className="entry-tag">No. {String(entryNo).padStart(3, '0')}</span>
        )}
        <div className="absolute -bottom-6 left-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-md border-2 border-paper bg-forest-ink shadow-card transition duration-300 ease-out-expo group-hover:-translate-y-0.5">
          {club.logo ? (
            <img src={fileUrl(club.logo)} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="font-display text-lg font-semibold text-parchment">{club.name?.[0]}</span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4 pt-8">
        <span className="badge-gold w-fit">{club.category}</span>
        <h3 className="font-display text-base font-semibold leading-snug text-forest-ink">
          <span className="link-draw">{club.name}</span>
        </h3>
        <p className="line-clamp-2 text-sm text-ink-muted">{club.description}</p>
        <div className="mt-auto flex items-center gap-1.5 pt-2 text-xs text-ink-muted">
          <Users size={14} /> {club.members?.length ?? 0} members
        </div>
      </div>
    </Link>
  );
}
