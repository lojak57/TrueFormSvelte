import { BaseService } from './BaseService';
import type { SupabaseClient } from '@supabase/supabase-js';
import type {
	Message,
	CreateMessageDTO,
	UpdateMessageDTO,
	MessageWithDetails,
	MessageThread,
	CreateMessageThreadDTO,
	UpdateMessageThreadDTO,
	MessageThreadWithDetails,
	MessageAttachment,
	CreateMessageAttachmentDTO,
	MessageReadStatus,
	CreateMessageReadStatusDTO,
	MessageReaction,
	CreateMessageReactionDTO,
	MessageReactionSummary,
	TypingIndicator,
	CreateTypingIndicatorDTO,
	UserProfile
} from '$lib/types';

export class MessageService extends BaseService<Message, CreateMessageDTO, UpdateMessageDTO> {
	constructor(supabaseClient?: SupabaseClient) {
		super('tf_messages', supabaseClient);
	}

	// =====================================================================================
	// MESSAGE THREAD OPERATIONS
	// =====================================================================================

	async createThread(dto: CreateMessageThreadDTO): Promise<MessageThread> {
		const { data, error } = await this.supabase
			.from('tf_message_threads')
			.insert({
				...dto,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			})
			.select()
			.single();

		if (error) {
			throw new Error(`Failed to create message thread: ${error.message}`);
		}

		return data;
	}

	async getThreadsByCompany(companyId: string): Promise<MessageThreadWithDetails[]> {
		const { data, error } = await this.supabase
			.from('tf_message_threads')
			.select(
				`
				*,
				company:tf_companies(*),
				project:tf_company_projects(*),
				created_by_user:tf_user_profiles!tf_message_threads_created_by_fkey(*)
			`
			)
			.eq('company_id', companyId)
			.eq('is_archived', false)
			.order('updated_at', { ascending: false });

		if (error) {
			throw new Error(`Failed to fetch threads: ${error.message}`);
		}

		// Add unread count and last message for each thread
		const threadsWithDetails = await Promise.all(
			data.map(async (thread) => {
				const [lastMessage, unreadCount] = await Promise.all([
					this.getLastMessage(thread.id),
					this.getUnreadCount(thread.id)
				]);

				return {
					...thread,
					last_message: lastMessage,
					unread_count: unreadCount
				};
			})
		);

		return threadsWithDetails;
	}

	async getThreadById(threadId: string): Promise<MessageThreadWithDetails> {
		const { data, error } = await this.supabase
			.from('tf_message_threads')
			.select(
				`
				*,
				company:tf_companies(*),
				project:tf_company_projects(*),
				created_by_user:tf_user_profiles!tf_message_threads_created_by_fkey(*)
			`
			)
			.eq('id', threadId)
			.single();

		if (error) {
			throw new Error(`Failed to fetch thread: ${error.message}`);
		}

		// Get participants
		const participants = await this.getThreadParticipants(threadId);

		return {
			...data,
			participants
		};
	}

	async updateThread(threadId: string, dto: UpdateMessageThreadDTO): Promise<MessageThread> {
		const { data, error } = await this.supabase
			.from('tf_message_threads')
			.update({
				...dto,
				updated_at: new Date().toISOString()
			})
			.eq('id', threadId)
			.select()
			.single();

		if (error) {
			throw new Error(`Failed to update thread: ${error.message}`);
		}

		return data;
	}

	// =====================================================================================
	// MESSAGE OPERATIONS
	// =====================================================================================

	async getThreadMessages(
		threadId: string,
		limit = 50,
		offset = 0
	): Promise<MessageWithDetails[]> {
		const { data, error } = await this.supabase
			.from('tf_messages')
			.select(
				`
				*,
				sender:tf_user_profiles!tf_messages_sender_id_fkey(*),
				reply_to_message:tf_messages!tf_messages_reply_to_fkey(*),
				attachments:tf_message_attachments(*)
			`
			)
			.eq('thread_id', threadId)
			.eq('is_deleted', false)
			.order('created_at', { ascending: true })
			.range(offset, offset + limit - 1);

		if (error) {
			throw new Error(`Failed to fetch messages: ${error.message}`);
		}

		// Add read status and reactions for each message
		const messagesWithDetails = await Promise.all(
			data.map(async (message) => {
				const [readBy, reactions] = await Promise.all([
					this.getMessageReadStatus(message.id),
					this.getMessageReactions(message.id)
				]);

				return {
					...message,
					read_by: readBy,
					reactions: reactions
				};
			})
		);

		return messagesWithDetails;
	}

	async sendMessage(dto: CreateMessageDTO): Promise<MessageWithDetails> {
		// Create the message
		const message = await this.create({
			...dto,
			created_at: new Date().toISOString()
		});

		// Update thread's updated_at timestamp
		await this.supabase
			.from('tf_message_threads')
			.update({ updated_at: new Date().toISOString() })
			.eq('id', dto.thread_id);

		// Get full message details
		const messageWithDetails = await this.getMessageById(message.id);

		// Mark as read by sender
		await this.markMessageAsRead(message.id, dto.sender_id);

		return messageWithDetails;
	}

