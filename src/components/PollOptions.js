import { Box, Button, Grid, Paragraph, Text, TextInput } from "grommet"
import React, { useState } from "react"
import { v4 as uuidv4 } from "uuid" // Import UUID generator
import copy from "copy-to-clipboard"
import axios from "axios"
import { API, graphqlOperation } from "aws-amplify"
import { listPolls } from "../graphql/queries"
import {
	createPoll as createPollMutation,
	createOption as createOptionMutation,
} from "../graphql/mutations"

import $ from "jquery"
import {
	generatePollText,
	getOrSetUserId,
	hideLoading,
	showLoading,
} from "../utility/utilities"
import { Add, AddCircle, Close, FormAdd, FormClose, Trash } from "grommet-icons"
import { Icon } from "@aws-amplify/ui-react"

const PollOptions = () => {
	const [options, setOptions] = useState([])
	const [isPollGenerated, setIsPollGenerated] = useState(false)
	const [generatedPoll, setGeneratedPoll] = useState("")
	const [description, setDescription] = useState("")
	const [refresh, setRefresh] = useState(false)
	const [lastCreatedOptionId, setLastCreatedOptionId] = useState("")

	const addOption = async () => {
		const optionId = uuidv4()
		const newOption = { id: optionId, text: "" } // Generate unique ID
		setLastCreatedOptionId(optionId)
		setOptions([...options, newOption])
	}

	const removeOption = (id) => {
		const updatedOptions = options.filter((option) => option.id !== id)
		setOptions(updatedOptions)
	}

	const handleOptionChange = (id, newText) => {
		const updatedOptions = options.map((option) =>
			option.id === id ? { ...option, text: newText } : option
		)
		setOptions(updatedOptions)
	}

	const handleDescriptionChange = (newDescription) => {
		setDescription(newDescription)
	}

	const createPoll = async () => {
		showLoading()
		// generate user id if not in cookies otherwise get from cookies
		let userId = getOrSetUserId()

		const createPollParams = {
			input: { description: description, creatorId: userId },
		}

		const createPollResult = await API.graphql(
			graphqlOperation(createPollMutation, createPollParams)
		)

		const poll = createPollResult.data.createPoll

		// Make a GET request to your serverless function
		const apiUrl =
			"https://xfm6ahnlme.execute-api.us-west-2.amazonaws.com/default/easyPollBulkRequestTinyUrl-staging"

		const baseUrl = window.location.origin

		// Data to send in the request body (assuming it's in JSON format)
		const requestData = {
			baseUrl,
			options,
			poll,
		}
		console.log("requestData:", requestData)

		const response = await fetch(apiUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json", // Specify the content type as JSON
			},
			body: JSON.stringify(requestData), // Convert data to JSON string
		})

		if (!response.ok) {
			throw new Error(
				`Error calling the tiny url lambda functions ${response.status}`
			)
		}

		const responseJson = await response.json()
		console.log("responseJson: ", responseJson)

		let optionsToCreate = responseJson.body.optionsToCreate

		let optionsList = []

		for (let option of optionsToCreate) {
			let optionParams = {
				input: option,
			}
			console.log("inserting option: ", optionParams)
			const createOptionResult = await API.graphql(
				graphqlOperation(createOptionMutation, optionParams)
			)
			optionsList.push(createOptionResult.data.createOption)
			console.log(createOptionResult)
		}

		const pollText = generatePollText(poll, optionsList)

		hideLoading()
		setGeneratedPoll(pollText)
		setIsPollGenerated(true)
	}

	const copyGeneratedPollIntoClipboard = () => {
		copy(generatedPoll)
	}

	const onKeyDownPollInput = (event) => {
		if (event.key === "Enter") {
			if (options.length == 0) {
				addOption()
			} else {
				document.getElementById(options[0].id).focus()
			}
		}
	}

	const onKeyDownOptionInput = (event) => {
		if (event.key === "Enter") {
			console.log(event.srcElement, lastCreatedOptionId)
			if (event.srcElement.id === options[options.length - 1].id) {
				addOption()
			} else {
				let nextOption
				for (let i = 0; i < options.length; i++) {
					if (options[i].id === event.srcElement.id) {
						nextOption = options[i + 1]
						break
					}
				}

				document.getElementById(nextOption.id).focus()
			}
		} else if (event.key === "Backspace") {
			if (event.srcElement.value === "") {
				event.preventDefault()
				console.log("empty that ass girl")
				let nextOption
				for (let i = options.length - 1; i >= 0; i--) {
					if (options[i].id === event.srcElement.id) {
						nextOption = options[i - 1]
						break
					}
				}

				removeOption(event.srcElement.id)
				if (options.length > 1) {
					document.getElementById(nextOption.id).focus()
				} else {
					document.getElementById("poll-title").focus()
				}
			}
		}
	}
	return (
		<Box
			overflow="auto"
			direction="column"
			justify="center"
			width={"fit-content"}
			//gap="small"
			fill="horizontal"
		>
			<Box
				//basis="small"
				background={"dark"}
				direction="column"
				fill="horizontal"
				align="center"
				pad={{ horizontal: "small", vertical: "large" }}
				gap="medium"
				justify="evenly"
			>
				<Text size="large" weight={"bold"}>
					Create a Poll
				</Text>
				<Text size="small" textAlign="center" color={"secondary"}>
					Fill in the fields below to create a poll.
				</Text>
				<Button
					label={"View My Polls"}
					onClick={() => {
						showLoading()
						window.location.href = "../polls"
					}}
				/>
			</Box>
			<Box background="bright" fill="horizontal" height="5px"></Box>
			<Box
				width="large"
				round
				pad="medium"
				alignSelf="center"
				justify="evenly"
				flex="shrink"
			>
				<Grid gap="small" pad={"small"} fill>
					<TextInput
						style={{
							fontWeight: "normal",
						}}
						className="descriptionTitle"
						id="poll-title"
						placeholder={
							description === "" ? "What is your favorite color?" : ""
						}
						value={description}
						onChange={(e) => handleDescriptionChange(e.target.value)}
						onKeyDown={onKeyDownPollInput}
						autoFocus={true}
					/>
					{options.map((option, index) => (
						<Box
							key={option.id}
							direction="row"
							align="center"
							gap="medium"
							margin={"small"}
						>
							<TextInput
								style={{
									fontWeight: "lighter",
								}}
								className="optionInput"
								placeholder={
									option.text === "" ? "Option " + (index + 1) : ""
								}
								autoFocus={index === options.length - 1}
								value={option.text}
								id={option.id}
								onKeyDown={onKeyDownOptionInput}
								onChange={(e) =>
									handleOptionChange(option.id, e.target.value)
								}
							/>
							<Box alignContent="center" align="center">
								<Button
									pad={"none"}
									style={{
										borderRadius: "50%",
									}}
									onClick={() => removeOption(option.id)}
									icon={<FormClose size="medium" color="secondary" />}
								/>
							</Box>
						</Box>
					))}
					<Button
						onClick={addOption}
						label={"Add another option"}
						icon={<FormAdd size="medium" />}
					/>
					<Button
						style={{ fontWeight: "bolder" }}
						primary
						color={"bright"}
						onClick={createPoll}
						label={"Generate poll"}
					/>

					{/* Display generated poll text. */}
					{isPollGenerated ? (
						<Box gap="medium">
							<textarea
								readOnly
								style={{ resize: "none" }}
								rows={options.length * 3 + 1}
								value={generatedPoll}
							/>
							<Button
								primary
								onClick={copyGeneratedPollIntoClipboard}
								label="Copy poll"
							/>
							<Button
								primary
								onClick={() => {
									window.location.href = "../"
								}}
								label="New Poll +"
							/>
						</Box>
					) : (
						""
					)}
				</Grid>
			</Box>
		</Box>
	)
}

export default PollOptions
