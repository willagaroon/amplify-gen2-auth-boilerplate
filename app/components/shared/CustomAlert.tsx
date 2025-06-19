import React from 'react';
import { Alert, AlertTitle, AlertProps } from '@mui/material';

interface CustomAlertProps extends AlertProps {
  title?: string;
  children?: React.ReactNode;
}

export default function CustomAlert({
  title,
  children,
  severity = 'error',
  variant = 'filled',
  sx,
  ...props
}: CustomAlertProps) {
  return (
    <Alert
      variant={variant}
      severity={severity}
      sx={{
        borderRadius: 2,
        ...sx,
      }}
      {...props}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {children}
    </Alert>
  );
}
