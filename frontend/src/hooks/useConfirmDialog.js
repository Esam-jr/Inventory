import { useState } from "react";

const useConfirmDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({});

  const openDialog = (config) => {
    setDialogConfig(config);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setDialogConfig({});
  };

  const ConfirmDialogComponent = () => (
    <ConfirmDialog
      open={dialogOpen}
      onClose={closeDialog}
      onConfirm={() => {
        dialogConfig.onConfirm?.();
        closeDialog();
      }}
      title={dialogConfig.title}
      message={dialogConfig.message}
      confirmText={dialogConfig.confirmText}
      cancelText={dialogConfig.cancelText}
      severity={dialogConfig.severity}
      loading={dialogConfig.loading}
    />
  );

  return {
    openDialog,
    closeDialog,
    ConfirmDialogComponent,
  };
};

export default useConfirmDialog;
