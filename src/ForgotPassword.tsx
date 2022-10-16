import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  TextField,
} from "@mui/material";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

export default function AlertDialog() {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [toastOpen, setToastOpen] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState("");

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => {
          setOpen(true);
        }}
        color="secondary"
        fullWidth
      >
        Forgot Password?
      </Button>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Send Password Reset?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            A password reset will be sent to the following email:
          </DialogContentText>
          <TextField
            id="outlined-basic"
            label="Email"
            type="email"
            variant="outlined"
            style={{width: '100%'}}
            onChange={(event) => {
              const email = event.target.value;
              setEmail(email);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              console.log("sending email to: ", email);
              try {
                await firebase.auth().sendPasswordResetEmail(email);
                setOpen(false);
                setToastOpen(true);
                setToastMessage("Password reset email sent!");
              } catch (error) {
                setToastOpen(true);
                setToastMessage((error as any)?.message ?? "");
              }
            }}
            color="primary"
            autoFocus
          >
            Send Email
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={toastOpen}
        onClose={() => {
          setToastOpen(false);
          setToastOpen(false);
        }}
        autoHideDuration={6000}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        message={toastMessage}
      ></Snackbar>
    </>
  );
}