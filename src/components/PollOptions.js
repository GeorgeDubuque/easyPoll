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


const PollOptions = () => {
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
            pollText += `😀 ${option.text} - ${option.tinyUrl}\n\n`
        });

        setGeneratedPoll(pollText);
        setIsPollGenerated(true);
    }

    const generateOptionLink = (pollId, optionId) => {
        var baseUrl = window.location.origin;
        return `${baseUrl}/vote?pollid=${pollId}&optionid=${optionId}`;
    }

    const requestSmallUrls = (linkToOptions) => {
        let batchUrlRequestBody = { items: [] };
        for (const [link, option] of Object.entries(linkToOptions)) {
            let currUrlItem = {
                operation: "create",
                url: link
            }
            batchUrlRequestBody.items.push(currUrlItem);
        }

        const API_TOKEN = '0LgSRMllWQj3Kd8biYAFCS27VbjzfgMKs67MgoYaeqO1PPkbXb3o58PP5Ic5';

        fetch("https://api.tinyurl.com/bulk", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_TOKEN}`
            },
            body: JSON.stringify(batchUrlRequestBody)
        })
            .then(response => response.json())
            .then(response => console.log("tinyUrl response: ", response));
    }

    const requestTinyUrl = async (longUrl) => {
        const API_TOKEN = '0LgSRMllWQj3Kd8biYAFCS27VbjzfgMKs67MgoYaeqO1PPkbXb3o58PP5Ic5';
        let tinyUrl;
        try {

            const response = await fetch("https://api.tinyurl.com/create", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_TOKEN}`
                },
                body: JSON.stringify({
                    url: longUrl
                })
            })

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseJson = await response.json();

            const data = responseJson.data.tiny_url; // or response.text() if you expect plain text
            return data; // Return the fetched data
        } catch (error) {
            // Handle errors here
            console.error('Fetch error:', error);
            throw error; // Re-throw the error to propagate it to the caller
        }
    }

    const createPoll = async () => {

        // generate user id if not in cookies otherwise get from cookies
        let userId = getOrSetUserId();

        const createPollParams = {
            input: { description: description, creatorId: userId }
        }

        const createPollResult = await API.graphql(
            graphqlOperation(createPollMutation, createPollParams)
        );

        const poll = createPollResult.data.createPoll;

        console.log(`Create poll response: ${createPollResult}`);
        console.log(`Poll: ${poll}`);

        //let tinyUrlDict = requestSmallUrls(poll, options);
        let optionsToCreate = [];
        for (let option of options) {
            let optionId = uuidv4();
            let longUrl = generateOptionLink(poll.id, optionId);
            const tinyUrl = await requestTinyUrl(longUrl);

            const optionParams = {
                id: optionId,
                text: option.text,
                numVotes: 0,
                tinyUrl: tinyUrl,
                longUrl: longUrl,
                voters: [],
                pollId: poll.id
            }

            optionsToCreate.push(optionParams);
        }

        let optionsList = [];

        for (let option of optionsToCreate) {
            let optionParams = {
                input: option
            }
            console.log("inserting option: ", optionParams);
            const createOptionResult = await API.graphql(
                graphqlOperation(createOptionMutation, optionParams)
            );
            optionsList.push(createOptionResult.data.createOption);
            console.log(createOptionResult);
        }


        generatePollText(poll, optionsList);
    }

    const copyGeneratedPollIntoClipboard = () => {
        copy(generatedPoll);
    }

    return (
        <Box overflow='auto' fill>
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
        </Box>
    );
}

export default PollOptions;