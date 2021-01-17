import React from "react";
import shortid from "shortid";
import { ConfirmationDialog } from "./ConfirmationDialog";

const DialogContext = React.createContext();

export const DialogProvider = ({ children }) => {
  const [dialogs, setDialogs] = React.useState([]);

  const create = (options) => {
    const dialogId = shortid.generate();
    const dialog = { ...options, dialogId, open: true };
    setDialogs((ds) => [...ds, dialog]);
  };

  const closeDialog = (dialogId) => {
    const dialog = dialogs.find((d) => d.dialogId === dialogId);
    const onCloseFn = dialog?.onClose;
    if (onCloseFn) onCloseFn();
    setDialogs((ds) => ds.filter((d) => d.dialogId !== dialogId));
  };

  const confirm = (props) => new Promise((res) => {
    create({
      ...props,
      onContinue: () => res(true),
      onCancel: () => res(false)
    });
  });

  const contextValue = React.useRef({ create, confirm });

  return (
    <DialogContext.Provider value={contextValue.current}>
      {children}
      {dialogs.map(({ dialogId, ...props }) => {
        const DialogType = props.DialogType || ConfirmationDialog;
        return (
          <DialogType
            key={dialogId}
            {...props}
            onClose={() => closeDialog(dialogId)}
          />
        );
      })}
    </DialogContext.Provider>
  );
};

export const useDialog = () => React.useContext(DialogContext);

export const withDialogProvider = (Component) => () => (
  <DialogProvider>
    <Component />
  </DialogProvider>
);
