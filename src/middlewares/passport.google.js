const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const pool = require("../configs/db.config");

const createUser = (body, done) => {
    pool.query("SELECT * FROM users WHERE email = $1", [body.email]).then((user) => {
        if (user.rowCount > 0) {
            done(null, user.rows[0]);
        } else {
            pool.query("INSERT INTO users(first_name, last_name, email) VALUES($1, $2, $3)", [
                body.first_name,
                body.last_name,
                body.email
            ]).then((user) => {
                done(null, user.rows[0]);
            });
        }
    });
};

passport.use(
    new GoogleStrategy(
        {
            callbackURL: "/api/v1/auth/google/redirect",
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET
        },
        function (accessToken, refreshToken, profile, done) {
            const body = {
                email: profile.emails[0].value,
                first_name: profile.name.givenName,
                last_name: profile.name.familyName
            };
            createUser(body, done);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    pool.query("SELECT * FROM users WHERE id = $1", [id])
        .then((response) => {
            const user = response.rows[0];
            done(null, user);
        })
        .catch((error) => {
            done(error, null);
        });
});
