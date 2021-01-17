import React, { useState } from "react";
import { DialogForm } from "components/DialogForm";
import { Button } from "@material-ui/core";

export const ConfirmationDialog = ({
  cancelLabel, continueLabel,
  onContinue, onCancel,
  callback, onClose,
  ...rest
}) => {
  const [loading, setLoading] = useState();

  const continueWrapper = async () => {
    setLoading(true);
    if (onContinue) await onContinue();
    setLoading(false);
    onClose();
  };

  const onCloseWrapper = async () => {
    setLoading(true);
    if (onCancel) await onCancel();
    setLoading(false);
    onClose();
  };

  return (
    <DialogForm
      cross
      open
      fullScreen={false}
      actions={(
        <>
          <Button
            disabled={loading}
            onClick={onCloseWrapper}
          >
            {cancelLabel || "Cancel"}
          </Button>
          <Button
            disabled={loading}
            variant="contained"
            color="primary"
            onClick={continueWrapper}
          >
            {continueLabel || "Continue"}
          </Button>
        </>
      )}
      {...rest}
    />
  );
};
