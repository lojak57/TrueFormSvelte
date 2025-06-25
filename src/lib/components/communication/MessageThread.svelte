<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher, tick } from "svelte";
  import { MessageService } from "$lib/services/MessageService";
  import MessageBubble from "./MessageBubble.svelte";
  import MessageInput from "./MessageInput.svelte";
  import TypingIndicator from "./TypingIndicator.svelte";
  import AttachmentUpload from "./AttachmentUpload.svelte";
  import type {
    MessageThread,
    MessageWithDetails,
    UserProfile,
    CreateMessageDTO,
  } from "$lib/types";

  export let thread: MessageThread;
  export let currentUser: UserProfile;

  const dispatch = createEventDispatcher<{
    threadUpdated: { thread: MessageThread };
    error: { message: string };
  }>();

  let messages: MessageWithDetails[] = [];
  let typingUsers: UserProfile[] = [];
  let replyingTo: MessageWithDetails | null = null;
  let editingMessage: MessageWithDetails | null = null;
  let showAttachmentPanel = false;
  let loading = false;
  let error = "";

  let messagesContainer: HTMLDivElement;
  let messageService: MessageService;
  let realtimeSubscription: any;

  onMount(async () => {
    messageService = new MessageService();
    await loadMessages();
    // Realtime subscriptions disabled for now
    // setupRealtimeSubscription();
    scrollToBottom();
  });

  onDestroy(() => {
    // if (realtimeSubscription) {
    //   realtimeSubscription.unsubscribe();
    // }
  });

  async function loadMessages() {
    try {
      loading = true;
      error = "";
      messages = await messageService.getThreadMessages(thread.id);
      await tick();
      scrollToBottom();
    } catch (err) {
      error = err.message;
      dispatch("error", { message: err.message });
    } finally {
      loading = false;
    }
  }

  // Realtime subscriptions disabled for now
  /*
  function setupRealtimeSubscription() {
    realtimeSubscription = messageService.subscribeToThread(
      thread.id,
      (payload) => {
        handleRealtimeEvent(payload);
      }
    );
  }

  */

  // Realtime event handler disabled for now
  /*
  async function handleRealtimeEvent(payload: any) {
    const { eventType, table, new: newRecord, old: oldRecord } = payload;

    if (table === "tf_messages") {
      if (eventType === "INSERT") {
        // New message added
        const messageWithDetails = await messageService.getMessageById(
          newRecord.id
        );
        messages = [...messages, messageWithDetails];
        await tick();
        scrollToBottom();

        // Mark as read if not sent by current user
        if (newRecord.sender_id !== currentUser.user_id) {
          await messageService.markMessageAsRead(
            newRecord.id,
            currentUser.user_id
          );
        }
      } else if (eventType === "UPDATE") {
        // Message updated
        const updatedMessage = await messageService.getMessageById(
          newRecord.id
        );
        const index = messages.findIndex((m) => m.id === newRecord.id);
        if (index !== -1) {
          messages[index] = updatedMessage;
          messages = [...messages];
        }
      } else if (eventType === "DELETE") {
        // Message deleted
        messages = messages.filter((m) => m.id !== oldRecord.id);
      }
    } else if (table === "tf_typing_indicators") {
      // Update typing indicators
      await updateTypingIndicators();
    }
  }

  */

  // Typing indicators disabled for now
  /*
  async function updateTypingIndicators() {
    try {
      typingUsers = await messageService.getTypingUsers(thread.id);
      // Filter out current user
      typingUsers = typingUsers.filter(
        (user) => user.user_id !== currentUser.user_id
      );
    } catch (err) {
      console.warn("Failed to update typing indicators:", err);
    }
  }
  */

  async function handleSendMessage(
    event: CustomEvent<{ content: string; replyTo?: string }>
  ) {
    try {
      const { content, replyTo } = event.detail;

      const messageDTO: CreateMessageDTO = {
        thread_id: thread.id,
        sender_id: currentUser.user_id,
        message_type: "text",
        content,
        reply_to: replyTo,
      };

      await messageService.sendMessage(messageDTO);

      // Clear reply state
      replyingTo = null;
    } catch (err) {
      error = err.message;
      dispatch("error", { message: err.message });
    }
  }

  async function handleTyping(event: CustomEvent<{ isTyping: boolean }>) {
    try {
      const { isTyping } = event.detail;

      if (isTyping) {
        await messageService.startTyping({
          thread_id: thread.id,
          user_id: currentUser.user_id,
        });
      } else {
        await messageService.stopTyping(thread.id, currentUser.user_id);
      }
    } catch (err) {
      console.warn("Failed to update typing status:", err);
    }
  }

  async function handleReaction(
    event: CustomEvent<{ messageId: string; reactionType: string }>
  ) {
    try {
      const { messageId, reactionType } = event.detail;

      // Check if user already reacted with this type
      const message = messages.find((m) => m.id === messageId);
      const existingReaction = message?.reactions?.find(
        (r) => r.reaction_type === reactionType && r.user_reacted
      );

      if (existingReaction) {
        // Remove reaction
        await messageService.removeReaction(
          messageId,
          currentUser.user_id,
          reactionType
        );
      } else {
        // Add reaction
        await messageService.addReaction({
          message_id: messageId,
          user_id: currentUser.user_id,
          reaction_type: reactionType,
        });
      }
    } catch (err) {
      error = err.message;
      dispatch("error", { message: err.message });
    }
  }

  async function handleEditMessage(
    event: CustomEvent<{ messageId: string; content: string }>
  ) {
    try {
      const { messageId, content } = event.detail;
      await messageService.editMessage(messageId, content);
      editingMessage = null;
    } catch (err) {
      error = err.message;
      dispatch("error", { message: err.message });
    }
  }

  async function handleDeleteMessage(
    event: CustomEvent<{ messageId: string }>
  ) {
    try {
      const { messageId } = event.detail;

      if (confirm("Are you sure you want to delete this message?")) {
        await messageService.deleteMessage(messageId);
      }
    } catch (err) {
      error = err.message;
      dispatch("error", { message: err.message });
    }
  }

  function handleReply(event: CustomEvent<{ message: MessageWithDetails }>) {
    replyingTo = event.detail.message;
    editingMessage = null;
  }

  function handleEdit(event: CustomEvent<{ messageId: string }>) {
    const message = messages.find((m) => m.id === event.detail.messageId);
    if (message) {
      editingMessage = message;
      replyingTo = null;
    }
  }

  function scrollToBottom() {
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  function handleAttachment() {
    showAttachmentPanel = true;
  }

  async function handleAttachmentUpload(event: CustomEvent) {
    // Handle file upload logic here
    showAttachmentPanel = false;

    // For now, just close the panel
    // In a real implementation, you'd upload the file and send a message
  }

  // Format thread title
  $: threadDisplayName =
    thread.title || `${thread.company?.name || "Chat"} - ${thread.thread_type}`;
</script>

<div class="flex flex-col h-full bg-gray-50">
  <!-- Thread Header -->
  <div class="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
    <div class="flex items-center justify-between">
      <div class="flex items-center min-w-0">
        {#if thread.company?.logo}
          <img
            src={thread.company.logo}
            alt={thread.company.name}
            class="w-10 h-10 rounded-full mr-3 flex-shrink-0"
          />
        {:else}
          <div
            class="w-10 h-10 bg-blue-500 rounded-full mr-3 flex-shrink-0 flex items-center justify-center"
          >
            <span class="text-white font-medium text-sm">
              {thread.company?.name?.charAt(0) || "C"}
            </span>
          </div>
        {/if}
        <div class="min-w-0">
          <h3 class="font-semibold text-gray-900 truncate">
            {threadDisplayName}
          </h3>
          <p class="text-sm text-gray-600 truncate">
            {thread.company?.name || "Company"}
            {#if thread.project}
              · {thread.project.name}
            {/if}
          </p>
        </div>
      </div>

      <!-- Thread actions -->
      <div class="flex items-center space-x-2">
        <button
          class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
          title="Thread info"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Messages Area -->
  <div
    bind:this={messagesContainer}
    class="flex-1 overflow-y-auto px-6 py-4 space-y-4"
  >
    {#if loading}
      <div class="flex justify-center items-center h-32">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
        />
      </div>
    {:else if error}
      <div class="flex justify-center items-center h-32">
        <div class="text-center">
          <div class="text-red-600 font-medium">Failed to load messages</div>
          <div class="text-sm text-gray-600 mt-1">{error}</div>
          <button
            class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            on:click={loadMessages}
          >
            Retry
          </button>
        </div>
      </div>
    {:else if messages.length === 0}
      <div class="flex justify-center items-center h-32">
        <div class="text-center text-gray-500">
          <svg
            class="w-12 h-12 mx-auto mb-3 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p>No messages yet</p>
          <p class="text-sm">Start the conversation!</p>
        </div>
      </div>
    {:else}
      {#each messages as message (message.id)}
        <MessageBubble
          {message}
          isOwn={message.sender_id === currentUser.user_id}
          currentUserId={currentUser.user_id}
          showAvatar={true}
          on:react={handleReaction}
          on:reply={handleReply}
          on:edit={handleEdit}
          on:delete={handleDeleteMessage}
        />
      {/each}
    {/if}

    <!-- Typing indicator -->
    {#if typingUsers.length > 0}
      <TypingIndicator users={typingUsers} />
    {/if}
  </div>

  <!-- Message Input -->
  <div class="flex-shrink-0">
    <MessageInput
      {replyingTo}
      {editingMessage}
      on:send={handleSendMessage}
      on:typing={handleTyping}
      on:attach={handleAttachment}
      on:cancelReply={() => (replyingTo = null)}
      on:cancelEdit={() => (editingMessage = null)}
      on:editSave={handleEditMessage}
    />
  </div>
</div>

<!-- Attachment Upload Modal -->
{#if showAttachmentPanel}
  <AttachmentUpload
    on:close={() => (showAttachmentPanel = false)}
    on:upload={handleAttachmentUpload}
  />
{/if}
