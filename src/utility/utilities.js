
import { v4 as uuidv4 } from 'uuid'; // Import UUID generator
import Cookies from 'universal-cookie';

export const getOrSetUserId = () => {
    const cookies = new Cookies();
    let userId = cookies.get("userId");
    if (!userId) {
        userId = uuidv4();
        cookies.set("userId", userId, { maxAge: 100000 });
    }
    return userId;
}


export const getVotePercent = (numVotes, totalVotes) => {
    return totalVotes > 0 ? ((numVotes / totalVotes) * 100).toFixed(1) : 0;
}
