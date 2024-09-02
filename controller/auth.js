const User = require('../modles/user');
const bcrypt = require('bcryptjs');
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
        }))



    }).catch(err => {
        console.log(err);
    })


};