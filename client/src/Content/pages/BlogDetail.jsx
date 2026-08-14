"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBlog } from "../Redux/ActionCreators/BlogActionCreators";
import {
  getComment,
  createComment,
} from "../Redux/ActionCreators/CommentActionCreators";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function BlogDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const BlogStateData = useSelector((state) => state.BlogStateData);
  const CommentStateData = useSelector((state) => state.CommentStateData);

  const [blog, setBlog] = useState(null);
  const [similarBlogs, setSimilarBlogs] = useState([]);
  const [visibleComments, setVisibleComments] = useState(3);

  const [commentForm, setCommentForm] = useState({
    name: "",
    email: "",
    commentText: "",
  });

  const [alertMsg, setAlertMsg] = useState(null);
  const [alertType, setAlertType] = useState("success");

  useEffect(() => {
    dispatch(getBlog());
    dispatch(getComment());
    AOS.init({ duration: 900, once: true });
  }, [dispatch]);

  useEffect(() => {
    if (BlogStateData?.length > 0) {
      const selected = BlogStateData.find((item) => String(item._id) === String(id));
      setBlog(selected || null);

      if (selected) {
        const sims = BlogStateData.filter(
          (item) =>
            String(item._id) !== String(id) &&
            item.category?.toLowerCase() === selected.category?.toLowerCase()
        );
        setSimilarBlogs(sims.length > 0 ? sims : BlogStateData.filter(item => String(item._id) !== String(id)));
      }
    }
  }, [BlogStateData, id]);

  const submitComment = () => {
    if (!commentForm.name || !commentForm.email || !commentForm.commentText) {
      setAlertType("danger");
      setAlertMsg("All fields are required!");
      return;
    }

    const data = {
      ...commentForm,
      blogId: id,
    };

    dispatch(createComment(data));

    setAlertType("success");
    setAlertMsg("Comment submitted successfully!");
    setCommentForm({ name: "", email: "", commentText: "" });

    setTimeout(() => {
      dispatch(getComment());
    }, 500);

    setTimeout(() => {
      const modal = document.getElementById("commentModal");
      if (modal && window.bootstrap) {
        const modalInstance = window.bootstrap.Modal.getInstance(modal);
        if (modalInstance) modalInstance.hide();
      }
      setAlertMsg(null);
    }, 1200);
  };

  if (!blog) return (
    <div style={{ textAlign: "center", padding: "100px 16px", color: "var(--text-color)" }}>
      <div className="spinner-border text-primary" role="status"></div>
      <p className="mt-3 text-muted">Loading article...</p>
    </div>
  );

  const blogComments = Array.isArray(CommentStateData) ? CommentStateData.filter((c) => String(c?.blogId?._id || c?.blogId) === String(id)) : [];
  const formattedDate = blog.date ? new Date(blog.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "Recent";

  return (
    <section
      className="py-5"
      style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
    >
      <div className="container" style={{ maxWidth: "860px" }}>
        
        {/* Breadcrumbs */}
        <div className="d-flex align-items-center gap-2 mb-4" style={{ fontSize: "0.86rem" }}>
          <Link href="/" className="text-muted text-decoration-none">Home</Link>
          <span className="text-muted">/</span>
          <Link href="/blog" className="text-muted text-decoration-none">Articles</Link>
          <span className="text-muted">/</span>
          <span className="text-primary fw-bold text-truncate">{blog.title}</span>
        </div>

        {/* Category Pill */}
        <div className="text-center mb-3">
          <span className="section-badge">
            <i className="bi bi-journal-bookmark-fill"></i>
            {blog.category || "Tech Article"}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-center fw-bold mb-3" style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", lineHeight: 1.25 }}>
          {blog.title}
        </h1>

        {/* Meta Info */}
        <div className="d-flex justify-content-center align-items-center gap-3 text-muted mb-4 pb-2" style={{ fontSize: "0.9rem" }}>
          <span><i className="bi bi-person-circle me-1"></i> {blog.author || "Ishaan Gupta"}</span>
          <span>•</span>
          <span><i className="bi bi-calendar3 me-1"></i> {formattedDate}</span>
        </div>

        {/* Hero Image */}
        <div style={{ position: "relative", width: "100%", height: 420, borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-md)", marginBottom: "32px" }}>
          <Image
            src={blog.pic || "/img/blog/blog-1.jpg"}
            alt={blog.title}
            fill
            sizes="(max-width: 860px) 100vw, 860px"
            style={{ objectFit: "cover" }}
            priority
          />
        </div>

        {/* Short description lead */}
        {blog.shortDescription && (
          <p className="lead fw-medium mb-4" style={{ color: "var(--text-color)", borderLeft: "3px solid var(--primary-color)", paddingLeft: "16px", lineHeight: 1.7 }}>
            {blog.shortDescription}
          </p>
        )}

        {/* Article Body */}
        <div
          dangerouslySetInnerHTML={{ __html: blog.longDescription }}
          style={{ fontSize: "1.05rem", lineHeight: "1.85", color: "var(--text-color)" }}
        />

        {/* Tags */}
        {blog.tags && (
          <div className="mt-5 pt-3 border-top" style={{ borderColor: "var(--border-color)" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginRight: "10px" }}>
              Tags:
            </span>
            {blog.tags.split(",").map((tag, index) => (
              <span key={index} className="badge bg-body-secondary text-body me-2 p-2 px-3 rounded-pill" style={{ fontSize: "0.8rem" }}>
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Comments Section */}
        <div
          className="mt-5 p-4 rounded-4 shadow-sm"
          style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--card-border)" }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold m-0" style={{ color: "var(--text-color)" }}>
              Discussion ({blogComments.length})
            </h4>
            <button
              className="btn btn-sm btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#commentModal"
            >
              <i className="bi bi-chat-left-text-fill me-1"></i> Add Comment
            </button>
          </div>

          {blogComments.length > 0 ? (
            blogComments.slice(0, visibleComments).map((item) => (
              <div
                key={item._id}
                className="p-3 mb-3"
                style={{
                  backgroundColor: "var(--bg-color)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <div className="d-flex align-items-center gap-2 mb-1">
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--primary-color)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700 }}>
                    {item.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <h6 className="fw-bold m-0" style={{ color: "var(--text-color)", fontSize: "0.95rem" }}>
                    {item.name}
                  </h6>
                </div>
                <p className="mt-2 mb-0" style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.6 }}>{item.commentText}</p>
              </div>
            ))
          ) : (
            <p className="text-muted m-0">Be the first to share your thoughts on this article!</p>
          )}

          {blogComments.length > visibleComments && (
            <button
              className="btn btn-outline-primary btn-sm mt-2"
              onClick={() => setVisibleComments(blogComments.length)}
            >
              Show More Comments
            </button>
          )}

          {visibleComments > 3 && (
            <button
              className="btn btn-outline-secondary btn-sm mt-2 ms-2"
              onClick={() => setVisibleComments(3)}
            >
              Show Less
            </button>
          )}
        </div>

        {/* Comment Modal */}
        <div className="modal fade" id="commentModal" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content"
              style={{ backgroundColor: "var(--card-bg)", color: "var(--text-color)", border: "1px solid var(--card-border)", borderRadius: "var(--radius-lg)" }}
            >
              <div className="modal-header border-bottom" style={{ borderColor: "var(--border-color)" }}>
                <h5 className="modal-title fw-bold">Leave a Comment</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>

              <div className="modal-body p-4">
                {alertMsg && (
                  <div className={`alert alert-${alertType}`}>{alertMsg}</div>
                )}

                <div className="mb-3">
                  <label className="form-label fw-semibold small text-uppercase">Your Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. David Miller"
                    value={commentForm.name}
                    onChange={(e) =>
                      setCommentForm({ ...commentForm, name: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small text-uppercase">Your Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="david@example.com"
                    value={commentForm.email}
                    onChange={(e) =>
                      setCommentForm({ ...commentForm, email: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small text-uppercase">Comment Message</label>
                  <textarea
                    className="form-control"
                    style={{ height: "120px" }}
                    placeholder="Share your perspective or questions..."
                    value={commentForm.commentText}
                    onChange={(e) =>
                      setCommentForm({
                        ...commentForm,
                        commentText: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="modal-footer border-top" style={{ borderColor: "var(--border-color)" }}>
                <button type="button" className="btn btn-outline-dark" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={submitComment}>
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Blogs */}
        {similarBlogs.length > 0 && (
          <div className="mt-5 pt-4 border-top" style={{ borderColor: "var(--border-color)" }} data-aos="fade-up">
            <h4 className="fw-bold mb-4" style={{ color: "var(--text-color)" }}>Related Articles</h4>

            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000 }}
              breakpoints={{
                576: { slidesPerView: 1.5 },
                768: { slidesPerView: 2 },
                992: { slidesPerView: 2.5 },
              }}
              style={{ paddingBottom: 24 }}
            >
              {similarBlogs.map((item) => (
                <SwiperSlide key={item._id}>
                  <Link
                    href={`/blogDetail/${item._id}`}
                    className="text-decoration-none"
                  >
                    <div 
                      className="card h-100 overflow-hidden shadow-sm"
                      style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "var(--radius-md)" }}
                    >
                      <div style={{ position: "relative", width: "100%", height: 160 }}>
                        <Image
                          src={item.pic || "/img/blog/blog-1.jpg"}
                          alt={item.title}
                          fill
                          sizes="(max-width: 576px) 100vw, (max-width: 992px) 50vw, 33vw"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <div className="card-body p-3">
                        <h6 className="fw-bold mb-2 text-truncate" style={{ color: "var(--text-color)" }}>{item.title}</h6>
                        <p
                          className="text-muted m-0"
                          style={{ fontSize: "0.85rem", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                        >
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

        {/* Bottom Actions */}
        <div className="text-center mt-5 pt-3">
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link href="/blog" className="btn btn-primary">
              <i className="bi bi-grid-fill me-1"></i> All Articles
            </Link>
            <Link href="/" className="btn btn-outline-dark">
              <i className="bi bi-house-fill me-1"></i> Back to Home
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}