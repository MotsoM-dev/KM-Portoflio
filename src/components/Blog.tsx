'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import {
  AtSign,
  Camera,
  ChevronLeft,
  ChevronRight,
  Code2,
  Film,
  Hash,
  ImageIcon,
  Layers,
  Lock,
  LogOut,
  Palette,
  PenLine,
  Plus,
  Save,
  Share2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Trash2,
  UploadCloud,
  X,
  Zap,
} from 'lucide-react';
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card';

const POSTS_KEY = 'motsom-dev-visual-feed-posts';
const LEGACY_POSTS_KEY = 'motsom-dev-blog-posts';
const SETTINGS_KEY = 'motsom-dev-feed-settings';
const ADMIN_KEY = 'motsom-dev-blog-admin';
const ADMIN_PASSWORD_HASH = '3c7bff9a336ba17f715cbffd291cfdad52f33e4887c164a0a368ba429555b160';
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const MAX_VIDEO_BYTES = 8 * 1024 * 1024;
const MAX_MEDIA_FILES = 6;

type BlogMedia = { src: string; name: string; kind: 'image' | 'video' };
type VisualPost = { id: string; caption: string; createdAt: string; tags: string[]; media: BlogMedia[] };
type FeedSettings = { tags: string[]; interests: string[] };

const defaultInterests = ['Mobile development', 'Web development', 'FinTech', 'Blockchain', 'Cybersecurity', 'UX', 'UI'];
const defaultTags = ['#MobileDev', '#WebDev', '#FinTech', '#Blockchain', '#Cybersecurity', '#UX', '#UI'];
const defaultSettings: FeedSettings = { tags: defaultTags, interests: defaultInterests };

const starterPosts: VisualPost[] = [
  {
    id: 'mobile-first-product-flow',
    caption: 'Mobile-first product flows that feel quick, clear, and human. I like interfaces that make complex work feel lighter.',
    createdAt: '2026-07-13T10:00:00.000Z',
    tags: ['#MobileDev', '#UX', '#UI'],
    media: [],
  },
  {
    id: 'fintech-msme-marketplace',
    caption: 'FinTech thinking from my MSME and funder marketplace idea: better discovery, better trust, and better access to opportunity.',
    createdAt: '2026-07-12T14:15:00.000Z',
    tags: ['#FinTech', '#MSMEs', '#Hackathon'],
    media: [],
  },
  {
    id: 'secure-web-experiments',
    caption: 'Experimenting with secure, polished web experiences where the interface, data layer, and product story all work together.',
    createdAt: '2026-07-11T09:30:00.000Z',
    tags: ['#WebDev', '#Cybersecurity', '#BuildInPublic'],
    media: [],
  },
];

const interestIcons = [Smartphone, Code2, Sparkles, Layers, ShieldCheck, Palette, Zap];
const interestGradients = ['gradient-hero-bg', 'gradient-cool-bg', 'gradient-pink-bg'];

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const formatDate = (value: string) => new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));

async function hashText(value: string) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function normalizeTag(value: string) {
  const cleaned = value.trim().replace(/\s+/g, '');
  if (!cleaned) return '';
  return cleaned.startsWith('#') ? cleaned : `#${cleaned}`;
}

function normalizeTags(values: unknown) {
  if (!Array.isArray(values)) return [];
  const tags = values.filter((value): value is string => typeof value === 'string').map(normalizeTag).filter(Boolean);
  return Array.from(new Set(tags));
}

function parseTagList(value: string) {
  const tags = value.split(/[\s,]+/).map(normalizeTag).filter(Boolean);
  return Array.from(new Set(tags));
}

function normalizeMediaItem(value: unknown): BlogMedia | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const media = value as Partial<BlogMedia> & { type?: unknown };
  if (typeof media.src !== 'string' || !media.src) return undefined;
  const sourceKind = media.kind === 'video' || media.type === 'video' || media.src.startsWith('data:video') ? 'video' : 'image';
  return { src: media.src, name: typeof media.name === 'string' ? media.name : 'Feed media', kind: sourceKind };
}

function normalizeMedia(mediaValue: unknown, legacyImage: unknown) {
  const fromMedia = Array.isArray(mediaValue) ? mediaValue.map(normalizeMediaItem).filter((item): item is BlogMedia => Boolean(item)) : [];
  const fromImage = normalizeMediaItem(legacyImage);
  return (fromMedia.length > 0 ? fromMedia : fromImage ? [fromImage] : []).slice(0, MAX_MEDIA_FILES);
}

function normalizePost(value: unknown): VisualPost | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const raw = value as { id?: unknown; caption?: unknown; body?: unknown; title?: unknown; createdAt?: unknown; tags?: unknown; media?: unknown; image?: unknown };
  const captionSource = typeof raw.caption === 'string' ? raw.caption : typeof raw.body === 'string' ? raw.body : typeof raw.title === 'string' ? raw.title : '';
  const caption = captionSource.trim();
  if (!caption) return undefined;
  return {
    id: typeof raw.id === 'string' && raw.id ? raw.id : createId(),
    caption,
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : new Date().toISOString(),
    tags: normalizeTags(raw.tags),
    media: normalizeMedia(raw.media, raw.image),
  };
}

function readPostList(key: string) {
  const saved = window.localStorage.getItem(key);
  if (!saved) return [];
  const parsed = JSON.parse(saved) as unknown;
  if (!Array.isArray(parsed)) return [];
  return parsed.map(normalizePost).filter((post): post is VisualPost => Boolean(post));
}

function readPosts() {
  try {
    const visualPosts = readPostList(POSTS_KEY);
    if (visualPosts.length > 0) return visualPosts;
    const legacyPosts = readPostList(LEGACY_POSTS_KEY);
    if (legacyPosts.length > 0) return legacyPosts;
    return starterPosts;
  } catch {
    return starterPosts;
  }
}

function readSettings() {
  try {
    const saved = window.localStorage.getItem(SETTINGS_KEY);
    if (!saved) return defaultSettings;
    const parsed = JSON.parse(saved) as Partial<FeedSettings>;
    const tags = normalizeTags(parsed.tags);
    const interests = Array.isArray(parsed.interests) && parsed.interests.some((item) => typeof item === 'string' && item.trim())
      ? parsed.interests.filter((item): item is string => typeof item === 'string').map((item) => item.trim())
      : defaultInterests;
    return { tags: tags.length > 0 ? tags : defaultTags, interests };
  } catch {
    return defaultSettings;
  }
}

