let dbCon = require('../lib/db');



const getImagePath = (postId, callback) => {

    let from_b = {
        post_id: postId
    }
    dbCon.query('SELECT * FROM post WHERE post_id = ?', [from_b.post_id], (err, rows) => {
        if (err) {
            return callback(err, null);
        }
        if (rows.length > 0) {
            return callback(null, rows[0].post_img);
        } else {
            console.log("----------> err : ", err);
            return callback(new Error("No image found"), null);
        }
    });
};

const getImagePath_b = (postId, callback) => {

    let from_b = {
        post_id: postId
    }
    dbCon.query(`SELECT post.*, market.*
    FROM post
    JOIN market ON post.market_id = market.market_id 
    WHERE post_id = ?
    `, [from_b.post_id], (err, rows) => {
        if (err) {
            return callback(err, null);
        }
        if (rows.length > 0) {
            return callback(null, rows[0].mk_img);
        } else {
            console.log("----------> err : ", err);
            return callback(new Error("No image found"), null);
        }
    });
};

module.exports = { getImagePath,getImagePath_b };