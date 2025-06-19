declare module 'simplebar-react' {
  import { ComponentType, ReactNode } from 'react';
  import { SxProps } from '@mui/system';

  interface SimpleBarProps {
    children: ReactNode;
    sx?: SxProps;
    [key: string]: any;
  }

  const SimpleBar: ComponentType<SimpleBarProps>;
  export default SimpleBar;
}

declare module 'simplebar-react/dist/simplebar.min.css';
