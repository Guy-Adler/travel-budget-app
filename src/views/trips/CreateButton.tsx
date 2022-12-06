/* eslint-disable react/jsx-props-no-spreading */
import React, { ReactElement, useContext } from 'react';
import { styled } from '@mui/material/styles';
import { Fab, useMediaQuery, Theme } from '@mui/material';
import ContentAdd from '@mui/icons-material/Add';
import { useTranslate, Button, ButtonProps } from 'react-admin';
import DialogContext from './DialogContext';

const PREFIX = 'RaCreateButton';

export const CreateButtonClasses = {
  floating: `${PREFIX}-floating`,
};

const StyledFab = styled(Fab, {
  name: PREFIX,
  overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
  [`&.${CreateButtonClasses.floating}`]: {
    color: theme.palette.getContrastText(theme.palette.primary.main),
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 60,
    left: 'auto',
    position: 'fixed',
    zIndex: 1000,
  },
})) as unknown as typeof Fab;

const defaultIcon = <ContentAdd />;

/**
 * Opens the Create view of a given resource
 *
 * Renders as a regular button on desktop, and a Floating Action Button
 * on mobile.
 *
 * @example // basic usage
 * import { CreateButton } from 'react-admin';
 *
 * const CommentCreateButton = () => (
 *     <CreateButton label="Create comment" />
 * );
 */
const CreateButton = (props: CreateButtonProps) => {
  const {
    className,
    icon = defaultIcon,
    label = 'ra.action.create',
    variant,
  } = props;

  const translate = useTranslate();
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const dialogContext = useContext(DialogContext);

  return isSmall ? (
    <StyledFab
      color="primary"
      className={`${CreateButtonClasses.floating}${
        className ? ` ${className}` : ''
      }`}
      aria-label={label && translate(label)}
      onClick={() => dialogContext[1](true)}
    >
      {icon}
    </StyledFab>
  ) : (
    <Button
      className={className}
      label={label}
      variant={variant}
      onClick={() => dialogContext[1](true)}
    >
      {icon}
    </Button>
  );
};

export default CreateButton;

interface Props {
  resource?: string;
  icon?: ReactElement;
}

export type CreateButtonProps = Props & ButtonProps;
