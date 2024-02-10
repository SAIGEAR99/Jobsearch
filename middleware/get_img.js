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



const getImageMk = (userId, callback) => {

    let from_b = {
        user_id: userId
    }
    dbCon.query(`SELECT market.*
    FROM market
    INNER JOIN user ON market.market_id = user.market_id
    WHERE user.user_id = ?
    
    `, [from_b.user_id], (err, rows) => {
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


const getImageMk2 = (mkId, callback) => {

    let from_b = {
        market_id: mkId
    }
    dbCon.query(`SELECT market.*
    FROM market
    
    WHERE market_id = ?
    
    `, [from_b.market_id], (err, rows) => {
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

const getImageMk3 = (mkId, callback) => {

    let from_b = {
        market_id: mkId
    }
    dbCon.query(`SELECT market.*
    FROM market
    
    WHERE market_id = ?
    
    `, [from_b.market_id], (err, rows) => {
        if (err) {
            return callback(err, null);
        }
        if (rows.length > 0) {
            return callback(null, rows[0].mk_cover);
        } else {
            console.log("----------> err : ", err);
            return callback(new Error("No image found"), null);
        }
    });
};


const getImageMk4 = (mkId, callback) => {

    let from_b = {
        market_id: mkId
    }
    dbCon.query(`SELECT board.*, market.*
    FROM board
    JOIN market ON board.market_id = market.market_id
    WHERE board.board_id = ?
    
    
    
    `, [from_b.market_id], (err, rows) => {
        if (err) {
            return callback(err, null);
        }
        if (rows.length > 0) {
            return callback(null, rows[0].board_img);
        } else {
            console.log("----------> err : ", err);
            return callback(new Error("No image found"), null);
        }
    });
};



const getImageMk5 = (mkId, callback) => {

    let from_b = {
        market_id: mkId
    }
    dbCon.query(`SELECT board.*, market.*, hire.*
    FROM board
    JOIN market ON board.market_id = market.market_id
    JOIN hire ON board.hire_id = hire.hire_id
    WHERE board.board_id = ?;
    

    `, [from_b.market_id], (err, rows) => {
        if (err) {
            return callback(err, null);
        }
        if (rows.length > 0) {
            return callback(null, rows[0].hire_img);
        } else {
            console.log("----------> err : ", err);
            return callback(new Error("No image found"), null);
        }
    });
};



module.exports = { getImagePath,getImagePath_b,getImageMk ,getImageMk2,getImageMk3,getImageMk4,getImageMk5};