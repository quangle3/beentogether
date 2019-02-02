const passport = require('passport');
const passportFb = require('passport-facebook').Strategy;
const userModel = require('../user/model');

passport.use(new passportFb({
    clientID: "376141353189214",
    clientSecret: "fbaa5f3f1acf543e05ba4b35207672cd",
    callbackURL: "https://beentogether.herokuapp.com/api/auth/fb/cb",
    profileFields: ['email', 'displayName']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // let temp = JSON.parse(profile._raw);
        const user = await userModel.findOne({ id: profile._json.id });
        if (user) return done(null, user);
        const newUser = await userModel.create({
            id: profile._json.id,
            email: profile._json.email,
            username: profile._json.name,
            password: " ",
            birthday: " "
        })
        return done(null, newUser);
    } catch (error) {
        return done(error);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    userModel.findOne({ id }, (err, user) => {
        done(null, user);
    })
});