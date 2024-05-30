import axios from 'axios';

export const getUserIdFromLocalStorage = () => {
    return localStorage.getItem('userId');
};

export const getEmployeeAccess = async (userId) => {
    try {
        const response = await axios.get(`http://localhost:7775/access/find_access/${userId}`);
        console.log('응답 데이터:', response.data); // 서버 응답 데이터 출력
        
        const accessIds = response.data
            .filter(item => item.accessRight.accessId >= 1 && item.accessRight.accessId <= 21)
            .map(item => item.accessRight.accessId);

        if (accessIds.length > 0) {
            return accessIds;
        } else {
            console.error('사용자의 accessId가 허용된 범위에 없음');
            throw new Error('사용자의 accessId가 허용된 범위에 없음');
        }
    } catch (error) {
        console.error('사용자 권한 조회 중 오류:', error);
        throw error;
    }
};

export const requirePermission = (requiredAccessId) => {
    return async (to, from, next) => {
        try {
            const userId = getUserIdFromLocalStorage();
            if (!userId) {
                console.error('LocalStorage에서 userId를 가져올 수 없음');
                alert('접근이 거부되었습니다.');
                return next(false);
            }

            const accessIds = await getEmployeeAccess(userId);

            if (accessIds.includes(requiredAccessId)) {
                next();
            } else {
                alert('접근이 거부되었습니다.');
                next(false);
            }
        } catch (error) {
            console.error('사용자 권한 확인 중 오류:', error);
            alert('접근이 거부되었습니다.');
            next(false);
        }
    };
};