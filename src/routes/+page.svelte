<script>
	import { onMount } from 'svelte';
	import { marked } from 'marked';
	import DOMPurify from 'dompurify';
	import { Moon, Sun } from 'lucide-svelte';

	let messages = [];
	let inputMessage = '';
	let isLoading = false;
	let isDarkMode = false;

	function parseMarkdown(content) {
		const rawHtml = marked(content);
		return DOMPurify.sanitize(rawHtml);
	}

	async function sendMessage() {
		if (!inputMessage.trim()) return;

		const userMessage = { role: 'user', content: inputMessage };
		messages = [...messages, userMessage];
		isLoading = true;
		inputMessage = '';

		try {
			const response = await fetch('/api/chat-completion', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ content: userMessage.content })
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const botResponse = await response.json();
			const botMessage = {
				role: 'assistant',
				content: botResponse.choices[0]?.message?.content || 'No response'
			};
			messages = [...messages, botMessage];
		} catch (error) {
			console.error('Error in sendMessage:', error);
			const errorMessage = {
				role: 'assistant',
				content: 'An error occurred. Please try again later.'
			};
			messages = [...messages, errorMessage];
		} finally {
			isLoading = false;
		}
	}

	function toggleDarkMode() {
		isDarkMode = !isDarkMode;
		localStorage.setItem('isDarkMode', isDarkMode);
		updateTheme();
	}

	function updateTheme() {
		if (isDarkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}

	onMount(() => {
		document.querySelector('input').focus();
		isDarkMode = localStorage.getItem('isDarkMode') === 'true';
		updateTheme();
	});
</script>

<svelte:head>
	<style>
		:root {
			--bg-color: #ffffff;
			--text-color: #000000;
			--chat-bg: #f3f4f6;
			--input-bg: #ffffff;
			--input-text: #000000;
			--button-bg: #3b82f6;
			--button-text: #ffffff;
			--button-hover: #2563eb;
		}

		.dark {
			--bg-color: #1f2937;
			--text-color: #ffffff;
			--chat-bg: #374151;
			--input-bg: #4b5563;
			--input-text: #ffffff;
			--button-bg: #3b82f6;
			--button-text: #ffffff;
			--button-hover: #2563eb;
		}

		body {
			background-color: var(--bg-color);
			color: var(--text-color);
			transition:
				background-color 0.3s,
				color 0.3s;
		}

		.markdown-content {
			white-space: pre-wrap;
		}
		.markdown-content p {
			margin-bottom: 1em;
		}
		.markdown-content ul,
		.markdown-content ol {
			margin-left: 1.5em;
			margin-bottom: 1em;
		}
		.markdown-content code {
			background-color: #f0f0f0;
			padding: 0.2em 0.4em;
			border-radius: 3px;
		}
		.markdown-content pre {
			background-color: #f0f0f0;
			padding: 1em;
			border-radius: 5px;
			overflow-x: auto;
		}
		html,
		body,
		main {
			height: 100%;
			margin: 0;
		}
		main {
			display: flex;
			flex-direction: column;
		}
		.container {
			flex: 1;
			display: flex;
			flex-direction: column;
		}
		.chat-container {
			flex: 1;
			overflow-y: auto;
		}
	</style>
</svelte:head>

<main class="container mx-auto p-4 max-w-2xl">
	<h1 class="text-3xl font-bold mb-4">LLAMA Chat 70b</h1>
	<div class="bg-chat-bg shadow-md rounded-lg p-4 mb-4 chat-container">
		{#each messages as message}
			<div class="mb-2">
				<strong>{message.role === 'user' ? 'You' : 'Bot'}:</strong>
				{#if message.role === 'user'}
					<p class="ml-2">{message.content}</p>
				{:else}
					<div class="ml-2 markdown-content">
						{@html parseMarkdown(message.content)}
					</div>
				{/if}
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
			style="background-color: var(--input-bg); color: var(--input-text);"
		/>
		<button
			type="submit"
			class="px-4 py-2 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
			style="background-color: var(--button-bg); color: var(--button-text);"
			disabled={isLoading}
		>
			Send
		</button>
	</form>

	<button
		on:click={toggleDarkMode}
		class="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
	>
		{#if isDarkMode}
			<Sun size={24} />
		{:else}
			<Moon size={24} />
		{/if}
	</button>
</main>
