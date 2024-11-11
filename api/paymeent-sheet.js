const Stripe = require('stripe');
const stripe = Stripe('sk_test_51QJNwTL7B8edvQLx2zjx6YPNHdlqk8MfavP3hP1j4gdkg2zYWvx5qDSs2ODcvaJf2h9HPXow56AcqiJJxjbORYuG00VyJwNd0s');

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        try {
            const data = req.body;
            console.log(req.body);
            
            const customer = await stripe.customers.create({
                email: data.email,
                name: data.name,
            });
            const ephemeralKey = await stripe.ephemeralKeys.create(
                { customer: customer.id },
                { apiVersion: '2020-08-27' }
            );
            const paymentIntent = await stripe.paymentIntents.create({
                amount: parseInt(data.amount),
                currency: data.currency,
                customer: customer.id,
                automatic_payment_methods: { enabled: true },
            });
            
            res.status(200).json({
                paymentIntent: paymentIntent.client_secret,
                ephemeralKey: ephemeralKey.secret,
                customer: customer.id,
            });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    } else {
        res.status(405).send('Method Not Allowed');
    }
};
