var express = require('express');
var router = express.Router();
let dbCon = require('../lib/db');


router.get('/api', (req, res) => {
    const query = req.query.query;
    
  
    // ดำเนินการค้นหาข้อมูลในฐานข้อมูล MySQL
    dbCon.query(`SELECT 
    subdistricts.name_in_thai AS subdistrict_name,
    subdistricts.zip_code,
    districts.name_in_thai AS district_name,
    provinces.name_in_thai AS province_name
FROM 
    subdistricts
JOIN 
    districts ON subdistricts.district_id = districts.id
JOIN 
    provinces ON districts.province_id = provinces.id
WHERE 
    subdistricts.name_in_thai LIKE ? 
LIMIT 5;

`,[query + '%'], (err, results) => {
      if (err) {
        console.error('มีข้อผิดพลาดในการค้นหาข้อมูล: ' + err.message);
        return;
      }
  
      // ส่งข้อมูลผลลัพธ์กลับในรูปแบบ JSON
      res.json({ results });
      console.log(results);
    });
  });

  router.get('/api2', (req, res) => {
    const query = req.query.query;
    
  
    // ดำเนินการค้นหาข้อมูลในฐานข้อมูล MySQL
    dbCon.query('SELECT * FROM subdistricts WHERE zip_code LIKE ? LIMIT 5',[query + '%'], (err, results) => {
      if (err) {
        console.error('มีข้อผิดพลาดในการค้นหาข้อมูล: ' + err.message);
        return;
      }
  
      // ส่งข้อมูลผลลัพธ์กลับในรูปแบบ JSON
      res.json({ results });
      console.log(results);
    });
  });



module.exports = router;
