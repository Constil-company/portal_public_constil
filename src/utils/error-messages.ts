export const    loginErrorMessages: Record<number, string> = {
    400: "Email or password may be incorrect.",
    401: "Unauthorized: Invalid credentials.",
    403: "Forbidden: You do not have permission.",
    404: "Email or password may be incorrect.",
    500: "Please try again late.",
    0:"Please try again late."
  };
  
  export function getLoginErrorMessage(statusCode: number): string {
    return loginErrorMessages[statusCode]
  }
  