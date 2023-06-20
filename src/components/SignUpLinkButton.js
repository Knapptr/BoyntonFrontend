import { Button } from "@mui/material"
import { useContext } from "react"
import  fetchWithToken from "../fetchWithToken"
import UserContext from "./UserContext"

const SignUpLinkButton = ({buttonProps,onGetToken})=>{
  const auth = useContext(UserContext)
  const getToken = async()=>{
    const url = "/api/sign-up-token"
    const response = await fetchWithToken(url,{},auth)
    const data = await response.json();
    const {token} = data;
    onGetToken(token)
  }
  return <Button  onClick={getToken} {...buttonProps} >Generate Sign-Up Link</Button>
}

export default SignUpLinkButton;
