import React, { useEffect, useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { listPollsByCreator } from '../graphql/queries';
import Cookies from 'universal-cookie';
import { Box, Grid } from 'grommet';

function ViewPolls({ creatorId }) {
    const [polls, setPolls] = useState([]);
    const [error, setError] = useState(null);
    const cookies = new Cookies();

    useEffect(() => {
        async function fetchPolls() {
            try {
                const userId = cookies.get("userId")
                const response = await API.graphql(graphqlOperation(listPollsByCreator, { creatorId: userId }));
                if (response.data.listPolls && response.data.listPolls.items) {
                    console.log("Retrieved Polls: ", response.data.listPolls.items);
                    setPolls(response.data.listPolls.items);
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

    const buildPoll = (poll) => {
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
        <Grid>
            {polls.map(poll => (
                buildPoll(poll)
            ))}
        </Grid>
    );
}

export default ViewPolls;
