var express = require('express');
var router = express.Router();
let dbCon = require('../lib/db');
const sessionConfig = require('../middleware/session-config')
const { formatDate, calculateAge } = require('../middleware/cal_Date_Age');


router.use(sessionConfig);


// แยกสิทธ์
router.get('/feed', function(req, res, next) {
  console.log('----> req.session.user in =: ', req.session.user);
  res.render('market/feed_market', { user: req.session.user});
});

router.get('/profile', (req, res, next) => {

    const user = req.session.user;
   
    dbCon.query(`SELECT user.*, market.*, role.*, typebusiness.*,gender.*,role.role AS role_name,gender.gender AS gender_name
    FROM user
    JOIN market ON user.market_id = market.market_id
    JOIN role ON user.role = role.role_id
    JOIN typebusiness ON market.market_type = typebusiness.business_id
    JOIN gender ON user.gender = gender.gender_id
    WHERE user.username = ?`
    ,user ,(err, rows) => {
         if (err) {
             console.error('Error retrieving data:', err);
             res.render('market/edit_market', { 
                formatDate , calculateAge,
                rows : rows ,
                user: req.session.user 
            });
         } else {
             console.log('Data from the database:', rows);
             res.render('market/edit_market', {
                formatDate , calculateAge,
                rows : rows ,
                user: req.session.user
            });
         }
     });
 });

  
  router.get('/profile/business', (req, res, next) => {
  
      const user = req.session.user;
     
      dbCon.query(`SELECT user.*, market.*, role.*, typebusiness.*,gender.*,role.role AS role_name,gender.gender AS gender_name
      FROM user
      JOIN market ON user.market_id = market.market_id
      JOIN role ON user.role = role.role_id
      JOIN typebusiness ON market.market_type = typebusiness.business_id
      JOIN gender ON user.gender = gender.gender_id
      WHERE user.username = ?`
      ,user ,(err, rows) => {
           if (err) {
               console.error('Error retrieving data:', err);
               res.render('market/edit_business', { 
                  formatDate , calculateAge,
                  rows : rows ,
                  user: req.session.user 
              });
           } else {
               console.log('Data from the database:', rows);
               res.render('market/edit_business', {
                  formatDate , calculateAge,
                  rows : rows ,
                  user: req.session.user
              });
           }
       });
   });


module.exports = router;
