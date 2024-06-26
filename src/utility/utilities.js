import { v4 as uuidv4 } from "uuid" // Import UUID generator
import Cookies from "universal-cookie"
const emojiFromWord = require("emoji-from-word")

export const getOrSetUserId = () => {
	const cookies = new Cookies()
	let userId = cookies.get("userId", {
		path: "/",
	})
	if (!userId) {
		userId = uuidv4()
		cookies.set("userId", userId, {
			expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
			path: "/",
		})
	}
	return userId
}

export const generatePollText = (poll, optionsList) => {
	console.log(poll, optionsList)
	let pollText = `${poll.description}\n\n`
	optionsList.forEach((option) => {
		const emojiObject = emojiFromWord(option.text)
		let emoji = `😁`
		if (emojiObject.score > 0) {
			emoji = emojiObject.emoji.char
		}
		pollText += `${emoji} ${option.text}\n ${option.tinyUrl}\n\n`
	})

	return pollText
}

export const showLoading = () => {
	let loadingModal = document.getElementById("loading")
	loadingModal.style.visibility = "visible"
}

export const hideLoading = () => {
	let loadingModal = document.getElementById("loading")
	loadingModal.style.visibility = "hidden"
}

export const getVotePercent = (numVotes, totalVotes) => {
	return totalVotes > 0 ? ((numVotes / totalVotes) * 100).toFixed(1) : 0
}
