/**
 * Premium Responsive HTML Email Templates for Ishaan Portfolio
 */

function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function baseLayout({ previewText, badgeText, badgeColor = "#6366f1", title, subtitle, contentHtml, ctaText, ctaUrl, siteName }) {
    const brandName = siteName || process.env.SITE_NAME || "Ishaan Portfolio";
    const year = new Date().getFullYear();
    const websiteUrl = process.env.CLIENT_URL || process.env.SERVER || "https://www.ishaanportfolio.com";

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>${escapeHtml(title)}</title>
    <!--[if mso]>
    <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
    </style>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; color: #e2e8f0;">
    <!-- Preview Text -->
    <div style="display: none; max-height: 0px; overflow: hidden; opacity: 0;">
        ${escapeHtml(previewText || title)}
    </div>

    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; width: 100%; min-height: 100vh; padding: 40px 15px;">
        <tr>
            <td align="center">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #111827; border-radius: 16px; border: 1px solid #1f293d; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                    
                    <!-- Top Accent Gradient Line -->
                    <tr>
                        <td height="4" style="background: linear-gradient(90deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);"></td>
                    </tr>

                    <!-- Header -->
                    <tr>
                        <td style="padding: 36px 36px 20px 36px; text-align: center; border-bottom: 1px solid #1e293b;">
                            <div style="display: inline-block; margin-bottom: 12px;">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="background: linear-gradient(135deg, #6366f1, #8b5cf6); width: 44px; height: 44px; border-radius: 12px; text-align: center; vertical-align: middle; color: #ffffff; font-weight: 800; font-size: 20px; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);">
                                            ⚡
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <h3 style="margin: 6px 0 0 0; color: #f8fafc; font-size: 19px; font-weight: 700; letter-spacing: -0.3px;">
                                ${escapeHtml(brandName)}
                            </h3>
                        </td>
                    </tr>

                    <!-- Main Body -->
                    <tr>
                        <td style="padding: 32px 36px;">
                            
                            ${badgeText ? `
                            <div style="margin-bottom: 16px;">
                                <span style="display: inline-block; padding: 5px 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 20px; background-color: ${badgeColor}20; color: ${badgeColor}; border: 1px solid ${badgeColor}40;">
                                    ${escapeHtml(badgeText)}
                                </span>
                            </div>` : ''}

                            <h1 style="margin: 0 0 10px 0; color: #ffffff; font-size: 24px; font-weight: 700; line-height: 1.3;">
                                ${escapeHtml(title)}
                            </h1>

                            ${subtitle ? `
                            <p style="margin: 0 0 24px 0; color: #94a3b8; font-size: 15px; line-height: 1.6;">
                                ${escapeHtml(subtitle)}
                            </p>` : ''}

                            <!-- Dynamic Content -->
                            ${contentHtml}

                            <!-- CTA Button if present -->
                            ${ctaText && ctaUrl ? `
                            <div style="margin-top: 32px; text-align: center;">
                                <a href="${ctaUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #4f46e5); color: #ffffff; text-decoration: none; padding: 14px 32px; font-size: 15px; font-weight: 600; border-radius: 10px; box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35); transition: all 0.2s ease;">
                                    ${escapeHtml(ctaText)} &rarr;
                                </a>
                            </div>` : ''}

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 24px 36px; background-color: #0d121f; border-top: 1px solid #1e293b; text-align: center;">
                            <p style="margin: 0 0 8px 0; color: #64748b; font-size: 13px; line-height: 1.5;">
                                This is an automated message from <a href="${websiteUrl}" style="color: #818cf8; text-decoration: none; font-weight: 500;">${escapeHtml(brandName)}</a>.
                            </p>
                            <p style="margin: 0; color: #475569; font-size: 12px;">
                                &copy; ${year} ${escapeHtml(brandName)}. All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

/**
 * Template: Query Submission Confirmation (Contact Us)
 */
function getContactQueryReceivedTemplate({ name, email, phone, subject, message }) {
    const siteName = process.env.SITE_NAME || "Ishaan Portfolio";
    const contactUrl = `${process.env.CLIENT_URL || process.env.SERVER || "https://www.ishaanportfolio.com"}/contact`;

    const contentHtml = `
        <div style="background-color: #1e293b; border-radius: 12px; border: 1px solid #334155; padding: 20px; margin-bottom: 20px;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                ${name ? `
                <tr>
                    <td style="padding: 8px 0; color: #94a3b8; font-size: 14px; width: 100px; vertical-align: top;"><strong>Name:</strong></td>
                    <td style="padding: 8px 0; color: #f1f5f9; font-size: 14px; font-weight: 500;">${escapeHtml(name)}</td>
                </tr>` : ''}
                <tr>
                    <td style="padding: 8px 0; color: #94a3b8; font-size: 14px; width: 100px; vertical-align: top;"><strong>Email:</strong></td>
                    <td style="padding: 8px 0; color: #f1f5f9; font-size: 14px; font-weight: 500;">${escapeHtml(email)}</td>
                </tr>
                ${phone ? `
                <tr>
                    <td style="padding: 8px 0; color: #94a3b8; font-size: 14px; width: 100px; vertical-align: top;"><strong>Phone:</strong></td>
                    <td style="padding: 8px 0; color: #f1f5f9; font-size: 14px; font-weight: 500;">${escapeHtml(phone)}</td>
                </tr>` : ''}
                <tr>
                    <td style="padding: 8px 0; color: #94a3b8; font-size: 14px; width: 100px; vertical-align: top;"><strong>Subject:</strong></td>
                    <td style="padding: 8px 0; color: #f1f5f9; font-size: 14px; font-weight: 500;">${escapeHtml(subject)}</td>
                </tr>
            </table>

            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #334155;">
                <p style="margin: 0 0 8px 0; color: #94a3b8; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Message Details:</p>
                <div style="background-color: #0f172a; border-left: 3px solid #6366f1; border-radius: 6px; padding: 14px 16px; color: #e2e8f0; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message)}</div>
            </div>
        </div>

        <p style="margin: 0; color: #94a3b8; font-size: 14px; line-height: 1.6;">
            We have received your message and will get back to you promptly.
        </p>
    `;

    return baseLayout({
        previewText: `We received your inquiry: "${subject}"`,
        badgeText: "Query Received",
        badgeColor: "#6366f1",
        title: "Thank You for Reaching Out",
        subtitle: `Hi ${name ? escapeHtml(name) : 'there'}, we've successfully recorded your inquiry.`,
        contentHtml,
        ctaText: "Visit Contact Page",
        ctaUrl: contactUrl,
        siteName
    });
}

/**
 * Template: Contact Query Resolved
 */
function getContactQueryResolvedTemplate({ name, subject }) {
    const siteName = process.env.SITE_NAME || "Ishaan Portfolio";
    const contactUrl = `${process.env.CLIENT_URL || process.env.SERVER || "https://www.ishaanportfolio.com"}/contact`;

    const contentHtml = `
        <div style="background-color: #064e3b20; border-radius: 12px; border: 1px solid #05966940; padding: 24px; text-align: center; margin-bottom: 24px;">
            <div style="font-size: 36px; margin-bottom: 12px;">✅</div>
            <h3 style="margin: 0 0 8px 0; color: #34d399; font-size: 18px; font-weight: 600;">Inquiry Successfully Resolved</h3>
            <p style="margin: 0; color: #a7f3d0; font-size: 14px; line-height: 1.6;">
                Your query regarding <strong>"${escapeHtml(subject || "General Inquiry")}"</strong> has been processed and marked as resolved.
            </p>
        </div>

        <p style="margin: 0; color: #94a3b8; font-size: 14px; line-height: 1.6; text-align: center;">
            If you have any further questions or need additional assistance, feel free to contact us anytime.
        </p>
    `;

    return baseLayout({
        previewText: "Your query has been marked as resolved",
        badgeText: "Resolved",
        badgeColor: "#10b981",
        title: "Query Resolved",
        subtitle: `Hi ${name ? escapeHtml(name) : 'there'}, thank you for your patience.`,
        contentHtml,
        ctaText: "Submit New Query",
        ctaUrl: contactUrl,
        siteName
    });
}

/**
 * Template: Service Request Received
 */
function getServiceRequestReceivedTemplate({ name, email, phone, service, message }) {
    const siteName = process.env.SITE_NAME || "Ishaan Portfolio";
    const contactUrl = `${process.env.CLIENT_URL || process.env.SERVER || "https://www.ishaanportfolio.com"}/services`;

    const serviceName = service?.name || "Custom Service";
    const serviceCategory = service?.category || "Service";
    const servicePrice = service?.price !== undefined ? `$${service.price}` : null;
    const serviceDuration = service?.duration || null;

    const contentHtml = `
        <!-- Service Highlight Card -->
        <div style="background: linear-gradient(135deg, #1e1b4b 0%, #1e293b 100%); border-radius: 12px; border: 1px solid #4338ca50; padding: 22px; margin-bottom: 20px;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td>
                        <span style="display: inline-block; padding: 3px 10px; font-size: 11px; font-weight: 600; text-transform: uppercase; border-radius: 12px; background-color: #6366f130; color: #a5b4fc; margin-bottom: 8px;">
                            ${escapeHtml(serviceCategory)}
                        </span>
                        <h2 style="margin: 0 0 10px 0; color: #ffffff; font-size: 18px; font-weight: 700;">
                            ${escapeHtml(serviceName)}
                        </h2>
                    </td>
                </tr>
            </table>

            <div style="display: flex; gap: 12px; margin-top: 10px; padding-top: 12px; border-top: 1px solid #334155;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        ${servicePrice ? `
                        <td style="padding-right: 16px;">
                            <span style="color: #94a3b8; font-size: 12px; text-transform: uppercase;">Estimated Price</span><br>
                            <span style="color: #38bdf8; font-size: 16px; font-weight: 700;">${escapeHtml(servicePrice)}</span>
                        </td>` : ''}
                        ${serviceDuration ? `
                        <td>
                            <span style="color: #94a3b8; font-size: 12px; text-transform: uppercase;">Timeline</span><br>
                            <span style="color: #f1f5f9; font-size: 14px; font-weight: 600;">${escapeHtml(serviceDuration)}</span>
                        </td>` : ''}
                    </tr>
                </table>
            </div>
        </div>

        <!-- Request Details -->
        <div style="background-color: #1e293b; border-radius: 12px; border: 1px solid #334155; padding: 18px; margin-bottom: 20px;">
            <p style="margin: 0 0 8px 0; color: #94a3b8; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Your Message / Project Details:</p>
            <div style="background-color: #0f172a; border-left: 3px solid #8b5cf6; border-radius: 6px; padding: 12px 14px; color: #e2e8f0; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message || "No additional message provided.")}</div>
        </div>

        <p style="margin: 0; color: #94a3b8; font-size: 14px; line-height: 1.6;">
            We will review your requirements and get in touch with you shortly with next steps.
        </p>
    `;

    return baseLayout({
        previewText: `We received your service request for ${serviceName}`,
        badgeText: "Service Request",
        badgeColor: "#8b5cf6",
        title: "Service Request Received",
        subtitle: `Hello ${name ? escapeHtml(name) : 'there'}, thank you for choosing our services!`,
        contentHtml,
        ctaText: "Explore More Services",
        ctaUrl: contactUrl,
        siteName
    });
}

/**
 * Template: Service Request Resolved
 */
function getServiceRequestResolvedTemplate({ name, serviceName }) {
    const siteName = process.env.SITE_NAME || "Ishaan Portfolio";
    const contactUrl = `${process.env.CLIENT_URL || process.env.SERVER || "https://www.ishaanportfolio.com"}/contact`;

    const contentHtml = `
        <div style="background-color: #064e3b20; border-radius: 12px; border: 1px solid #05966940; padding: 24px; text-align: center; margin-bottom: 24px;">
            <div style="font-size: 36px; margin-bottom: 12px;">🎉</div>
            <h3 style="margin: 0 0 8px 0; color: #34d399; font-size: 18px; font-weight: 600;">Request Completed & Resolved</h3>
            <p style="margin: 0; color: #a7f3d0; font-size: 14px; line-height: 1.6;">
                Your service request for <strong>"${escapeHtml(serviceName || "Requested Service")}"</strong> has been successfully resolved.
            </p>
        </div>

        <p style="margin: 0; color: #94a3b8; font-size: 14px; line-height: 1.6; text-align: center;">
            Thank you for working with us! If you need any further modifications or have a new project in mind, we would love to collaborate.
        </p>
    `;

    return baseLayout({
        previewText: `Your service request for ${serviceName || 'our service'} has been resolved`,
        badgeText: "Resolved",
        badgeColor: "#10b981",
        title: "Service Request Resolved",
        subtitle: `Hello ${name ? escapeHtml(name) : 'there'}, here is an update on your request.`,
        contentHtml,
        ctaText: "Start a New Request",
        ctaUrl: contactUrl,
        siteName
    });
}

/**
 * Template: Password Reset OTP
 */
function getPasswordResetOtpTemplate({ name, otp }) {
    const siteName = process.env.SITE_NAME || "Ishaan Portfolio";

    const contentHtml = `
        <div style="background-color: #1e293b; border-radius: 14px; border: 1px solid #334155; padding: 28px 24px; text-align: center; margin-bottom: 24px;">
            <p style="margin: 0 0 12px 0; color: #94a3b8; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                Your One-Time Verification Code
            </p>
            
            <div style="display: inline-block; background-color: #0f172a; border: 2px dashed #6366f1; border-radius: 12px; padding: 14px 28px; margin: 8px 0 16px 0;">
                <span style="font-family: 'SF Pro Mono', Menlo, Monaco, 'Courier New', monospace; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #818cf8;">
                    ${escapeHtml(otp)}
                </span>
            </div>

            <p style="margin: 0; color: #f87171; font-size: 13px; font-weight: 500;">
                ⏱️ This code is valid for 10 minutes. Do not share it with anyone.
            </p>
        </div>

        <div style="background-color: #0f172a; border-radius: 8px; border-left: 3px solid #f59e0b; padding: 12px 16px; margin-bottom: 12px;">
            <p style="margin: 0; color: #cbd5e1; font-size: 13px; line-height: 1.5;">
                <strong>Security Alert:</strong> If you did not initiate this password reset request, please disregard this email or secure your account.
            </p>
        </div>
    `;

    return baseLayout({
        previewText: `Your OTP for password reset is ${otp}`,
        badgeText: "Security Verification",
        badgeColor: "#f59e0b",
        title: "Password Reset Request",
        subtitle: `Hi ${name ? escapeHtml(name) : 'there'}, use the code below to reset your password.`,
        contentHtml,
        siteName
    });
}

module.exports = {
    getContactQueryReceivedTemplate,
    getContactQueryResolvedTemplate,
    getServiceRequestReceivedTemplate,
    getServiceRequestResolvedTemplate,
    getPasswordResetOtpTemplate
};
