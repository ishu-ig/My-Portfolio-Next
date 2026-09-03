const { Resend } = require("resend");
const templates = require("./templates");

let resendClient = null;

function getResendClient() {
    if (!resendClient && process.env.RESEND_API_KEY) {
        resendClient = new Resend(process.env.RESEND_API_KEY);
    }
    return resendClient;
}

const mailer = {
    sendMail: async (options, callback) => {
        try {
            const client = getResendClient();
            if (!client) {
                const err = new Error("RESEND_API_KEY is not defined in environment variables");
                console.error("Resend configuration error:", err.message);
                if (typeof callback === "function") callback(err, null);
                return { error: err };
            }

            const fromAddress = process.env.RESEND_FROM || options.from || `${process.env.SITE_NAME || "Portfolio"} <onboarding@resend.dev>`;
            const toAddress = Array.isArray(options.to) ? options.to : [options.to];

            const { data, error } = await client.emails.send({
                from: fromAddress,
                to: toAddress,
                subject: options.subject,
                html: options.html,
                text: options.text,
            });

            if (error) {
                console.error("Resend error sending email:", error);
                if (typeof callback === "function") callback(error, null);
                return { error };
            }

            if (typeof callback === "function") callback(null, data);
            return { data };
        } catch (error) {
            console.error("Resend mailer error:", error);
            if (typeof callback === "function") callback(error, null);
            return { error };
        }
    },
    getResendClient,
    templates
};

module.exports = mailer;