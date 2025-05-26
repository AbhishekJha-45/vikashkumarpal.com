import { BIHIVE_ACCESS_KEY, BIHIVE_PUB_KEY } from "../../../config/index"
const POST = async (req, res) => {
    // Method validation
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({
            success: false,
            error: 'Method Not Allowed',
            message: 'Only POST requests are accepted'
        });
    }

    // Validate environment variables
    if (!BIHIVE_ACCESS_KEY || !BIHIVE_PUB_KEY) {
        console.error('Missing Beehive environment variables');
        return res.status(500).json({
            success: false,
            error: 'Server configuration error'
        });
    }

    // Input validation
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            error: 'Bad Request',
            message: 'Email is required'
        });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
            success: false,
            error: 'Bad Request',
            message: 'Invalid email format'
        });
    }

    try {
        // Process subscription
        const result = await submitToBeehive(email);

        if (result.success) {
            return res.status(201).json({
                success: true,
                data: result.data
            });
        } else {
            return res.status(400).json({
                success: false,
                error: result.error || 'Subscription failed',
                details: result.details
            });
        }
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Failed to process subscription'
        });
    }
};

const submitToBeehive = async (email) => {
    const payload = {
        email: email,
        reactivate_existing: false,
        send_welcome_email: true,
        utm_source: "vikashkumarpal.com",
        utm_medium: "organic",
        utm_campaign: "promotion",
        referring_site: 'vikashkumarpal.com/seo-insights',
    };

    try {
        const response = await fetch(
            `https://api.beehiiv.com/v2/publications/${BIHIVE_PUB_KEY}/subscriptions`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${BIHIVE_ACCESS_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error('Beehive API Error:', {
                status: response.status,
                error: data,
                email: email // (Note: Be careful with logging PII)
            });

            return {
                success: false,
                error: data.error?.message || 'Subscription failed',
                details: data.errors
            };
        }

        console.log('Successfully subscribed:', { email, beehiivId: data.id });
        return {
            success: true,
            data: {
                beehiivId: data.id,
                email: data.email,
                status: data.status
            }
        };
    } catch (error) {
        console.error('Beehive API Request Failed:', error);
        return {
            success: false,
            error: 'Failed to connect to Beehive API',
            details: error.message
        };
    }
};

export default POST;