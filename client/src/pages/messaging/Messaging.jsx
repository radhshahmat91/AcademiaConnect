import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Send, MessageSquare, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { getSocket } from '../../services/socket';
import Avatar from '../../components/common/Avatar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import usePageTitle from '../../hooks/usePageTitle';

export default function Messaging() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [active, setActive] = useState(null); // { conversationId, otherUser, messages }
  const [loadingActive, setLoadingActive] = useState(false);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const bottomRef = useRef(null);
  usePageTitle(active?.otherUser?.name ? `Chat with ${active.otherUser.name}` : 'Messages');

  const loadConversations = useCallback(() => {
    return api.get('/messages/conversations').then((res) => setConversations(res.data));
  }, []);

  useEffect(() => {
    loadConversations().finally(() => setLoadingConvos(false));
  }, [loadConversations]);

  // Open (or create) the thread for whichever user is in the URL.
  useEffect(() => {
    if (!userId) {
      setActive(null);
      return;
    }
    setLoadingActive(true);
    api
      .get(`/messages/with/${userId}`)
      .then((res) => {
        const otherUser =
          conversations.find((c) => c.otherUser._id === userId)?.otherUser ||
          searchResults.find((u) => u._id === userId);
        setActive({ conversationId: res.data.conversationId, otherUser, messages: res.data.messages });
      })
      .finally(() => setLoadingActive(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Fill in otherUser once conversations load, in case it wasn't known yet.
  useEffect(() => {
    if (active && !active.otherUser) {
      const match = conversations.find((c) => c.otherUser._id === userId)?.otherUser;
      if (match) setActive((prev) => ({ ...prev, otherUser: match }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations]);

  // Live incoming messages.
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return undefined;

    const onNewMessage = ({ conversationId, message }) => {
      setActive((prev) =>
        prev && prev.conversationId === conversationId
          ? { ...prev, messages: [...prev.messages, message] }
          : prev
      );
      loadConversations();
    };

    socket.on('newMessage', onNewMessage);
    return () => socket.off('newMessage', onNewMessage);
  }, [loadConversations]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [active?.messages]);

  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      return undefined;
    }
    const handle = setTimeout(() => {
      api.get('/users', { params: { search: search.trim() } }).then((res) => setSearchResults(res.data));
    }, 250);
    return () => clearTimeout(handle);
  }, [search]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !userId) return;
    const content = text.trim();
    setText('');
    setSending(true);
    setTimeout(() => setSending(false), 650);
    const res = await api.post('/messages', { receiverId: userId, content });
    setActive((prev) => (prev ? { ...prev, messages: [...prev.messages, res.data] } : prev));
    loadConversations();
  };

  const openConversation = (otherUserId) => {
    setSearch('');
    setSearchResults([]);
    navigate(`/messages/${otherUserId}`);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-md border border-hairline bg-paper lg:h-[calc(100vh-6rem)]">
      {/* Conversation list */}
      <div className={`w-full shrink-0 flex-col border-r border-hairline sm:w-80 ${userId ? 'hidden sm:flex' : 'flex'}`}>
        <div className="border-b border-hairline p-3">
          <div className="search-box">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              className="text-sm"
              placeholder="Find someone to message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {search.trim() ? (
            searchResults.length === 0 ? (
              <p className="p-4 text-sm text-ink-muted">No matches.</p>
            ) : (
              searchResults.map((u, i) => (
                <button
                  key={u._id}
                  onClick={() => openConversation(u._id)}
                  className="reveal flex w-full items-center gap-3 border-b border-hairline px-4 py-3 text-left transition-colors duration-150 hover:bg-parchment/60"
                  style={{ '--i': i }}
                >
                  <Avatar src={u.avatar} name={u.name} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{u.name}</p>
                    <p className="truncate text-xs text-ink-muted">{u.department || u.role}</p>
                  </div>
                </button>
              ))
            )
          ) : loadingConvos ? (
            <LoadingSpinner />
          ) : conversations.length === 0 ? (
            <p className="p-4 text-sm text-ink-muted">Search for a classmate above to start a conversation.</p>
          ) : (
            conversations.map((c, i) => (
              <button
                key={c._id}
                onClick={() => openConversation(c.otherUser._id)}
                className={`reveal flex w-full items-center gap-3 border-b border-hairline px-4 py-3 text-left transition-colors duration-150 hover:bg-parchment/60 ${
                  userId === c.otherUser._id ? 'bg-forest/5' : ''
                }`}
                style={{ '--i': i }}
              >
                <Avatar src={c.otherUser.avatar} name={c.otherUser.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{c.otherUser.name}</p>
                  <p className="truncate text-xs text-ink-muted">{c.lastMessage}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Active thread */}
      <div className={`flex min-w-0 flex-1 flex-col ${userId ? 'flex' : 'hidden sm:flex'}`}>
        {!userId ? (
          <EmptyState
            icon={MessageSquare}
            title="Select a conversation"
            description="Choose someone from the list, or search for a classmate to start chatting."
          />
        ) : loadingActive || !active ? (
          <LoadingSpinner fullPage />
        ) : (
          <>
            <div className="flex items-center gap-3 border-b border-hairline px-4 py-3">
              <button onClick={() => navigate('/messages')} className="icon-btn sm:hidden">
                <ArrowLeft size={18} />
              </button>
              <Avatar src={active.otherUser?.avatar} name={active.otherUser?.name} size="sm" />
              <p className="text-sm font-medium text-ink">{active.otherUser?.name || 'Conversation'}</p>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {active.messages.length === 0 && (
                <p className="py-10 text-center text-sm text-ink-muted">Say hello 👋</p>
              )}
              {active.messages.map((m) => {
                const mine = m.sender?._id === user._id || m.sender === user._id;
                return (
                  <div key={m._id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`animate-rise max-w-[75%] rounded-md px-3.5 py-2 text-sm ${
                        mine ? 'bg-forest text-paper' : 'border border-hairline bg-parchment text-ink'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{m.content}</p>
                      <p className={`mt-1 text-[10px] ${mine ? 'text-paper/60' : 'text-ink-muted'}`}>
                        {format(new Date(m.createdAt), 'h:mm a')}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-hairline p-3">
              <input
                className="input-field flex-1"
                placeholder="Write a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button type="submit" className={`btn-primary send-btn ${sending ? 'is-sending' : ''}`} disabled={!text.trim()}>
                <Send size={16} />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
