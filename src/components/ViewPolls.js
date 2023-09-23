import React, { useEffect, useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { Box, Grid, Text, Tip } from 'grommet';
import { getOrSetUserId } from '../utility/utilities';
import { Info } from 'grommet-icons';
import PollBar from './PollBar';
import { pollsByDateWithOptions } from '../graphql/custom-queries';


const ViewPolls = ({ creatorId }) => {
    const [polls, setPolls] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchPolls() {
            try {
                const userId = getOrSetUserId();

                const response = await API.graphql(
                    graphqlOperation(pollsByDateWithOptions, { creatorId: userId, sortDirection: "DESC" })
                );

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

    const getVotePercent = (numVotes, totalVotes) => {
        return totalVotes > 0 ? ((numVotes / totalVotes) * 100).toFixed(1) : 0;
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
        return (
            <Grid margin="medium" gap="small" key={'poll-' + poll.id}>
                <h3>{poll.description}</h3>
                {
                    options.map((option) => (
                        (
                            <PollBar option={option} totalVotes={totalVotes}/>
                        )
                    ))
                }
                <Text size='small' color={'faint'}>{totalVotes} votes</Text>
            </Grid >
        )
    }

    if (error) {
        return <div>Error fetching polls: {error.message}</div>;
    }

    return (
        <Box overflow="auto">
            <Grid>
                {listPolls()}
            </Grid>
        </Box>
    );
}

export default ViewPolls;
