import { Typography, TypographyProps } from '@mui/material';

interface CustomFormLabelProps extends TypographyProps {
  htmlFor?: string;
}

export default function CustomFormLabel({ children, htmlFor, ...props }: CustomFormLabelProps) {
  return (
    <Typography
      component="label"
      htmlFor={htmlFor}
      variant="subtitle2"
      fontWeight={600}
      color="textPrimary"
      mb={1}
      display="block"
      {...props}
    >
      {children}
    </Typography>
  );
}
