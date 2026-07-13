
"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import {
  AtSign,
  Bell,
  Bookmark,
  Calendar,
  Camera,
  Flame,
  Heart,
  Lock,
  LogOut,
  MessageCircle,
  PenLine,
  Plus,
  Radio,
  Send,
  Share2,
  Sparkles,
  Trash2,
  TrendingUp,
  UploadCloud,
  X,
  Zap,
} from "lucide-react";

const POSTS_KEY = "motsom-dev-blog-posts";
const ADMIN_KEY = "motsom-dev-blog-admin";
const ADMIN_PASSWORD_HASH = "3c7bff9a336ba17f715cbffd291cfdad52f33e4887c164a0a368ba429555b160";
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

type BlogComment = { id: string; name: string; message: string; createdAt: string };
type BlogImage = { src: string; name: string };
type BlogPost = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  likes: number;
  comments: BlogComment[];
  image?: BlogImage;
};

const starterPosts: BlogPost[] = [
  {
    id: "welcome-to-motsom-dev",
    title: "Welcome to my build feed",
    body:
      "This is where I share what I am learning, shipping, testing, and thinking about as a frontend and mobile app developer. Expect React notes, mobile ideas, hackathon reflections, product thinking, and the practical lessons that come from building in public.",
    createdAt: "2026-07-13T10:00:00.000Z",
    likes: 12,
    comments: [
      { id: "starter-comment-1", name: "Visitor", message: "Excited to follow the journey.", createdAt: "2026-07-13T10:20:00.000Z" },
    ],
  },
  {
    id: "fintech-msme-marketplace",
    title: "Fintech idea: better discovery for MSMEs and funders",
    body:
      "My UCT Fintech Winter School Hackathon solution explored a marketplace where MSMEs and funders can find each other, connect, network, and build trust before funding conversations begin. The opportunity is not only matching capital to businesses, but making discovery easier and more human.",
    createdAt: "2026-07-12T14:15:00.000Z",
    likes: 18,
    comments: [],
  },
  {
    id: "What I am sharpening this week".toLowerCase().replaceAll(" ", "-"),
    title: "What I am sharpening this week",
    body:
      "I am spending more time with Next.js, FastAPI, Supabase, Neon, and cleaner interaction design. The goal is simple: build products that look polished, feel fast, and solve real problems without unnecessary complexity.",
    createdAt: "2026-07-11T09:30:00.000Z",
    likes: 9,
    comments: [],
  },
];

const storyItems = [
  { label: "React", detail: "UI craft", className: "gradient-hero-bg" },
  { label: "Mobile", detail: "Native flows", className: "gradient-cool-bg" },
  { label: "Fintech", detail: "MSMEs", className: "gradient-pink-bg" },
  { label: "AI", detail: "Ideas", className: "gradient-hero-bg" },
  { label: "Cloud", detail: "Supabase", className: "gradient-cool-bg" },
  { label: "UX", detail: "People first", className: "gradient-pink-bg" },
];

const topics = ["Next.js", "React Native", "FastAPI", "Supabase", "Neon", "Hackathons", "Fintech", "UI/UX"];

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const formatDate = (value: string) => new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));

async function hashText(value: string) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function readPosts() {
  try {
    const saved = window.localStorage.getItem(POSTS_KEY);
    if (!saved) return starterPosts;
    const parsed = JSON.parse(saved) as BlogPost[];
    if (!Array.isArray(parsed)) return starterPosts;
    return parsed.map((post) => ({
      ...post,
      likes: typeof post.likes === "number" ? post.likes : 0,
      comments: Array.isArray(post.comments) ? post.comments : [],
    }));
  } catch {
    return starterPosts;
  }
}

function copyToClipboard(value: string) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(value);
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  return Promise.resolve();
}

