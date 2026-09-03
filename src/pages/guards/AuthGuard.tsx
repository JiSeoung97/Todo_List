import useAuthStore, { selectIsAuthenticated } from '@/src/stores/common/authStore';
import { Navigate, Outlet, useLocation } from 'react-router';

/**
 * 로그인하지 않은 사용자의 접근을 차단한다.
 * 원래 가려던 경로를 state 로 넘겨 로그인 후 복귀에 활용할 수 있게 한다.
 */
const AuthGuard = () => {
	const isAuthenticated = useAuthStore(selectIsAuthenticated);
	const location = useLocation();

	if (!isAuthenticated) {
		return (
			<Navigate
				to='/login'
				replace
				state={{ from: `${location.pathname}${location.search}` }}
			/>
		);
	}

	return <Outlet />;
};

export default AuthGuard;
