var db = require("../models");
var Op = db.Sequelize.Op;

module.exports = function (app) {
  // read the info at this path

  app.get("/api/users", function (req, res) {

    // req.query is the result of the query
    console.log(req.query);
    db.User.findAll({
      where: {
        city: req.query.city
      }
    }).then(function (users) {
      console.log(users);
      res.json(users);
    });
  });

  // create
  app.post("/api/user/", function (req, res) {
    var matching;
    db.User.findAll({
      where: {
        [Op.or]: [{ city: req.body.city }, { country: req.body.country }],
      },
    }).then(function (matchingUsers) {
      temp = matchingUsers;
      console.log('here ---->', temp.length)
      // if there is a match, then do the for loop
      if (matchingUsers.length > 0) {
        for (var i = 0; i < matchingUsers.length; i++) {
          if (matchingUsers[i].city == req.body.city) {
            console.log('matching name:', matchingUsers[i].name, ': ', matchingUsers[i].city, 'city');
            // matching city is working. logging out matching city
          } else {
            console.log('Matching country: ', matchingUsers[i].country, 'matching name: ', matchingUsers[i].name);
          }
        }
      } else {
        // the else condition doesn't run
        console.log('No matches found!');
      };
    }).then(function() {
      db.User.create({
      name: req.body.name,
      city: req.body.city,
      photo: req.body.photo,
      age: req.body.age,
      lang: req.body.lang,
      country: req.body.country,
      secLang: req.body.secLang

    }).then(function (dbUser) {
      db.User.findAll({
        where: {
          [Op.or]: [{ city: req.body.city }, { country: req.body.country }],
        },

      }).then(function (matchingUsers) {
        console.log('here ---->')

        for (var i = 0; i < matchingUsers.length; i++) {
          if (matchingUsers[i].city == req.body.city) {
            console.log('matching name:', matchingUsers[i].name, ': ', matchingUsers[i].city, 'city');
            // matching city is working. logging out matching city


          } else {
            console.log('Matching country: ', matchingUsers[i].country, 'matching name: ', matchingUsers[i].name)
          }
        }

        res.json(matchingUsers);
      })

    });

  })
});
};
