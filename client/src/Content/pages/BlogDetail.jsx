"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBlog } from "../Redux/ActionCreartors/BlogActionCreators";
import { getComment, createComment } from "../Redux/ActionCreartors/CommentActionCreators";
import { useParams } from "next/navigation";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function BlogDetail() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const BlogStateData = useSelector(state => state.BlogStateData);
    const CommentStateData = useSelector(state => state.CommentStateData);

    const [blog, setBlog] = useState(null);
    const [similarBlogs, setSimilarBlogs] = useState([]);
    const [visibleComments, setVisibleComments] = useState(2);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [commentForm, setCommentForm] = useState({ name: "", email: "", commentText: "" });
    const [alertMsg, setAlertMsg] = useState(null);
    const [alertType, setAlertType] = useState("success");

    useEffect(() => { dispatch(getBlog()); AOS.init({ duration: 900 }); }, [dispatch]);
    useEffect(() => { dispatch(getComment()); }, [dispatch]);

    useEffect(() => {
        if (BlogStateData?.length > 0) {
            const selected = BlogStateData.find(item => item._id === id);
            setBlog(selected || null);
            if (selected) {
                setSimilarBlogs(BlogStateData.filter(item => item._id !== id && item.category?.toLowerCase() === selected.category?.toLowerCase()));
            }
        }
    }, [BlogStateData, id]);

    const submitComment = () => {
        if (!commentForm.name || !commentForm.email || !commentForm.commentText) {
            setAlertType("danger"); setAlertMsg("All fields are required!"); return;
        }
        dispatch(createComment({ ...commentForm, blogId: id }));
        setAlertType("success"); setAlertMsg("Comment submitted successfully!");
        setCommentForm({ name: "", email: "", commentText: "" });
        setTimeout(() => { dispatch(getComment()); }, 500);
        setTimeout(() => { setShowCommentModal(false); setAlertMsg(null); }, 1200);
    };

    if (!blog) return (
        <div style={{ textAlign: "center", padding: "80px 16px", color: "var(--text-color)" }}>
            Loading blog...
        </div>
    );

    const blogComments = CommentStateData.filter(c => c?.blogId?._id === id);

    const inputStyle = {
        width: "100%", padding: "10px 14px", borderRadius: 10, fontSize: 13,
        border: "1px solid var(--border-color)", background: "var(--bg-color)",
        color: "var(--text-color)", outline: "none",
    };

    return (
        <section style={{ padding: "60px 16px", backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}>
            <div style={{ maxWidth: 820, margin: "0 auto" }}>

                {/* ── Title & Meta ── */}
                <div className="text-center mb-4" data-aos="fade-up">
                    {blog.category && (
                        <span style={{ fontSize: 11, fontWeight: 500, background: "rgba(0,123,255,0.1)", color: "var(--primary-color)", padding: "3px 12px", borderRadius: 999, letterSpacing: "1px", textTransform: "uppercase" }}>
                            {blog.category}
                        </span>
                    )}
                    <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: 700, color: "var(--text-color)", margin: "14px 0 10px", lineHeight: 1.3 }}>
                        {blog.title}
                    </h1>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, fontSize: 13, color: "var(--muted-color)", flexWrap: "wrap" }}>
                        <span><i className="bi bi-person" style={{ marginRight: 4 }}></i>{blog.author || "Admin"}</span>
                        <span><i className="bi bi-calendar3" style={{ marginRight: 4 }}></i>{new Date(blog.date).toDateString()}</span>
                    </div>
                </div>

                {/* ── Hero image ── */}
                <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 32 }} data-aos="fade-up">
                    <img src={blog.pic} alt={blog.title} style={{ width: "100%", maxHeight: 380, objectFit: "cover", display: "block" }} />
                </div>

                {/* ── Content ── */}
                <div data-aos="fade-up" style={{ fontSize: 15, lineHeight: 1.85, color: "var(--text-color)", marginBottom: 32 }}
                    dangerouslySetInnerHTML={{ __html: blog.longDescription }} />

                {/* ── Tags ── */}
                {blog.tags && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 40 }}>
                        <span style={{ fontSize: 12, color: "var(--muted-color)" }}>Tags:</span>
                        {blog.tags.split(",").map((tag, i) => (
                            <span key={i} style={{ fontSize: 12, background: "var(--card-bg)", border: "1px solid var(--border-color)", color: "var(--muted-color)", padding: "2px 10px", borderRadius: 999 }}>
                                #{tag.trim()}
                            </span>
                        ))}
                    </div>
                )}

                {/* ── Comments ── */}
                <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 14, padding: 20, marginBottom: 40 }} data-aos="fade-up">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                        <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-color)", margin: 0 }}>
                            Comments <span style={{ fontSize: 12, color: "var(--muted-color)", fontWeight: 400 }}>({blogComments.length})</span>
                        </p>
                        <button
                            onClick={() => setShowCommentModal(true)}
                            style={{
                                display: "inline-flex", alignItems: "center", gap: 5,
                                padding: "6px 14px", borderRadius: 999,
                                background: "rgba(0,123,255,0.1)", color: "var(--primary-color)",
                                border: "none", fontSize: 12, fontWeight: 500, cursor: "pointer",
                            }}
                        >
                            <i className="bi bi-plus"></i> Add Comment
                        </button>
                    </div>

                    {/* Comment list */}
                    {blogComments.length === 0 ? (
                        <p style={{ fontSize: 13, color: "var(--muted-color)", textAlign: "center", padding: "16px 0" }}>No comments yet. Be the first!</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {blogComments.slice(0, visibleComments).map(item => (
                                <div key={item._id} style={{ background: "var(--bg-color)", border: "1px solid var(--border-color)", borderRadius: 10, padding: "12px 14px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(0,123,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <i className="bi bi-person" style={{ fontSize: 14, color: "var(--primary-color)" }}></i>
                                        </div>
                                        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-color)", margin: 0 }}>{item.name}</p>
                                    </div>
                                    <p style={{ fontSize: 13, color: "var(--muted-color)", margin: 0, lineHeight: 1.6 }}>{item.commentText}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Show more / less */}
                    {blogComments.length > 2 && (
                        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                            {blogComments.length > visibleComments && (
                                <button onClick={() => setVisibleComments(blogComments.length)} style={{ fontSize: 12, color: "var(--primary-color)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                                    Show all {blogComments.length} comments
                                </button>
                            )}
                            {visibleComments > 2 && (
                                <button onClick={() => setVisibleComments(2)} style={{ fontSize: 12, color: "var(--muted-color)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                                    Show less
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* ── Similar blogs ── */}
                {similarBlogs.length > 0 && (
                    <div data-aos="fade-up" style={{ marginBottom: 40 }}>
                        <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-color)", marginBottom: 16 }}>Recommended Blogs</p>
                        <Swiper modules={[Autoplay]} spaceBetween={14} autoplay={{ delay: 3500 }}
                            breakpoints={{ 0: { slidesPerView: 1.1 }, 576: { slidesPerView: 1.5 }, 768: { slidesPerView: 2.2 } }}>
                            {similarBlogs.map(item => (
                                <SwiperSlide key={item._id}>
                                    <Link href={`/blogDetail/${item._id}`} style={{ textDecoration: "none" }}>
                                        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 12, overflow: "hidden", transition: "border-color 0.2s" }}>
                                            <img src={item.pic} alt={item.title} style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }} />
                                            <div style={{ padding: "12px 14px" }}>
                                                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-color)", margin: "0 0 4px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                                    {item.title}
                                                </p>
                                                <p style={{ fontSize: 12, color: "var(--muted-color)", margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                                    {item.shortDescription}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}

                {/* ── Bottom nav ── */}
                <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
                    {[{ href: "/blog", icon: "bi-journal-text", label: "More Blogs" }, { href: "/", icon: "bi-house", label: "Home" }].map(btn => (
                        <Link key={btn.href} href={btn.href} style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            padding: "10px 22px", borderRadius: 999,
                            border: "1px solid var(--border-color)", background: "transparent",
                            color: "var(--text-color)", fontSize: 13, fontWeight: 500, textDecoration: "none",
                        }}>
                            <i className={`bi ${btn.icon}`}></i> {btn.label}
                        </Link>
                    ))}
                </div>
            </div>

            {/* ── Comment Modal ── */}
            {showCommentModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 16 }}>
                    <div style={{ background: "var(--card-bg)", borderRadius: 16, width: "100%", maxWidth: 460, border: "1px solid var(--border-color)", overflow: "hidden" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid var(--border-color)" }}>
                            <p style={{ fontWeight: 600, fontSize: 15, color: "var(--text-color)", margin: 0 }}>Add a Comment</p>
                            <button onClick={() => setShowCommentModal(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--muted-color)" }}>×</button>
                        </div>
                        <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
                            {alertMsg && (
                                <div style={{ padding: "8px 12px", borderRadius: 8, fontSize: 13, background: alertType === "success" ? "rgba(22,163,74,0.1)" : "rgba(239,68,68,0.1)", color: alertType === "success" ? "#16a34a" : "#ef4444" }}>
                                    {alertMsg}
                                </div>
                            )}
                            {[
                                { label: "Name", key: "name", type: "text" },
                                { label: "Email", key: "email", type: "email" },
                            ].map(f => (
                                <div key={f.key}>
                                    <p style={{ fontSize: 12, fontWeight: 500, color: "var(--text-color)", margin: "0 0 5px" }}>{f.label}</p>
                                    <input type={f.type} value={commentForm[f.key]} onChange={e => setCommentForm({ ...commentForm, [f.key]: e.target.value })} style={inputStyle} />
                                </div>
                            ))}
                            <div>
                                <p style={{ fontSize: 12, fontWeight: 500, color: "var(--text-color)", margin: "0 0 5px" }}>Comment</p>
                                <textarea value={commentForm.commentText} onChange={e => setCommentForm({ ...commentForm, commentText: e.target.value })} rows={4} style={{ ...inputStyle, resize: "vertical" }} />
                            </div>
                        </div>
                        <div style={{ padding: "12px 18px", borderTop: "1px solid var(--border-color)", display: "flex", justifyContent: "flex-end", gap: 8 }}>
                            <button onClick={() => setShowCommentModal(false)} style={{ padding: "8px 18px", borderRadius: 999, border: "1px solid var(--border-color)", background: "transparent", color: "var(--text-color)", fontSize: 13, cursor: "pointer" }}>Cancel</button>
                            <button onClick={submitComment} style={{ padding: "8px 18px", borderRadius: 999, background: "var(--primary-color)", color: "#fff", border: "none", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Submit</button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}