const getPreferencesAndPersonalisation = async (req, res) => {
    try {
        const data = {
            theme: req.user.theme,
            dashboardlayout: req.user.dashboardlayout,

        };
        return res.status(200).json({ success: true, data: data });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export { getPreferencesAndPersonalisation };
