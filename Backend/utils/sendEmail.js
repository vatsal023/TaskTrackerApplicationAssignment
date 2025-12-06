const { Resend } = require("resend");

// Initialize Resend with API key from environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(email, subject, text) {
    try {
        // Get the sender email from environment variable
        const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
        
        const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: [email], // Resend expects an array
            subject: subject,
            html: `<p>${text}</p>`, // Resend prefers HTML, but we'll convert text to HTML
        });

        if (error) {
            console.error("Resend API error:", error);
            throw error;
        }

        console.log(`Email sent successfully to ${email}. Email ID: ${data?.id}`);
        return data;
    } catch (error) {
        console.error(`Error sending email to ${email}:`, error);
        throw error;
    }
}

module.exports = sendEmail;