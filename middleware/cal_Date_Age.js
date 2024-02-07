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

    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };

    const date = new Date(dateString);
    if (isNaN(date)) return 'ไม่ระบุ';

    const currentTime = new Date();
    const timeDifference = currentTime - date;

    if (timeDifference < 60000) {
        return 'เมื่อสักครู่นี้';
    } else if (timeDifference < 3600000) {
        const minutesAgo = Math.floor(timeDifference / 60000);
        return `${minutesAgo} นาทีที่แล้ว`;
    } else if (timeDifference < 86400000) {
        const hoursAgo = Math.floor(timeDifference / 3600000);
        return `${hoursAgo} ชั่วโมงที่แล้ว`;
    } else {
        // ใช้ Intl.DateTimeFormat สำหรับรูปแบบวันที่
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const dateFormatter = new Intl.DateTimeFormat('th-TH', options);
        return dateFormatter.format(date);
    }
};



const formatTimeToZero = (timeString) => {
    if (!timeString) return '00:00';
    const parts = timeString.split(':'); // แยกเวลาออกเป็นส่วนๆ
    const hours = parts[0].padStart(2, '0'); // รับชั่วโมงและเติม 0 ถ้าต้องการ
    const minutes = parts[1].padStart(2, '0'); // รับนาทีและเติม 0 ถ้าต้องการ
    return `${hours}:${minutes}`;
};

module.exports = { formatDate, calculateAge,formatDate2 ,formatTimeToZero};
