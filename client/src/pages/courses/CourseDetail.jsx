import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlayCircle, FileText, Download, Trash2, Plus, Users, ArrowLeft } from 'lucide-react';
import api, { fileUrl } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import FileUpload from '../../components/upload/FileUpload';
import { toEmbedUrl } from '../../utils/video';
import usePageTitle from '../../hooks/usePageTitle';

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [bursting, setBursting] = useState(false);
  usePageTitle(course?.title || 'Course');

  const [videoForm, setVideoForm] = useState({ title: '', url: '', duration: '' });
  const [noteForm, setNoteForm] = useState({ title: '', fileUrl: '' });
  const [savingVideo, setSavingVideo] = useState(false);
  const [savingNote, setSavingNote] = useState(false);

  const load = () => {
    api.get(`/courses/${id}`).then((res) => {
      setCourse(res.data);
      setActiveVideo((prev) => prev || res.data.videos?.[0] || null);
    });
  };

  useEffect(() => {
    setLoading(true);
    load();
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading || !course) return <LoadingSpinner fullPage />;

  const isEnrolled = course.enrolledStudents?.some((s) => (s._id || s) === user._id);
  const isAdmin = user.role === 'admin';
  const embedUrl = activeVideo ? toEmbedUrl(activeVideo.url) : null;

  const handleEnroll = async () => {
    setEnrolling(true);
    const wasEnrolled = isEnrolled;
    await api.post(`/courses/${id}/enroll`);
    await load();
    setEnrolling(false);
    if (!wasEnrolled) {
      setBursting(true);
      setTimeout(() => setBursting(false), 800);
    }
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    if (!videoForm.title || !videoForm.url) return;
    setSavingVideo(true);
    await api.post(`/courses/${id}/videos`, videoForm);
    setVideoForm({ title: '', url: '', duration: '' });
    setSavingVideo(false);
    load();
  };

  const handleDeleteVideo = async (videoId) => {
    await api.delete(`/courses/${id}/videos/${videoId}`);
    setActiveVideo(null);
    load();
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteForm.title || !noteForm.fileUrl) return;
    setSavingNote(true);
    await api.post(`/courses/${id}/notes`, noteForm);
    setNoteForm({ title: '', fileUrl: '' });
    setSavingNote(false);
    load();
  };

  const handleDeleteNote = async (noteId) => {
    await api.delete(`/courses/${id}/notes/${noteId}`);
    load();
  };

  return (
    <div>
      <Link to="/courses" className="back-link">
        <ArrowLeft size={15} /> Back to courses
      </Link>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <span className="badge-forest">{course.category}</span>
          <h1 className="mt-2 font-display text-2xl font-semibold text-forest-ink">{course.title}</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {course.code && <span>{course.code} &middot; </span>}
            {course.instructor}
          </p>
        </div>
        <div className="relative inline-block shrink-0">
          <button
            onClick={handleEnroll}
            disabled={enrolling}
            className={`toggle-btn ${isEnrolled ? 'btn-secondary is-active' : 'btn-primary'}`}
          >
            {isEnrolled ? (
              <span className="label-swap">
                <span className="label-default">Enrolled</span>
                <span className="label-hover">Unenroll</span>
              </span>
            ) : (
              'Enroll in course'
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

      {course.description && <p className="mt-4 max-w-prose text-sm text-ink-muted">{course.description}</p>}

      <div className="mt-3 flex items-center gap-1.5 text-xs text-ink-muted">
        <Users size={13} /> {course.enrolledStudents?.length ?? 0} students enrolled
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <h2 className="font-display text-lg font-semibold text-forest-ink">Video lectures</h2>

          {activeVideo ? (
            <div className="overflow-hidden rounded-md border border-hairline bg-forest-ink">
              {embedUrl ? (
                <div className="aspect-video">
                  <iframe
                    key={activeVideo._id}
                    src={embedUrl}
                    title={activeVideo.title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <a
                  href={activeVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex aspect-video flex-col items-center justify-center gap-2 text-parchment hover:bg-forest-ink/80"
                >
                  <PlayCircle size={40} strokeWidth={1.25} />
                  <span className="text-sm">Watch "{activeVideo.title}" externally</span>
                </a>
              )}
            </div>
          ) : (
            <p className="rounded-md border border-dashed border-hairline bg-paper/50 px-4 py-10 text-center text-sm text-ink-muted">
              No videos have been added to this course yet.
            </p>
          )}

          <ul className="divide-y divide-hairline rounded-md border border-hairline bg-paper">
            {course.videos?.map((v, i) => (
              <li
                key={v._id}
                className={`reveal flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-200 ${
                  activeVideo?._id === v._id ? 'bg-forest/5' : ''
                }`}
                style={{ '--i': i }}
              >
                <button onClick={() => setActiveVideo(v)} className="flex flex-1 items-center gap-3 text-left">
                  <span className="w-5 shrink-0 text-xs text-ink-muted">{i + 1}.</span>
                  <PlayCircle size={16} className="shrink-0 text-forest" />
                  <span className="flex-1 text-ink">{v.title}</span>
                  {v.duration && <span className="text-xs text-ink-muted">{v.duration}</span>}
                </button>
                {isAdmin && (
                  <button onClick={() => handleDeleteVideo(v._id)} className="icon-btn icon-btn-danger" title="Remove video">
                    <Trash2 size={15} />
                  </button>
                )}
              </li>
            ))}
          </ul>

          {isAdmin && (
            <form onSubmit={handleAddVideo} className="card space-y-3 p-4">
              <p className="text-sm font-medium text-forest-ink">Add a video (admin)</p>
              <input
                className="input-field"
                placeholder="Video title"
                value={videoForm.title}
                onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
              />
              <div className="flex gap-2">
                <input
                  className="input-field"
                  placeholder="YouTube or video URL"
                  value={videoForm.url}
                  onChange={(e) => setVideoForm({ ...videoForm, url: e.target.value })}
                />
                <input
                  className="input-field w-28"
                  placeholder="12:34"
                  value={videoForm.duration}
                  onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                />
              </div>
              <button className="btn-secondary" disabled={savingVideo}>
                <Plus size={15} /> Add video
              </button>
            </form>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-lg font-semibold text-forest-ink">Notes</h2>
          {course.notes?.length ? (
            <ul className="divide-y divide-hairline rounded-md border border-hairline bg-paper">
              {course.notes.map((n, i) => (
                <li key={n._id} className="reveal flex items-center gap-2.5 px-4 py-3 text-sm" style={{ '--i': i }}>
                  <FileText size={16} className="shrink-0 text-forest" />
                  <span className="flex-1 truncate text-ink">{n.title}</span>
                  <a href={fileUrl(n.fileUrl)} target="_blank" rel="noopener noreferrer" title="Download" className="icon-btn">
                    <Download size={15} />
                  </a>
                  {isAdmin && (
                    <button onClick={() => handleDeleteNote(n._id)} className="icon-btn icon-btn-danger" title="Remove note">
                      <Trash2 size={15} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-md border border-dashed border-hairline bg-paper/50 px-4 py-8 text-center text-sm text-ink-muted">
              No notes uploaded yet.
            </p>
          )}

          {isAdmin && (
            <form onSubmit={handleAddNote} className="card space-y-3 p-4">
              <p className="text-sm font-medium text-forest-ink">Add a note (admin)</p>
              <input
                className="input-field"
                placeholder="Note title, e.g. Chapter 4 Slides"
                value={noteForm.title}
                onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
              />
              <FileUpload
                kind="file"
                accept="application/pdf"
                value={noteForm.fileUrl}
                onChange={(url) => setNoteForm({ ...noteForm, fileUrl: url })}
              />
              <button className="btn-secondary" disabled={savingNote}>
                <Plus size={15} /> Add note
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
