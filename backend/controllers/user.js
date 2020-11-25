var date = new Date();
exports.login = (req, res, next) => {

};

exports.register = (req, res, next) => {
    // salt the password 10 times and return a promise
    bcrypt.hash(req.body.password, 10).then(
        (hash) => {
            const user = new User( {
                id: UUID(),
                username: req.body.username,
                password: hash,
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                imgURL: req.body.imgURL,
                modifiedDate: date.getUTCDate(),
                createdDate: date.getUTCDate(),
                isDelete: false
            });
            user.save().then(
                () => {
                    res.status(201).json({
                        message: 'User added successfully'
                    });
                }
            ).catch(
                (error) => {
                    res.status(500).json({
                        error: error
                    });
                }
            );
        }
    );
};

console.log(generateUUID())
