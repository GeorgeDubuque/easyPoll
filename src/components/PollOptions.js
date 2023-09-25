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
import { generatePollText, getOrSetUserId } from '../utility/utilities';
import { Add, AddCircle, Close, FormAdd, FormClose, Trash } from 'grommet-icons';
import { Icon } from '@aws-amplify/ui-react';


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

        console.log(`poop`);


        // Make a GET request to your serverless function
        const apiUrl = 'https://xfm6ahnlme.execute-api.us-west-2.amazonaws.com/default/easyPollBulkRequestTinyUrl-staging';

        const baseUrl = window.location.origin;

        // Data to send in the request body (assuming it's in JSON format)
        const requestData = {
            baseUrl,
            options,
            poll
        };
        console.log('requestData:', requestData);

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Specify the content type as JSON
            },
            body: JSON.stringify(requestData), // Convert data to JSON string
        });

        if (!response.ok) {
            throw new Error(`Error calling the tiny url lambda functions ${response.status}`);
        }

        const responseJson = await response.json();
        console.log("responseJson: ", responseJson);

        let optionsToCreate = responseJson.body.optionsToCreate;

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


        const pollText = generatePollText(poll, optionsList);

        setGeneratedPoll(pollText);
        setIsPollGenerated(true);
    }

    const copyGeneratedPollIntoClipboard = () => {
        copy(generatedPoll);
    }

    return (
        <Grid overflow='auto' dir='vertical' gap={'small'}>
            <Box basis='small' background={'dark'}>
                <Box align='center' pad='large' gap='medium'>
                    <Text size='large' weight={'bold'} >Create a Poll</Text>
                    <Text size='small' textAlign='center' color={'secondary'}>Fill in the fields below to create a poll.</Text>
                </Box>
                <Box background='bright' width='120%' height='5px'></Box>
            </Box>
            <Grid gap="small" pad={'small'} fill>
                <TextInput
                    style={{
                        fontWeight: 'normal'
                    }}
                    className='descriptionTitle'
                    placeholder={description === "" ? "What is your favorite color?" : ""}
                    value={description}
                    onChange={e => handleDescriptionChange(e.target.value)}
                    autoFocus={true}
                />
                {options.map((option, index) => (
                    <Box key={option.id} direction='row' align='center' gap='medium' margin={'small'}>
                        <TextInput
                            style={{
                                fontWeight: 'lighter'
                            }}
                            className='optionInput'
                            placeholder={option.text === "" ? "Option " + (index + 1) : ""}
                            value={option.text}
                            onChange={e => handleOptionChange(option.id, e.target.value)}
                        />
                        <Box alignContent='center' align='center'>
                            <Button
                                pad={'none'}
                                style={{
                                    borderRadius: '50%'
                                }}
                                onClick={() => removeOption(option.id)}
                                icon={<FormClose size='medium' color='secondary' />}
                            />
                        </Box>
                    </Box>
                ))}
                <Button onClick={addOption} label={"Add another option"} icon={<FormAdd size='medium' />} />
                <Button style={{ fontWeight: 'bolder' }} primary color={'bright'} onClick={createPoll} label={'Generate poll'} />

                {/* Display generated poll text. */}
                {isPollGenerated ? (
                    <Box>
                        <textarea
                            readOnly
                            style={{ resize: "none" }}
                            rows={options.length * 3}
                            value={generatedPoll}
                        />
                        <Button primary onClick={copyGeneratedPollIntoClipboard} label="Copy poll" />
                    </Box>
                ) : (
                    ""
                )}
            </Grid>
        </Grid>
    );
}

export default PollOptions;