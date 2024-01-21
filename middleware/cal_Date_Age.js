// cal_Date_Age.js

// ฟังก์ชัน formatDate ซึ่งใช้ในการแปลงวันที่เป็นรูปแบบข้อความ
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
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



const formatDate2 = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

module.exports = { formatDate, calculateAge,formatDate2 };
