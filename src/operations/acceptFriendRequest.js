import axios from "axios";

export async function acceptFriendRequest(
    token,
    user_id
) {
    try {
        const res = await axios.put(`https://discord.com/api/v9/users/@me/relationships/${user_id}`, {
            headers: {
                "authorization": token,
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36"
            }
        });
        if (res.status === 200) {
            return {
                status: "success",
                message: `Added as a friend: ${user_id}`
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
}