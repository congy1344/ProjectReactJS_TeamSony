import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Snackbar, Alert } from "@mui/material";
import { hideNotification } from "../store/notificationSlice";

const Notification = () => {
  const { message, type, isOpen } = useSelector((state) => state.notification);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        dispatch(hideNotification());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, dispatch]);

  return (
    <Snackbar
      open={isOpen}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        severity={type}
        variant="filled"
        onClose={() => dispatch(hideNotification())}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
