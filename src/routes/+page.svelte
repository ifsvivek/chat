<!-- src/routes/+page.svelte -->
<script>
	import { onMount } from 'svelte';
	import { getGroqChatCompletion } from '$lib/groq-api';

	let messages = [];
	let inputMessage = '';
	let isLoading = false;

	async function sendMessage() {
		if (!inputMessage.trim()) return;

		const userMessage = { role: 'user', content: inputMessage };
		messages = [...messages, userMessage];
		isLoading = true;
		inputMessage = '';

		const botResponse = await getGroqChatCompletion(userMessage.content);
		const botMessage = { role: 'assistant', content: botResponse };
		messages = [...messages, botMessage];
		isLoading = false;
	}

	onMount(() => {
		// Focus on the input field when the component mounts
		document.querySelector('input').focus();
	});
</script>

<main class="container mx-auto p-4 max-w-2xl">
	<h1 class="text-3xl font-bold mb-4">Groq Chatbot</h1>

	<div class="bg-white shadow-md rounded-lg p-4 mb-4 h-96 overflow-y-auto">
		{#each messages as message}
			<div class="mb-2">
				<strong>{message.role === 'user' ? 'You' : 'Bot'}:</strong>
				<p class="ml-2">{message.content}</p>
			</div>
		{/each}
		{#if isLoading}
			<div class="text-gray-500">Bot is typing...</div>
		{/if}
	</div>

	<form on:submit|preventDefault={sendMessage} class="flex">
		<input
			type="text"
			bind:value={inputMessage}
			placeholder="Type your message..."
			class="flex-grow border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
		/>
		<button
			type="submit"
			class="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
			disabled={isLoading}
		>
			Send
		</button>
	</form>
</main>
