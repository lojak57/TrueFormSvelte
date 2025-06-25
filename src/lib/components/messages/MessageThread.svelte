<script lang="ts">
  import { onMount, onDestroy, afterUpdate } from "svelte";
  import { createEventDispatcher } from "svelte";
  import { supabase } from "$lib/supabaseClient";
  import { formatDistanceToNow } from "date-fns";
  import MessageInput from "./MessageInput.svelte";
  import MessageBubble from "./MessageBubble.svelte";
  import type { RealtimeChannel } from "@supabase/supabase-js";

  export let thread: any;
  export let embedded: boolean = false;

  const dispatch = createEventDispatcher();

  interface Message {
    id: string;
    content: string;
    message_type: string;
    sender_id: string;
    created_at: string;
    is_edited: boolean;
    sender: {
      first_name: string;
      last_name: string;
      is_client: boolean;
      avatar_url?: string;
    };
    reactions?: Array<{
      reaction_type: string;
      user_id: string;
    }>;
    read_by?: Array<{
      user_id: string;
      read_at: string;
    }>;
  }

  let messages: Message[] = [];
  let loading = true;
  let error = "";
  let messagesContainer: HTMLDivElement;
  let subscription: RealtimeChannel;
  let currentUserId: string;
  let typingUsers: Map<string, { userId: string; userName: string }> = new Map();

  onMount(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      currentUserId = user.id;
    }

    await loadMessages();
    // Realtime subscriptions disabled for now
    // setupRealtimeSubscription();
    scrollToBottom();
  });

  onDestroy(() => {
    // if (subscription) {
    //   subscription.unsubscribe();
    // }
  });

  afterUpdate(() => {
    scrollToBottom();
  });

  async function loadMessages() {
    try {
      const { data, error: messagesError } = await supabase
        .from("tf_messages")
        .select(
          `
          *,
          sender_id,
          reactions:tf_message_reactions(
            reaction_type,
            user_id
          ),
          read_by:tf_message_read_status(
            user_id,
            read_at
          )
        `
        )
        .eq("thread_id", thread.id)
        .eq("is_deleted", false)
        .order("created_at", { ascending: true });

      if (messagesError) throw messagesError;

      messages = data || [];

      // Fetch user profiles for all senders
      const senderIds = new Set<string>();
      messages.forEach((msg) => {
        if (msg.sender_id) senderIds.add(msg.sender_id);
      });

      const { data: userProfiles } = await supabase
        .from("tf_user_profiles")
        .select("user_id, first_name, last_name, is_client, avatar_url")
        .in("user_id", Array.from(senderIds));

      // Create a map of user profiles
      const profileMap = new Map();
      userProfiles?.forEach((profile) => {
        profileMap.set(profile.user_id, profile);
      });

      // Add sender info to messages
      messages = messages.map((msg) => {
        const profile = profileMap.get(msg.sender_id);
        if (profile) {
          msg.sender = {
            user_id: profile.user_id,
            first_name: profile.first_name,
            last_name: profile.last_name,
            is_client: profile.is_client,
            avatar_url: profile.avatar_url
          };
        }
        return msg;
      });

      // Mark messages as read
      await markMessagesAsRead();
    } catch (err) {
      console.error("Error loading messages:", err);
      error = "Failed to load messages";
    } finally {
      loading = false;
    }
  }

  // Realtime subscriptions disabled for now
  /*
  function setupRealtimeSubscription() {
    subscription = supabase
      .channel(`thread-${thread.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "tf_messages",
          filter: `thread_id=eq.${thread.id}`,
        },
        async (payload) => {
          // Fetch full message with relations
          const { data } = await supabase
            .from("tf_messages")
            .select(
              `
              *,
              sender:tf_user_profiles!tf_messages_sender_id_fkey(
                user_id,
                first_name,
                last_name,
                is_client,
                avatar_url
              )
            `
            )
            .eq("id", payload.new.id)
            .single();

          if (data) {
            messages = [...messages, data];
            await markMessagesAsRead();
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tf_typing_indicators",
          filter: `thread_id=eq.${thread.id}`,
        },
        async (payload) => {
          if (
            payload.eventType === "INSERT" &&
            payload.new.user_id !== currentUserId
          ) {
            // Fetch user info for typing indicator
            const { data: userData } = await supabase
              .from("tf_user_profiles")
              .select("first_name, last_name")
              .eq("user_id", payload.new.user_id)
              .single();
              
            if (userData) {
              typingUsers.set(payload.new.user_id, {
                userId: payload.new.user_id,
                userName: `${userData.first_name} ${userData.last_name}`
              });
            }
          } else if (payload.eventType === "DELETE") {
            typingUsers.delete(payload.old.user_id);
          }
          typingUsers = typingUsers; // Trigger reactivity
        }
      )
      .subscribe();
  }
  */

  async function markMessagesAsRead() {
    const unreadMessages = messages.filter(
      (m) =>
        m.sender_id !== currentUserId &&
        !m.read_by?.some((r) => r.user_id === currentUserId)
    );

    for (const message of unreadMessages) {
      await supabase.rpc("mark_message_as_read", {
        message_uuid: message.id,
        user_uuid: currentUserId,
      });
    }
  }

  async function sendMessage(
    event: CustomEvent<{ content: string; type: string; files?: File[] }>
  ) {
    const { content, type, files } = event.detail;

    try {
      // Insert message
      const { data, error } = await supabase
        .from("tf_messages")
        .insert({
          thread_id: thread.id,
          sender_id: currentUserId,
          content,
          message_type: type,
        })
        .select(
          `
          *,
          sender_id
        `
        )
        .single();

      if (error) throw error;

      // Fetch sender profile for the new message
      if (data) {
        const { data: profile } = await supabase
          .from("tf_user_profiles")
          .select("user_id, first_name, last_name, is_client, avatar_url")
          .eq("user_id", data.sender_id)
          .single();

        if (profile) {
          data.sender = {
            user_id: profile.user_id,
            first_name: profile.first_name,
            last_name: profile.last_name,
            is_client: profile.is_client,
            avatar_url: profile.avatar_url
          };
        }

        // Add the new message to the list
        messages = [...messages, data];
      }

      // Handle file uploads if any
      if (files && files.length > 0 && data) {
        // TODO: Implement file upload
      }

      // Update thread's updated_at
      await supabase
        .from("tf_message_threads")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", thread.id);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  }

  async function handleReaction(
    event: CustomEvent<{ messageId: string; reaction: string }>
  ) {
    const { messageId, reaction } = event.detail;

    try {
      // Toggle reaction
      const existing = messages
        .find((m) => m.id === messageId)
        ?.reactions?.find(
          (r) => r.user_id === currentUserId && r.reaction_type === reaction
        );

      if (existing) {
        // Remove reaction
        await supabase.from("tf_message_reactions").delete().match({
          message_id: messageId,
          user_id: currentUserId,
          reaction_type: reaction,
        });
      } else {
        // Add reaction
        await supabase.from("tf_message_reactions").insert({
          message_id: messageId,
          user_id: currentUserId,
          reaction_type: reaction,
        });
      }

      // Reload messages to get updated reactions
      await loadMessages();
    } catch (err) {
      console.error("Error handling reaction:", err);
    }
  }

  function scrollToBottom() {
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  function handleBack() {
    dispatch("back");
  }

  // Group messages by date
  function groupMessagesByDate(messages: Message[]) {
    const groups: { date: string; messages: Message[] }[] = [];
    let currentDate = "";

    messages.forEach((message) => {
      const messageDate = new Date(message.created_at).toDateString();

      if (messageDate !== currentDate) {
        currentDate = messageDate;
        groups.push({
          date: messageDate,
          messages: [message],
        });
      } else {
        groups[groups.length - 1].messages.push(message);
      }
    });

    return groups;
  }

  $: messageGroups = groupMessagesByDate(messages);
</script>

<!-- Thread Header -->
{#if !embedded}
  <div class="border-b bg-white px-4 py-3 flex items-center gap-3">
    <button
      on:click={handleBack}
      class="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>

    <div class="flex-1">
      <h2 class="font-semibold text-gray-900">{thread.company.name}</h2>
      <p class="text-sm text-gray-600">{thread.title}</p>
    </div>

    <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
      <svg
        class="w-5 h-5 text-gray-600"
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
{/if}

<!-- Messages Container -->
<div
  bind:this={messagesContainer}
  class="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50"
>
  {#if loading}
    <div class="flex items-center justify-center h-full">
      <div class="tf-spinner tf-spinner-lg" />
    </div>
  {:else if error}
    <div class="flex items-center justify-center h-full">
      <p class="text-red-600">{error}</p>
    </div>
  {:else}
    {#each messageGroups as group}
      <!-- Date Separator -->
      <div class="flex items-center gap-4 my-4">
        <div class="flex-1 border-t border-gray-300" />
        <span class="text-xs text-gray-500 font-medium px-2">
          {new Date(group.date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        <div class="flex-1 border-t border-gray-300" />
      </div>

      <!-- Messages in Group -->
      {#each group.messages as message, i}
        <MessageBubble
          {message}
          isOwn={message.sender_id === currentUserId}
          showAvatar={i === 0 ||
            group.messages[i - 1].sender_id !== message.sender_id}
          on:reaction={handleReaction}
        />
      {/each}
    {/each}

    <!-- Typing Indicators -->
    {#if typingUsers.size > 0}
      {#each Array.from(typingUsers.values()) as typingUser}
        <MessageBubble
          message={{
            id: `typing-${typingUser.userId}`,
            content: '',
            sender: {
              first_name: typingUser.userName.split(' ')[0],
              last_name: typingUser.userName.split(' ')[1] || '',
              is_client: true
            },
            created_at: new Date().toISOString()
          }}
          isOwn={false}
          showAvatar={true}
          isTyping={true}
          typingUser={typingUser.userName.split(' ')[0]}
        />
      {/each}
    {/if}
  {/if}
</div>

<!-- Message Input -->
<MessageInput threadId={thread.id} on:send={sendMessage} />

<style>
  @keyframes bounce {
    0%,
    60%,
    100% {
      transform: translateY(0);
    }
    30% {
      transform: translateY(-10px);
    }
  }
</style>
