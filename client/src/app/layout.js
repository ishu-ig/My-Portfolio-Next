import "./globals.css";
import MasterLayout from "./MasterLayout";
import Script from "next/script";

export const metadata = {
  metadataBase: new URL("https://yourdomain.com"),

  title: {
    default: "Ishaan Gupta – Full Stack Developer | MERN Developer Portfolio",
    template: "%s | Ishaan Gupta",
  },

  description:
    "I am Ishaan Gupta, a MERN Stack Developer building full-stack applications, providing professional web development services, AI solutions, and writing technical blogs.",

  keywords: [
    "Ishaan Gupta",
    "portfolio",
    "mern developer",
    "full stack developer",
    "react developer",
    "nextjs developer",
    "mongodb developer",
    "express developer",
    "freelancer web developer",
    "projects",
    "blogs",
    "services",
  ],

  authors: [{ name: "Ishaan Gupta" }],
  creator: "Ishaan Gupta",
  publisher: "Ishaan Gupta",

  openGraph: {
    type: "website",
    url: "https://yourdomain.com",
    title: "Ishaan Gupta – Full Stack Developer Portfolio",
    description:
      "Explore my MERN stack projects, blogs, services and AI-powered features.",
    siteName: "Ishaan Gupta Portfolio",
    images: [
      {
        url: "/images/portfolio-og.png",
        width: 1200,
        height: 630,
        alt: "Portfolio Preview",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Ishaan Gupta – MERN Stack Developer",
    description:
      "Explore my projects, blogs and professional services.",
    images: ["/images/portfolio-og.png"],
    creator: "@yourTwitterHandle",
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "https://yourdomain.com",
  },

  verification: {
    google: "GOOGLE_VERIFICATION_CODE", // Optional
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>

        {/* JSON-LD SCHEMA (SEO BOOST) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Ishaan Gupta",
              url: "https://yourdomain.com",
              jobTitle: "Full Stack Developer | MERN Developer",
              sameAs: [
                "https://github.com/yourgithub",
                "https://linkedin.com/in/yourlinkedin",
                "https://twitter.com/yourtwitter",
              ],
            }),
          }}
        />

        {/* FONT AWESOME */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />

        {/* BOOTSTRAP ICONS */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css"
        />

        {/* BOOTSTRAP CSS */}
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />

        {/* CUSTOM CSS */}
        <link rel="stylesheet" href="/css/style.css" />
      </head>

      <body>

        {/* Scroll to top button */}
        <a
          href="#"
          id="scroll-top"
          className="scroll-top d-flex align-items-center justify-content-center"
        >
          <i className="bi bi-arrow-up-short"></i>
        </a>

        <MasterLayout>{children}</MasterLayout>

        {/* BOOTSTRAP JS */}
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" />

        {/* AOS JS */}
        <Script src="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js" />

        <Script id="init-aos">{`AOS.init();`}</Script>

        {/* CUSTOM JS */}
        <Script src="/js/index.js" />

        {/* Smooth scroll-top functionality */}
        <Script id="scroll-top-script">
          {`
            document.addEventListener("DOMContentLoaded", function () {
              const scrollTopBtn = document.getElementById("scroll-top");
              window.addEventListener("scroll", function () {
                if (window.scrollY > 300) {
                  scrollTopBtn.classList.add("show");
                } else {
                  scrollTopBtn.classList.remove("show");
                }
              });
              scrollTopBtn.addEventListener("click", function (e) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              });
            });
          `}
        </Script>
      </body>
    </html>
  );
}
