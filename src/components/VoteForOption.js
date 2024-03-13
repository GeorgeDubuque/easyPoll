import { Box, Button, Grid, Paragraph, Text, TextInput } from "grommet"
import React, { useState, useEffect } from "react"
import copy from "copy-to-clipboard"
import { API, graphqlOperation } from "aws-amplify"
import Cookies from "universal-cookie"
import { getOption, getPoll } from "../graphql/queries"
import {
	createPoll as createPollMutation,
	createOption as createOptionMutation,
	updateOption as updateOptionMutation,
} from "../graphql/mutations"

import { getOrSetUserId } from "../utility/utilities"
import PollBar from "./PollBar"

function VoteForOption() {
	const queryParameters = new URLSearchParams(window.location.search)
	const pollId = queryParameters.get("pollid")
	const optionId = queryParameters.get("optionid")
	const [votedOption, setVotedOption] = useState({})
	const [prevVotedOption, setPrevVotedOption] = useState({})
	const [poll, setPoll] = useState({})
	const [error, setError] = useState()
	const cookies = new Cookies()
	console.log("queryParameters", queryParameters)
	useEffect(() => {
		const fetchPoll = async () => {
			console.log("swag on em")
			//retrieve poll
			const pollParams = {
				id: pollId,
			}
			const pollResult = await API.graphql(graphqlOperation(getPoll, pollParams))
			let poll = pollResult.data.getPoll
			console.log("PollResult: ", pollResult)
			console.log("Poll: ", poll)

			if (poll !== null) {
				//find option voted for in poll
				const votedOption = poll.options.items.find((option) => {
					return option.id === optionId
				})

				//check if user has already voted on this poll and change vote if necessary
				const prevVotedOption = getPreviouslyVotedOption(poll.options.items)
				console.log("Voted Option: ", votedOption)
				console.log("Previously Voted Option: ", prevVotedOption)

				let userId = getOrSetUserId()
				if (prevVotedOption) {
					if (prevVotedOption.id !== votedOption.id) {
						removeVoteForOption(prevVotedOption, userId)
						addVoteForOption(pollId, votedOption, userId)
					}
				} else {
					addVoteForOption(pollId, votedOption, userId)
				}

				setPrevVotedOption(prevVotedOption)
				setVotedOption(votedOption)
				const pollParams = {
					id: pollId,
				}
				const pollResult = await API.graphql(
					graphqlOperation(getPoll, pollParams)
				)
				poll = pollResult.data.getPoll
				setPoll(poll)
			} else {
				setError("This poll does not exist or has been deleted by it's creator.")
			}
		}
		fetchPoll()
	}, [])

	const removeVoteForOption = async (prevVotedOption, userId) => {
		// remove vote from prev option
		let prevVoters = prevVotedOption.voters
		prevVoters = removeItemFromArray(prevVoters, userId)
		const removeUpdateParams = {
			input: {
				id: prevVotedOption.id,
				numVotes: prevVotedOption.numVotes - 1,
				voters: prevVoters,
			},
		}
		const removeVoteResult = await API.graphql(
			graphqlOperation(updateOptionMutation, removeUpdateParams)
		)
		console.log("Removed previous vote: ", removeVoteResult)
	}

	const addVoteForOption = async (pollId, votedOption, userId) => {
		// add new vote for curr option
		const addVoteParams = {
			input: {
				id: votedOption.id,
				pollId: pollId,
				numVotes: votedOption.numVotes + 1,
				voters: [...votedOption.voters, userId],
			},
		}
		const addVoteResult = await API.graphql(
			graphqlOperation(updateOptionMutation, addVoteParams)
		)
		console.log("Added vote:", addVoteResult)
	}

	const removeItemFromArray = (array, item) => {
		const index = array.indexOf(item)
		if (index > -1) {
			// only splice array when item is found
			array.splice(index, 1) // 2nd parameter means remove one item only
		}

		return array
	}

	const getPreviouslyVotedOption = (options) => {
		const prevVotedOption = options.find((option) => {
			return option.voters.includes(cookies.get("userId"))
		})
		if (!prevVotedOption) {
			return null
		} else {
			return prevVotedOption
		}
	}

	const getVotedMessage = () => {
		let votedMessage = `You voted "${votedOption.text}" on this poll!`
		if (prevVotedOption) {
			if (votedOption.id === prevVotedOption.id) {
				votedMessage = `You already voted "${votedOption.text}" on this poll!`
			} else {
				votedMessage = `You changed your vote from "${prevVotedOption.text}" to "${votedOption.text}".`
			}
		}

		return votedMessage
	}

	const getTotalVotesOnPoll = () => {
		let totalVotes = 0
		console.log("poll", poll)
		for (let option of poll.options.items) {
			totalVotes += option.numVotes
		}

		return totalVotes
	}
	const listPolls = () => {
		let listedPolls = []
		const totalVotes = getTotalVotesOnPoll(poll)
		listedPolls.push(listPoll(poll, totalVotes))

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

	return (
		<Grid pad="medium" gap="medium">
			{!error ? (
				<Box>
					<h2>{getVotedMessage()}</h2>
					{
						<Box overflow="auto">
							<Grid>{poll.description ? listPolls() : ""}</Grid>
						</Box>
					}
				</Box>
			) : (
				<Box>
					<h2>{error}</h2>
				</Box>
			)}
		</Grid>
	)
}

export default VoteForOption
