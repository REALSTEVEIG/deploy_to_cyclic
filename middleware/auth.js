const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).redirect('reg')
        }

        next()
    } catch (error) {
        return res.status(403).render('reg', {msg : "Forbidden"})
    }
}

module.exports = authMiddleware