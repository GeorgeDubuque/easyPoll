import React, { useEffect, useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { pollsByDate } from '../graphql/queries';
import { Box, Grid, Text, Tip } from 'grommet';
import { getOrSetUserId } from '../utility/utilities';
import { Info } from 'grommet-icons';

const TipContent = ({ message }) => (
    <Box direction="row">
        <Box direction="column">
            <Box margin={{ bottom: "-10px", left: "10px" }}>
                <svg viewBox="0 0 22 22" version="1.1" width="22px" height="22px">
                    <polygon
                        fill="grey"
                        points="2 6 12 18 22 6"
                        transform="rotate(180 11 11)"
                    />
                </svg>
            </Box>
            <Box background="grey" direction="row" pad="small" round="xsmall">
                <Text>{message}</Text>
            </Box>
        </Box>
    </Box>


);

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
        return (
            <Grid margin="medium" gap="small" key={'poll-' + poll.id}>
                <h3>{poll.description}</h3>
                {
                    options.map((option) => (
                        (
                            <Box justify='center' fill>
                                <Tip
                                    //dropProps={{ align: { left: 'right' } }}
                                    content={<TipContent message={option.numVotes + " votes"} />}
                                    plain
                                >
                                    <Box
                                        style={{ width: "100%", position: 'relative' }}
                                        background="dark-1"
                                        round
                                        direction='row'
                                        key={'option-' + option.id}
                                    >
                                        <Box
                                            style={{
                                                width: (option.numVotes / totalVotes) * 100 + "%",
                                                backgroundColor: (option.numVotes / totalVotes > 0 ? "#30a3f0" : ""),
                                                position: 'absolute',
                                                height: '100%',
                                                boxShadow: '2px 0 5px 0 #000000, 0 0 0 0 transparent, 0 0 0 0 transparent, 0 0 0 0 transparent'
                                            }}
                                            round
                                        >

                                        </Box>
                                        <Box fill align='start' margin='small' style={{ zIndex: 1 }}>{option.text}</Box>
                                        <Box fill align='end' margin='small' style={{ zIndex: 1 }}>{totalVotes > 0 ? option.numVotes / totalVotes * 100 + "%" : "0%"}</Box>
                                    </Box>
                                </Tip>
                            </Box>
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
        <Box fill overflow="scroll">
            <Grid>
                {listPolls()}
            </Grid>
        </Box>
    );
}

export default ViewPolls;
