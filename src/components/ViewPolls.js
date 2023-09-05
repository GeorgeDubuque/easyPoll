import React, { useEffect, useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { pollsByDate } from '../graphql/queries';
import { Box, Grid } from 'grommet';
import { getOrSetUserId } from '../utility/utilities';

function ViewPolls({ creatorId }) {
    const [polls, setPolls] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchPolls() {
            try {
                const userId = getOrSetUserId();
                const response = await API.graphql(graphqlOperation(pollsByDate, { creatorId: userId, sortDirection: "DESC" }));
                if (response.data.pollsByDate && response.data.pollsByDate.items) {
                    console.log("Retrieved Polls: ", response.data.pollsByDate.items);
                    setPolls(response.data.pollsByDate.items);
                } else {
                    // Handle the case where no polls are returned
                    setPolls([]);
                }
            } catch (error) {
                console.error('Error fetching polls:', error);
                setError(error); // Store the error in state for rendering
            }
        }

        fetchPolls();
    }, [creatorId]);

    const getTotalVotesOnPoll = (poll) => {
        let totalVotes = 0;
        for (let option of poll.options.items) {
            totalVotes += option.numVotes;
        }

        return totalVotes;
    }

    const listPolls = () => {
        let listedPolls = [];
        for (let poll of polls) {
            const totalVotes = getTotalVotesOnPoll(poll);
            listedPolls.push(listPoll(poll, totalVotes))
        }

        return listedPolls;
    }

    const listPoll = (poll, totalVotes) => {
        const options = poll.options.items;
        const numOptions = poll.options.items.length;
        return (
            <Grid margin="medium" gap="small">
                <h3>{poll.description}</h3>
                {
                    options.map((option) => (
                        (
                            <Box style={{width: "100%"}} background="dark-1" round>
                                <Box 
                                    style={{
                                        width: (option.numVotes/totalVotes)*100 + "%", 
                                        backgroundColor: (option.numVotes/totalVotes > 0 ? "#30a3f0" : "")
                                    }} 
                                    round
                                    pad="2%"
                                >
                                    {option.text}
                                </Box>
                            </Box>
                        )
                    ))
                }
            </Grid>
        )
    }

    if (error) {
        return <div>Error fetching polls: {error.message}</div>;
    }

    return (
        <Box fill overflow="scroll">
            <Grid>
                {listPolls()}
            </Grid>
        </Box>
    );
}

export default ViewPolls;
