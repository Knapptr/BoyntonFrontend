import { Button,  Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material"

const SignUpLinkDialog = ({open,onClose,url})=>{
  return <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
    <DialogTitle>Sign Up Link</DialogTitle>
    <DialogContent><Typography  variant="body2" component="span">{url}</Typography></DialogContent>
  <DialogActions>
    <Button variant="contained" color="warning" onClick={onClose} >Close</Button>
  </DialogActions>
    </Dialog>
}

export default SignUpLinkDialog
