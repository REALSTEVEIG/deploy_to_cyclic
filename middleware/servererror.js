const serverError = async (req, res, next) => {
    if (res.status === 500) {
        return res.status(404).redirect('500')
    }
    next()
}

module.exports = serverError