const serverMessageSwitcher = (serverMessage?: string, serverMessageType?:string) => {
  switch (serverMessage){
    case 'logout-success':
      return {
        serverMessage: 'You have been logged out successfully',
        serverMessageType: 'success'
      }
    case 'not-logged-in-or-expired-session':
      return {
        serverMessage: 'You are not logged in or your session has expired',
        serverMessageType: 'error'
      }
    default:
      return {
        serverMessage,
        serverMessageType: serverMessageType || 'default'
      }
  }
}

export default serverMessageSwitcher;
