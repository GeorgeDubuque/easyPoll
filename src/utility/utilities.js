
import { v4 as uuidv4 } from 'uuid'; // Import UUID generator
import Cookies from 'universal-cookie';

export const getOrSetUserId = () => {
    const cookies = new Cookies();
    let userId = cookies.get("userId");
    if (!userId) {
        userId = uuidv4();
        cookies.set("userId", userId);
    }
    return userId;
}

