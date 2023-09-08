import React from "react";
import { getVotePercent } from "../utility/utilities";
import { Box, Text, Tip } from "grommet";

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

const PollBar = ({ option, totalVotes }) => {
    const votePercent = getVotePercent(option.numVotes, totalVotes);
    return (

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
                            width: votePercent + "%",
                            backgroundColor: votePercent > 0 ? "#30a3f0" : "",
                            position: 'absolute',
                            height: '100%',
                            boxShadow: `2px 0 5px 0 #000000, 
                                        0 0 0 0 transparent, 
                                        0 0 0 0 transparent, 
                                        0 0 0 0 transparent`
                        }}
                        round
                    >

                    </Box>
                    <Box fill align='start' margin='small' style={{ zIndex: 1 }}>{option.text}</Box>
                    <Box fill align='end' margin='small' style={{ zIndex: 1 }}>
                        {votePercent + "%"}
                    </Box>
                </Box>
            </Tip>
        </Box>
    )
}

export default PollBar;