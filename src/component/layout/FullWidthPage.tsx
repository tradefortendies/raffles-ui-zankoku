import { Box, BoxProps } from '@material-ui/core';

import doodle from '../../assets/images/bg.png';

export default function FullWidthPage({ children, ...props }: BoxProps) {
	return (
		<Box
			{...props}
			display='flex'
			minHeight='100vh'
			justifyContent={'center'}
			alignItems='center'
			position={'relative'}
		>
			<img
				src={doodle}
				alt='doodle'
				style={{
					position: 'fixed',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
				}}
			/>

			{children}
		</Box>
	);
}
