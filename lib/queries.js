import axios from "axios";
import Jsona from "jsona";

export const searchRequest = async (query) => {
    console.log('Searching')
    const dataFormatter = new Jsona()
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/users.json`,
            {
                headers: {
                    Authorization: localStorage.token,
                    'Content-type': 'application/json',
                },
                params: { search: query },
            },
        )

        const users = dataFormatter.deserialize(response.data.data)
        const updatedUserOptions = users.map((user) => ({
            value: user.id,
            label: `${user.first_name} ${user.last_name}`,
        }))

        return updatedUserOptions
    } catch (error) {
        console.log(error)
        return []
    }
}

export const fetchUsers = async () => {
    const dataFormatter = new Jsona()

    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/users.json`,
            { headers: { Authorization: localStorage.token } },
        )
        const users = dataFormatter.deserialize(response.data.data)
        const userOptions = users.map((user) => ({
            value: user.id,
            label: `${user.first_name} ${user.last_name}`,
        }))

        return userOptions
    } catch (error) {
        console.log(error)
        return []
    }
}