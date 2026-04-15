import { alpha } from '@mui/material/styles';

/**
 * Shared outlined field look for login/register (spacing + focus ring).
 * @param {import('@mui/material').Theme} theme
 */
export function authTextFieldSx(theme) {
  return {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.04) : alpha(theme.palette.common.black, 0.02),
      transition: theme.transitions.create(['box-shadow', 'border-color'], {
        duration: theme.transitions.duration.short,
      }),
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: alpha(theme.palette.primary.main, 0.45),
      },
      '&.Mui-focused': {
        boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.12)}`,
      },
    },
    '& .MuiInputLabel-root': {
      fontWeight: 500,
    },
  };
}
