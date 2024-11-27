const sellerModel = require('../../models/sellerModel')
const { responseReturn } = require('../../utiles/response')

class sellerController {

    get_seller_request = async (req, res) => {
        const { page, searchValue, parPage } = req.query
        const skipPage = parseInt(parPage) * (parseInt(page) - 1)
        try {
            if (searchValue) {
                //const seller
            } else {
                const sellers = await sellerModel.find({ status: 'pending' }).skip(skipPage).limit(parPage).sort({ createdAt: -1 })
                const totalSeller = await sellerModel.find({ status: 'pending' }).countDocuments()
                responseReturn(res, 200, { totalSeller, sellers })
            }
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }
    get_seller = async (req, res) => {
        const { sellerId } = req.params

        try {
            const seller = await sellerModel.findById(sellerId)
            responseReturn(res, 200, { seller })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    seller_status_update = async (req, res) => {
        const { sellerId, status } = req.body
        try {
            await sellerModel.findByIdAndUpdate(sellerId, {
                status
            })
            const seller = await sellerModel.findById(sellerId)
            responseReturn(res, 200, { seller, message: 'seller status update success' })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    get_active_sellers = async (req, res) => {
        let { page, searchValue, parPage } = req.query
        page = parseInt(page)
        parPage = parseInt(parPage)

        const skipPage = parPage * (page - 1)

        try {
            if (searchValue) {
                const sellers = await sellerModel.find({
                    $text: { $search: searchValue },
                    status: 'active'
                }).skip(skipPage).limit(parPage).sort({ createdAt: -1 })

                const totalSeller = await sellerModel.find({
                    $text: { $search: searchValue },
                    status: 'active'
                }).countDocuments()

                responseReturn(res, 200, { totalSeller, sellers })
            } else {
                const sellers = await sellerModel.find({ status: 'active' }).skip(skipPage).limit(parPage).sort({ createdAt: -1 })
                const totalSeller = await sellerModel.find({ status: 'active' }).countDocuments()
                responseReturn(res, 200, { totalSeller, sellers })
            }

        } catch (error) {
            console.log('active seller get ' + error.message)
        }
    }

    get_deactive_sellers = async (req, res) => {
        let { page, searchValue, parPage } = req.query
        page = parseInt(page)
        parPage = parseInt(parPage)

        const skipPage = parPage * (page - 1)

        try {
            if (searchValue) {
                const sellers = await sellerModel.find({
                    $text: { $search: searchValue },
                    status: 'deactive'
                }).skip(skipPage).limit(parPage).sort({ createdAt: -1 })

                const totalSeller = await sellerModel.find({
                    $text: { $search: searchValue },
                    status: 'deactive'
                }).countDocuments()

                responseReturn(res, 200, { totalSeller, sellers })
            } else {
                const sellers = await sellerModel.find({ status: 'deactive' }).skip(skipPage).limit(parPage).sort({ createdAt: -1 })
                const totalSeller = await sellerModel.find({ status: 'deactive' }).countDocuments()
                responseReturn(res, 200, { totalSeller, sellers })
            }

        } catch (error) {
            console.log('active seller get ' + error.message)
        }
    }

    create_paystack_account = async (req, res) => {
        try {
            const response = await axios.post('https://api.paystack.co/subaccount', {
                // Include the necessary body data for Paystack
                business_name: req.body.business_name, // Example field
                settlement_bank: req.body.settlement_bank, // Example field
                account_number: req.body.account_number, // Example field
                percentage_charge: req.body.percentage_charge // Example field
            }, {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            });
    
            res.status(200).json({ success: true, data: response.data });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error creating Paystack account', error: error.message });
        }
    }


    activate_paystack_account = async (req, res) => {
    try {
        const { activationCode } = req.params;

        // Call Paystack to activate the account using the activationCode
        const response = await axios.put(`https://api.paystack.co/subaccount/${activationCode}/activate`, {}, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
            }
        });

        res.status(200).json({ success: true, data: response.data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error activating Paystack account', error: error.message });
    }
};
}

module.exports = new sellerController()