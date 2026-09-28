import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import api, { fileUrl } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Avatar from '../../components/common/Avatar';
import FileUpload from '../../components/upload/FileUpload';
import usePageTitle from '../../hooks/usePageTitle';

export default function ClubDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [bursting, setBursting] = useState(false);
  const [updateForm, setUpdateForm] = useState({ title: '', content: '', image: '' });
  const [posting, setPosting] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  usePageTitle(club?.name || 'Club');

  const load = () => api.get(`/clubs/${id}`).then((res) => setClub(res.data));

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading || !club) return <LoadingSpinner fullPage />;

  const isMember = club.members?.some((m) => m._id === user._id);
  const isAdmin = user.role === 'admin';

  const handleJoin = async () => {
    setJoining(true);
    const wasMember = isMember;
    await api.post(`/clubs/${id}/join`);
    await load();
    setJoining(false);
    if (!wasMember) {
      setBursting(true);
      setTimeout(() => setBursting(false), 800);
    }
  };

  const handlePostUpdate = async (e) => {
    e.preventDefault();
    if (!updateForm.title || !updateForm.content) return;
    setPosting(true);
    await api.post(`/clubs/${id}/updates`, updateForm);
    setUpdateForm({ title: '', content: '', image: '' });
    setPosting(false);
    load();
  };

  const handleDeleteUpdate = async (updateId) => {
    await api.delete(`/clubs/${id}/updates/${updateId}`);
    load();
  };

  return (
    <div>
      <Link to="/clubs" className="back-link">
        <ArrowLeft size={15} /> Back to clubs
      </Link>

      <div className="card overflow-hidden">
        <div className={`relative h-32 sm:h-40 ${club.coverImage ? '' : 'cover-fallback'}`}>
          {club.coverImage && <img src={fileUrl(club.coverImage)} alt="" className="h-full w-full object-cover opacity-90" />}
        </div>
        <div className="flex flex-col gap-4 px-5 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="-mt-8 flex items-end gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md border-4 border-paper bg-forest-ink shadow-card">
              {club.logo ? (
                <img src={fileUrl(club.logo)} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="font-display text-2xl font-semibold text-parchment">{club.name?.[0]}</span>
              )}
            </div>
            <div className="pb-1">
              <span className="badge-gold">{club.category}</span>
              <h1 className="mt-1 font-display text-xl font-semibold text-forest-ink sm:text-2xl">{club.name}</h1>
            </div>
          </div>
          <div className="relative inline-block shrink-0">
            <button
              onClick={handleJoin}
              disabled={joining}
              className={`toggle-btn ${isMember ? 'btn-secondary is-active' : 'btn-primary'}`}
            >
              {isMember ? (
                <span className="label-swap">
                  <span className="label-default">Member</span>
                  <span className="label-hover">Leave club</span>
                </span>
              ) : (
                'Join club'
              )}
            </button>
            {bursting && (
              <span className="burst" aria-hidden="true">
                {Array.from({ length: 10 }).map((_, i) => (
                  <i key={i} style={{ '--a': `${i * 36}deg`, '--d': `${18 + (i % 3) * 6}px`, animationDelay: `${i * 12}ms` }} />
                ))}
              </span>
            )}
          </div>
        </div>
        <div className="border-t border-hairline px-5 py-4">
          <p className="max-w-prose text-sm text-ink-muted">{club.description}</p>
          <button
            onClick={() => setShowMembers((s) => !s)}
            className="group mt-3 flex items-center gap-1.5 text-sm text-forest transition active:scale-[0.98]"
          >
            <Users size={15} /> <span className="link-draw">{club.members?.length ?? 0} members</span>
          </button>
          {showMembers && (
            <div className="mt-3 flex flex-wrap gap-3">
              {club.members?.map((m, i) => (
                <div
                  key={m._id}
                  className="reveal flex items-center gap-2 rounded border border-hairline bg-parchment/60 py-1 pl-1 pr-3 text-sm"
                  style={{ '--i': i }}
                >
                  <Avatar src={m.avatar} name={m.name} size="sm" />
                  {m.name}
                </div>
              ))}
              {club.members?.length === 0 && <p className="text-sm text-ink-muted">No members yet — be the first to join.</p>}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 font-display text-lg font-semibold text-forest-ink">Updates</h2>

        {isAdmin && (
          <form onSubmit={handlePostUpdate} className="card mb-5 space-y-3 p-4">
            <p className="text-sm font-medium text-forest-ink">Post an update (admin)</p>
            <input
              className="input-field"
              placeholder="Update title"
              value={updateForm.title}
              onChange={(e) => setUpdateForm({ ...updateForm, title: e.target.value })}
            />
            <textarea
              className="input-field min-h-[80px]"
              placeholder="What's happening in the club?"
              value={updateForm.content}
              onChange={(e) => setUpdateForm({ ...updateForm, content: e.target.value })}
            />
            <FileUpload
              kind="image"
              value={updateForm.image}
              onChange={(url) => setUpdateForm({ ...updateForm, image: url })}
            />
            <button className="btn-secondary" disabled={posting}>
              <Plus size={15} /> Post update
            </button>
          </form>
        )}

        {club.updates?.length ? (
          <div className="space-y-4">
            {club.updates.map((u, i) => (
              <div key={u._id} className="card card-hover reveal p-4" style={{ '--i': i }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar src={u.postedBy?.avatar} name={u.postedBy?.name} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-ink">{u.postedBy?.name || 'Club admin'}</p>
                      <p className="text-xs text-ink-muted">{format(new Date(u.createdAt), 'MMM d, yyyy · h:mm a')}</p>
                    </div>
                  </div>
                  {isAdmin && (
                    <button onClick={() => handleDeleteUpdate(u._id)} className="icon-btn icon-btn-danger">
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
                <h3 className="mt-3 font-display text-base font-semibold text-forest-ink">{u.title}</h3>
                <p className="mt-1 text-sm text-ink-muted">{u.content}</p>
                {u.image && <img src={fileUrl(u.image)} alt="" className="mt-3 max-h-72 w-full rounded object-cover" />}
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-md border border-dashed border-hairline bg-paper/50 px-4 py-10 text-center text-sm text-ink-muted">
            No updates posted yet.
          </p>
        )}
      </div>
    </div>
  );
}
