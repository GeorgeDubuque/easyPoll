import React, { useEffect, useState } from "react"
import { API, graphqlOperation } from "aws-amplify"
import { Box, Button, DropButton, Grid, Spinner, Text, Tip } from "grommet"
import {
	generatePollText,
	getOrSetUserId,
	hideLoading,
	showLoading,
} from "../utility/utilities"
import { Clone, FormAdd, Info, Trash } from "grommet-icons"
import PollBar from "./PollBar"
import { pollsByDateWithOptions } from "../graphql/custom-queries"
import copy from "copy-to-clipboard"
import { deletePoll as deletePollMutation } from "../graphql/mutations"

const ViewPolls = ({ creatorId }) => {
	const [polls, setPolls] = useState([])
	const [error, setError] = useState(null)
	const [refresh, setRefresh] = useState(false)

	useEffect(() => {
		async function fetchPolls() {
			showLoading()
			try {
				const userId = getOrSetUserId()

				const response = await API.graphql(
					graphqlOperation(pollsByDateWithOptions, {
						creatorId: userId,
						sortDirection: "DESC",
					})
				)

				if (response.data.pollsByDate && response.data.pollsByDate.items) {
					console.log("Retrieved Polls: ", response.data.pollsByDate.items)
					setPolls(response.data.pollsByDate.items)
				} else {
					// Handle the case where no polls are returned
					setPolls([])
				}
			} catch (error) {
				console.error("Error fetching polls:", error)
				setError(error) // Store the error in state for rendering
			}
		}

		fetchPolls()
		hideLoading()
	}, [creatorId, refresh])

	const getTotalVotesOnPoll = (poll) => {
		let totalVotes = 0
		for (let option of poll.options.items) {
			totalVotes += option.numVotes
		}

		return totalVotes
	}

	const getVotePercent = (numVotes, totalVotes) => {
		return totalVotes > 0 ? ((numVotes / totalVotes) * 100).toFixed(1) : 0
	}

	const displayNoPolls = () => {
		return <Box>You have no polls.</Box>
	}

	const deletePoll = async (pollId) => {
		showLoading()
		console.log("deletePoll: ", pollId)
		const deletePollParams = {
			input: { id: pollId },
		}
		let loadingModal = document.getElementById("loading")
		loadingModal.style.visibility = "visible"
		const deletePollResult = await API.graphql(
			graphqlOperation(deletePollMutation, deletePollParams)
		)
		setRefresh(!refresh)

		console.log("deleted poll result: ", deletePollResult)
	}

	const listPolls = () => {
		let listedPolls = []
		for (let poll of polls) {
			const totalVotes = getTotalVotesOnPoll(poll)
			listedPolls.push(listPoll(poll, totalVotes))
		}

		return listedPolls
	}

	const listPoll = (poll, totalVotes) => {
		const options = poll.options.items
		return (
			<Grid margin="medium" gap="small" key={"poll-" + poll.id}>
				<Box direction="row">
					<Text margin="small" alignSelf="center" size="large">
						{poll.description}
					</Text>
					<Button
						style={{
							border: "2px solid #C1C1C1",
							borderRadius: "5px",
						}}
						color={"dark"}
						primary
						margin="small"
						icon={<Clone size="20px" />}
						onClick={() => {
							copy(generatePollText(poll, options))
						}}
						elevation="large"
					/>
					<Button
						style={{ border: "2px solid #C1C1C1", borderRadius: "5px" }}
						color={"dark"}
						primary
						margin="small"
						icon={<Trash size="20px" />}
						onClick={() => {
							deletePoll(poll.id)
						}}
					/>
				</Box>
				{options.map((option) => (
					<PollBar option={option} totalVotes={totalVotes} />
				))}
				<Text size="small" color={"faint"}>
					{totalVotes} votes
				</Text>
			</Grid>
		)
	}

	if (error) {
		return <div>Error fetching polls: {error.message}</div>
	}

	return (
		<Box>
			<Button
				margin={{ horizontal: "large", vertical: "medium" }}
				onClick={() => {
					showLoading()
					window.location.href = "../"
				}}
				//justify={"evenly"}
				primary
				color={"bright"}
				label={"Create New Poll"}
				icon={<FormAdd size="medium" />}
				alignSelf={"center"}
			/>
			<Box overflow="auto">
				<Grid>{polls.length !== 0 ? listPolls() : displayNoPolls()}</Grid>
			</Box>
		</Box>
	)
}

export default ViewPolls
