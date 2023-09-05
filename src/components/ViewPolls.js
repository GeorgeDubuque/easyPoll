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

    const listPoll = (poll) => {
        const options = poll.options.items;
        return (
            <Box>
                <h3>{poll.description}</h3>
                {
                    options.map((option) => (
                        (
                            <p>{option.text}: {option.numVotes}</p>
                        )
                    ))
                }
            </Box>
        )
    }

    if (error) {
        return <div>Error fetching polls: {error.message}</div>;
    }

    return (
        <Box fill overflow="scroll">
            <Grid>
                {polls.map(poll => (
                    listPoll(poll)
                ))}
            </Grid>
        </Box>
    );
}

export default ViewPolls;
