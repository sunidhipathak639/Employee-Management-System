import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { notifyError } from '../notify';

/**
 * Compact centered confirmation modal (including on mobile — not full-screen).
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {() => void | Promise<void>} props.onConfirm
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {string} [props.confirmLabel]
 * @param {string} [props.cancelLabel]
 * @param {'error' | 'primary' | 'warning'} [props.confirmColor]
 */
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  confirmColor = 'error',
}) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) setLoading(false);
  }, [open]);

  const handleConfirm = useCallback(async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (e) {
      notifyError(e?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [onConfirm, onClose]);

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby="confirm-dialog-title"
      aria-describedby={description ? 'confirm-dialog-description' : undefined}
      scroll="paper"
      sx={{
        zIndex: (t) => t.zIndex.modal + 2,
        '& .MuiDialog-container': { alignItems: 'center', py: { xs: 1, sm: 2 } },
      }}
      PaperProps={{
        sx: {
          borderRadius: 2,
          m: { xs: 1.5, sm: 2 },
          width: { xs: 'calc(100% - 24px)', sm: '100%' },
          maxWidth: { xs: 360, sm: 400 },
          maxHeight: { xs: 'min(280px, calc(100vh - 32px))', sm: 'min(320px, calc(100vh - 48px))' },
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle
        id="confirm-dialog-title"
        sx={{
          fontWeight: 800,
          fontSize: '1.05rem',
          lineHeight: 1.35,
          px: 2.5,
          pt: 2,
          pb: description ? 1 : 0.5,
          flexShrink: 0,
        }}
      >
        {title}
      </DialogTitle>
      {description ? (
        <DialogContent
          id="confirm-dialog-description"
          sx={{
            px: 2.5,
            pt: 0,
            pb: 1,
            flex: '1 1 auto',
            minHeight: 0,
            overflowY: 'auto',
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
            {description}
          </Typography>
        </DialogContent>
      ) : null}
      <DialogActions
        sx={{
          px: 2,
          pb: `max(12px, env(safe-area-inset-bottom, 0px))`,
          pt: 1,
          gap: 1,
          flexShrink: 0,
          justifyContent: 'flex-end',
        }}
      >
        <Button onClick={onClose} color="inherit" disabled={loading} sx={{ fontWeight: 600 }} size="small">
          {cancelLabel}
        </Button>
        <Button
          variant="contained"
          color={confirmColor}
          onClick={handleConfirm}
          disabled={loading}
          size="small"
          sx={{ fontWeight: 700, minWidth: 88 }}
        >
          {loading ? '…' : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
