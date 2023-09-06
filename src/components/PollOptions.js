import { Box, Button, Grid, Paragraph, Text, TextInput } from 'grommet';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Import UUID generator
import copy from 'copy-to-clipboard';
import axios from 'axios';
import { API, graphqlOperation } from "aws-amplify";
import { listPolls } from "../graphql/queries";
import {
    createPoll as createPollMutation,
    createOption as createOptionMutation,
} from "../graphql/mutations";

import $ from 'jquery';
import { getOrSetUserId } from '../utility/utilities';


function PollOptions() {
    const [options, setOptions] = useState([]);
    const [isPollGenerated, setIsPollGenerated] = useState(false);
    const [generatedPoll, setGeneratedPoll] = useState("");
    const [description, setDescription] = useState("");

    const addOption = async () => {
        const newOption = { id: uuidv4(), text: '' }; // Generate unique ID
        setOptions([...options, newOption]);
    };

    const removeOption = (id) => {
        const updatedOptions = options.filter(option => option.id !== id);
        setOptions(updatedOptions);
    };

    const handleOptionChange = (id, newText) => {
        const updatedOptions = options.map(option =>
            option.id === id ? { ...option, text: newText } : option
        );
        setOptions(updatedOptions);
    };

    const handleDescriptionChange = (newDescription) => {
        setDescription(newDescription);
    };

    const generatePollText = (poll, optionsList) => {
        console.log(poll, optionsList);
        let pollText = "";
        optionsList.forEach(option => {
            pollText += `😀 ${option.text} - ${generateOptionLink(poll.id, option.id)}\n\n`
        });

        setGeneratedPoll(pollText);
        setIsPollGenerated(true);
    }

    const generateOptionLink = (pollId, optionId) => {
        var baseUrl = window.location.origin;
        return `${baseUrl}/vote?pollid=${pollId}&optionid=${optionId}`;
    }

    const createPoll = async () => {

        // generate user id if not in cookies otherwise get from cookies
        let userId = getOrSetUserId();

        const createPollParams = {
            input: { description: description, creatorId: userId }
        }

        const createPollResult = await API.graphql(graphqlOperation(createPollMutation, createPollParams));
        const poll = createPollResult.data.createPoll;
        console.log(`Create poll response: ${createPollResult}`);
        console.log(`Poll: ${poll}`);

        let optionsList = [];
        for (let option of options) {
            const optionParams = {
                input: {
                    text: option.text,
                    numVotes: 0,
                    voters: [],
                    pollId: poll.id
                }
            }
            const createOptionResult = await API.graphql(graphqlOperation(createOptionMutation, optionParams));
            optionsList.push(createOptionResult.data.createOption);
            console.log(createOptionResult);
        }


        generatePollText(poll, optionsList);
    }

    const copyGeneratedPollIntoClipboard = () => {
        copy(generatedPoll);
    }

    return (
        <Grid pad="medium" gap="medium" >
            <Text color='white'>easy poll</Text>
            <TextInput
                className='descriptionTitle'
                placeholder={description === "" ? "What is your favorite color?" : ""}
                value={description}
                onChange={e => handleDescriptionChange(e.target.value)}
                autoFocus={true}
            />
            {options.map((option, index) => (
                <Box key={option.id} direction='row'>
                    <TextInput
                        className='optionInput'
                        placeholder={option.text === "" ? "Option " + (index + 1) : ""}
                        value={option.text}
                        onChange={e => handleOptionChange(option.id, e.target.value)}
                    />
                    <Button onClick={() => removeOption(option.id)} label="x" />
                </Box>
            ))}
            <Button primary onClick={addOption} label="Add Option" />
            <Button primary onClick={createPoll} label="Generate Poll" />

            {/* Display generated poll text. */}
            {isPollGenerated ? (
                <Box>
                    <textarea
                        readOnly
                        style={{ resize: "none" }}
                        rows={options.length * 3}
                        value={generatedPoll}
                    />
                    <Button primary onClick={copyGeneratedPollIntoClipboard} label="Copy Link" />
                </Box>
            ) : (
                ""
            )}
        </Grid>
    );
}

export default PollOptions;