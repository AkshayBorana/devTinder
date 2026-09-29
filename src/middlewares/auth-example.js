const adminAuth = (req, res, next) => {
    const token = 'xyz';
    const isAdminAuthorized = token === 'xyz';

    if(!isAdminAuthorized) {
        res.status(401).send('User is not authorized');
    } else {
        next();
    }
};

const userAuthExample = (req, res, next) => {
    const token = 'xyz';
    const isAdminAuthorized = token === 'xyz';

    if(!isAdminAuthorized) {
        res.status(401).send('User is not authorized');
    } else {
        next();
    }
};

module.exports = {
    adminAuth,
    userAuthExample,
}