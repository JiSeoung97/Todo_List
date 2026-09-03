import CloseIcon from '@mui/icons-material/Close';
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	type Breakpoint,
} from '@mui/material';
import type { ReactNode } from 'react';

interface IProps {
	open: boolean;
	onClose: () => void;
	title: string;
	children: ReactNode;
	/** 하단 버튼 영역 — 없으면 렌더링하지 않는다 */
	actions?: ReactNode;
	maxWidth?: Breakpoint;
}

/**
 * 공통 모달 — MUI Dialog 를 감싸 제목·닫기 버튼·액션 영역의 배치만 고정한다.
 * ESC / 배경 클릭 / 포커스 트랩은 Dialog 가 처리한다.
 */
const Modal = ({ open, onClose, title, children, actions, maxWidth = 'sm' }: IProps) => (
	<Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
		<DialogTitle className='flex items-center justify-between gap-4'>
			{title}
			<IconButton onClick={onClose} aria-label='닫기' size='small'>
				<CloseIcon fontSize='small' />
			</IconButton>
		</DialogTitle>

		<DialogContent dividers>{children}</DialogContent>

		{actions && <DialogActions>{actions}</DialogActions>}
	</Dialog>
);

export default Modal;