function Avatar({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "h-9 w-9 text-xs", md: "h-12 w-12 text-sm", lg: "h-20 w-20 text-xl" };
  return (
    <div className={`gradient-hero-bg relative grid shrink-0 place-items-center rounded-2xl font-display font-bold text-white shadow-lg ${sizes[size]}`}>
      <span>KM</span>
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 rounded-2xl border border-white/50"
        animate={{ scale: [1, 1.22, 1], opacity: [0.45, 0, 0.45] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function DefaultVisual({ title }: { title: string }) {
  return (
    <div className="gradient-cool-bg relative grid aspect-[16/9] w-full overflow-hidden place-items-center text-white">
      <motion.div
        aria-hidden="true"
        className="absolute inset-y-0 -left-1/3 w-1/3 skew-x-12 bg-white/25 blur-xl"
        animate={{ x: ["0%", "430%"] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative grid gap-3 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-white/30 bg-white/15 backdrop-blur">
          <PenLine className="h-7 w-7" />
        </div>
        <p className="max-w-sm px-6 font-display text-xl font-semibold">{title}</p>
      </div>
    </div>
  );
}
export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>(starterPosts);
  const [loaded, setLoaded] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [draftImage, setDraftImage] = useState<BlogImage | undefined>();
  const [imageError, setImageError] = useState("");
  const [editingPostId, setEditingPostId] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [commentDrafts, setCommentDrafts] = useState<Record<string, { name: string; message: string }>>({});
  const [likedPostId, setLikedPostId] = useState("");
  const [sharedPostId, setSharedPostId] = useState("");
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setPosts(readPosts());
    setIsAdmin(window.sessionStorage.getItem(ADMIN_KEY) === "true");
    setAdminOpen(new URLSearchParams(window.location.search).get("admin") === "1");
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) window.localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  }, [loaded, posts]);

  const featuredPost = useMemo(
    () => (posts.length > 0 ? posts.reduce((best, post) => (post.likes + post.comments.length > best.likes + best.comments.length ? post : best), posts[0]) : undefined),
    [posts],
  );

  const activity = useMemo(() => {
    const comments = posts.flatMap((post) =>
      post.comments.map((comment) => ({
        id: `${post.id}-${comment.id}`,
        label: `${comment.name} commented`,
        detail: post.title,
        createdAt: comment.createdAt,
      })),
    );
    const postUpdates = posts.map((post) => ({ id: `${post.id}-published`, label: "New post", detail: post.title, createdAt: post.createdAt }));
    return [...comments, ...postUpdates].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  }, [posts]);

  const deleteTarget = useMemo(() => posts.find((post) => post.id === deleteTargetId), [deleteTargetId, posts]);

  const closeAdmin = () => {
    setAdminOpen(false);
    window.history.replaceState(null, "", "/blog");
  };

  const login = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const hash = await hashText(password);
    if (hash !== ADMIN_PASSWORD_HASH) {
      setLoginError("Incorrect password.");
      return;
    }
    setIsAdmin(true);
    setPassword("");
    setLoginError("");
    window.sessionStorage.setItem(ADMIN_KEY, "true");
  };

  const logout = () => {
    setIsAdmin(false);
    setEditingPostId("");
    window.sessionStorage.removeItem(ADMIN_KEY);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setImageError("");
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setImageError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setImageError("Please choose an image under 2 MB so it can save locally.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setDraftImage({ src: reader.result, name: file.name });
    };
    reader.readAsDataURL(file);
  };

  const addPost = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = draftTitle.trim();
    const body = draftBody.trim();
    if (!title || !body) return;
    setPosts((current) => [{ id: createId(), title, body, image: draftImage, createdAt: new Date().toISOString(), likes: 0, comments: [] }, ...current]);
    setDraftTitle("");
    setDraftBody("");
    setDraftImage(undefined);
    setImageError("");
  };

  const startEditing = (post: BlogPost) => {
    setEditingPostId(post.id);
    setEditTitle(post.title);
    setEditBody(post.body);
    setAdminOpen(true);
  };

  const cancelEditing = () => {
    setEditingPostId("");
    setEditTitle("");
    setEditBody("");
  };

  const saveEditedPost = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = editTitle.trim();
    const body = editBody.trim();
    if (!editingPostId || !title || !body) return;
    setPosts((current) => current.map((post) => (post.id === editingPostId ? { ...post, title, body } : post)));
    cancelEditing();
  };

  const requestDeletePost = (postId: string) => {
    setDeleteTargetId(postId);
    setDeletePassword("");
    setDeleteError("");
  };

  const cancelDelete = () => {
    setDeleteTargetId("");
    setDeletePassword("");
    setDeleteError("");
  };

  const confirmDeletePost = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!deleteTarget) {
      cancelDelete();
      return;
    }
    const hash = await hashText(deletePassword);
    if (hash !== ADMIN_PASSWORD_HASH) {
      setDeleteError("Password did not match. Post was not deleted.");
      return;
    }
    setPosts((current) => current.filter((post) => post.id !== deleteTarget.id));
    if (editingPostId === deleteTarget.id) cancelEditing();
    cancelDelete();
  };

  const likePost = (postId: string) => {
    setPosts((current) => current.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post)));
    setLikedPostId(postId);
    window.setTimeout(() => setLikedPostId(""), 700);
  };

  const sharePost = async (postId: string) => {
    await copyToClipboard(`${window.location.origin}/blog#${postId}`);
    setSharedPostId(postId);
    window.setTimeout(() => setSharedPostId(""), 1600);
  };

  const toggleSavedPost = (postId: string) => {
    setSavedPosts((current) => ({ ...current, [postId]: !current[postId] }));
  };

  const focusComment = (postId: string) => document.getElementById(`comment-${postId}`)?.focus();

  const addComment = (postId: string) => {
    const draft = commentDrafts[postId] ?? { name: "", message: "" };
    const name = draft.name.trim() || "Anonymous";
    const message = draft.message.trim();
    if (!message) return;
    setPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, { id: createId(), name, message, createdAt: new Date().toISOString() }] }
          : post,
      ),
    );
    setCommentDrafts((current) => ({ ...current, [postId]: { name: "", message: "" } }));
  };
  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 pb-20 pt-28 md:px-8 md:pt-32">
      <motion.section
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="glass card-shadow relative overflow-hidden rounded-3xl border border-border p-6 md:p-10"
      >
        <motion.div aria-hidden="true" className="gradient-hero-bg absolute -right-24 -top-28 h-72 w-72 rounded-full opacity-25 blur-3xl" animate={{ scale: [1, 1.16, 1], rotate: [0, 20, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div aria-hidden="true" className="gradient-cool-bg absolute -bottom-32 left-10 h-72 w-72 rounded-full opacity-20 blur-3xl" animate={{ x: [0, 20, 0], y: [0, -16, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-hotpink">
              <Sparkles className="h-4 w-4" /> Blog
            </span>
            <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-tight md:text-6xl">Thoughts from the build.</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
              A polished space for build notes, lessons, hackathon reflections, product ideas, and the small details that shape better digital experiences.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-background/65 p-5 backdrop-blur">
            <div className="flex items-center gap-4">
              <Avatar size="lg" />
              <div>
                <div className="font-display text-xl font-semibold">Kgomotso Mathombo</div>
                <div className="mt-1 text-sm text-muted-foreground">@MotsoM-Dev</div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">Frontend and mobile developer writing about the ideas, tools, and experiments behind the work.</p>
          </div>
        </div>
      </motion.section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="min-w-0 space-y-5">
          <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }} className="glass card-shadow overflow-hidden rounded-3xl border border-border">
            <div className="border-b border-border p-5 md:p-6">
              <div className="flex items-center gap-4">
                <Avatar />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-hotpink"><Radio className="h-4 w-4" /> MotsoM Feed</div>
                  <h2 className="mt-1 font-display text-2xl font-bold md:text-4xl">Builds, ideas, and wins in motion.</h2>
                </div>
              </div>
              <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">Short reflections and longer notes, arranged like a social feed so visitors can read, react, comment, and share.</p>
            </div>

            <div className="overflow-hidden border-b border-border px-5 py-4 md:px-6">
              <div className="flex gap-3 overflow-x-auto pb-1">
                {storyItems.map((story, index) => (
                  <motion.div
                    key={story.label}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3 + index * 0.2, repeat: Infinity, ease: "easeInOut", delay: index * 0.12 }}
                    whileHover={{ y: -7, scale: 1.03 }}
                    className="shrink-0 rounded-2xl border border-border bg-background/70 p-3 text-center shadow-sm"
                  >
                    <div className={`${story.className} mx-auto grid h-14 w-14 place-items-center rounded-2xl text-sm font-bold text-white`}>{story.label.slice(0, 2)}</div>
                    <div className="mt-2 text-sm font-semibold">{story.label}</div>
                    <div className="text-xs text-muted-foreground">{story.detail}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden px-5 py-3 md:px-6">
              <motion.div className="flex w-max gap-2" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }}>
                {[...topics, ...topics].map((topic, index) => (
                  <span key={`${topic}-${index}`} className="rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">#{topic.replace(".", "")}</span>
                ))}
              </motion.div>
            </div>
          </motion.section>

          {posts.length === 0 ? (
            <div className="glass card-shadow rounded-3xl border border-border p-8 text-center">
              <div className="gradient-cool-bg mx-auto grid h-14 w-14 place-items-center rounded-2xl text-white"><PenLine className="h-7 w-7" /></div>
              <h2 className="mt-4 font-display text-2xl font-semibold">No feed posts yet.</h2>
              <p className="mx-auto mt-2 max-w-md leading-7 text-muted-foreground">New notes will appear here after they are published from the Admin Studio.</p>
            </div>
          ) : (
            posts.map((post, index) => {
              const draft = commentDrafts[post.id] ?? { name: "", message: "" };
              const saved = Boolean(savedPosts[post.id]);
              return (
                <motion.article
                  id={post.id}
                  key={post.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06, duration: 0.45 }}
                  whileHover={{ y: -3 }}
                  className="glass card-shadow overflow-hidden rounded-3xl border border-border"
                >
                  <div className="flex items-start justify-between gap-4 p-5 md:p-6">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar size="sm" />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-display text-base font-semibold leading-tight">Kgomotso Mathombo</h3>
                          <span className="inline-flex items-center gap-1 rounded-full bg-hotpink/10 px-2 py-0.5 text-[11px] font-semibold text-hotpink"><AtSign className="h-3 w-3" /> MotsoM-Dev</span>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {formatDate(post.createdAt)}</span>
                          <span>Public post</span>
                        </div>
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="flex shrink-0 items-center gap-2">
                        <button type="button" onClick={() => startEditing(post)} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-teal hover:text-teal">
                          <PenLine className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button type="button" onClick={() => requestDeletePost(post.id)} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-hotpink hover:text-hotpink">
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="px-5 pb-5 md:px-6">
                    <h2 className="font-display text-2xl font-bold leading-tight md:text-3xl">{post.title}</h2>
                    <p className="mt-3 whitespace-pre-line leading-8 text-muted-foreground">{post.body}</p>
                  </div>

                  {post.image ? <img src={post.image.src} alt={post.title} className="aspect-[16/9] w-full object-cover" /> : <DefaultVisual title={post.title} />}
                  <div className="px-5 py-4 md:px-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="gradient-pink-bg grid h-7 w-7 place-items-center rounded-full text-white"><Heart className="h-3.5 w-3.5 fill-current" /></span>
                        <span>{post.likes} likes</span>
                      </div>
                      <span>{post.comments.length} comments</span>
                    </div>

                    <div className="grid grid-cols-4 gap-1 border-b border-border py-3 sm:gap-2">
                      <button type="button" onClick={() => likePost(post.id)} className="relative inline-flex items-center justify-center gap-1.5 rounded-2xl px-2 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-hotpink/10 hover:text-hotpink sm:gap-2 sm:px-3">
                        <Heart className="h-4 w-4" /> <span className="hidden sm:inline">Like</span>
                        <AnimatePresence>
                          {likedPostId === post.id && (
                            <motion.span initial={{ opacity: 0, y: 8, scale: 0.8 }} animate={{ opacity: 1, y: -18, scale: 1 }} exit={{ opacity: 0, y: -28 }} className="absolute -top-1 rounded-full bg-hotpink px-2 py-0.5 text-xs text-white">
                              +1
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </button>
                      <button type="button" onClick={() => focusComment(post.id)} className="inline-flex items-center justify-center gap-1.5 rounded-2xl px-2 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-teal/10 hover:text-teal sm:gap-2 sm:px-3">
                        <MessageCircle className="h-4 w-4" /> <span className="hidden sm:inline">Comment</span>
                      </button>
                      <button type="button" onClick={() => sharePost(post.id)} className="inline-flex items-center justify-center gap-1.5 rounded-2xl px-2 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-violet/10 hover:text-violet sm:gap-2 sm:px-3">
                        <Share2 className="h-4 w-4" /> <span className="hidden sm:inline">{sharedPostId === post.id ? "Copied" : "Share"}</span>
                      </button>
                      <button type="button" onClick={() => toggleSavedPost(post.id)} className="inline-flex items-center justify-center gap-1.5 rounded-2xl px-2 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:gap-2 sm:px-3">
                        <Bookmark className={`h-4 w-4 ${saved ? "fill-current text-hotpink" : ""}`} /> <span className="hidden sm:inline">{saved ? "Saved" : "Save"}</span>
                      </button>
                    </div>

                    <div className="mt-4 grid gap-3">
                      {post.comments.map((comment) => (
                        <motion.div key={comment.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
                          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border bg-background text-xs font-bold text-hotpink">{comment.name.slice(0, 1).toUpperCase()}</div>
                          <div className="min-w-0 flex-1 rounded-2xl border border-border bg-background/60 px-4 py-3">
                            <div className="flex flex-wrap items-center gap-2"><span className="text-sm font-semibold">{comment.name}</span><span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span></div>
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">{comment.message}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-4 flex gap-3">
                      <Avatar size="sm" />
                      <div className="grid min-w-0 flex-1 gap-2 rounded-2xl border border-border bg-background/60 p-3">
                        <input value={draft.name} onChange={(event) => setCommentDrafts((current) => ({ ...current, [post.id]: { ...draft, name: event.target.value } }))} placeholder="Name" className="rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-hotpink" />
                        <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                          <input id={`comment-${post.id}`} value={draft.message} onChange={(event) => setCommentDrafts((current) => ({ ...current, [post.id]: { ...draft, message: event.target.value } }))} placeholder="Write a comment..." className="rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-hotpink" />
                          <button type="button" onClick={() => addComment(post.id)} className="gradient-hero-bg inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white"><Send className="h-4 w-4" /> Send</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })
          )}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
          <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="glass card-shadow rounded-3xl border border-border p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-hotpink">Now building</div>
                <h2 className="mt-1 font-display text-xl font-semibold">Current stack pulse</h2>
              </div>
              <motion.div animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="gradient-cool-bg grid h-11 w-11 place-items-center rounded-2xl text-white">
                <Zap className="h-5 w-5" />
              </motion.div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {topics.slice(0, 6).map((topic) => (
                <span key={topic} className="rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">{topic}</span>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.08 }} className="glass card-shadow rounded-3xl border border-border p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-hotpink">Live pulse</div>
                <h2 className="mt-1 font-display text-xl font-semibold">Recent movement</h2>
              </div>
              <span className="relative flex h-3 w-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-hotpink opacity-70" /><span className="relative inline-flex h-3 w-3 rounded-full bg-hotpink" /></span>
            </div>
            <div className="mt-5 grid gap-3">
              {activity.length === 0 ? (
                <p className="rounded-2xl border border-border bg-background/65 p-3 text-sm leading-6 text-muted-foreground">No movement yet.</p>
              ) : (
                activity.map((item, index) => (
                  <motion.div key={item.id} animate={{ x: [0, index % 2 === 0 ? 4 : -4, 0] }} transition={{ duration: 4 + index * 0.4, repeat: Infinity, ease: "easeInOut" }} className="rounded-2xl border border-border bg-background/65 p-3">
                    <div className="flex items-center gap-2 text-sm font-semibold"><Bell className="h-4 w-4 text-hotpink" /> {item.label}</div>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.detail}</p>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {featuredPost && (
            <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.14 }} className="gradient-hero-bg glow-shadow overflow-hidden rounded-3xl p-5 text-white">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/80"><Flame className="h-4 w-4" /> Featured reflection</div>
              <h2 className="mt-3 font-display text-2xl font-bold">{featuredPost.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/82">{featuredPost.body}</p>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="glass rounded-3xl border border-border p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-hotpink"><TrendingUp className="h-4 w-4" /> Topics</div>
            <div className="mt-4 grid gap-2">
              {topics.slice(0, 5).map((topic) => (
                <div key={topic} className="flex items-center justify-between rounded-2xl border border-border bg-background/60 px-3 py-2 text-sm">
                  <span>#{topic.replace(".", "")}</span>
                  <span className="text-xs text-muted-foreground">Focus</span>
                </div>
              ))}
            </div>
          </motion.div>
        </aside>
      </section>
      {adminOpen && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-background/75 px-4 py-8 backdrop-blur-md">
          <motion.section
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-border bg-card p-5 card-shadow md:p-7"
            role="dialog"
            aria-modal="true"
            aria-label="Creator Studio"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <Avatar />
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-hotpink"><Lock className="h-4 w-4" /> Admin Studio</div>
                  <h2 className="mt-2 font-display text-3xl font-semibold">Edit the feed</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">Publish new posts, update existing notes, and manage what appears on the Blog page.</p>
                </div>
              </div>
              <button type="button" onClick={closeAdmin} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border hover:border-hotpink hover:bg-muted" aria-label="Close creator studio"><X className="h-4 w-4" /></button>
            </div>

            {!isAdmin ? (
              <form onSubmit={login} className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Admin password" className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-hotpink" />
                <button type="submit" className="gradient-hero-bg rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-lg">Unlock</button>
                {loginError && <p className="text-sm text-hotpink sm:col-span-2">{loginError}</p>}
              </form>
            ) : (
              <div className="mt-6 grid gap-5">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-background/60 p-3">
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground"><Sparkles className="h-4 w-4 text-hotpink" /> Logged in as Kgomotso.</span>
                  <button type="button" onClick={logout} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs font-semibold hover:border-hotpink hover:bg-muted"><LogOut className="h-4 w-4" /> Log out</button>
                </div>

                {editingPostId ? (
                  <form onSubmit={saveEditedPost} className="grid gap-4 rounded-3xl border border-border bg-background/60 p-4">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-hotpink">Editing post</div>
                      <h3 className="mt-1 font-display text-2xl font-semibold">Update this feed item</h3>
                    </div>
                    <input value={editTitle} onChange={(event) => setEditTitle(event.target.value)} placeholder="Post title" className="rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-hotpink" />
                    <textarea value={editBody} onChange={(event) => setEditBody(event.target.value)} placeholder="Post body" rows={7} className="resize-none rounded-2xl border border-border bg-card px-4 py-3 text-sm leading-7 outline-none focus:border-hotpink" />
                    <div className="flex flex-wrap gap-3">
                      <button type="submit" className="gradient-hero-bg inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg"><PenLine className="h-4 w-4" /> Save changes</button>
                      <button type="button" onClick={cancelEditing} className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-muted-foreground hover:border-hotpink hover:text-hotpink"><X className="h-4 w-4" /> Cancel</button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={addPost} className="grid gap-4 rounded-3xl border border-border bg-background/60 p-4">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-hotpink">New post</div>
                      <h3 className="mt-1 font-display text-2xl font-semibold">Publish to the feed</h3>
                    </div>
                    <div className="flex gap-3">
                      <Avatar size="sm" />
                      <div className="grid min-w-0 flex-1 gap-3">
                        <input value={draftTitle} onChange={(event) => setDraftTitle(event.target.value)} placeholder="Post title" className="rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-hotpink" />
                        <textarea value={draftBody} onChange={(event) => setDraftBody(event.target.value)} placeholder="What are you building today?" rows={6} className="resize-none rounded-2xl border border-border bg-card px-4 py-3 text-sm leading-7 outline-none focus:border-hotpink" />
                      </div>
                    </div>
                    <label className="group grid cursor-pointer gap-3 rounded-3xl border border-dashed border-border bg-card p-5 transition-colors hover:border-hotpink">
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      <div className="flex items-center gap-3">
                        <div className="gradient-cool-bg grid h-11 w-11 place-items-center rounded-2xl text-white"><UploadCloud className="h-5 w-5" /></div>
                        <div>
                          <div className="text-sm font-semibold text-foreground">Add media</div>
                          <div className="text-xs text-muted-foreground">PNG, JPG, or WebP under 2 MB</div>
                        </div>
                      </div>
                      {draftImage && <img src={draftImage.src} alt="Post preview" className="aspect-[16/9] w-full rounded-2xl object-cover" />}
                      {imageError && <p className="text-sm text-hotpink">{imageError}</p>}
                    </label>
                    <div className="flex flex-wrap items-center gap-3">
                      {draftImage && (
                        <button type="button" onClick={() => setDraftImage(undefined)} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:border-hotpink hover:text-hotpink"><Trash2 className="h-4 w-4" /> Remove media</button>
                      )}
                      <button type="submit" className="gradient-hero-bg inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg"><Plus className="h-4 w-4" /> Publish post</button>
                    </div>
                  </form>
                )}

                <section className="rounded-3xl border border-border bg-background/60 p-4">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-hotpink">Feed editor</div>
                      <h3 className="mt-1 font-display text-2xl font-semibold">Manage existing posts</h3>
                    </div>
                    {editingPostId && <button type="button" onClick={cancelEditing} className="rounded-full border border-border px-3 py-2 text-xs font-semibold text-muted-foreground hover:border-hotpink hover:text-hotpink">New post instead</button>}
                  </div>
                  <div className="mt-4 grid gap-3">
                    {posts.length === 0 ? (
                      <p className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">There are no posts to manage yet.</p>
                    ) : (
                      posts.map((post) => (
                        <article key={post.id} className="grid gap-3 rounded-2xl border border-border bg-card p-4 md:grid-cols-[1fr_auto] md:items-center">
                          <div className="min-w-0">
                            <h4 className="truncate font-display text-lg font-semibold">{post.title}</h4>
                            <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">{post.body}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button type="button" onClick={() => startEditing(post)} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-semibold text-muted-foreground hover:border-teal hover:text-teal"><PenLine className="h-3.5 w-3.5" /> Edit</button>
                            <button type="button" onClick={() => requestDeletePost(post.id)} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-semibold text-muted-foreground hover:border-hotpink hover:text-hotpink"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
                          </div>
                        </article>
                      ))
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
          <div className="fixed inset-0 z-[80] grid place-items-center bg-background/80 px-4 py-8 backdrop-blur-md">
            <motion.form
              onSubmit={confirmDeletePost}
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.22 }}
              className="w-full max-w-md rounded-3xl border border-border bg-card p-6 card-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="gradient-pink-bg grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white"><Trash2 className="h-5 w-5" /></div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-hotpink">Confirm delete</div>
                  <h2 className="mt-1 font-display text-2xl font-semibold">Delete this post?</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">Enter the admin password before removing "{deleteTarget.title}" from the feed.</p>
                </div>
              </div>
              <input type="password" value={deletePassword} onChange={(event) => setDeletePassword(event.target.value)} placeholder="Admin password" className="mt-5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-hotpink" />
              {deleteError && <p className="mt-3 text-sm text-hotpink">{deleteError}</p>}
              <div className="mt-5 flex flex-wrap justify-end gap-3">
                <button type="button" onClick={cancelDelete} className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-muted-foreground hover:border-hotpink hover:text-hotpink">Cancel</button>
                <button type="submit" className="gradient-pink-bg rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg">Delete post</button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      <div className="mt-10 flex items-center justify-center gap-2 text-xs text-muted-foreground"><Camera className="h-4 w-4" /> Fresh posts, comments, and reactions appear in this feed.</div>
    </main>
  );
}
