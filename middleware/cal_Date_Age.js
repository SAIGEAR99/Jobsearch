// cal_Date_Age.js

// ฟังก์ชัน formatDate ซึ่งใช้ในการแปลงวันที่เป็นรูปแบบข้อความ
const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

// ฟังก์ชัน calculateAge ซึ่งใช้ในการคำนวณอายุ
const calculateAge = (birthday) => {
    if (!birthday) return '';
    const birthDate = new Date(birthday);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1;
    } else {
        return age;
    }
};

module.exports = { formatDate, calculateAge };
