import axios from "axios";

export async function confirmFriendRequest(
    token
) {
    try {
        const res = await axios.get("https://discord.com/api/v9/users/@me/relationships", {
            headers: {
                "authorization": token,
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36"
            }
        });
        if (res.status === 200) {
            const ExtractedUsers = res.data.filter(user => user.type === 3);
            return {
                status: "success",
                ExtractedUsers
            }
        } else {
            return {
                status: "error",
                message: res.statusText
            }
        }
    } catch (e) {
        return {
            status: "error",
            message: e.message
        }
    }
};