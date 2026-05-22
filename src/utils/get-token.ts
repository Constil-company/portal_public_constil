
export function getToken(){
    const tokenData = JSON.parse(sessionStorage.getItem("authToken") || "{}");
    const accessToken = tokenData.accessToken || "";
    return accessToken;
}