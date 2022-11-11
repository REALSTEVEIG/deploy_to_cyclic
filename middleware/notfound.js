
const notFoundError = async (req, res) => {
    return res.status(404).redirect('404')
}

module.exports = notFoundError