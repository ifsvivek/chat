<script>
	import { onMount } from 'svelte';
	import { marked } from 'marked';
	import DOMPurify from 'dompurify';
	import { LogOut, Send, User, Bot } from 'lucide-svelte';
	import { auth } from '$lib/firebase';
	import { signOut } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { fade, fly } from 'svelte/transition';

	let messages = [];
	let inputMessage = '';
	let isLoading = false;

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
			const idToken = await auth.currentUser.getIdToken();
			const response = await fetch('/api/chat-completion', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${idToken}`
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

	async function handleSignOut() {
		try {
			await signOut(auth);
			goto('/');
		} catch (error) {
			console.error('Error signing out:', error);
		}
	}

	onMount(() => {
		document.querySelector('input')?.focus();
	});
</script>

<div class="flex flex-col h-screen bg-gray-900 text-gray-100">
	<header class="bg-gray-800 text-white p-4 flex justify-between items-center">
		<h1 class="text-2xl font-bold">LLAMA Chat 70b</h1>
		<button
			on:click={handleSignOut}
			class="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
		>
			<LogOut size={20} />
		</button>
	</header>

	<main class="flex-1 overflow-auto p-4 space-y-4">
		<div class="container mx-auto max-w-4xl">
			{#each messages as message, i (i)}
				<div
					in:fly={{ y: 50, duration: 300, delay: 300 * i }}
					out:fade={{ duration: 200 }}
					class="flex {message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4"
				>
					<div
						class="flex items-start space-x-2 max-w-[70%] {message.role === 'user'
							? 'flex-row-reverse space-x-reverse'
							: ''}"
					>
						<div
							class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white"
						>
							{#if message.role === 'user'}
								<User size={16} />
							{:else}
								<Bot size={16} />
							{/if}
						</div>
						<div
							class="p-3 rounded-lg shadow-md {message.role === 'user'
								? 'bg-blue-600 text-white'
								: 'bg-gray-700 text-gray-100'}"
						>
							{#if message.role === 'user'}
								<p>{message.content}</p>
							{:else}
								<div class="markdown-content">
									{@html parseMarkdown(message.content)}
								</div>
							{/if}
						</div>
					</div>
				</div>
			{/each}
			{#if isLoading}
				<div class="flex justify-start mb-4">
					<div class="bg-gray-700 text-gray-100 p-3 rounded-lg shadow-md">
						<div class="typing-indicator">
							<span></span>
							<span></span>
							<span></span>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</main>

	<footer class="p-4 bg-gray-800 border-t border-gray-700">
		<div class="container mx-auto max-w-4xl">
			<form on:submit|preventDefault={sendMessage} class="flex items-center space-x-2">
				<input
					type="text"
					bind:value={inputMessage}
					placeholder="Type your message..."
					class="flex-grow p-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
				/>
				<button
					type="submit"
					class="p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 transition-colors"
					disabled={isLoading}
				>
					<Send size={20} />
				</button>
			</form>
		</div>
	</footer>
</div>

<style>
	:global(body) {
		background-color: #1a202c;
		color: #f7fafc;
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
		background-color: #2d3748;
		color: #f7fafc;
		padding: 0.2em 0.4em;
		border-radius: 3px;
		font-family: monospace;
	}
	.markdown-content pre {
		background-color: #2d3748;
		color: #f7fafc;
		padding: 1em;
		border-radius: 5px;
		overflow-x: auto;
		border: 1px solid #4a5568;
	}
	.markdown-content pre code {
		background-color: transparent;
		padding: 0;
		border-radius: 0;
	}

	.typing-indicator {
		display: flex;
		align-items: center;
		column-gap: 0.25rem;
	}

	.typing-indicator span {
		height: 0.5rem;
		width: 0.5rem;
		background-color: #f7fafc;
		border-radius: 50%;
		animation: typing 1s infinite ease-in-out;
	}

	.typing-indicator span:nth-child(1) {
		animation-delay: 0.1s;
	}

	.typing-indicator span:nth-child(2) {
		animation-delay: 0.2s;
	}

	.typing-indicator span:nth-child(3) {
		animation-delay: 0.3s;
	}

	@keyframes typing {
		0% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-0.5rem);
		}
		100% {
			transform: translateY(0);
		}
	}
</style>
