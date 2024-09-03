const User = require('../modles/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gaganarora987123@gmail.com',
        pass: 'apogqlvflhroytsp'
    }
});


exports.getLogin = (req, res, next) => {

    // const cookieHeader = req.get('Cookie');
    // let isAuthenticated = false;

    // if (cookieHeader) {
    //     const cookies = cookieHeader.split(';').map(cookie => cookie.trim().split('='));
    //     const loggedInCookie = cookies.find(cookie => cookie[0] === 'loggedIn');
    //     isAuthenticated = loggedInCookie && loggedInCookie[1] === 'true';
    // }

    // req.isAuthenticated = isAuthenticated;
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/Login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.session.isLoggedIn,
        errorMessage: message
    })
};
exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                req.flash('error', 'invalid email or password');
                return res.redirect('/login');
            }
            bcrypt.compare(password, user.password).then(domatch => {
                if (domatch) {
                    req.session.isLoggedIn = true;
                    req.session.user = user;

                    return req.session.save((err) => {
                        console.log(err);
                        return res.redirect('/');
                    });
                }

                req.flash('error', 'invalid email or password');

                res.redirect('/login');

            })


        })
        .catch((err) => {
            console.log(err);
        });

};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    })

};

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');

    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message
    });
};

exports.postSignup = (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({ email: email }).then(userDoc => {
        if (userDoc) {
            req.flash('error', 'email already exists')
            return res.redirect('/signup');
        }

        return bcrypt.hash(password, 12).then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
                cart: { items: [] }
            });
            return user.save();
        }).then((result => {

            res.redirect('/login');
            return transporter.sendMail({
                to: email,
                from: 'gaganarora987123@gmail.com',
                subject: 'Signup',
                html: '<h1>Signup success</h1>'
            })
        }))
    }).catch(err => {
        console.log(err);
    })


};

exports.getReset = (req, res, next) => {
    let message = req.flash('error');

    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset-Password',
        errorMessage: message
    })
}


exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/');
        }
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    req.flash('error', 'no email found');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            }).then(result => {
                res.redirect('/');

                transporter.sendMail({
                    to: req.body.email,
                    from: 'gaganMart@gmail.com',
                    subject: 'password rest',
                    html: `<p>click this link to set new password <a href="http://localhost:3000/reset/${token}>link</a><p>`

                })
            }).catch(err => {
                console.log(err);
            })
    })
}



exports.getNewPassword = (req, res, next) => {

    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            let message = req.flash('error');

            if (message.length > 0) {
                message = message[0];
            } else {
                message = null;
            }
            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New-Password',
                errorMessage: message,
                userId: user._id.toString(),
                passwordToken: token
            })
        })
        .catch(err => {
            console.log(err);
        })

}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    User.findOne({
            resetToken: passwordToken,
            resetTokenExpiration: { $gt: Date.now() },
            _id: userId
        })
        .then(user => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        })
        .then(result => {
            res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
        });
};