	async editMessage(messageId: string, content: string): Promise<Message> {
		const { data, error } = await this.supabase
			.from('tf_messages')
			.update({
				content,
				is_edited: true,
				edited_at: new Date().toISOString()
			})
			.eq('id', messageId)
			.select()
			.single();

		if (error) {
			throw new Error(`Failed to edit message: ${error.message}`);
		}

		return data;
	}

	async deleteMessage(messageId: string): Promise<Message> {
		const { data, error } = await this.supabase
			.from('tf_messages')
			.update({
				is_deleted: true,
				deleted_at: new Date().toISOString()
			})
			.eq('id', messageId)
			.select()
			.single();

		if (error) {
			throw new Error(`Failed to delete message: ${error.message}`);
		}

		return data;
	}

	async getMessageById(messageId: string): Promise<MessageWithDetails> {
		const { data, error } = await this.supabase
			.from('tf_messages')
			.select(
				`
				*,
				sender:tf_user_profiles!tf_messages_sender_id_fkey(*),
				thread:tf_message_threads(*),
				reply_to_message:tf_messages!tf_messages_reply_to_fkey(*),
				attachments:tf_message_attachments(*)
			`
			)
			.eq('id', messageId)
			.single();

		if (error) {
			throw new Error(`Failed to fetch message: ${error.message}`);
		}

		// Add read status and reactions
		const [readBy, reactions] = await Promise.all([
			this.getMessageReadStatus(messageId),
			this.getMessageReactions(messageId)
		]);

		return {
			...data,
			read_by: readBy,
			reactions: reactions
		};
	}

	// =====================================================================================
	// MESSAGE ATTACHMENTS
	// =====================================================================================

	async addAttachment(dto: CreateMessageAttachmentDTO): Promise<MessageAttachment> {
		const { data, error } = await this.supabase
			.from('tf_message_attachments')
			.insert({
				...dto,
				created_at: new Date().toISOString()
			})
			.select()
			.single();

		if (error) {
			throw new Error(`Failed to add attachment: ${error.message}`);
		}

		return data;
	}

	async getMessageAttachments(messageId: string): Promise<MessageAttachment[]> {
		const { data, error } = await this.supabase
			.from('tf_message_attachments')
			.select('*')
			.eq('message_id', messageId)
			.order('created_at');

		if (error) {
			throw new Error(`Failed to fetch attachments: ${error.message}`);
		}

		return data;
	}

	// =====================================================================================
	// READ STATUS & REACTIONS
	// =====================================================================================

	async markMessageAsRead(messageId: string, userId: string): Promise<MessageReadStatus> {
		const { data, error } = await this.supabase
			.from('tf_message_read_status')
			.upsert(
				{
					message_id: messageId,
					user_id: userId,
					read_at: new Date().toISOString()
				},
				{ onConflict: 'message_id,user_id' }
			)
			.select()
			.single();

		if (error) {
			throw new Error(`Failed to mark message as read: ${error.message}`);
		}

		return data;
	}

	async getMessageReadStatus(messageId: string): Promise<MessageReadStatus[]> {
		const { data, error } = await this.supabase
			.from('tf_message_read_status')
			.select('*')
			.eq('message_id', messageId)
			.order('read_at');

		if (error) {
			throw new Error(`Failed to fetch read status: ${error.message}`);
		}

		return data || [];
	}

	async addReaction(dto: CreateMessageReactionDTO): Promise<MessageReaction> {
		const { data, error } = await this.supabase
			.from('tf_message_reactions')
			.upsert(
				{
					...dto,
					created_at: new Date().toISOString()
				},
				{ onConflict: 'message_id,user_id,reaction_type' }
			)
			.select()
			.single();

		if (error) {
			throw new Error(`Failed to add reaction: ${error.message}`);
		}

		return data;
	}

	async removeReaction(messageId: string, userId: string, reactionType: string): Promise<void> {
		const { error } = await this.supabase
			.from('tf_message_reactions')
			.delete()
			.eq('message_id', messageId)
			.eq('user_id', userId)
			.eq('reaction_type', reactionType);

		if (error) {
			throw new Error(`Failed to remove reaction: ${error.message}`);
		}
	}

	async getMessageReactions(messageId: string): Promise<MessageReactionSummary[]> {
		const { data, error } = await this.supabase
			.from('tf_message_reactions')
			.select(
				`
				*,
				user:tf_user_profiles!tf_message_reactions_user_id_fkey(*)
			`
			)
			.eq('message_id', messageId);

		if (error) {
			throw new Error(`Failed to fetch reactions: ${error.message}`);
		}

		// Group reactions by type
		const reactionGroups = data.reduce((groups, reaction) => {
			const type = reaction.reaction_type;
			if (!groups[type]) {
				groups[type] = [];
			}
			groups[type].push(reaction);
			return groups;
		}, {} as Record<string, any[]>);

		// Convert to summary format
		return Object.entries(reactionGroups).map(([reactionType, reactions]) => ({
			reaction_type: reactionType as MessageReaction['reaction_type'],
			count: reactions.length,
			users: reactions.map((r) => r.user),
			user_reacted: false // Will be set by client based on current user
		}));
	}