function copyToClipboard(value: string) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(value);
  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  return Promise.resolve();
}

function getMediaValidationError(file: File) {
  if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) return 'Please choose image or video files only.';
  if (file.type.startsWith('image/') && file.size > MAX_IMAGE_BYTES) return 'Images must be under 2 MB so they can save locally.';
  if (file.type.startsWith('video/') && file.size > MAX_VIDEO_BYTES) return 'Videos must be under 8 MB so they can save locally.';
  return '';
}

function readMediaFile(file: File) {
  return new Promise<BlogMedia>((resolve, reject) => {
    const error = getMediaValidationError(file);
    if (error) {
      reject(new Error(error));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read one of the selected files.'));
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('Could not read one of the selected files.'));
        return;
      }
      resolve({ src: reader.result, name: file.name, kind: file.type.startsWith('video/') ? 'video' : 'image' });
    };
    reader.readAsDataURL(file);
  });
}

function Avatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'h-9 w-9 text-xs', md: 'h-12 w-12 text-sm', lg: 'h-20 w-20 text-xl' };
  return (
    <div className={`gradient-hero-bg relative grid shrink-0 place-items-center rounded-2xl font-display font-bold text-white shadow-lg ${sizes[size]}`}>
      <span>KM</span>
      <motion.span aria-hidden='true' className='absolute inset-0 rounded-2xl border border-white/50' animate={{ scale: [1, 1.24, 1], opacity: [0.4, 0, 0.4] }} transition={{ duration: 2.9, repeat: Infinity, ease: 'easeInOut' }} />
    </div>
  );
}

