import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { Box } from '@mui/material';
import { SxProps } from '@mui/system';
import { styled } from '@mui/material/styles';
import { useMediaQuery, useTheme } from '@mui/material';

const SimpleBarStyle = styled(SimpleBar)(() => ({
  maxHeight: '100%',
}));

interface PropsType {
  children: React.ReactElement | React.ReactNode;
  sx?: SxProps;
  [key: string]: any;
}

const Scrollbar = (props: PropsType) => {
  const { children, sx, ...other } = props;
  const theme = useTheme();
  const lgDown = useMediaQuery(theme.breakpoints.down('lg'));

  if (lgDown) {
    return <Box sx={{ overflowX: 'auto', ...sx }}>{children}</Box>;
  }

  return (
    <SimpleBarStyle
      sx={sx}
      {...other}
    >
      {children}
    </SimpleBarStyle>
  );
};

export default Scrollbar;
