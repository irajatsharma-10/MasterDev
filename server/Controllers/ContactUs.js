const {contactUsEmail} = require('../Mail/templates/contactFormRes');
const mailSender = require('../Utils/mailsender');

exports.ContactUs = async (req, res) => {
    try {
        // Fetch the data from request body
        const { firstname, lastname = "", email, phonenumber, message, countrycode } = req.body;

        // Send the email to the user who contacted us
        const emailResponse = await mailSender(
            email, 
            "Thank you for your feedback, we will get back to you soon!",
            contactUsEmail(firstname, lastname, email, phonenumber, message, countrycode)
        );

        console.log("Contact Us Email Response:", emailResponse);

        // Respond with success message
        return res.status(200).json({
            success: true,
            message: 'Contact information sent successfully',
            data: emailResponse,
        });

    } catch (error) {
        console.error("Error handling contact us data:", error);
        return res.status(500).json({
            success: false,
            message: 'Failed to send contact information',
            error: error.message,
        });
    }
};