function DefaultVisual({ caption, index }: { caption: string; index: number }) {
  return (
    <div className='gradient-cool-bg relative grid h-full min-h-[18rem] w-full overflow-hidden place-items-center text-white'>
      <motion.div aria-hidden='true' className='absolute -left-1/4 top-0 h-full w-1/2 skew-x-12 bg-white/20 blur-2xl' animate={{ x: ['0%', '260%'] }} transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut', delay: index * 0.12 }} />
      <motion.div aria-hidden='true' className='absolute right-8 top-8 h-28 w-28 rounded-full border border-white/20' animate={{ scale: [1, 1.18, 1], rotate: [0, 20, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
      <div className='relative grid max-w-sm gap-4 px-7 text-center'>
        <div className='mx-auto grid h-16 w-16 place-items-center rounded-3xl border border-white/30 bg-white/15 backdrop-blur'><Camera className='h-7 w-7' /></div>
        <p className='font-display text-2xl font-bold leading-tight'>MotsoM Feed</p>
        <p className='line-clamp-2 text-sm leading-6 text-white/80'>{caption}</p>
      </div>
    </div>
  );
}

function MediaDisplay({ media, caption, index, controls = false, fit = 'cover' }: { media?: BlogMedia; caption: string; index: number; controls?: boolean; fit?: 'cover' | 'contain' }) {
  const fitClass = fit === 'contain' ? 'object-contain' : 'object-cover';
  if (!media) return <DefaultVisual caption={caption} index={index} />;
  if (media.kind === 'video') {
    return (
      <video
        src={media.src}
        className={`h-full w-full bg-black ${fitClass}`}
        controls={controls}
        muted={!controls}
        loop={!controls}
        playsInline
        autoPlay={!controls}
      />
    );
  }
  return <img src={media.src} alt={caption} className={`h-full w-full ${fitClass} transition duration-500 group-hover/card:scale-105`} />;
}

function MediaCollage({ media, caption, index }: { media: BlogMedia[]; caption: string; index: number }) {
  if (media.length === 0) return <DefaultVisual caption={caption} index={index} />;
  if (media.length === 1) return <MediaDisplay media={media[0]} caption={caption} index={index} />;

  const visibleMedia = media.slice(0, 4);
  const extraCount = Math.max(media.length - 4, 0);
  const cellBase = 'relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-lg shadow-black/20';
  const renderCell = (item: BlogMedia, itemIndex: number, className = '') => (
    <motion.div
      key={`${item.name}-${itemIndex}`}
      className={`${cellBase} ${className}`}
      whileHover={{ scale: 1.025 }}
      transition={{ duration: 0.22 }}
    >
      <MediaDisplay media={item} caption={caption} index={index + itemIndex} />
      <div className='absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/5 opacity-80' />
      {item.kind === 'video' && (
        <div className='absolute left-2 top-2 grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur'>
          <Film className='h-4 w-4' />
        </div>
      )}
      {itemIndex === 3 && extraCount > 0 && (
        <div className='absolute inset-0 grid place-items-center bg-black/50 text-white backdrop-blur-[2px]'>
          <span className='rounded-full border border-white/25 bg-white/15 px-4 py-2 font-display text-lg font-semibold'>+{extraCount}</span>
        </div>
      )}
    </motion.div>
  );

  if (media.length === 2) {
    return <div className='grid h-full min-h-[18rem] grid-cols-2 gap-2 bg-black p-2'>{visibleMedia.map((item, itemIndex) => renderCell(item, itemIndex, 'h-full'))}</div>;
  }

  if (media.length === 3) {
    return (
      <div className='grid h-full min-h-[18rem] grid-cols-[1.2fr_0.8fr] grid-rows-2 gap-2 bg-black p-2'>
        {renderCell(visibleMedia[0], 0, 'row-span-2')}
        {renderCell(visibleMedia[1], 1)}
        {renderCell(visibleMedia[2], 2)}
      </div>
    );
  }

  return <div className='grid h-full min-h-[18rem] grid-cols-2 grid-rows-2 gap-2 bg-black p-2'>{visibleMedia.map((item, itemIndex) => renderCell(item, itemIndex))}</div>;
}
function MediaPreviewGrid({ media, onRemove }: { media: BlogMedia[]; onRemove: (index: number) => void }) {
  if (media.length === 0) return null;
  return (
    <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
      {media.map((item, index) => (
        <div key={`${item.name}-${index}`} className='group relative overflow-hidden rounded-2xl border border-border bg-muted'>
          <div className='aspect-video'>
            <MediaDisplay media={item} caption={item.name} index={index} />
          </div>
          <div className='absolute left-2 top-2 rounded-full border border-white/20 bg-black/45 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur'>
            {item.kind === 'video' ? 'Video' : 'Image'} {index + 1}
          </div>
          <button type='button' onClick={() => onRemove(index)} className='absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-black/45 text-white opacity-90 backdrop-blur transition hover:bg-hotpink' aria-label='Remove media'>
            <X className='h-4 w-4' />
          </button>
        </div>
      ))}
    </div>
  );
}

export default function Blog() {
  const [posts, setPosts] = useState<VisualPost[]>(starterPosts);
  const [settings, setSettings] = useState<FeedSettings>(defaultSettings);
  const [loaded, setLoaded] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [draftCaption, setDraftCaption] = useState('');
  const [draftTags, setDraftTags] = useState('');
  const [draftMedia, setDraftMedia] = useState<BlogMedia[]>([]);
  const [mediaError, setMediaError] = useState('');
  const [editingPostId, setEditingPostId] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editMedia, setEditMedia] = useState<BlogMedia[]>([]);
  const [editMediaError, setEditMediaError] = useState('');
  const [newFeedTag, setNewFeedTag] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [sharedPostId, setSharedPostId] = useState('');
  const [viewerPostId, setViewerPostId] = useState('');
  const [viewerMediaIndex, setViewerMediaIndex] = useState(0);

  useEffect(() => {
    setPosts(readPosts());
    setSettings(readSettings());
    setIsAdmin(window.sessionStorage.getItem(ADMIN_KEY) === 'true');
    setAdminOpen(new URLSearchParams(window.location.search).get('admin') === '1');
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) window.localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  }, [loaded, posts]);

  useEffect(() => {
    if (loaded) window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [loaded, settings]);

  const activeTags = settings.tags.length > 0 ? settings.tags : defaultTags;
  const interests = settings.interests.length > 0 ? settings.interests : defaultInterests;
  const deleteTarget = useMemo(() => posts.find((post) => post.id === deleteTargetId), [deleteTargetId, posts]);
  const featuredPost = posts[0];
  const viewerPost = useMemo(() => posts.find((post) => post.id === viewerPostId), [posts, viewerPostId]);
  const viewerMediaCount = Math.max(viewerPost?.media.length ?? 0, 1);
  const viewerMedia = viewerPost?.media[viewerMediaIndex] ?? viewerPost?.media[0];

  const closeAdmin = () => {
    setAdminOpen(false);
    window.history.replaceState(null, '', '/blog');
  };

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const hash = await hashText(password);
    if (hash !== ADMIN_PASSWORD_HASH) {
      setLoginError('Incorrect password.');
      return;
    }
    setIsAdmin(true);
    setPassword('');
    setLoginError('');
    window.sessionStorage.setItem(ADMIN_KEY, 'true');
  };

  const logout = () => {
    setIsAdmin(false);
    setEditingPostId('');
    window.sessionStorage.removeItem(ADMIN_KEY);
  };

  const processMediaFiles = (fileList: FileList | null, currentCount: number, onSuccess: (media: BlogMedia[]) => void, setError: (value: string) => void) => {
    setError('');
    const files = Array.from(fileList ?? []);
    if (files.length === 0) return;
    const remaining = MAX_MEDIA_FILES - currentCount;
    if (remaining <= 0) {
      setError(`You can add up to ${MAX_MEDIA_FILES} media files per post.`);
      return;
    }
    const selectedFiles = files.slice(0, remaining);
    const invalidMessage = selectedFiles.map(getMediaValidationError).find(Boolean) ?? '';
    const validFiles = selectedFiles.filter((file) => !getMediaValidationError(file));
    if (validFiles.length === 0) {
      setError(invalidMessage || 'No supported media files were selected.');
      return;
    }
    void Promise.all(validFiles.map(readMediaFile))
      .then((media) => {
        onSuccess(media);
        if (files.length > remaining) setError(`Only ${MAX_MEDIA_FILES} media files can be saved per post.`);
        else if (invalidMessage) setError(invalidMessage);
      })
      .catch((error: Error) => setError(error.message));
  };

  const handleDraftMediaChange = (event: ChangeEvent<HTMLInputElement>) => {
    processMediaFiles(event.target.files, draftMedia.length, (media) => setDraftMedia((current) => [...current, ...media].slice(0, MAX_MEDIA_FILES)), setMediaError);
    event.currentTarget.value = '';
  };

  const handleEditMediaChange = (event: ChangeEvent<HTMLInputElement>) => {
    processMediaFiles(event.target.files, editMedia.length, (media) => setEditMedia((current) => [...current, ...media].slice(0, MAX_MEDIA_FILES)), setEditMediaError);
    event.currentTarget.value = '';
  };

  const addPost = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const caption = draftCaption.trim();
    if (!caption) return;
    setPosts((current) => [{ id: createId(), caption, media: draftMedia, tags: parseTagList(draftTags), createdAt: new Date().toISOString() }, ...current]);
    setDraftCaption('');
    setDraftTags('');
    setDraftMedia([]);
    setMediaError('');
  };

  const startEditing = (post: VisualPost) => {
    setEditingPostId(post.id);
    setEditCaption(post.caption);
    setEditTags(post.tags.join(' '));
    setEditMedia(post.media);
    setEditMediaError('');
    setAdminOpen(true);
  };

  const cancelEditing = () => {
    setEditingPostId('');
    setEditCaption('');
    setEditTags('');
    setEditMedia([]);
    setEditMediaError('');
  };

  const saveEditedPost = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const caption = editCaption.trim();
    if (!editingPostId || !caption) return;
    setPosts((current) => current.map((post) => (post.id === editingPostId ? { ...post, caption, media: editMedia, tags: parseTagList(editTags) } : post)));
    cancelEditing();
  };

  const addFeedTag = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const tag = normalizeTag(newFeedTag);
    if (!tag) return;
    setSettings((current) => ({ ...current, tags: [tag, ...current.tags.filter((item) => item.toLowerCase() !== tag.toLowerCase())].slice(0, 14) }));
    setNewFeedTag('');
  };

  const removeFeedTag = (tag: string) => {
    setSettings((current) => ({ ...current, tags: current.tags.filter((item) => item !== tag) }));
  };

  const addInterest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const interest = newInterest.trim();
    if (!interest) return;
    setSettings((current) => ({ ...current, interests: [interest, ...current.interests.filter((item) => item.toLowerCase() !== interest.toLowerCase())].slice(0, 12) }));
    setNewInterest('');
  };

  const removeInterest = (interest: string) => {
    setSettings((current) => ({ ...current, interests: current.interests.filter((item) => item !== interest) }));
  };

  const requestDeletePost = (postId: string) => {
    setDeleteTargetId(postId);
    setDeletePassword('');
    setDeleteError('');
  };

  const cancelDelete = () => {
    setDeleteTargetId('');
    setDeletePassword('');
    setDeleteError('');
  };

  const confirmDeletePost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!deleteTarget) {
      cancelDelete();
      return;
    }
    const hash = await hashText(deletePassword);
    if (hash !== ADMIN_PASSWORD_HASH) {
      setDeleteError('Password did not match. Post was not deleted.');
      return;
    }
    setPosts((current) => current.filter((post) => post.id !== deleteTarget.id));
    if (editingPostId === deleteTarget.id) cancelEditing();
    if (viewerPostId === deleteTarget.id) setViewerPostId('');
    cancelDelete();
  };

  const sharePost = async (postId: string) => {
    await copyToClipboard(`${window.location.origin}/blog#${postId}`);
    setSharedPostId(postId);
    window.setTimeout(() => setSharedPostId(''), 1600);
  };

  const openViewer = (postId: string, index = 0) => {
    setViewerPostId(postId);
    setViewerMediaIndex(index);
  };

  const closeViewer = () => {
    setViewerPostId('');
    setViewerMediaIndex(0);
  };

  const moveViewer = (direction: -1 | 1) => {
    setViewerMediaIndex((current) => (current + direction + viewerMediaCount) % viewerMediaCount);
  };

  return (
    <main className='mx-auto min-h-screen w-full max-w-7xl px-4 pb-20 pt-28 md:px-8 md:pt-32'>
      <motion.section initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className='glass card-shadow relative overflow-hidden rounded-3xl border border-border p-6 md:p-10'>
        <motion.div aria-hidden='true' className='gradient-hero-bg absolute -right-28 -top-32 h-80 w-80 rounded-full opacity-25 blur-3xl' animate={{ scale: [1, 1.15, 1], rotate: [0, 18, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div aria-hidden='true' className='gradient-cool-bg absolute -bottom-32 left-8 h-72 w-72 rounded-full opacity-20 blur-3xl' animate={{ x: [0, 24, 0], y: [0, -18, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
        <div className='relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_25rem] lg:items-end'>
          <div>
            <span className='inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-hotpink'><Sparkles className='h-4 w-4' /> MotsoM Feed</span>
            <h1 className='mt-5 max-w-3xl font-display text-4xl font-bold leading-tight md:text-6xl'>Visual notes from the build.</h1>
            <p className='mt-5 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg'>A polished blog space for pictures, videos, captions, hashtags, and the product ideas I am exploring across mobile, web, fintech, security, and design.</p>
            <div className='mt-6 flex flex-wrap gap-2'>
              {activeTags.map((tag) => <span key={tag} className='rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-semibold text-muted-foreground'>{tag}</span>)}
            </div>
          </div>
          <div className='relative rounded-3xl border border-border bg-background/65 p-5 backdrop-blur'>
            <div className='flex items-center gap-4'>
              <Avatar size='lg' />
              <div>
                <div className='font-display text-xl font-semibold'>Kgomotso Mathombo</div>
                <div className='mt-1 flex items-center gap-1.5 text-sm text-muted-foreground'><AtSign className='h-3.5 w-3.5' /> MotsoM-Dev</div>
              </div>
            </div>
            <p className='mt-4 text-sm leading-7 text-muted-foreground'>A creator feed for what I am learning, shipping, testing, and thinking about while building digital products.</p>
          </div>
        </div>
      </motion.section>

      <section className='mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]'>
        <div className='min-w-0 space-y-6'>
          <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }} className='glass card-shadow overflow-hidden rounded-3xl border border-border'>
            <div className='border-b border-border p-5 md:p-6'>
              <div className='flex items-center gap-4'>
                <Avatar />
                <div className='min-w-0 flex-1'>
                  <div className='flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-hotpink'><Hash className='h-4 w-4' /> Interest cards</div>
                  <h2 className='mt-1 font-display text-2xl font-bold md:text-4xl'>What I build around.</h2>
                </div>
              </div>
              <p className='mt-4 max-w-2xl leading-7 text-muted-foreground'>The feed stays centered on the areas I care about most, with editable tags and interest cards from Admin Studio.</p>
            </div>

            <div className='grid grid-cols-[repeat(auto-fit,minmax(8.5rem,1fr))] gap-2.5 p-4'>
              {interests.map((interest, index) => {
                const Icon = interestIcons[index % interestIcons.length];
                return (
                  <motion.div key={`${interest}-${index}`} animate={{ y: [0, -3, 0] }} transition={{ duration: 3.2 + index * 0.12, repeat: Infinity, ease: 'easeInOut', delay: index * 0.06 }} whileHover={{ y: -6, scale: 1.04, rotate: index % 2 === 0 ? -1 : 1 }} className='group relative min-h-28 overflow-hidden rounded-xl border border-border bg-background/70 p-3 transition-colors hover:border-hotpink/70 hover:bg-card'>
                    <div className={`${interestGradients[index % interestGradients.length]} absolute inset-0 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-20`} />
                    <motion.div aria-hidden='true' className='absolute -right-8 -top-8 h-16 w-16 rounded-full bg-hotpink/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
                    <div className='relative grid h-full content-between gap-3'>
                      <div className={`${interestGradients[index % interestGradients.length]} grid h-9 w-9 place-items-center rounded-xl text-white shadow-md transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110`}><Icon className='h-4 w-4' /></div>
                      <div className='max-w-full break-words font-display text-[0.82rem] font-semibold leading-tight [overflow-wrap:anywhere]'>{interest}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className='relative overflow-hidden border-t border-border px-5 py-3 md:px-6'>
              <motion.div className='flex w-max gap-2' animate={{ x: ['0%', '-50%'] }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}>
                {[...activeTags, ...activeTags].map((tag, index) => <span key={`${tag}-${index}`} className='rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground'>{tag}</span>)}
              </motion.div>
            </div>
          </motion.section>

          {posts.length === 0 ? (
            <div className='glass card-shadow rounded-3xl border border-border p-8 text-center'>
              <div className='gradient-cool-bg mx-auto grid h-14 w-14 place-items-center rounded-2xl text-white'><PenLine className='h-7 w-7' /></div>
              <h2 className='mt-4 font-display text-2xl font-semibold'>No visual posts yet.</h2>
              <p className='mx-auto mt-2 max-w-md leading-7 text-muted-foreground'>New media and captions will appear here after they are published from Admin Studio.</p>
            </div>
          ) : (
            <section className='grid gap-7 xl:grid-cols-2' aria-label='Visual blog posts'>
              {posts.map((post, index) => {
                const postTags = post.tags.length > 0 ? post.tags : activeTags.slice(0, 3);
                const hasVideo = post.media.some((item) => item.kind === 'video');
                return (
                  <motion.article
                    id={post.id}
                    key={post.id}
                    role='button'
                    tabIndex={0}
                    onClick={() => openViewer(post.id, 0)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        openViewer(post.id, 0);
                      }
                    }}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06, duration: 0.45 }}
                    className='min-w-0 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-hotpink focus-visible:ring-offset-4 focus-visible:ring-offset-background'
                  >
                    <CardContainer containerClassName='w-full py-0' className='w-full'>
                      <CardBody className='group/card relative h-full min-h-[32rem] w-full max-w-none overflow-hidden rounded-3xl border border-border bg-card/95 p-0 card-shadow'>
                        <CardItem translateZ={70} className='relative block w-full'>
                          <div className='relative aspect-[4/3] w-full overflow-hidden rounded-t-3xl bg-muted'>
                            <MediaCollage media={post.media} caption={post.caption} index={index} />
                            <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4'>
                              <div className='flex flex-wrap items-center justify-between gap-2'>
                                <div className='inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur'>
                                  {hasVideo ? <Film className='h-3.5 w-3.5' /> : <Camera className='h-3.5 w-3.5' />} Media post
                                </div>
                                <div className='inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/25 px-3 py-1 text-xs font-semibold text-white backdrop-blur'>
                                  {Math.max(post.media.length, 1)} item{Math.max(post.media.length, 1) === 1 ? '' : 's'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardItem>

                        <div className='grid gap-5 p-5 md:p-6'>
                          <div className='flex items-center justify-between gap-4'>
                            <CardItem translateZ={35} className='flex min-w-0 items-center gap-3'>
                              <Avatar size='sm' />
                              <div className='min-w-0'>
                                <div className='font-display text-sm font-semibold'>Kgomotso Mathombo</div>
                                <div className='mt-1 text-xs text-muted-foreground'>{formatDate(post.createdAt)}</div>
                              </div>
                            </CardItem>
                            <CardItem translateZ={45} className='shrink-0'>
                              <button type='button' onClick={(event) => { event.stopPropagation(); void sharePost(post.id); }} className='inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-hotpink hover:text-hotpink'>
                                <Share2 className='h-3.5 w-3.5' /> {sharedPostId === post.id ? 'Copied' : 'Share'}
                              </button>
                            </CardItem>
                          </div>

                          <CardItem translateZ={55} className='block w-full'><p className='text-base leading-8 text-foreground md:text-lg'>{post.caption}</p></CardItem>
                          <CardItem translateZ={40} className='flex w-full flex-wrap gap-2'>
                            {postTags.map((tag) => <span key={`${post.id}-${tag}`} className='rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-semibold text-muted-foreground'>{tag}</span>)}
                          </CardItem>

                          {isAdmin && (
                            <CardItem translateZ={50} className='flex w-full flex-wrap gap-2 border-t border-border pt-4'>
                              <button type='button' onClick={(event) => { event.stopPropagation(); startEditing(post); }} className='inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-semibold text-muted-foreground hover:border-teal hover:text-teal'><PenLine className='h-3.5 w-3.5' /> Edit</button>
                              <button type='button' onClick={(event) => { event.stopPropagation(); requestDeletePost(post.id); }} className='inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-semibold text-muted-foreground hover:border-hotpink hover:text-hotpink'><Trash2 className='h-3.5 w-3.5' /> Delete</button>
                            </CardItem>
                          )}
                        </div>
                      </CardBody>
                    </CardContainer>
                  </motion.article>
                );
              })}
            </section>
          )}
        </div>

        <aside className='space-y-5 lg:sticky lg:top-28 lg:self-start'>
          <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className='glass card-shadow rounded-3xl border border-border p-5'>
            <div className='flex items-center justify-between gap-3'>
              <div>
                <div className='text-xs font-semibold uppercase tracking-[0.18em] text-hotpink'>Feed mode</div>
                <h2 className='mt-1 font-display text-xl font-semibold'>Media + caption</h2>
              </div>
              <motion.div animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className='gradient-cool-bg grid h-11 w-11 place-items-center rounded-2xl text-white'><ImageIcon className='h-5 w-5' /></motion.div>
            </div>
            <p className='mt-4 text-sm leading-7 text-muted-foreground'>Each post can hold a small album of images and short videos. Tap a card to open the bigger media viewer.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.08 }} className='glass card-shadow rounded-3xl border border-border p-5'>
            <div className='flex items-center justify-between gap-3'>
              <div>
                <div className='text-xs font-semibold uppercase tracking-[0.18em] text-hotpink'>Creator tools</div>
                <h2 className='mt-1 font-display text-xl font-semibold'>Admin Studio</h2>
              </div>
              <div className='gradient-hero-bg grid h-11 w-11 place-items-center rounded-2xl text-white'><Lock className='h-5 w-5' /></div>
            </div>
            <p className='mt-4 text-sm leading-7 text-muted-foreground'>Open the studio to publish media posts, edit captions, manage hashtags, and update the interest cards.</p>
            <button type='button' onClick={() => setAdminOpen(true)} className='mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-background/70 px-4 py-3 text-sm font-semibold transition-colors hover:border-hotpink hover:text-hotpink'><Lock className='h-4 w-4' /> Open Admin Studio</button>
          </motion.div>

          {featuredPost && (
            <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.14 }} className='gradient-hero-bg glow-shadow overflow-hidden rounded-3xl p-5 text-white'>
              <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/80'><Sparkles className='h-4 w-4' /> Latest visual</div>
              <p className='mt-4 text-sm leading-7 text-white/85'>{featuredPost.caption}</p>
              <div className='mt-4 flex flex-wrap gap-2'>
                {(featuredPost.tags.length > 0 ? featuredPost.tags : activeTags.slice(0, 3)).map((tag) => <span key={`featured-${tag}`} className='rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold text-white/90'>{tag}</span>)}
              </div>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className='glass rounded-3xl border border-border p-5'>
            <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-hotpink'><Hash className='h-4 w-4' /> Feed tags</div>
            <div className='mt-4 flex flex-wrap gap-2'>
              {activeTags.map((tag) => <span key={`sidebar-${tag}`} className='rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground'>{tag}</span>)}
            </div>
          </motion.div>
        </aside>
      </section>

      <AnimatePresence>
        {viewerPost && (
          <div className='fixed inset-0 z-[75] grid place-items-center bg-background/80 px-3 py-5 backdrop-blur-xl md:px-6' onClick={closeViewer}>
            <motion.section
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.24 }}
              onClick={(event) => event.stopPropagation()}
              className='relative max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-3xl border border-border bg-card p-3 card-shadow md:p-5'
              role='dialog'
              aria-modal='true'
              aria-label='Media viewer'
            >
              <motion.div aria-hidden='true' className='gradient-hero-bg absolute -right-20 -top-24 h-56 w-56 rounded-full opacity-20 blur-3xl' animate={{ scale: [1, 1.12, 1], rotate: [0, 18, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
              <div className='relative flex items-start justify-between gap-4 p-2 md:p-3'>
                <div className='flex min-w-0 items-center gap-3'>
                  <Avatar size='sm' />
                  <div className='min-w-0'>
                    <div className='flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-hotpink'><Sparkles className='h-4 w-4' /> MotsoM media viewer</div>
                    <h2 className='mt-1 line-clamp-1 font-display text-xl font-semibold md:text-2xl'>{formatDate(viewerPost.createdAt)}</h2>
                  </div>
                </div>
                <button type='button' onClick={closeViewer} className='grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-background/70 hover:border-hotpink hover:text-hotpink' aria-label='Close media viewer'><X className='h-4 w-4' /></button>
              </div>

              <div className='relative overflow-hidden rounded-3xl border border-border bg-black'>
                <div className='aspect-[16/10] max-h-[68vh] min-h-[18rem] w-full'>
                  <MediaDisplay media={viewerMedia} caption={viewerPost.caption} index={viewerMediaIndex} controls fit='contain' />
                </div>
                {viewerMediaCount > 1 && (
                  <>
                    <button type='button' onClick={() => moveViewer(-1)} className='absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur transition hover:bg-hotpink' aria-label='Previous media'><ChevronLeft className='h-5 w-5' /></button>
                    <button type='button' onClick={() => moveViewer(1)} className='absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur transition hover:bg-hotpink' aria-label='Next media'><ChevronRight className='h-5 w-5' /></button>
                    <div className='absolute bottom-3 right-3 rounded-full border border-white/20 bg-black/45 px-3 py-1 text-xs font-semibold text-white backdrop-blur'>{viewerMediaIndex + 1} / {viewerMediaCount}</div>
                  </>
                )}
              </div>

              {viewerPost.media.length > 1 && (
                <div className='mt-4 flex gap-2 overflow-x-auto pb-1'>
                  {viewerPost.media.map((media, index) => (
                    <button key={`${media.name}-${index}`} type='button' onClick={() => setViewerMediaIndex(index)} className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-2xl border transition ${viewerMediaIndex === index ? 'border-hotpink ring-2 ring-hotpink/30' : 'border-border opacity-75 hover:opacity-100'}`} aria-label={`Open media ${index + 1}`}>
                      <MediaDisplay media={media} caption={viewerPost.caption} index={index} />
                      {media.kind === 'video' && <span className='absolute inset-0 grid place-items-center bg-black/20 text-white'><Film className='h-5 w-5' /></span>}
                    </button>
                  ))}
                </div>
              )}

              <div className='grid gap-4 p-2 pt-5 md:grid-cols-[1fr_auto] md:p-3 md:pt-5'>
                <div>
                  <p className='text-base leading-8 text-foreground md:text-lg'>{viewerPost.caption}</p>
                  <div className='mt-4 flex flex-wrap gap-2'>
                    {(viewerPost.tags.length > 0 ? viewerPost.tags : activeTags.slice(0, 3)).map((tag) => <span key={`viewer-${tag}`} className='rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-semibold text-muted-foreground'>{tag}</span>)}
                  </div>
                </div>
                <button type='button' onClick={() => void sharePost(viewerPost.id)} className='inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background/70 px-4 text-sm font-semibold text-muted-foreground transition hover:border-hotpink hover:text-hotpink'><Share2 className='h-4 w-4' /> {sharedPostId === viewerPost.id ? 'Copied' : 'Share'}</button>
              </div>
            </motion.section>
          </div>
        )}
      </AnimatePresence>

      {adminOpen && (
        <div className='fixed inset-0 z-[70] grid place-items-center bg-background/75 px-4 py-8 backdrop-blur-md'>
          <motion.section initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.25 }} className='max-h-[88vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-border bg-card p-5 card-shadow md:p-7' role='dialog' aria-modal='true' aria-label='Admin Studio'>
            <div className='flex items-start justify-between gap-4'>
              <div className='flex gap-4'>
                <Avatar />
                <div>
                  <div className='inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-hotpink'><Lock className='h-4 w-4' /> Admin Studio</div>
                  <h2 className='mt-2 font-display text-3xl font-semibold'>Edit MotsoM Feed</h2>
                  <p className='mt-2 text-sm leading-6 text-muted-foreground'>Publish media posts, update captions, add hashtags, and control the interest cards shown on the Blog page.</p>
                </div>
              </div>
              <button type='button' onClick={closeAdmin} className='grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border hover:border-hotpink hover:bg-muted' aria-label='Close admin studio'><X className='h-4 w-4' /></button>
            </div>

            {!isAdmin ? (
              <form onSubmit={login} className='mt-6 grid gap-3 sm:grid-cols-[1fr_auto]'>
                <input type='password' value={password} onChange={(event) => setPassword(event.target.value)} placeholder='Admin password' className='rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-hotpink' />
                <button type='submit' className='gradient-hero-bg rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-lg'>Unlock</button>
                {loginError && <p className='text-sm text-hotpink sm:col-span-2'>{loginError}</p>}
              </form>
            ) : (
              <div className='mt-6 grid gap-5'>
                <div className='flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-background/60 p-3'>
                  <span className='inline-flex items-center gap-2 text-sm font-medium text-muted-foreground'><Sparkles className='h-4 w-4 text-hotpink' /> Logged in as Kgomotso.</span>
                  <button type='button' onClick={logout} className='inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs font-semibold hover:border-hotpink hover:bg-muted'><LogOut className='h-4 w-4' /> Log out</button>
                </div>

                <section className='grid gap-4 rounded-3xl border border-border bg-background/60 p-4'>
                  <div>
                    <div className='text-xs font-semibold uppercase tracking-[0.18em] text-hotpink'>MotsoM Feed</div>
                    <h3 className='mt-1 font-display text-2xl font-semibold'>Tags and interest cards</h3>
                  </div>
                  <div className='grid gap-4 lg:grid-cols-2'>
                    <div className='rounded-2xl border border-border bg-card p-4'>
                      <div className='flex items-center gap-2 text-sm font-semibold'><Hash className='h-4 w-4 text-hotpink' /> Hashtags</div>
                      <form onSubmit={addFeedTag} className='mt-3 grid gap-2 sm:grid-cols-[1fr_auto]'>
                        <input value={newFeedTag} onChange={(event) => setNewFeedTag(event.target.value)} placeholder='#NewTag' className='rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-hotpink' />
                        <button type='submit' className='gradient-hero-bg inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white'><Plus className='h-4 w-4' /> Add</button>
                      </form>
                      <div className='mt-4 flex flex-wrap gap-2'>
                        {activeTags.map((tag) => <button key={`editor-${tag}`} type='button' onClick={() => removeFeedTag(tag)} className='inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-semibold text-muted-foreground hover:border-hotpink hover:text-hotpink'>{tag} <X className='h-3 w-3' /></button>)}
                      </div>
                    </div>
                    <div className='rounded-2xl border border-border bg-card p-4'>
                      <div className='flex items-center gap-2 text-sm font-semibold'><Layers className='h-4 w-4 text-hotpink' /> Interest cards</div>
                      <form onSubmit={addInterest} className='mt-3 grid gap-2 sm:grid-cols-[1fr_auto]'>
                        <input value={newInterest} onChange={(event) => setNewInterest(event.target.value)} placeholder='New interest' className='rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-hotpink' />
                        <button type='submit' className='gradient-cool-bg inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white'><Plus className='h-4 w-4' /> Add</button>
                      </form>
                      <div className='mt-4 flex flex-wrap gap-2'>
                        {interests.map((interest) => <button key={`interest-${interest}`} type='button' onClick={() => removeInterest(interest)} className='inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-semibold text-muted-foreground hover:border-hotpink hover:text-hotpink'>{interest} <X className='h-3 w-3' /></button>)}
                      </div>
                    </div>
                  </div>
                </section>

                {editingPostId ? (
                  <form onSubmit={saveEditedPost} className='grid gap-4 rounded-3xl border border-border bg-background/60 p-4'>
                    <div>
                      <div className='text-xs font-semibold uppercase tracking-[0.18em] text-hotpink'>Editing media post</div>
                      <h3 className='mt-1 font-display text-2xl font-semibold'>Update caption, tags, and media</h3>
                    </div>
                    <label className='group grid cursor-pointer gap-3 rounded-3xl border border-dashed border-border bg-card p-5 transition-colors hover:border-hotpink'>
                      <input type='file' accept='image/*,video/*' multiple onChange={handleEditMediaChange} className='hidden' />
                      <div className='flex items-center gap-3'>
                        <div className='gradient-cool-bg grid h-11 w-11 place-items-center rounded-2xl text-white'><UploadCloud className='h-5 w-5' /></div>
                        <div>
                          <div className='text-sm font-semibold text-foreground'>Add more media</div>
                          <div className='text-xs text-muted-foreground'>Up to {MAX_MEDIA_FILES} files. Images under 2 MB, videos under 8 MB.</div>
                        </div>
                      </div>
                    </label>
                    <MediaPreviewGrid media={editMedia} onRemove={(index) => setEditMedia((current) => current.filter((_, itemIndex) => itemIndex !== index))} />
                    {editMediaError && <p className='text-sm text-hotpink'>{editMediaError}</p>}
                    <textarea value={editCaption} onChange={(event) => setEditCaption(event.target.value)} placeholder='Caption' rows={6} className='resize-none rounded-2xl border border-border bg-card px-4 py-3 text-sm leading-7 outline-none focus:border-hotpink' />
                    <input value={editTags} onChange={(event) => setEditTags(event.target.value)} placeholder='#MobileDev #UX #FinTech' className='rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-hotpink' />
                    <div className='flex flex-wrap gap-3'>
                      <button type='submit' className='gradient-hero-bg inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg'><Save className='h-4 w-4' /> Save changes</button>
                      <button type='button' onClick={cancelEditing} className='inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-muted-foreground hover:border-hotpink hover:text-hotpink'><X className='h-4 w-4' /> Cancel</button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={addPost} className='grid gap-4 rounded-3xl border border-border bg-background/60 p-4'>
                    <div>
                      <div className='text-xs font-semibold uppercase tracking-[0.18em] text-hotpink'>New media post</div>
                      <h3 className='mt-1 font-display text-2xl font-semibold'>Publish pictures, videos, and caption</h3>
                    </div>
                    <label className='group grid cursor-pointer gap-3 rounded-3xl border border-dashed border-border bg-card p-5 transition-colors hover:border-hotpink'>
                      <input type='file' accept='image/*,video/*' multiple onChange={handleDraftMediaChange} className='hidden' />
                      <div className='flex items-center gap-3'>
                        <div className='gradient-cool-bg grid h-11 w-11 place-items-center rounded-2xl text-white'><UploadCloud className='h-5 w-5' /></div>
                        <div>
                          <div className='text-sm font-semibold text-foreground'>Add pictures or videos</div>
                          <div className='text-xs text-muted-foreground'>Up to {MAX_MEDIA_FILES} files. Images under 2 MB, videos under 8 MB.</div>
                        </div>
                      </div>
                    </label>
                    <MediaPreviewGrid media={draftMedia} onRemove={(index) => setDraftMedia((current) => current.filter((_, itemIndex) => itemIndex !== index))} />
                    {mediaError && <p className='text-sm text-hotpink'>{mediaError}</p>}
                    <textarea value={draftCaption} onChange={(event) => setDraftCaption(event.target.value)} placeholder='Write the caption...' rows={6} className='resize-none rounded-2xl border border-border bg-card px-4 py-3 text-sm leading-7 outline-none focus:border-hotpink' />
                    <input value={draftTags} onChange={(event) => setDraftTags(event.target.value)} placeholder='#MobileDev #UX #FinTech' className='rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-hotpink' />
                    <div className='flex flex-wrap items-center gap-3'>
                      {draftMedia.length > 0 && <button type='button' onClick={() => setDraftMedia([])} className='inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:border-hotpink hover:text-hotpink'><Trash2 className='h-4 w-4' /> Clear media</button>}
                      <button type='submit' className='gradient-hero-bg inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg'><Plus className='h-4 w-4' /> Publish post</button>
                    </div>
                  </form>
                )}

                <section className='rounded-3xl border border-border bg-background/60 p-4'>
                  <div className='flex flex-wrap items-end justify-between gap-3'>
                    <div>
                      <div className='text-xs font-semibold uppercase tracking-[0.18em] text-hotpink'>Media post editor</div>
                      <h3 className='mt-1 font-display text-2xl font-semibold'>Manage feed posts</h3>
                    </div>
                    {editingPostId && <button type='button' onClick={cancelEditing} className='rounded-full border border-border px-3 py-2 text-xs font-semibold text-muted-foreground hover:border-hotpink hover:text-hotpink'>New post instead</button>}
                  </div>
                  <div className='mt-4 grid gap-3'>
                    {posts.length === 0 ? (
                      <p className='rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground'>There are no posts to manage yet.</p>
                    ) : (
                      posts.map((post) => {
                        const manageMedia = post.media[0];
                        return (
                          <article key={`manage-${post.id}`} className='grid gap-3 rounded-2xl border border-border bg-card p-4 md:grid-cols-[4.5rem_1fr_auto] md:items-center'>
                            <div className='relative aspect-square overflow-hidden rounded-2xl bg-muted'>
                              <MediaDisplay media={manageMedia} caption={post.caption} index={0} />
                              {post.media.length > 1 && <span className='absolute bottom-1 right-1 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold text-white'>{post.media.length}</span>}
                            </div>
                            <div className='min-w-0'>
                              <p className='line-clamp-2 text-sm leading-6 text-muted-foreground'>{post.caption}</p>
                              <div className='mt-2 flex flex-wrap gap-1.5'>
                                {(post.tags.length > 0 ? post.tags : activeTags.slice(0, 2)).map((tag) => <span key={`manage-${post.id}-${tag}`} className='rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground'>{tag}</span>)}
                              </div>
                            </div>
                            <div className='flex flex-wrap gap-2'>
                              <button type='button' onClick={() => startEditing(post)} className='inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-semibold text-muted-foreground hover:border-teal hover:text-teal'><PenLine className='h-3.5 w-3.5' /> Edit</button>
                              <button type='button' onClick={() => requestDeletePost(post.id)} className='inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-semibold text-muted-foreground hover:border-hotpink hover:text-hotpink'><Trash2 className='h-3.5 w-3.5' /> Delete</button>
                            </div>
                          </article>
                        );
                      })
                    )}
                  </div>
                </section>
              </div>
            )}
          </motion.section>
        </div>
      )}

      <AnimatePresence>
        {deleteTarget && (
          <div className='fixed inset-0 z-[80] grid place-items-center bg-background/80 px-4 py-8 backdrop-blur-md'>
            <motion.form onSubmit={confirmDeletePost} initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.96 }} transition={{ duration: 0.22 }} className='w-full max-w-md rounded-3xl border border-border bg-card p-6 card-shadow'>
              <div className='flex items-start gap-4'>
                <div className='gradient-pink-bg grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white'><Trash2 className='h-5 w-5' /></div>
                <div>
                  <div className='text-xs font-semibold uppercase tracking-[0.18em] text-hotpink'>Confirm delete</div>
                  <h2 className='mt-1 font-display text-2xl font-semibold'>Delete this media post?</h2>
                  <p className='mt-2 text-sm leading-6 text-muted-foreground'>Enter the admin password before removing this media and caption from the feed.</p>
                </div>
              </div>
              <input type='password' value={deletePassword} onChange={(event) => setDeletePassword(event.target.value)} placeholder='Admin password' className='mt-5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-hotpink' />
              {deleteError && <p className='mt-3 text-sm text-hotpink'>{deleteError}</p>}
              <div className='mt-5 flex flex-wrap justify-end gap-3'>
                <button type='button' onClick={cancelDelete} className='rounded-full border border-border px-5 py-3 text-sm font-semibold text-muted-foreground hover:border-hotpink hover:text-hotpink'>Cancel</button>
                <button type='submit' className='gradient-pink-bg rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg'>Delete post</button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      <div className='mt-10 flex items-center justify-center gap-2 text-xs text-muted-foreground'><Camera className='h-4 w-4' /> Fresh media posts and captions appear in this feed.</div>
    </main>
  );
}

