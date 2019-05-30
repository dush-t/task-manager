const level2Check = async (req, res, next) => {
    if (req.user.level > 1) {
        next();
    } else {
        return res.status(403).send({
            'error': 'You are not authorized to make this request'
        });
    }
} 

const level1Check = async (req, res, next) => {
    if (req.user.level === 1) {
        next();
    } else {
        return res.status(403).send({
            'error': 'You are not authorized to make this request'
        });
    }
} 

module.exports = {
    level2Check,
    level1Check
}