	// =====================================================================================
	// TYPING INDICATORS
	// =====================================================================================

	async startTyping(dto: CreateTypingIndicatorDTO): Promise<TypingIndicator> {
		const { data, error } = await this.supabase
			.from('tf_typing_indicators')
			.upsert(
				{
					...dto,
					started_typing_at: new Date().toISOString()
				},
				{ onConflict: 'thread_id,user_id' }
			)
			.select()
			.single();

		if (error) {
			throw new Error(`Failed to start typing: ${error.message}`);
		}

		return data;
	}

	async stopTyping(threadId: string, userId: string): Promise<void> {
		const { error } = await this.supabase
			.from('tf_typing_indicators')
			.delete()
			.eq('thread_id', threadId)
			.eq('user_id', userId);

		if (error) {
			throw new Error(`Failed to stop typing: ${error.message}`);
		}
	}

	async getTypingUsers(threadId: string): Promise<UserProfile[]> {
		const { data, error } = await this.supabase
			.from('tf_typing_indicators')
			.select(
				`
				*,
				user:tf_user_profiles!tf_typing_indicators_user_id_fkey(*)
			`
			)
			.eq('thread_id', threadId)
			.gte('started_typing_at', new Date(Date.now() - 30000).toISOString()); // Last 30 seconds

		if (error) {
			throw new Error(`Failed to fetch typing users: ${error.message}`);
		}

		return data.map((indicator) => indicator.user);
	}

	// =====================================================================================
	// HELPER METHODS
	// =====================================================================================

	private async getLastMessage(threadId: string): Promise<Message | null> {
		const { data, error } = await this.supabase
			.from('tf_messages')
			.select('*')
			.eq('thread_id', threadId)
			.eq('is_deleted', false)
			.order('created_at', { ascending: false })
			.limit(1)
			.single();

		if (error && error.code !== 'PGRST116') {
			// PGRST116 is "no rows returned"
			throw new Error(`Failed to fetch last message: ${error.message}`);
		}

		return data || null;
	}

	private async getUnreadCount(threadId: string): Promise<number> {
		// This would need the current user ID from context
		// For now, return 0 as placeholder
		return 0;
	}

	async getUnreadCountForUser(threadId: string, userId: string): Promise<number> {
		const { data, error } = await this.supabase.rpc('get_unread_message_count', {
			user_uuid: userId
		});

		if (error) {
			console.warn('Failed to get unread count:', error.message);
			return 0;
		}

		return data || 0;
	}

	private async getThreadParticipants(threadId: string): Promise<UserProfile[]> {
		const { data, error } = await this.supabase.rpc('get_thread_participants', {
			thread_uuid: threadId
		});

		if (error) {
			throw new Error(`Failed to fetch thread participants: ${error.message}`);
		}

		return data || [];
	}

	// =====================================================================================
	// SEARCH & FILTERING
	// =====================================================================================

	async searchMessages(
		query: string,
		threadId?: string,
		companyId?: string
	): Promise<MessageWithDetails[]> {
		let queryBuilder = this.supabase
			.from('tf_messages')
			.select(
				`
				*,
				sender:tf_user_profiles!tf_messages_sender_id_fkey(*),
				thread:tf_message_threads(*),
				attachments:tf_message_attachments(*)
			`
			)
			.ilike('content', `%${query}%`)
			.eq('is_deleted', false);

		if (threadId) {
			queryBuilder = queryBuilder.eq('thread_id', threadId);
		}

		if (companyId) {
			queryBuilder = queryBuilder
				.select(
					`
					*,
					sender:tf_user_profiles!tf_messages_sender_id_fkey(*),
					thread:tf_message_threads!inner(*),
					attachments:tf_message_attachments(*)
				`
				)
				.eq('thread.company_id', companyId);
		}

		const { data, error } = await queryBuilder
			.order('created_at', { ascending: false })
			.limit(50);

		if (error) {
			throw new Error(`Failed to search messages: ${error.message}`);
		}

		return data;
	}

	// =====================================================================================
	// REAL-TIME SUBSCRIPTIONS HELPERS
	// =====================================================================================

	subscribeToThread(threadId: string, callback: (payload: any) => void) {
		return this.supabase
			.channel(`thread:${threadId}`)
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'tf_messages',
					filter: `thread_id=eq.${threadId}`
				},
				callback
			)
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'tf_typing_indicators',
					filter: `thread_id=eq.${threadId}`
				},
				callback
			)
			.subscribe();
	}

	subscribeToUserNotifications(userId: string, callback: (payload: any) => void) {
		return this.supabase
			.channel(`user:${userId}`)
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'tf_message_read_status',
					filter: `user_id=eq.${userId}`
				},
				callback
			)
			.subscribe();
	}
}