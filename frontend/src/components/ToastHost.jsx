import { Alert, Snackbar } from '@mui/material';
import { useToastStore } from '../store/toastStore';

/**
 * Renders queued toasts from {@link ../store/toastStore}. Mount once inside {@link ThemeProvider}.
 */
export default function ToastHost() {
  const items = useToastStore((s) => s.items);
  const dismiss = useToastStore((s) => s.dismiss);
  const current = items[0];

  return (
    <Snackbar
      key={current?.id}
      open={Boolean(current)}
      autoHideDuration={6000}
      onClose={(_, reason) => {
        if (reason === 'clickaway') return;
        if (current) dismiss(current.id);
      }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{ zIndex: (t) => t.zIndex.snackbar }}
    >
      {current ? (
        <Alert
          severity={current.severity}
          variant="filled"
          elevation={6}
          onClose={() => dismiss(current.id)}
          sx={{ width: '100%', alignItems: 'center' }}
        >
          {current.message}
        </Alert>
      ) : (
        <span />
      )}
    </Snackbar>
  );
}
