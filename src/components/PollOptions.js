import { Box, Button, Grid, Paragraph, Text, TextInput } from 'grommet';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Import UUID generator
import copy from 'copy-to-clipboard';
import axios from 'axios';
import Cookies from 'universal-cookie'

function PollOptions() {
    const [options, setOptions] = useState([]);
    const [isPollGenerated, setIsPollGenerated] = useState(false);
    const [generatedPoll, setGeneratedPoll] = useState("");
    const axiosInstance = axios.create({
        baseURL: 'http://localhost:8000', // Replace with your backend server URL and custom port
        timeout: 10000, // Optional: Set a timeout for requests
        headers: {
            // Optional: Set default headers here (e.g., authentication tokens)
        }
    });
    const cookies = new Cookies()

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

    const generatePollText = () => {
        let pollText = "";
        options.forEach(option => {
            pollText += `😀 ${option.text} - ${generateOptionLink(option.id)}\n\n`
        });

        setGeneratedPoll(pollText);
        setIsPollGenerated(true);
    }

    const createPoll = async () => {
        // get curr poll values
        const optionTexts = options.map(option => option.text);
        
        // generate user id if not in cookies otherwise get from cookies
        let userId = cookies.get("userId");
        if(!userId){
            userId = uuidv4();
            cookies.set("userId", userId);
        }

        //await axiosInstance.post("/api/polls/create", { userId, options: optionTexts });
    }

    const generateOptionLink = (id) => {
        return "https://www.fakelink.com/" + id;
    }

    const copyGeneratedPollIntoClipboard = () => {
        //navigator.clipboard.writeText(generatedPoll).then(() => {
        //    console.log("got heem");
        //});
        copy(generatedPoll);
    }

    return (
        <Grid pad="medium" gap="medium">
            <h2>easy poll</h2>
            {options.map((option, index) => (
                <Box key={option.id} direction='row'>
                    <TextInput
                        placeholder={option.text === "" ? "Option " + (index + 1) : ""}
                        value={option.text}
                        onChange={e => handleOptionChange(option.id, e.target.value)}
                    />
                    <Button onClick={() => removeOption(option.id)} label="x" />
                </Box>
            ))}
            <Button primary onClick={addOption} label="Add Option" />
            <Button primary onClick={createPoll} label="Generate Poll" />
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