const cookieSession = require('cookie-session');

module.exports = cookieSession({
  name: 'session',  // ชื่อของคุกกี้
  keys: ['key1', 'key2'],  // คีย์ที่ใช้ในการเข้ารหัสคุกกี้
  maxAge:  3600 * 1000,  // เวลาที่คุกกี้มีอายุ (1 ชั่วโมง)
});
